import { useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { yukleBildirimAyarlari, yukleSehir } from '../utils/storage';
import { logger } from '../utils/logger';
import { getNamazVakitleri } from '../utils/namazVakitleri';
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
 * Namaz vakitlerini ve hatırlatıcıları yerel olarak planla
 */
async function planlaYerelBildirimler() {
  try {
    const ayarlar = await yukleBildirimAyarlari();
    const sehir = await yukleSehir();

    // 1. Önce tüm eski planlı bildirimleri temizle (çakışmayı önlemek için)
    await Notifications.cancelAllScheduledNotificationsAsync();
    logger.info('Eski yerel bildirimler temizlendi', undefined, 'useBildirimler');

    // 2. Günlük Hatırlatıcı (Sabit Saat)
    if (ayarlar.gunlukHatirlaticiAktif) {
      const [saat, dakika] = ayarlar.gunlukHatirlaticiSaat.split(':').map(Number);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌙 Günlük Hatırlatıcı',
          body: 'Bugünkü ibadetlerinizi kaydetmeyi unutmayın.',
          sound: 'yunus_emre.mp3',
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
      // Basitlik için sonraki 5 periyodu planla
      const aralikDakika = ayarlar.suIcmeAraligi || 30;
      for (let i = 1; i <= 5; i++) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '💧 Su Vakti',
            body: 'Sağlığınız için bir bardak su içmeyi unutmayın.',
            sound: 'yunus_emre.mp3',
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

      // Önümüzdeki 7 gün için planla
      for (let gunOffset = 0; gunOffset < 7; gunOffset++) {
        const hedefGun = new Date();
        hedefGun.setDate(hedefGun.getDate() + gunOffset);

        const vakitler = await getNamazVakitleri(sehir.isim); // Not: getNamazVakitleri'ni tarih bazlı çağıracak şekilde geliştirmek lazım
        // Şimdilik bugünkü vakitleri baz alarak (api genelde bugünü döner) 
        // ama gerçek çözüm getTarihNamazVakitleri kullanmak
        const gunlukVakitler = await (gunOffset === 0 ? vakitler : null); // Şimdilik basitleştirilmiş

        if (vakitler) {
          for (const [key, vakit] of Object.entries(vakitler) as [string, string][]) {
            const [vakitSaat, vakitDakika] = vakit.split(':').map(Number);
            const bildirimTarih = new Date(hedefGun);
            bildirimTarih.setHours(vakitSaat, vakitDakika, 0, 0);

            // Eğer vakit geçtiyse atla
            if (bildirimTarih <= new Date()) continue;

            if (ayarlar.namazVakitleriAktif) {
              const isGunes = key === 'gunes';
              const title = isGunes ? '⚠️ Vakit Çıktı' : `🕌 ${vakitIsimleri[key as keyof typeof vakitIsimleri]} Vakti`;
              const body = isGunes
                ? 'Güneş doğdu, sabah namazı vakti çıktı. Namazınız kazaya kaldı.'
                : `${sehir.isim} için ${vakitIsimleri[key as keyof typeof vakitIsimleri]} vakti geldi.`;

              await Notifications.scheduleNotificationAsync({
                content: {
                  title: title,
                  body: body,
                  sound: isGunes ? 'yunus_emre.mp3' : 'ezan.mp3',
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
              if (sahurTarih > new Date()) {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: '🌙 Sahur Hatırlatıcısı',
                    body: 'İmsak vaktine 45 dakika kaldı. Bereketli sahur dileriz.',
                    sound: 'yunus_emre.mp3',
                    ...(Platform.OS === 'android' && { channelId: CHANNEL_HATIRLATICI }),
                  },
                  trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: sahurTarih,
                  },
                });
              }
            }

            // İftar Hatırlatıcısı (Akşam'dan önce)
            if (key === 'aksam' && ayarlar.iftarAktif) {
              // ayarlar.iftarSaat genelde "19:00" gibi bir değerdir, ancak biz Akşam vaktinden 15 dk önceyi de ekleyelim
              const iftarTarih = new Date(bildirimTarih);
              iftarTarih.setMinutes(iftarTarih.getMinutes() - 15);
              if (iftarTarih > new Date()) {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: '🍽️ İftar Hazırlığı',
                    body: 'Akşam ezanına 15 dakika kaldı.',
                    sound: 'yunus_emre.mp3',
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
        }
      }
      logger.info('Hibrit 7 günlük bildirim planlaması tamamlandı', undefined, 'useBildirimler');
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
    // Hemen bildirim gönder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Bildirimler Çalışıyor!',
        body: 'Şükür365 bildirimleri başarıyla ayarlandı.',
        // iOS için sound (Android'de channel'dan gelir)
        ...(Platform.OS === 'ios' && {
          sound: 'yunus_emre.mp3',
        }),
        ...(Platform.OS === 'android' && {
          channelId: CHANNEL_HATIRLATICI,
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
    await Notifications.scheduleNotificationAsync({
      content: {
        title: baslik,
        body: 'Belirlediğiniz vakit geldi.',
        ...(Platform.OS === 'ios' && {
          sound: 'yunus_emre.mp3',
        }),
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

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📝 Not Hatırlatıcısı',
        body: not.baslik || not.icerik.substring(0, 50),
        data: { notId: not.id },
        ...(Platform.OS === 'ios' && {
          sound: 'yunus_emre.mp3',
        }),
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
 */
export function useBildirimler() {
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

      // 4. Firebase Mesajlaşma ve Supabase Senkronizasyonu
      await setupFirebaseMessaging();

      // 5. Yerel planlama (Hibrit Güvenlik Katmanı)
      await planlaYerelBildirimler();
      logger.info('Yerel ve Merkezi bildirim sistemi aktif (Hibrit)', undefined, 'useBildirimler');

      // 8. Planlanan bildirimleri logla
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
    bildirimleriAyarla();
    // Cleanup artık gerekli değil - OS notification sound kullanılıyor
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
