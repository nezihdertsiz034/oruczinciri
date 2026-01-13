import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { SEHIRLER } from '../constants/sehirler';
import { Sehir } from '../types';

/**
 * GPS koordinatlarına en yakın şehri bulur
 * Türkiye'deki 81 ilin koordinatlarına göre mesafe hesaplar
 */

// Şehir koordinatları (yaklaşık merkez koordinatları)
const SEHIR_KOORDINATLARI: { [key: string]: { lat: number; lon: number } } = {
    'Adana': { lat: 37.0, lon: 35.32 },
    'Adıyaman': { lat: 37.76, lon: 38.28 },
    'Afyonkarahisar': { lat: 38.73, lon: 30.54 },
    'Ağrı': { lat: 39.72, lon: 43.05 },
    'Amasya': { lat: 40.65, lon: 35.83 },
    'Ankara': { lat: 39.93, lon: 32.86 },
    'Antalya': { lat: 36.88, lon: 30.70 },
    'Artvin': { lat: 41.18, lon: 41.82 },
    'Aydın': { lat: 37.85, lon: 27.85 },
    'Balıkesir': { lat: 39.65, lon: 27.88 },
    'Bilecik': { lat: 40.15, lon: 29.98 },
    'Bingöl': { lat: 38.88, lon: 40.50 },
    'Bitlis': { lat: 38.40, lon: 42.11 },
    'Bolu': { lat: 40.73, lon: 31.61 },
    'Burdur': { lat: 37.72, lon: 30.29 },
    'Bursa': { lat: 40.19, lon: 29.06 },
    'Çanakkale': { lat: 40.15, lon: 26.41 },
    'Çankırı': { lat: 40.60, lon: 33.62 },
    'Çorum': { lat: 40.55, lon: 34.95 },
    'Denizli': { lat: 37.77, lon: 29.09 },
    'Diyarbakır': { lat: 37.92, lon: 40.22 },
    'Edirne': { lat: 41.68, lon: 26.56 },
    'Elazığ': { lat: 38.67, lon: 39.22 },
    'Erzincan': { lat: 39.75, lon: 39.49 },
    'Erzurum': { lat: 39.90, lon: 41.27 },
    'Eskişehir': { lat: 39.78, lon: 30.52 },
    'Gaziantep': { lat: 37.07, lon: 37.38 },
    'Giresun': { lat: 40.91, lon: 38.39 },
    'Gümüşhane': { lat: 40.46, lon: 39.48 },
    'Hakkari': { lat: 37.58, lon: 43.74 },
    'Hatay': { lat: 36.20, lon: 36.16 },
    'Isparta': { lat: 37.76, lon: 30.55 },
    'Mersin': { lat: 36.80, lon: 34.64 },
    'İstanbul': { lat: 41.01, lon: 28.98 },
    'İzmir': { lat: 38.42, lon: 27.14 },
    'Kars': { lat: 40.60, lon: 43.10 },
    'Kastamonu': { lat: 41.38, lon: 33.78 },
    'Kayseri': { lat: 38.73, lon: 35.48 },
    'Kırklareli': { lat: 41.73, lon: 27.22 },
    'Kırşehir': { lat: 39.15, lon: 34.16 },
    'Kocaeli': { lat: 40.85, lon: 29.88 },
    'Konya': { lat: 37.87, lon: 32.48 },
    'Kütahya': { lat: 39.42, lon: 29.98 },
    'Malatya': { lat: 38.35, lon: 38.31 },
    'Manisa': { lat: 38.61, lon: 27.43 },
    'Kahramanmaraş': { lat: 37.59, lon: 36.93 },
    'Mardin': { lat: 37.31, lon: 40.73 },
    'Muğla': { lat: 37.22, lon: 28.36 },
    'Muş': { lat: 38.73, lon: 41.50 },
    'Nevşehir': { lat: 38.63, lon: 34.71 },
    'Niğde': { lat: 37.97, lon: 34.68 },
    'Ordu': { lat: 40.98, lon: 37.88 },
    'Rize': { lat: 41.02, lon: 40.52 },
    'Sakarya': { lat: 40.69, lon: 30.40 },
    'Samsun': { lat: 41.29, lon: 36.33 },
    'Siirt': { lat: 37.93, lon: 41.94 },
    'Sinop': { lat: 42.03, lon: 35.15 },
    'Sivas': { lat: 39.75, lon: 37.02 },
    'Tekirdağ': { lat: 41.00, lon: 27.52 },
    'Tokat': { lat: 40.31, lon: 36.55 },
    'Trabzon': { lat: 41.00, lon: 39.73 },
    'Tunceli': { lat: 39.11, lon: 39.55 },
    'Şanlıurfa': { lat: 37.16, lon: 38.79 },
    'Uşak': { lat: 38.67, lon: 29.41 },
    'Van': { lat: 38.49, lon: 43.38 },
    'Yozgat': { lat: 39.82, lon: 34.80 },
    'Zonguldak': { lat: 41.45, lon: 31.80 },
    'Aksaray': { lat: 38.37, lon: 34.03 },
    'Bayburt': { lat: 40.26, lon: 40.22 },
    'Karaman': { lat: 37.18, lon: 33.22 },
    'Kırıkkale': { lat: 39.85, lon: 33.51 },
    'Batman': { lat: 37.89, lon: 41.13 },
    'Şırnak': { lat: 37.52, lon: 42.45 },
    'Bartın': { lat: 41.64, lon: 32.34 },
    'Ardahan': { lat: 41.11, lon: 42.70 },
    'Iğdır': { lat: 39.92, lon: 44.05 },
    'Yalova': { lat: 40.65, lon: 29.27 },
    'Karabük': { lat: 41.20, lon: 32.62 },
    'Kilis': { lat: 36.72, lon: 37.12 },
    'Osmaniye': { lat: 37.07, lon: 36.25 },
    'Düzce': { lat: 40.84, lon: 31.16 },
};

/**
 * Haversine formülü ile iki koordinat arası mesafe (km)
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Dünya yarıçapı (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Koordinatlara en yakın şehri bulur
 */
export function enYakinSehriBul(lat: number, lon: number): Sehir | null {
    let minMesafe = Infinity;
    let enYakinSehir: Sehir | null = null;

    for (const sehir of SEHIRLER) {
        const koordinat = SEHIR_KOORDINATLARI[sehir.isim];
        if (!koordinat) continue;

        const mesafe = haversineDistance(lat, lon, koordinat.lat, koordinat.lon);
        if (mesafe < minMesafe) {
            minMesafe = mesafe;
            enYakinSehir = sehir;
        }
    }

    return enYakinSehir;
}

/**
 * GPS konumundan şehri otomatik belirler
 * @returns Bulunan şehir veya null (hata durumunda)
 */
export async function konumdanSehirBul(): Promise<Sehir | null> {
    try {
        // Konum izni iste
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                'Konum İzni Gerekli',
                'Şehrinizi otomatik bulmak için konum iznine ihtiyacımız var. Lütfen manuel olarak şehir seçin.',
                [{ text: 'Tamam' }]
            );
            return null;
        }

        // Mevcut konumu al
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = location.coords;

        // En yakın şehri bul
        const sehir = enYakinSehriBul(latitude, longitude);

        if (sehir) {
            return sehir;
        } else {
            Alert.alert(
                'Şehir Bulunamadı',
                'Konumunuz Türkiye sınırları dışında olabilir. Lütfen manuel olarak şehir seçin.',
                [{ text: 'Tamam' }]
            );
            return null;
        }
    } catch (error) {
        console.error('Konum alınırken hata:', error);
        Alert.alert(
            'Konum Hatası',
            'Konumunuz alınamadı. Lütfen konum ayarlarınızı kontrol edin veya manuel olarak şehir seçin.',
            [{ text: 'Tamam' }]
        );
        return null;
    }
}
