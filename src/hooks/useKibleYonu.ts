import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { KibleYonu } from '../types';

/**
 * Kıble yönünü hesaplayan hook
 * Mekke'nin koordinatları: 21.4225° N, 39.8262° E
 */
export function useKibleYonu() {
  const [kibleYonu, setKibleYonu] = useState<KibleYonu | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    async function kibleHesapla() {
      try {
        setYukleniyor(true);
        setHata(null);

        // Konum izni iste
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Konum izni verilmedi');
        }

        // Mevcut konumu al
        const konum = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = konum.coords;

        // Kıble yönü hesapla (basit yaklaşım)
        // Türkiye için yaklaşık güney-doğu yönü
        const mekkeLat = 21.4225;
        const mekkeLon = 39.8262;

        // Açı hesaplama (basitleştirilmiş)
        const dLat = mekkeLat - latitude;
        const dLon = mekkeLon - longitude;

        let aci = (Math.atan2(dLon, dLat) * 180) / Math.PI;
        if (aci < 0) aci += 360;

        // Yön belirleme
        let yon: KibleYonu['yon'] = 'G';
        if (aci >= 337.5 || aci < 22.5) yon = 'K';
        else if (aci >= 22.5 && aci < 67.5) yon = 'KD';
        else if (aci >= 67.5 && aci < 112.5) yon = 'D';
        else if (aci >= 112.5 && aci < 157.5) yon = 'GD';
        else if (aci >= 157.5 && aci < 202.5) yon = 'G';
        else if (aci >= 202.5 && aci < 247.5) yon = 'GB';
        else if (aci >= 247.5 && aci < 292.5) yon = 'B';
        else if (aci >= 292.5 && aci < 337.5) yon = 'KB';

        setKibleYonu({ aci, yon });
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Kıble yönü hesaplanamadı');
        console.error('Kıble yönü hesaplanırken hata:', err);
        // Varsayılan değer (Türkiye için yaklaşık)
        setKibleYonu({ aci: 135, yon: 'GD' });
      } finally {
        setYukleniyor(false);
      }
    }

    kibleHesapla();
  }, []);

  return { kibleYonu, yukleniyor, hata };
}






