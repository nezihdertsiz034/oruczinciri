import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';

/**
 * Ezan sesi çalma yardımcı fonksiyonları
 * Expo AV kullanarak daha güvenilir ses çalma
 */

let sound: Audio.Sound | null = null;
let listener: Notifications.Subscription | null = null;

/**
 * Ezan sesini çalar
 */
export async function ezanSesiCal(): Promise<void> {
  try {
    // Önceki ses varsa durdur
    if (sound) {
      await ezanSesiDurdur();
    }

    // Ses modunu ayarla
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });

    // Yerel ezan sesi dosyasını yükle
    const { sound: newSound } = await Audio.Sound.createAsync(
      require('../../assets/ezan.mp3'),
      { shouldPlay: true, volume: 1.0 }
    );

    sound = newSound;

    // Ses bittiğinde otomatik temizle
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        ezanSesiDurdur();
      }
    });
  } catch (error) {
    console.error('Ezan sesi çalınırken hata:', error);
    if (sound) {
      try {
        await sound.unloadAsync();
      } catch (e) {
        // Ignore
      }
      sound = null;
    }
  }
}

/**
 * Çalan ezan sesini durdurur
 */
export async function ezanSesiDurdur(): Promise<void> {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
    }
  } catch (error) {
    console.error('Ezan sesi durdurulurken hata:', error);
    sound = null;
  }
}

/**
 * Bildirim geldiğinde ezan sesi çal
 */
export function bildirimEzanSesiBaslat(): void {
  // Önceki listener varsa kaldır
  if (listener) {
    listener.remove();
    listener = null;
  }

  // Bildirim listener'ı ekle
  listener = Notifications.addNotificationReceivedListener(async (notification) => {
    const ezanSesi = notification.request.content.data?.ezanSesi;

    // Eğer bu bir namaz vakti bildirimi ve ezan sesi aktifse
    if (ezanSesi && notification.request.content.title?.includes('Namazı')) {
      await ezanSesiCal();
    }
  });
}

/**
 * Ezan sesi listener'ını temizle
 */
export function bildirimEzanSesiTemizle(): void {
  if (listener) {
    listener.remove();
    listener = null;
  }
  ezanSesiDurdur();
}
