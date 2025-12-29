import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';

/**
 * Ezan sesi çalma yardımcı fonksiyonları
 */

let soundObject: Audio.Sound | null = null;
let listener: Notifications.Subscription | null = null;

/**
 * Ezan sesini çalar
 * @param sesUrl Ezan sesi URL'i (opsiyonel, varsayılan online ses kullanır)
 */
export async function ezanSesiCal(sesUrl?: string): Promise<void> {
  try {
    // Önceki ses varsa durdur
    if (soundObject) {
      await soundObject.unloadAsync();
      soundObject = null;
    }

    // Ses modunu ayarla
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    // Ezan sesi URL'i (online kaynak - güvenilir bir kaynak)
    // Not: Gerçek uygulamada yerel dosya kullanılması önerilir
    const ezanUrl = sesUrl || 'https://www.islamicfinder.org/prayer-times/assets/audio/azan.mp3';
    
    // Alternatif: Yerel dosya kullanmak isterseniz
    // const ezanUrl = require('../assets/ezan.mp3');

    // Ses dosyasını yükle ve çal
    const { sound } = await Audio.Sound.createAsync(
      { uri: ezanUrl },
      { shouldPlay: true, volume: 1.0, isLooping: false }
    );

    soundObject = sound;

    // Ses bittiğinde temizle
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        soundObject = null;
      }
    });
  } catch (error) {
    console.error('Ezan sesi çalınırken hata:', error);
    // Hata durumunda sessiz devam et
  }
}

/**
 * Çalan ezan sesini durdurur
 */
export async function ezanSesiDurdur(): Promise<void> {
  try {
    if (soundObject) {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
      soundObject = null;
    }
  } catch (error) {
    console.error('Ezan sesi durdurulurken hata:', error);
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

