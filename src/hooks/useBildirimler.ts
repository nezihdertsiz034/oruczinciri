import { useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import { yukleBildirimAyarlari, yukleSehir } from '../utils/storage';
import { getTarihNamazVakitleri, saattenDakikaCikar } from '../utils/namazVakitleri';
import { bildirimEzanSesiBaslat, bildirimEzanSesiTemizle } from '../utils/ezanSesi';
import { logger } from '../utils/logger';
import { getHadisByTarihVeVakit } from '../constants/namazVaktiHadisleri';

// Bildirim kanalı ID'leri
const CHANNEL_NAMAZ = 'namaz-vakitleri';
const CHANNEL_HATIRLATICI = 'hatirlaticilar';

// Bildirim handler ayarla
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

/**
 * Android için bildirim kanallarını oluştur
 */
async function createNotificationChannels() {
  if (Platform.OS !== 'android') return;

  try {
    // Namaz vakitleri kanalı
    await Notifications.setNotificationChannelAsync(CHANNEL_NAMAZ, {
      name: 'Namaz Vakitleri',
      description: 'Günlük namaz vakti bildirimleri',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 500, 500, 500, 500, 500, 500],
      lightColor: '#1a5f3f',
      sound: 'ney',
      enableVibrate: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });

    // Hatırlatıcılar kanalı
    await Notifications.setNotificationChannelAsync(CHANNEL_HATIRLATICI, {
      name: 'Hatırlatıcılar',
      description: 'Sahur, iftar ve diğer hatırlatıcılar',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 500, 500, 500, 500, 500, 500],
      lightColor: '#1a5f3f',
      sound: 'ney',
      enableVibrate: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });

    logger.info('Bildirim kanalları oluşturuldu', undefined, 'useBildirimler');
  } catch (error) {
    logger.error('Bildirim kanalları oluşturulurken hata', { error }, 'useBildirimler');
  }
}

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
 * Bugün ve yarın için namaz vakti bildirimlerini planla
 */
async function scheduleNamazNotifications(sehirAdi: string, ayarlar: any) {
  // Ana ayar kontrolü - namazVakitleriAktif kapalıysa hiçbir namaz bildirimi planlanmaz
  if (!ayarlar.namazVakitleriAktif) {
    logger.info('Namaz vakitleri bildirimi kapalı, atlanıyor...', undefined, 'useBildirimler');
    return;
  }

  const simdi = new Date();
  const simdiTimestamp = simdi.getTime();

  // Önümüzdeki 7 günü planla
  const planlanacakGunSayisi = 7;

  logger.info(`${planlanacakGunSayisi} günlük namaz bildirimi planlanıyor...`, { sehirAdi }, 'useBildirimler');

  for (let i = 0; i < planlanacakGunSayisi; i++) {
    // Her gün için yeni bir tarih oluştur (timezone problemlerini önlemek için)
    const tarih = new Date();
    tarih.setDate(tarih.getDate() + i);
    tarih.setHours(0, 0, 0, 0); // Günün başına sıfırla

    const yil = tarih.getFullYear();
    const ay = tarih.getMonth();
    const gun = tarih.getDate();
    const tarihStr = `${yil}-${String(ay + 1).padStart(2, '0')}-${String(gun).padStart(2, '0')}`;

    const vakitler = await getTarihNamazVakitleri(tarih, sehirAdi);

    if (!vakitler) {
      logger.warn('Namaz vakitleri alınamadı', { tarih: tarihStr }, 'useBildirimler');
      continue;
    }

    // Tüm namaz vakitlerini planla (namazVakitleriAktif açıksa hepsi aktif)
    const namazVakitleri = [
      { isim: 'İmsak', saat: vakitler.imsak },
      { isim: 'Güneş', saat: vakitler.gunes },
      { isim: 'Öğle', saat: vakitler.ogle },
      { isim: 'İkindi', saat: vakitler.ikindi },
      { isim: 'Akşam', saat: vakitler.aksam },
      { isim: 'Yatsı', saat: vakitler.yatsi },
    ];


    for (const vakit of namazVakitleri) {
      if (!vakit.saat || vakit.saat.length < 5) {
        logger.warn('Geçersiz vakit formatı', { vakit: vakit.isim, saat: vakit.saat }, 'useBildirimler');
        continue;
      }

      const [saat, dakika] = vakit.saat.split(':').map(Number);

      // Bildirim tarihini sıfırdan oluştur (timezone güvenli)
      const bildirimTarih = new Date(yil, ay, gun, saat, dakika, 0, 0);
      const bildirimTimestamp = bildirimTarih.getTime();

      // Geçmiş vakitleri atla (en az 30 saniye sonrası olmalı)
      if (bildirimTimestamp <= simdiTimestamp + 30000) {
        logger.debug('Geçmiş vakit atlandı', {
          vakit: vakit.isim,
          tarih: tarihStr,
          saat: vakit.saat
        }, 'useBildirimler');
        continue;
      }

      try {
        const identifier = `namaz-${tarihStr}-${vakit.isim}`;

        // Gün ve vakite göre hadis-i şerif al
        const hadis = getHadisByTarihVeVakit(bildirimTarih, vakit.isim);
        const bildirimBody = `"${hadis.metin}" - ${hadis.kaynak}`;

        await Notifications.scheduleNotificationAsync({
          identifier,
          content: {
            title: `🕌 ${vakit.isim} Namazı Vakti`,
            body: bildirimBody,
            sound: 'ney',
            data: {
              vakit: vakit.isim,
              ezanSesi: ayarlar.ezanSesiAktif ?? true,
            },
            ...(Platform.OS === 'android' && { channelId: CHANNEL_NAMAZ }),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: bildirimTimestamp,
          },
        });

        logger.debug('Namaz bildirimi planlandı', {
          id: identifier,
          vakit: vakit.isim,
          tarih: bildirimTarih.toLocaleString('tr-TR'),
          timestamp: bildirimTimestamp
        }, 'useBildirimler');
      } catch (error) {
        logger.error('Namaz bildirimi planlanırken hata', { error, vakit: vakit.isim }, 'useBildirimler');
      }
    }
  }
}

/**
 * Oruç/Fasting dönemi bildirimleri (sahur, iftar)
 * Artık her zaman çalışır (Ramazan dışı nafile oruçlar için de uygun)
 */
async function scheduleFastingNotifications(sehirAdi: string, ayarlar: any) {
  const simdi = new Date();
  const simdiTimestamp = simdi.getTime();

  // Önümüzdeki 7 günü planla
  const planlanacakGunSayisi = 7;

  logger.info(`${planlanacakGunSayisi} günlük oruç bildirimi planlanıyor...`, { sehirAdi }, 'useBildirimler');

  for (let i = 0; i < planlanacakGunSayisi; i++) {
    // Her gün için yeni bir tarih oluştur (timezone problemlerini önlemek için)
    const tarih = new Date();
    tarih.setDate(tarih.getDate() + i);
    tarih.setHours(0, 0, 0, 0); // Günün başına sıfırla

    const yil = tarih.getFullYear();
    const ay = tarih.getMonth();
    const gun = tarih.getDate();
    const tarihStr = `${yil}-${String(ay + 1).padStart(2, '0')}-${String(gun).padStart(2, '0')}`;

    const vakitler = await getTarihNamazVakitleri(tarih, sehirAdi);

    if (!vakitler) continue;

    // Sahur hatırlatıcısı (İmsak'tan 45 dk önce)
    if (ayarlar.sahurAktif) {
      const sahurSaat = saattenDakikaCikar(vakitler.imsak, 45);
      const [saat, dakika] = sahurSaat.split(':').map(Number);

      // Timezone güvenli tarih oluşturma
      const sahurTarih = new Date(yil, ay, gun, saat, dakika, 0, 0);
      const sahurTimestamp = sahurTarih.getTime();

      if (sahurTimestamp > simdiTimestamp + 30000) {
        const sahurId = `sahur-${tarihStr}`;
        try {
          await Notifications.scheduleNotificationAsync({
            identifier: sahurId,
            content: {
              title: '🌅 Sahur Hatırlatıcısı',
              body: `Sahur vaktiniz yaklaşıyor! İmsak: ${vakitler.imsak}`,
              sound: 'ney',
              ...(Platform.OS === 'android' && { channelId: CHANNEL_HATIRLATICI }),
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: sahurTimestamp,
            },
          });
          logger.debug('Sahur bildirimi planlandı', { id: sahurId, tarih: sahurTarih.toLocaleString('tr-TR'), timestamp: sahurTimestamp }, 'useBildirimler');
        } catch (error) {
          logger.error('Sahur bildirimi planlanırken hata', { error }, 'useBildirimler');
        }
      } else {
        logger.debug('Sahur vakti geçmiş, planlanmadı', { tarih: tarihStr, saat: sahurSaat }, 'useBildirimler');
      }
    }

    // İftar hatırlatıcısı (Akşam'dan 45 dk önce)
    if (ayarlar.iftarAktif) {
      const iftarSaat = saattenDakikaCikar(vakitler.aksam, 45);
      const [saat, dakika] = iftarSaat.split(':').map(Number);

      // Timezone güvenli tarih oluşturma
      const iftarTarih = new Date(yil, ay, gun, saat, dakika, 0, 0);
      const iftarTimestamp = iftarTarih.getTime();

      if (iftarTimestamp > simdiTimestamp + 30000) {
        const iftarId = `iftar-${tarihStr}`;
        try {
          await Notifications.scheduleNotificationAsync({
            identifier: iftarId,
            content: {
              title: '🌇 İftar Hatırlatıcısı',
              body: `İftar vaktiniz yaklaşıyor! Akşam: ${vakitler.aksam}`,
              sound: 'ney',
              ...(Platform.OS === 'android' && { channelId: CHANNEL_HATIRLATICI }),
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: iftarTimestamp,
            },
          });
          logger.debug('İftar bildirimi planlandı', { id: iftarId, tarih: iftarTarih.toLocaleString('tr-TR'), timestamp: iftarTimestamp }, 'useBildirimler');
        } catch (error) {
          logger.error('İftar bildirimi planlanırken hata', { error }, 'useBildirimler');
        }
      }
    }
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
        sound: 'ney',
        ...(Platform.OS === 'android' && { channelId: CHANNEL_HATIRLATICI }),
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
      await createNotificationChannels();

      // 3. Mevcut bildirimleri temizle
      await Notifications.cancelAllScheduledNotificationsAsync();
      logger.debug('Mevcut bildirimler temizlendi', undefined, 'useBildirimler');

      // 4. Ayarları ve şehri yükle
      const ayarlar = await yukleBildirimAyarlari();
      const sehir = await yukleSehir();
      const sehirAdi = sehir?.isim || 'Istanbul';

      logger.debug('Bildirim ayarları yüklendi', { sehir: sehirAdi, ayarlar }, 'useBildirimler');

      // 5. Namaz vakti bildirimlerini planla
      await scheduleNamazNotifications(sehirAdi, ayarlar);

      // 6. Oruç bildirimlerini planla (sahur/iftar)
      await scheduleFastingNotifications(sehirAdi, ayarlar);

      // 7. Planlanan bildirimleri logla
      const planlilar = await getScheduledNotifications();
      logger.info(`Toplam ${planlilar.length} bildirim planlandı`, undefined, 'useBildirimler');

      // 8. Ezan sesi listener'ını başlat
      bildirimEzanSesiBaslat();

    } catch (error) {
      logger.error('Bildirimler ayarlanırken hata', { error }, 'useBildirimler');
    }
  }, []);

  useEffect(() => {
    bildirimleriAyarla();

    return () => {
      bildirimEzanSesiTemizle();
    };
  }, [bildirimleriAyarla]);

  return { bildirimleriAyarla, sendTestNotification, getScheduledNotifications };
}
