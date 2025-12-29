import { getRamazan2026Tarihleri } from './ramazanTarihleri';
import { NamazVakitleri } from '../types';

/**
 * 2026 Ramazan ayı için sahur saatlerini hesaplar
 * Sahur genellikle imsak (sabah ezanı) saatinden 1-2 saat önce yapılır
 */

interface SahurVakti {
  tarih: Date;
  imsak: string; // HH:mm formatında
  sahur: string; // HH:mm formatında (imsak - 1.5 saat)
}

/**
 * Belirli bir tarih için namaz vakitlerini alır
 */
async function getTarihNamazVakitleri(tarih: Date): Promise<NamazVakitleri | null> {
  try {
    const yil = tarih.getFullYear();
    const ay = String(tarih.getMonth() + 1).padStart(2, '0');
    const gun = tarih.getDate();
    
    const url = `https://api.aladhan.com/v1/calendarByCity/${yil}/${ay}?city=Istanbul&country=Turkey&method=13`;
    
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    if (!data.data || !Array.isArray(data.data)) {
      return null;
    }
    
    const gununVakitleri = data.data.find(
      (item: any) => parseInt(item.date.gregorian.day) === gun
    );

    if (!gununVakitleri || !gununVakitleri.timings) {
      return null;
    }

    const timings = gununVakitleri.timings;
    
    const formatTime = (timeString: string): string => {
      return timeString.split(' ')[0];
    };

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
    return null;
  }
}

/**
 * Saat string'ini dakikaya çevirir
 */
function saatToDakika(saat: string): number {
  const [saatDeger, dakikaDeger] = saat.split(':').map(Number);
  return saatDeger * 60 + dakikaDeger;
}

/**
 * Dakikayı saat string'ine çevirir
 */
function dakikaToSaat(dakika: number): string {
  // Negatif değerleri düzelt (gece yarısından önce)
  if (dakika < 0) {
    dakika += 24 * 60;
  }
  const saat = Math.floor(dakika / 60) % 24;
  const dk = dakika % 60;
  return `${String(saat).padStart(2, '0')}:${String(dk).padStart(2, '0')}`;
}

/**
 * 2026 Ramazan ayı için tüm sahur saatlerini hesaplar
 * @returns Sahur vakitleri dizisi
 */
export async function getSahurVakitleri2026(): Promise<SahurVakti[]> {
  const ramazanTarihleri = getRamazan2026Tarihleri();
  const sahurVakitleri: SahurVakti[] = [];

  for (const tarih of ramazanTarihleri) {
    const vakitler = await getTarihNamazVakitleri(tarih);
    
    if (vakitler) {
      // Sahur = İmsak - 1.5 saat (90 dakika)
      const imsakDakika = saatToDakika(vakitler.imsak);
      const sahurDakika = imsakDakika - 90; // 1.5 saat önce
      const sahurSaat = dakikaToSaat(sahurDakika);
      
      sahurVakitleri.push({
        tarih: new Date(tarih),
        imsak: vakitler.imsak,
        sahur: sahurSaat,
      });
    } else {
      // Fallback: Varsayılan sahur saati (imsak - 1.5 saat)
      // Şubat-Mart için yaklaşık imsak: 05:00-05:30
      const varsayilanImsak = '05:15';
      const imsakDakika = saatToDakika(varsayilanImsak);
      const sahurDakika = imsakDakika - 90;
      const sahurSaat = dakikaToSaat(sahurDakika);
      
      sahurVakitleri.push({
        tarih: new Date(tarih),
        imsak: varsayilanImsak,
        sahur: sahurSaat,
      });
    }
    
    // API rate limit'i için kısa bekleme
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return sahurVakitleri;
}

/**
 * Belirli bir tarih için sahur saatini döndürür
 */
export async function getSahurSaati(tarih: Date): Promise<string | null> {
  const vakitler = await getTarihNamazVakitleri(tarih);
  if (!vakitler) {
    return null;
  }
  
  const imsakDakika = saatToDakika(vakitler.imsak);
  const sahurDakika = imsakDakika - 90; // 1.5 saat önce
  return dakikaToSaat(sahurDakika);
}

/**
 * Şu anki saat sahur saatinden sonra mı kontrol eder
 */
export function sahurSaatiGectiMi(sahurSaati: string): boolean {
  const simdi = new Date();
  const simdiSaat = simdi.getHours();
  const simdiDakika = simdi.getMinutes();
  const simdiToplam = simdiSaat * 60 + simdiDakika;
  
  const [sahurSaat, sahurDakika] = sahurSaati.split(':').map(Number);
  const sahurToplam = sahurSaat * 60 + sahurDakika;
  
  // Eğer sahur saati gece yarısından önceyse (örneğin 03:30)
  // ve şu anki saat öğleden sonraysa, sahur geçmiş demektir
  if (sahurToplam < 12 * 60 && simdiToplam > 12 * 60) {
    return true;
  }
  
  return simdiToplam >= sahurToplam;
}

