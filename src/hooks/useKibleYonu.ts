import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { KibleYonu } from '../types';
import { logger } from '../utils/logger';
import { handleError } from '../utils/errorHandler';

/**
 * Kıble yönünü hesaplayan ve gerçek zamanlı pusula verisi ile yöneten hook
 * 
 * @returns {Object} Kıble yönü, pusula açısı, yükleniyor durumu ve hata mesajı
 */
export function useKibleYonu() {
  const [kibleYonu, setKibleYonu] = useState<KibleYonu | null>(null);
  const [pusulaAcisi, setPusulaAcisi] = useState<number>(0);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  // Kabe koordinatları
  const kabeLatitude = 21.4225;
  const kabeLongitude = 39.8262;

  useEffect(() => {
    let subscription: any = null;

    async function baslat() {
      try {
        setYukleniyor(true);
        setHata(null);

        // 1. Konum izni iste
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setHata('Konum izni verilmedi. Lütfen ayarlardan izin verin.');
          logger.warn('Konum izni verilmedi', undefined, 'useKibleYonu');
          setYukleniyor(false);
          return;
        }

        // 2. Mevcut konumu al ve kıble açısını hesapla
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Kıble açısını (Kuzey'den saat yönünde) hesapla
        const lat1 = (latitude * Math.PI) / 180;
        const lat2 = (kabeLatitude * Math.PI) / 180;
        const dLon = ((kabeLongitude - longitude) * Math.PI) / 180;

        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        let kibleAcisi = (Math.atan2(y, x) * 180) / Math.PI;
        kibleAcisi = (kibleAcisi + 360) % 360; // 0-360 arası

        const yonlar: Array<KibleYonu['yon']> = ['K', 'KB', 'B', 'GB', 'G', 'GD', 'D', 'KD'];
        const yonIndex = Math.round(kibleAcisi / 45) % 8;
        const yon = yonlar[yonIndex];

        setKibleYonu({ aci: kibleAcisi, yon });
        logger.debug('Kıble açısı hesaplandı', { kibleAcisi, yon }, 'useKibleYonu');

        // 3. Pusulayı (Magnetometer) başlat
        Magnetometer.setUpdateInterval(100);
        subscription = Magnetometer.addListener(data => {
          let { x, y } = data;
          let angle = Math.atan2(y, x) * (180 / Math.PI);

          // Android ve iOS farklarını kompanse et (yaklaşık pusher mantığı)
          angle = angle < 0 ? angle + 360 : angle;
          setPusulaAcisi(Math.round(angle));
        });

      } catch (err) {
        const appError = handleError(err, 'useKibleYonu.baslat');
        setHata(appError.userMessage);
        // Varsayılan (Türkiye/İstanbul civarı)
        setKibleYonu({ aci: 152, yon: 'GD' });
      } finally {
        setYukleniyor(false);
      }
    }

    baslat();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return {
    kibleYonu,
    pusulaAcisi, // Cihazın baktığı yön
    kibleOkAcisi: kibleYonu ? (kibleYonu.aci - pusulaAcisi + 360) % 360 : 0, // Okun ekranda ne kadar dönmesi gerektiği
    yukleniyor,
    hata
  };
}
