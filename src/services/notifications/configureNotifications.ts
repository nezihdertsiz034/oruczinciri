import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { logger } from '../../utils/logger';

/**
 * Bildirim kanalı ID'leri
 * NOT: Android'de kanal bir kez oluşturulduğunda sesi değiştirilemez.
 * Ses değişikliği gerektiğinde kanal ID'sini versiyonlayın (örn: ezan-v3).
 */
export const CHANNEL_EZAN = 'ezan-v2'; // v2: yunus_emre sesi ile yeniden oluşturuldu
export const CHANNEL_NAMAZ = 'namaz-vakitleri-v2';
export const CHANNEL_HATIRLATICI = 'hatirlaticilar-v2';

/**
 * Eski kanalları temizle (artık kullanılmayan kanal ID'leri)
 */
const ESKI_KANALLAR = ['ezan']; // eski ezan kanalı

/**
 * Bildirim handler ayarla
 * priority: MAX -> bildirimlerin heads-up (popup) olarak gösterilmesini sağlar
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

/**
 * Android için bildirim kanallarını oluştur
 * iOS için ses ayarlarını yapılandır
 * App açılışında çağrılmalı
 */
export async function configureNotifications(): Promise<void> {
  if (Platform.OS !== 'android') {
    logger.info('iOS platform - notification channels gerekli değil (ses content.sound ile belirlenir)', undefined, 'configureNotifications');
    return;
  }

  try {
    // Eski kanalları sil (ses güncellemesi için gerekli)
    for (const eskiKanal of ESKI_KANALLAR) {
      try {
        await Notifications.deleteNotificationChannelAsync(eskiKanal);
        logger.info(`Eski kanal silindi: ${eskiKanal}`, undefined, 'configureNotifications');
      } catch {
        // Kanal zaten yoksa sorun değil
      }
    }

    // Ezan kanalı (yunus_emre sesi - OS notification sound)
    // Android'de bildirim sesi kanal bazında belirlenir
    await Notifications.setNotificationChannelAsync(CHANNEL_EZAN, {
      name: 'Ezan Sesi',
      description: 'Namaz vakti geldiğinde ezan sesi ile bildirim',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: '#1a5f3f',
      sound: 'yunus_emre', // Android raw resource - uzantı olmadan
      enableVibrate: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });

    // Namaz vakitleri kanalı (geriye dönük uyumluluk)
    await Notifications.setNotificationChannelAsync(CHANNEL_NAMAZ, {
      name: 'Namaz Vakitleri',
      description: 'Günlük namaz vakti bildirimleri',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 1000, 500, 1000],
      lightColor: '#1a5f3f',
      sound: 'yunus_emre', // Android raw resource - uzantı olmadan
      enableVibrate: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });

    // Hatırlatıcılar kanalı (sahur, iftar, su, günlük vb.)
    await Notifications.setNotificationChannelAsync(CHANNEL_HATIRLATICI, {
      name: 'Hatırlatıcılar',
      description: 'Sahur, iftar ve diğer hatırlatıcılar',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: '#1a5f3f',
      sound: 'yunus_emre', // Hatırlatıcılar için de Yunus Emre sesi
      enableVibrate: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: false, // Hatırlatıcılar DnD'yi geçmesin
    });

    logger.info('Bildirim kanalları yapılandırıldı (ezan-v2, namaz-v2, hatirlatici-v2)', undefined, 'configureNotifications');
  } catch (error) {
    logger.error('Bildirim kanalları yapılandırılırken hata', { error }, 'configureNotifications');
  }
}
