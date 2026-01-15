import { NamazVakitleri } from '../types';
import { logger } from './logger';

// Fetch timeout (15 saniye - mobil bağlantılar için daha uzun)
const FETCH_TIMEOUT = 15000;
const MAX_RETRIES = 2; // Maksimum 2 retry

/**
 * Timeout ile fetch yapar
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout: number = FETCH_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

/**
 * Retry mekanizması ile fetch yapar
 */
async function fetchWithRetry(url: string, options: RequestInit = {}, retries: number = MAX_RETRIES): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      logger.debug(`API çağrısı (deneme ${i + 1}/${retries + 1})`, { url }, 'namazVakitleri');
      const response = await fetchWithTimeout(url, options);
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn(`API çağrısı başarısız (deneme ${i + 1}/${retries + 1})`, { error: lastError.message }, 'namazVakitleri');

      // Son deneme değilse kısa bir süre bekle
      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}


/**
 * Şehir isimlerini Aladhan API uyumlu hale getirir (İngilizce karakterlere çevirir)
 */
function normalizeSehirAdi(sehirAdi: string): string {
  const mapping: { [key: string]: string } = {
    'İ': 'I', 'ı': 'i',
    'Ş': 'S', 'ş': 's',
    'Ğ': 'G', 'ğ': 'g',
    'Ç': 'C', 'ç': 'c',
    'Ü': 'U', 'ü': 'u',
    'Ö': 'O', 'ö': 'o'
  };

  return sehirAdi.replace(/[İıŞşĞğÇçÜüÖö]/g, char => mapping[char] || char);
}

/**
 * Aladhan API'den belirli bir tarih için namaz vakitlerini çeker
 */
async function getAladhanTarihNamazVakitleri(
  sehirAdi: string,
  tarih: Date
): Promise<NamazVakitleri | null> {
  try {
    const apiSehirAdi = normalizeSehirAdi(sehirAdi);
    const yil = tarih.getFullYear();
    const ay = tarih.getMonth() + 1;

    const apiUrl = `https://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(apiSehirAdi)}&country=Turkey&method=13&year=${yil}&month=${ay}`;

    const response = await fetchWithRetry(apiUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.data && Array.isArray(data.data)) {
      const hedefTarih = tarih.getDate();
      const hedefAy = tarih.getMonth() + 1;
      const hedefYil = tarih.getFullYear();

      const vakit = data.data.find((v: any) => {
        const gregorian = v?.date?.gregorian;
        if (!gregorian) return false;
        const gun = Number(gregorian.day);
        const ayNo = Number(gregorian.month?.number);
        const yilNo = Number(gregorian.year);
        if (!Number.isFinite(gun) || !Number.isFinite(ayNo) || !Number.isFinite(yilNo)) {
          return false;
        }
        return gun === hedefTarih && ayNo === hedefAy && yilNo === hedefYil;
      });

      if (vakit && vakit.timings) {
        const timings = vakit.timings;
        const result: NamazVakitleri = {
          imsak: timings.Fajr?.substring(0, 5) || timings.Imsak?.substring(0, 5) || '',
          gunes: timings.Sunrise?.substring(0, 5) || '',
          ogle: timings.Dhuhr?.substring(0, 5) || '',
          ikindi: timings.Asr?.substring(0, 5) || '',
          aksam: timings.Maghrib?.substring(0, 5) || '',
          yatsi: timings.Isha?.substring(0, 5) || '',
        };

        if (result.imsak && result.gunes && result.ogle && result.ikindi && result.aksam && result.yatsi) {
          return result;
        }
      }
    }

    return null;
  } catch (error: any) {
    logger.error('[Aladhan Tarih API] Hata', error, 'namazVakitleri');
    return null;
  }
}

/**
 * Aladhan API'den koordinat ile belirli bir tarih için namaz vakitlerini çeker
 * Endpoint: /v1/timings/{timestamp}
 */
async function getAladhanKoordinatNamazVakitleri(
  lat: number,
  lon: number,
  tarih: Date
): Promise<NamazVakitleri | null> {
  try {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      logger.error('[Aladhan Koordinat API] Geçersiz koordinatlar', { lat, lon }, 'namazVakitleri');
      return null;
    }

    const timestamp = Math.floor(tarih.getTime() / 1000);
    const apiUrl = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lon}&method=13`;

    console.log(`[Aladhan Koordinat API] Vakitler çekiliyor: ${lat}, ${lon}, ts=${timestamp}`);

    const response = await fetchWithRetry(apiUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      logger.warn(`[Aladhan Koordinat API] HTTP hatası: ${response.status}`, undefined, 'namazVakitleri');
      return null;
    }

    const data = await response.json();
    const timings = data?.data?.timings;

    if (!timings) {
      logger.warn('[Aladhan Koordinat API] Yanıtta timing bulunamadı', undefined, 'namazVakitleri');
      return null;
    }

    const result: NamazVakitleri = {
      imsak: timings.Fajr?.substring(0, 5) || timings.Imsak?.substring(0, 5) || '',
      gunes: timings.Sunrise?.substring(0, 5) || '',
      ogle: timings.Dhuhr?.substring(0, 5) || '',
      ikindi: timings.Asr?.substring(0, 5) || '',
      aksam: timings.Maghrib?.substring(0, 5) || '',
      yatsi: timings.Isha?.substring(0, 5) || '',
    };

    if (result.imsak && result.gunes && result.ogle && result.ikindi && result.aksam && result.yatsi) {
      console.log('[Aladhan Koordinat API] ✅ Başarılı!', result);
      return result;
    }

    logger.warn('[Aladhan Koordinat API] ⚠️ Eksik veri', result, 'namazVakitleri');
    return null;
  } catch (error: any) {
    logger.error('[Aladhan Koordinat API] Hata', error, 'namazVakitleri');
    return null;
  }
}

/**
 * Aladhan API'den namaz vakitlerini çeker (öncelikli - en güvenilir)
 * Method 13 = Diyanet İşleri Başkanlığı hesaplama yöntemi
 */
async function getAladhanNamazVakitleri(
  sehirAdi: string
): Promise<NamazVakitleri | null> {
  try {
    const apiSehirAdi = normalizeSehirAdi(sehirAdi);
    const bugun = new Date();
    const yil = bugun.getFullYear();
    const ay = bugun.getMonth() + 1;

    // API endpoint: /v1/calendarByCity
    // method=13 = Diyanet İşleri Başkanlığı
    const apiUrl = `https://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(apiSehirAdi)}&country=Turkey&method=13&year=${yil}&month=${ay}`;

    console.log(`[Aladhan API] Vakitler çekiliyor: ${apiSehirAdi} (Orijinal: ${sehirAdi})`);

    const response = await fetchWithRetry(apiUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      logger.warn(`[Aladhan API] HTTP hatası: ${response.status}`, undefined, 'namazVakitleri');
      return null;
    }

    const data = await response.json();

    // Aladhan API formatı: { data: [...] }
    if (data.data && Array.isArray(data.data)) {
      // Bugünün tarihini bul
      const bugunTarih = bugun.getDate();
      const bugunAy = bugun.getMonth() + 1;
      const bugunYil = bugun.getFullYear();

      const bugununVakti = data.data.find((v: any) => {
        const gregorian = v?.date?.gregorian;
        if (!gregorian) return false;
        const gun = Number(gregorian.day);
        const ayNo = Number(gregorian.month?.number);
        const yilNo = Number(gregorian.year);
        if (!Number.isFinite(gun) || !Number.isFinite(ayNo) || !Number.isFinite(yilNo)) {
          return false;
        }
        return gun === bugunTarih && ayNo === bugunAy && yilNo === bugunYil;
      });

      if (bugununVakti && bugununVakti.timings) {
        const timings = bugununVakti.timings;

        const result: NamazVakitleri = {
          imsak: timings.Fajr?.substring(0, 5) || timings.Imsak?.substring(0, 5) || '',
          gunes: timings.Sunrise?.substring(0, 5) || '',
          ogle: timings.Dhuhr?.substring(0, 5) || '',
          ikindi: timings.Asr?.substring(0, 5) || '',
          aksam: timings.Maghrib?.substring(0, 5) || '',
          yatsi: timings.Isha?.substring(0, 5) || '',
        };

        if (result.imsak && result.gunes && result.ogle && result.ikindi && result.aksam && result.yatsi) {
          console.log(`[Aladhan API] ✅ Başarılı!`, result);
          return result;
        } else {
          console.warn(`[Aladhan API] ⚠️ Eksik veri:`, result);
        }
      }
    }

    return null;
  } catch (error: any) {
    logger.error('[Aladhan API] Hata', error, 'namazVakitleri');
    return null;
  }
}

/**
 * Namaz vakitlerini çeker
 * Kaynak: Aladhan API
 * @param sehirAdi - Şehir adı (örn: "İstanbul", "Ankara")
 * @returns Promise<NamazVakitleri | null> - Namaz vakitleri veya null
 */
export async function getNamazVakitleri(sehirAdi: string): Promise<NamazVakitleri | null> {
  try {
    if (!sehirAdi || !sehirAdi.trim()) {
      console.error('[Namaz Vakitleri] Şehir adı boş');
      return null;
    }

    console.log(`[Namaz Vakitleri] Şehir: ${sehirAdi}`);

    // Öncelik 1: Aladhan API (Method 13 = Diyanet hesaplama yöntemi, en güvenilir)
    const aladhanVakitler = await getAladhanNamazVakitleri(sehirAdi);
    if (aladhanVakitler) {
      return aladhanVakitler;
    }

    // API başarısız oldu
    logger.error('[Namaz Vakitleri] Aladhan API başarısız oldu. Lütfen internet bağlantınızı kontrol edin', undefined, 'namazVakitleri');
    return null;
  } catch (error) {
    logger.error('[Namaz Vakitleri] Genel hata', error, 'namazVakitleri');
    return null;
  }
}

/**
 * Belirli bir tarih için namaz vakitlerini getirir
 * @param tarih - Tarih objesi
 * @param sehirAdi - Şehir adı
 * @returns Promise<NamazVakitleri | null> - Namaz vakitleri veya null
 */
export async function getTarihNamazVakitleri(
  tarih: Date,
  sehirAdi: string
): Promise<NamazVakitleri | null> {
  try {
    if (!sehirAdi || !sehirAdi.trim()) {
      console.error('[Tarih Namaz Vakitleri] Şehir adı boş');
      return null;
    }

    const yil = tarih.getFullYear();
    const ay = String(tarih.getMonth() + 1).padStart(2, '0');
    const gun = String(tarih.getDate()).padStart(2, '0');

    console.log(`[Tarih Namaz Vakitleri] Şehir: ${sehirAdi}, Tarih: ${yil}-${ay}-${gun}`);

    // Aladhan API kullan (tarih bazlı)
    const aladhanVakitler = await getAladhanTarihNamazVakitleri(sehirAdi, tarih);
    if (aladhanVakitler) {
      return aladhanVakitler;
    }

    return null;
  } catch (error) {
    logger.error('[Tarih Namaz Vakitleri] Genel hata', error, 'namazVakitleri');
    return null;
  }
}

/**
 * Saat string'inden dakika çıkarır
 * @param saat - "HH:MM" formatında saat string'i
 * @param dakika - Çıkarılacak dakika
 * @returns string - "HH:MM" formatında yeni saat
 */
export function saattenDakikaCikar(saat: string, dakika: number): string {
  try {
    const [saatStr, dakikaStr] = saat.split(':');
    let saatNum = parseInt(saatStr, 10);
    let dakikaNum = parseInt(dakikaStr, 10);

    // Dakikayı çıkar
    dakikaNum -= dakika;

    // Negatif dakika durumunda saati azalt
    while (dakikaNum < 0) {
      dakikaNum += 60;
      saatNum -= 1;
    }

    // Negatif saat durumunda günü azalt (00:00'a dön)
    if (saatNum < 0) {
      saatNum = 23;
      dakikaNum = 60 + dakikaNum;
    }

    return `${String(saatNum).padStart(2, '0')}:${String(dakikaNum).padStart(2, '0')}`;
  } catch (error) {
    logger.error('Saat hesaplama hatası', error, 'namazVakitleri');
    return saat;
  }
}

/**
 * İki saat arasındaki farkı dakika cinsinden hesaplar
 * @param saat1 - İlk saat "HH:MM" formatında
 * @param saat2 - İkinci saat "HH:MM" formatında
 * @returns number - Dakika cinsinden fark
 */
export function saatFarkiHesapla(saat1: string, saat2: string): number {
  try {
    const [saat1Str, dakika1Str] = saat1.split(':');
    const [saat2Str, dakika2Str] = saat2.split(':');

    const dakika1 = parseInt(saat1Str, 10) * 60 + parseInt(dakika1Str, 10);
    const dakika2 = parseInt(saat2Str, 10) * 60 + parseInt(dakika2Str, 10);

    return dakika2 - dakika1;
  } catch (error) {
    logger.error('Saat farkı hesaplama hatası', error, 'namazVakitleri');
    return 0;
  }
}

/**
 * Saniyeyi saat, dakika, saniye formatına çevirir
 * @param saniye - Toplam saniye
 * @returns { saat: number, dakika: number, saniye: number }
 */
export function saniyeToZaman(saniye: number): { saat: number; dakika: number; saniye: number } {
  const saat = Math.floor(saniye / 3600);
  const dakika = Math.floor((saniye % 3600) / 60);
  const saniyeKalan = saniye % 60;

  return { saat, dakika, saniye: saniyeKalan };
}

/**
 * Kullanım örneği:
 * (async () => {
 *   const vakitler =
 *     (await getAladhanKoordinatNamazVakitleri(41.0082, 28.9784, new Date())) ??
 *     (await getAladhanNamazVakitleri('İstanbul'));
 *   console.log('İmsak:', vakitler?.imsak);
 * })();
 */
export { getAladhanKoordinatNamazVakitleri };
