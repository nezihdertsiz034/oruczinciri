import { NamazVakitleri } from '../types';

/**
 * Diyanet İşleri Başkanlığı API'sinden namaz vakitlerini getirir
 * @param sehirAdi Şehir adı (örn: "Istanbul", "Ankara")
 * @returns Namaz vakitleri
 */
export async function getNamazVakitleri(
  sehirAdi: string = 'Istanbul'
): Promise<NamazVakitleri> {
  const bugun = new Date();
  const yil = bugun.getFullYear();
  const ay = String(bugun.getMonth() + 1).padStart(2, '0');
  
  // API için şehir adını normalize et (Türkçe karakterleri İngilizce'ye çevir)
  const normalizedSehir = sehirAdi
    .replace(/İ/g, 'I')
    .replace(/ı/g, 'i')
    .replace(/Ş/g, 'S')
    .replace(/ş/g, 's')
    .replace(/Ğ/g, 'G')
    .replace(/ğ/g, 'g')
    .replace(/Ü/g, 'U')
    .replace(/ü/g, 'u')
    .replace(/Ö/g, 'O')
    .replace(/ö/g, 'o')
    .replace(/Ç/g, 'C')
    .replace(/ç/g, 'c');
  
  // Aladhan API endpoint - şehre göre
  const url = `https://api.aladhan.com/v1/calendarByCity/${yil}/${ay}?city=${encodeURIComponent(normalizedSehir)}&country=Turkey&method=13`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Geçersiz API yanıtı');
    }
    
    // Bugünün vakitlerini al
    const bugununGunu = bugun.getDate();
    const bugununVakitleri = data.data.find(
      (item: any) => parseInt(item.date.gregorian.day) === bugununGunu
    );

    if (!bugununVakitleri || !bugununVakitleri.timings) {
      throw new Error('Bugünün vakitleri bulunamadı');
    }

    const timings = bugununVakitleri.timings;

    return {
      imsak: formatTime(timings.Fajr),
      gunes: formatTime(timings.Sunrise),
      ogle: formatTime(timings.Dhuhr),
      ikindi: formatTime(timings.Asr),
      aksam: formatTime(timings.Maghrib),
      yatsi: formatTime(timings.Isha),
    };
  } catch (error) {
    console.error('Namaz vakitleri alınırken hata:', error);
    // Fallback: Varsayılan vakitler (İstanbul için yaklaşık)
    return getVarsayilanVakitler();
  }
}

/**
 * Saat formatını düzenler (HH:mm)
 */
function formatTime(timeString: string): string {
  // "05:30 (GMT+3)" formatından "05:30" al
  const time = timeString.split(' ')[0];
  return time;
}

/**
 * Varsayılan namaz vakitleri (API çalışmazsa)
 */
function getVarsayilanVakitler(): NamazVakitleri {
  const bugun = new Date();
  const saat = bugun.getHours();
  
  // Mevsim ve saate göre yaklaşık vakitler
  const imsakSaat = saat < 6 ? 5 : 4;
  const aksamSaat = saat < 18 ? 19 : 20;
  
  return {
    imsak: `${String(imsakSaat).padStart(2, '0')}:30`,
    gunes: '06:00',
    ogle: '13:00',
    ikindi: '16:30',
    aksam: `${String(aksamSaat).padStart(2, '0')}:00`,
    yatsi: '21:30',
  };
}

/**
 * İki saat arasındaki farkı saniye cinsinden hesaplar
 */
export function saatFarkiHesapla(baslangic: string, bitis: string): number {
  const [baslangicSaat, baslangicDakika] = baslangic.split(':').map(Number);
  const [bitisSaat, bitisDakika] = bitis.split(':').map(Number);

  const baslangicToplam = baslangicSaat * 3600 + baslangicDakika * 60;
  const bitisToplam = bitisSaat * 3600 + bitisDakika * 60;

  let fark = bitisToplam - baslangicToplam;
  
  // Eğer bitiş ertesi güne geçiyorsa (gece yarısından sonra)
  if (fark < 0) {
    fark += 24 * 3600; // 24 saat ekle
  }

  return fark;
}

/**
 * Saniyeyi saat:dakika:saniye formatına çevirir
 */
export function saniyeToZaman(saniye: number): {
  saat: number;
  dakika: number;
  saniye: number;
} {
  const saat = Math.floor(saniye / 3600);
  const dakika = Math.floor((saniye % 3600) / 60);
  const sn = saniye % 60;

  return { saat, dakika, saniye: sn };
}

