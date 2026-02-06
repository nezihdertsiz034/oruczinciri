import { useEffect, useCallback, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform, Alert, AppState, AppStateStatus } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { yukleBildirimAyarlari, yukleSehir } from '../utils/storage';
import { logger } from '../utils/logger';
import { getNamazVakitleri, getTarihNamazVakitleri } from '../utils/namazVakitleri';
import { configureNotifications, CHANNEL_HATIRLATICI, CHANNEL_EZAN } from '../services/notifications/configureNotifications';
import { supabase } from '../utils/supabaseClient';

/**
 * Firebase Mesajlaşma İzni İste ve Token Al
 */
async function setupFirebaseMessaging() {
  try {
    // iOS için cihazı uzak mesajlara kaydet
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await messaging().getToken();
      logger.info('FCM Token alındı:', { token }, 'useBildirimler');

      // Supabase'e kaydet
      await syncUserToSupabase(token);
    } else {
      logger.warn('FCM Mesajlaşma izni verilmedi', { authStatus }, 'useBildirimler');
    }
  } catch (error) {
    logger.error('Firebase başlatılırken hata', { error }, 'useBildirimler');
  }
}

/**
 * Kullanıcı bilgilerini Supabase'e senkronize et
 */
async function syncUserToSupabase(token: string) {
  try {
    const sehir = await yukleSehir();
    const ayarlar = await yukleBildirimAyarlari();

    const { error } = await supabase
      .from('user_devices')
      .upsert({
        fcm_token: token,
        city_id: sehir?.id || 34,
        city_name: sehir?.isim || 'İstanbul',
        notification_settings: ayarlar,
        last_active: new Date().toISOString()
      }, { onConflict: 'fcm_token' });

    if (error) throw error;
    logger.info('Kullanıcı bilgileri Supabase\'e senkronize edildi', undefined, 'useBildirimler');
  } catch (error) {
    logger.error('Supabase senkronizasyonu hatası', { error }, 'useBildirimler');
  }
}

// Bildirim kanalları artık configureNotifications.ts'de yapılandırılıyor

/**
 * Bildirim izni iste
 */
async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existingStatus, android } = await Notifications.getPermissionsAsync();
    const androidStatus = android as any;
    let finalStatus = existingStatus;

    logger.info('Mevcut bildirim izni durumu:', {
      existingStatus,
      canScheduleExactAlarms: androidStatus?.canScheduleExactAlarms
    }, 'useBildirimler');

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      logger.warn('Bildirim izni verilmedi', { finalStatus }, 'useBildirimler');
      return false;
    }

    // Android 12+ için tam alarm (Exact Alarm) kontrolü
    if (Platform.OS === 'android') {
      const { status: alarmStatus } = await Notifications.getPermissionsAsync();
      const androidAlarmStatus = alarmStatus as any;

      if (androidAlarmStatus?.canScheduleExactAlarms === false) {
        logger.warn('Tam alarm (Exact Alarm) izni yok! Bildirimler gecikebilir.', undefined, 'useBildirimler');
        Alert.alert(
          'Bildirim İzni',
          'Namaz vakitlerinin tam zamanında bildirilmesi için "Tam Alarm" izni gereklidir. Lütfen ayarlardan bu izni verin.',
          [{ text: 'Tamam' }]
        );
      }
    }

    return true;
  } catch (error) {
    logger.error('Bildirim izni istenirken hata', { error }, 'useBildirimler');
    return false;
  }
}

/**
 * Bildirim sesi belirle (ezanSesiAktif ayarına göre + platform)
 * iOS: content.sound kullanır (.caf formatı en güvenilir, max 30sn)
 * Android: channel sound kullanır (content.sound da set edilir ama channel önceliklidir)
 *
 * ÖNEMLİ: ezan.mp3 213 saniye (3.5dk) olduğu için iOS'ta ÇALMAZ (30sn limiti).
 * Bu yüzden yunus_emre (20sn) kullanılıyor.
 */
function getEzanBildirimSesi(ezanSesiAktif: boolean): string {
  if (!ezanSesiAktif) return 'default';

  // iOS için .caf formatı en güvenilir, Android için .mp3
  return Platform.OS === 'ios' ? 'yunus_emre.caf' : 'yunus_emre.mp3';
}

/**
 * Namaz vakitlerini ve hatırlatıcıları yerel olarak planla
 * Her vakit için doğru tarih kullanılır (getTarihNamazVakitleri ile)
 */
async function planlaYerelBildirimler() {
  try {
    const ayarlar = await yukleBildirimAyarlari();
    const sehir = await yukleSehir();

    // 1. Önce tüm eski planlı bildirimleri temizle (çakışmayı önlemek için)
    await Notifications.cancelAllScheduledNotificationsAsync();
    logger.info('Eski yerel bildirimler temizlendi', undefined, 'useBildirimler');

    // Platforma uygun hatırlatıcı sesi
    const hatirlaticiSes = Platform.OS === 'ios' ? 'yunus_emre.caf' : 'yunus_emre.mp3';

    // 2. Günlük Hatırlatıcı (Sabit Saat)
    if (ayarlar.gunlukHatirlaticiAktif) {
      const [saat, dakika] = ayarlar.gunlukHatirlaticiSaat.split(':').map(Number);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌙 Günlük Hatırlatıcı',
          body: 'Bugünkü ibadetlerinizi kaydetmeyi unutmayın.',
          sound: hatirlaticiSes,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: saat,
          minute: dakika,
          repeats: true,
        },
      });
      logger.info('Günlük hatırlatıcı planlandı', { saat: ayarlar.gunlukHatirlaticiSaat }, 'useBildirimler');
    }

    // 3. Su Hatırlatıcı (Aralıklı)
    if (ayarlar.suIcmeHatirlaticiAktif) {
      const aralikDakika = ayarlar.suIcmeAraligi || 30;
      for (let i = 1; i <= 5; i++) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '💧 Su Vakti',
            body: 'Sağlığınız için bir bardak su içmeyi unutmayın.',
            sound: hatirlaticiSes,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: i * aralikDakika * 60,
          },
        });
      }
      logger.info('Su hatırlatıcıları planlandı', { aralik: aralikDakika }, 'useBildirimler');
    }

    // 4. Namaz Vakitleri & Hatırlatıcılar (7 Günlük Planlama)
    if (sehir) {
      const vakitIsimleri = {
        imsak: 'İmsak',
        gunes: 'Güneş',
        ogle: 'Öğle',
        ikindi: 'İkindi',
        aksam: 'Akşam',
        yatsi: 'Yatsı'
      };

      const ezanSesi = getEzanBildirimSesi(ayarlar.ezanSesiAktif);
      const simdi = new Date();

      // Önümüzdeki 7 gün için planla (her gün doğru vakitlerle)
      for (let gunOffset = 0; gunOffset < 7; gunOffset++) {
        const hedefGun = new Date();
        hedefGun.setDate(hedefGun.getDate() + gunOffset);
        hedefGun.setHours(0, 0, 0, 0);

        // Her gün için o günün gerçek namaz vakitlerini al
        let vakitler;
        if (gunOffset === 0) {
          // Bugün için hızlı çağrı (cache'den gelebilir)
          vakitler = await getNamazVakitleri(sehir.isim);
        } else {
          // Gelecek günler için tarih bazlı çağrı
          vakitler = await getTarihNamazVakitleri(hedefGun, sehir.isim);
        }

        // Tarih bazlı API başarısız olduysa bugünkü vakitleri fallback olarak kullan
        if (!vakitler && gunOffset > 0) {
          vakitler = await getNamazVakitleri(sehir.isim);
          logger.warn(`${gunOffset}. gün için vakitler alınamadı, bugünkü vakitler kullanılıyor`, undefined, 'useBildirimler');
        }

        if (!vakitler) continue;

        for (const [key, vakit] of Object.entries(vakitler) as [string, string][]) {
          if (!vakit || !vakit.includes(':')) continue;

          const [vakitSaat, vakitDakika] = vakit.split(':').map(Number);
          if (!Number.isFinite(vakitSaat) || !Number.isFinite(vakitDakika)) continue;

          const bildirimTarih = new Date(hedefGun);
          bildirimTarih.setHours(vakitSaat, vakitDakika, 0, 0);

          // Eğer vakit geçtiyse atla
          if (bildirimTarih <= simdi) continue;

          // Namaz vakti bildirimi
          if (ayarlar.namazVakitleriAktif) {
            const isGunes = key === 'gunes';
            const title = isGunes ? '⚠️ Vakit Çıktı' : `🕌 ${vakitIsimleri[key as keyof typeof vakitIsimleri]} Vakti`;
            const body = isGunes
              ? 'Güneş doğdu, sabah namazı vakti çıktı. Namazınız kazaya kaldı.'
              : `${sehir.isim} için ${vakitIsimleri[key as keyof typeof vakitIsimleri]} vakti geldi.`;

            // Ezan sesi: güneş vakti için varsayılan ses, diğerleri için ezan sesi
            const bildirimSesi = isGunes ? 'yunus_emre.mp3' : ezanSesi;

            await Notifications.scheduleNotificationAsync({
              content: {
                title,
                body,
                sound: bildirimSesi,
                ...(Platform.OS === 'android' && {
                  channelId: isGunes ? CHANNEL_HATIRLATICI : CHANNEL_EZAN,
                  priority: Notifications.AndroidNotificationPriority.MAX,
                }),
                categoryIdentifier: key === 'aksam' || key === 'imsak' ? 'ramazan' : undefined,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: bildirimTarih,
              },
            });
          }

          // Sahur Hatırlatıcısı (İmsak'tan 45 dk önce)
          if (key === 'imsak' && ayarlar.sahurAktif) {
            const sahurTarih = new Date(bildirimTarih);
            sahurTarih.setMinutes(sahurTarih.getMinutes() - 45);
            if (sahurTarih > simdi) {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: '🌙 Sahur Hatırlatıcısı',
                  body: 'İmsak vaktine 45 dakika kaldı. Bereketli sahur dileriz.',
                  sound: hatirlaticiSes,
                  ...(Platform.OS === 'android' && { channelId: CHANNEL_HATIRLATICI }),
                },
                trigger: {
                  type: Notifications.SchedulableTriggerInputTypes.DATE,
                  date: sahurTarih,
                },
              });
            }
          }

          // İftar Hatırlatıcısı (Akşam'dan 15 dk önce)
          if (key === 'aksam' && ayarlar.iftarAktif) {
            const iftarTarih = new Date(bildirimTarih);
            iftarTarih.setMinutes(iftarTarih.getMinutes() - 15);
            if (iftarTarih > simdi) {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: '🍽️ İftar Hazırlığı',
                  body: 'Akşam ezanına 15 dakika kaldı.',
                  sound: hatirlaticiSes,
                  ...(Platform.OS === 'android' && { channelId: CHANNEL_HATIRLATICI }),
                },
                trigger: {
                  type: Notifications.SchedulableTriggerInputTypes.DATE,
                  date: iftarTarih,
                },
              });
            }
          }
        }

        logger.info(`${gunOffset + 1}. gün bildirimleri planlandı`, { tarih: hedefGun.toISOString().split('T')[0] }, 'useBildirimler');
      }
      logger.info('7 günlük bildirim planlaması tamamlandı', undefined, 'useBildirimler');
    }

  } catch (error) {
    logger.error('Yerel bildirimler planlanırken hata', { error }, 'useBildirimler');
  }
}


/**
 * Test bildirimi gönder (hata ayıklama için)
 */
export async function sendTestNotification() {
  try {
    const testSes = Platform.OS === 'ios' ? 'yunus_emre.caf' : 'yunus_emre.mp3';
    // Hemen bildirim gönder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Bildirimler Çalışıyor!',
        body: 'Şükür365 bildirimleri başarıyla ayarlandı.',
        sound: testSes,
        ...(Platform.OS === 'android' && {
          channelId: CHANNEL_EZAN, // Ezan kanalıyla test et (ses doğrulaması için)
          color: '#1a5f3f',
          priority: Notifications.AndroidNotificationPriority.MAX,
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
      },
    });

    logger.info('Test bildirimi gönderildi', undefined, 'useBildirimler');
    return true;
  } catch (error) {
    logger.error('Test bildirimi gönderilemedi', { error }, 'useBildirimler');
    return false;
  }
}

/**
 * Planlanan bildirimleri listele
 */
export async function getScheduledNotifications() {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  } catch (error) {
    logger.error('Planlanmış bildirimler alınamadı', { error }, 'useBildirimler');
    return [];
  }
}

/**
 * Kullanıcı tarafından belirlenen özel bir saatte bildirim planla
 */
export async function scheduleCustomNotification(saat: number, dakika: number, baslik: string = '⏰ Hatırlatıcı') {
  try {
    const bildirimSes = Platform.OS === 'ios' ? 'yunus_emre.caf' : 'yunus_emre.mp3';
    await Notifications.scheduleNotificationAsync({
      content: {
        title: baslik,
        body: 'Belirlediğiniz vakit geldi.',
        sound: bildirimSes,
        ...(Platform.OS === 'android' && {
          channelId: CHANNEL_HATIRLATICI,
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: saat,
        minute: dakika,
        repeats: true,
      },
    });
    logger.info('Özel bildirim planlandı', { saat, dakika }, 'useBildirimler');
    return true;
  } catch (error) {
    logger.error('Özel bildirim planlanamadı', { error }, 'useBildirimler');
    return false;
  }
}

/**
 * Bir not için bildirim planla
 */
export async function scheduleNotBildirimi(not: any) {
  if (!not.hatirlatici) return null;

  try {
    const hatirlaticiTarih = new Date(not.hatirlatici);

    // Geçmiş bir tarihe bildirim kurmaya çalışma
    if (hatirlaticiTarih <= new Date()) {
      logger.warn('Geçmiş tarihli not bildirimi kurulamaz', { notId: not.id }, 'useBildirimler');
      return null;
    }

    const notSes = Platform.OS === 'ios' ? 'yunus_emre.caf' : 'yunus_emre.mp3';
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📝 Not Hatırlatıcısı',
        body: not.baslik || not.icerik.substring(0, 50),
        data: { notId: not.id },
        sound: notSes,
        ...(Platform.OS === 'android' && {
          channelId: CHANNEL_HATIRLATICI,
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: hatirlaticiTarih,
      },
    });

    logger.info('Not bildirimi planlandı', { notId: not.id, tarih: hatirlaticiTarih.toISOString() }, 'useBildirimler');
    return notificationId;
  } catch (error) {
    logger.error('Not bildirimi planlanırken hata', { error, notId: not.id }, 'useBildirimler');
    return null;
  }
}

/**
 * Not bildirimini iptal et
 */
export async function cancelNotBildirimi(notId: string) {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const target = scheduled.find(n => n.content.data?.notId === notId);

    if (target) {
      await Notifications.cancelScheduledNotificationAsync(target.identifier);
      logger.info('Not bildirimi iptal edildi', { notId }, 'useBildirimler');
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Not bildirimi iptal edilirken hata', { error, notId }, 'useBildirimler');
    return false;
  }
}

/**
 * Ana bildirim hook'u
 * - App açılışında bildirimleri planlar
 * - App foreground'a döndüğünde yeniden planlar (sürekli güncel kalması için)
 */
export function useBildirimler() {
  const appState = useRef(AppState.currentState);

  const bildirimleriAyarla = useCallback(async () => {
    logger.info('Bildirimler ayarlanıyor...', undefined, 'useBildirimler');

    try {
      // 1. Bildirim izni iste
      const izinVar = await requestNotificationPermission();
      if (!izinVar) {
        logger.warn('Bildirim izni yok, işlem iptal', undefined, 'useBildirimler');
        return;
      }

      // 2. Android kanallarını oluştur
      await configureNotifications();

      // 3. Firebase Mesajlaşma ve Supabase Senkronizasyonu
      await setupFirebaseMessaging();

      // 4. Yerel planlama (7 günlük, doğru tarihlerle)
      await planlaYerelBildirimler();
      logger.info('Yerel ve Merkezi bildirim sistemi aktif (Hibrit)', undefined, 'useBildirimler');

      // 5. Planlanan bildirimleri logla
      const planlilar = await getScheduledNotifications();
      logger.info(`Toplam ${planlilar.length} bildirim planlandı`, undefined, 'useBildirimler');

      // Not: Ezan sesi artık OS notification sound olarak çalıyor
      // (Android channel sound, iOS notification sound)
      // JS listener ile ses çalma kaldırıldı - app kapalıyken de çalışır

    } catch (error) {
      logger.error('Bildirimler ayarlanırken hata', { error }, 'useBildirimler');
    }
  }, []);

  useEffect(() => {
    // İlk açılışta bildirimleri ayarla
    bildirimleriAyarla();

    // App foreground'a döndüğünde bildirimleri yeniden planla
    // Bu sayede 7 günlük pencere sürekli yenilenir
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        logger.info('App foreground\'a döndü, bildirimler yeniden planlanıyor...', undefined, 'useBildirimler');
        planlaYerelBildirimler().catch((error) => {
          logger.error('Foreground yeniden planlama hatası', { error }, 'useBildirimler');
        });
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [bildirimleriAyarla]);

  return {
    bildirimleriAyarla,
    sendTestNotification,
    getScheduledNotifications,
    scheduleCustomNotification,
    scheduleNotBildirimi,
    cancelNotBildirimi
  };
}
