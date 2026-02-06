import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';
import { Not, Sadaka, Teravih, BildirimAyarlari, Sehir, TesbihSayaciVeri, TesbihKaydi, UygulamaAyarlari, NamazVakitleri } from '../types';
import { tarihToString, getRamazan2026Tarihleri } from './ramazanTarihleri';
import { yukleOrucVerileri } from './orucStorage';

// Storage key'leri
const STORAGE_KEYS = {
  NOTLAR: '@notlar',
  SADAKA: '@sadaka',
  TERAVIH: '@teravih',
  TESBIH_SAYACI: '@tesbih_sayaci',
  TESBIH_KAYITLARI: '@tesbih_kayitlari',
  BILDIRIM_AYARLARI: '@bildirim_ayarlari',
  UYGULAMA_AYARLARI: '@uygulama_ayarlari',
  SEHIR: '@sehir',
} as const;


// ========== NOTLAR ==========

/**
 * Tüm notları yükler
 */
export async function yukleNotlar(): Promise<Not[]> {
  try {
    const veri = await AsyncStorage.getItem(STORAGE_KEYS.NOTLAR);
    if (veri) {
      return JSON.parse(veri);
    }
    return [];
  } catch (error) {
    console.error('Notlar yüklenirken hata:', error);
    return [];
  }
}

/**
 * Not kaydeder
 */
export async function kaydetNot(not: Not): Promise<void> {
  try {
    const mevcutNotlar = await yukleNotlar();
    const index = mevcutNotlar.findIndex(n => n.id === not.id);

    if (index >= 0) {
      mevcutNotlar[index] = not;
    } else {
      mevcutNotlar.push(not);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.NOTLAR, JSON.stringify(mevcutNotlar));
  } catch (error) {
    console.error('Not kaydedilirken hata:', error);
    throw error;
  }
}

/**
 * Not siler
 */
export async function silNot(notId: string): Promise<void> {
  try {
    const mevcutNotlar = await yukleNotlar();
    const filtrelenmis = mevcutNotlar.filter(n => n.id !== notId);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTLAR, JSON.stringify(filtrelenmis));
  } catch (error) {
    console.error('Not silinirken hata:', error);
    throw error;
  }
}

/**
 * Belirli bir tarihin notunu getirir
 */
export async function getirTarihNotu(tarih: string): Promise<Not | null> {
  try {
    const notlar = await yukleNotlar();
    return notlar.find(n => n.tarih === tarih) || null;
  } catch (error) {
    console.error('Tarih notu getirilirken hata:', error);
    return null;
  }
}

// ========== SADAKA ==========

/**
 * Tüm sadaka kayıtlarını yükler
 */
export async function yukleSadakalar(): Promise<Sadaka[]> {
  try {
    const veri = await AsyncStorage.getItem(STORAGE_KEYS.SADAKA);
    if (veri) {
      return JSON.parse(veri);
    }
    return [];
  } catch (error) {
    console.error('Sadakalar yüklenirken hata:', error);
    return [];
  }
}

/**
 * Sadaka kaydeder
 */
export async function kaydetSadaka(sadaka: Sadaka): Promise<void> {
  try {
    const mevcutSadakalar = await yukleSadakalar();
    mevcutSadakalar.push(sadaka);
    await AsyncStorage.setItem(STORAGE_KEYS.SADAKA, JSON.stringify(mevcutSadakalar));
  } catch (error) {
    console.error('Sadaka kaydedilirken hata:', error);
    throw error;
  }
}

/**
 * Toplam sadaka miktarını getirir
 */
export async function getirToplamSadaka(): Promise<number> {
  try {
    const sadakalar = await yukleSadakalar();
    return sadakalar.reduce((toplam, s) => toplam + s.miktar, 0);
  } catch (error) {
    console.error('Toplam sadaka getirilirken hata:', error);
    return 0;
  }
}

// ========== TERAVIH ==========

/**
 * Tüm teravih kayıtlarını yükler
 */
export async function yukleTeravihler(): Promise<Teravih[]> {
  try {
    const veri = await AsyncStorage.getItem(STORAGE_KEYS.TERAVIH);
    if (veri) {
      return JSON.parse(veri);
    }
    return [];
  } catch (error) {
    console.error('Teravihler yüklenirken hata:', error);
    return [];
  }
}

/**
 * Teravih kaydeder
 */
export async function kaydetTeravih(teravih: Teravih): Promise<void> {
  try {
    const mevcutTeravihler = await yukleTeravihler();
    const index = mevcutTeravihler.findIndex(t => t.id === teravih.id);

    if (index >= 0) {
      mevcutTeravihler[index] = teravih;
    } else {
      mevcutTeravihler.push(teravih);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.TERAVIH, JSON.stringify(mevcutTeravihler));
  } catch (error) {
    console.error('Teravih kaydedilirken hata:', error);
    throw error;
  }
}

/**
 * Belirli bir tarihin teravih kaydını getirir
 */
export async function getirTarihTeravih(tarih: string): Promise<Teravih | null> {
  try {
    const teravihler = await yukleTeravihler();
    return teravihler.find(t => t.tarih === tarih) || null;
  } catch (error) {
    console.error('Tarih teravih getirilirken hata:', error);
    return null;
  }
}

// ========== BILDIRIM AYARLARI ==========

/**
 * Bildirim ayarlarını yükler
 */
export async function yukleBildirimAyarlari(): Promise<BildirimAyarlari> {
  try {
    const veri = await AsyncStorage.getItem(STORAGE_KEYS.BILDIRIM_AYARLARI);
    const varsayilanAyarlar: BildirimAyarlari = {
      sahurAktif: true,
      sahurSaat: '04:00',
      iftarAktif: true,
      iftarSaat: '19:00',
      namazVakitleriAktif: true, // Varsayılan olarak açık - ezan sesi için gerekli
      gunlukHatirlaticiAktif: true,
      gunlukHatirlaticiSaat: '20:00',
      suIcmeHatirlaticiAktif: false,
      suIcmeAraligi: 30, // Her 30 dakikada bir
      ezanSesiAktif: true, // Varsayılan olarak açık
      abdestHatirlaticiAktif: true,
    };

    if (veri) {
      return { ...varsayilanAyarlar, ...JSON.parse(veri) };
    }
    // Varsayılan ayarlar
    return varsayilanAyarlar;
  } catch (error) {
    console.error('Bildirim ayarları yüklenirken hata:', error);
    return {
      sahurAktif: true,
      sahurSaat: '04:00',
      iftarAktif: true,
      iftarSaat: '19:00',
      namazVakitleriAktif: true, // Varsayılan olarak açık - ezan sesi için gerekli
      gunlukHatirlaticiAktif: true,
      gunlukHatirlaticiSaat: '20:00',
      suIcmeHatirlaticiAktif: false,
      suIcmeAraligi: 30, // Her 30 dakikada bir
      ezanSesiAktif: true, // Varsayılan olarak açık
      abdestHatirlaticiAktif: true,
    };
  }
}

/**
 * Bildirim ayarlarını kaydeder
 */
export async function kaydetBildirimAyarlari(ayarlar: BildirimAyarlari): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BILDIRIM_AYARLARI, JSON.stringify(ayarlar));
  } catch (error) {
    console.error('Bildirim ayarları kaydedilirken hata:', error);
    throw error;
  }
}

// ========== UYGULAMA AYARLARI ==========

const VARSAYILAN_UYGULAMA_AYARLARI: UygulamaAyarlari = {
  // Görünüm
  yaziBoyutu: 'normal',
  temaTercih: 'otomatik',
  arapcaYaziGoster: true,
  animasyonlarAktif: true,

  // Tesbih
  tesbihTitresimAktif: true,
  tesbihSesAktif: true,
  tesbihVarsayilanHedef: 33,

  // Kıble
  kibleTitresimAktif: true,

  // Widget
  widgetAktif: true,
  widgetKilitEkraniAktif: false,
  widgetTema: 'koyu',

  // Uygulama
  dil: 'tr',
  hesaplamaMetodu: 'diyanet',
  otomatikKonum: false,
  ekraniAcikTut: true,

  // Kişiselleştirme
  kullaniciProfil: {
    isim: '',
    cinsiyet: 'belirtilmemis',
    unvan: '',
  },
};

/**
 * Uygulama ayarlarını yükler
 */
export async function yukleUygulamaAyarlari(): Promise<UygulamaAyarlari> {
  try {
    const veri = await AsyncStorage.getItem(STORAGE_KEYS.UYGULAMA_AYARLARI);
    if (veri) {
      return { ...VARSAYILAN_UYGULAMA_AYARLARI, ...JSON.parse(veri) };
    }
    return VARSAYILAN_UYGULAMA_AYARLARI;
  } catch (error) {
    console.error('Uygulama ayarları yüklenirken hata:', error);
    return VARSAYILAN_UYGULAMA_AYARLARI;
  }
}

/**
 * Uygulama ayarlarını kaydeder
 */
export async function kaydetUygulamaAyarlari(ayarlar: UygulamaAyarlari): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.UYGULAMA_AYARLARI, JSON.stringify(ayarlar));
  } catch (error) {
    console.error('Uygulama ayarları kaydedilirken hata:', error);
    throw error;
  }
}

// ========== TESBIH SAYACI ==========

/**
 * Tesbih sayacı verilerini yükler
 */
export async function yukleTesbihSayaci(): Promise<TesbihSayaciVeri> {
  const varsayilan: TesbihSayaciVeri = {
    sayac: 0,
    hedef: 33,
    guncellemeTarihi: Date.now(),
  };

  try {
    const veri = await AsyncStorage.getItem(STORAGE_KEYS.TESBIH_SAYACI);
    if (veri) {
      const parsed = JSON.parse(veri) as Partial<TesbihSayaciVeri>;
      return {
        sayac: parsed.sayac ?? varsayilan.sayac,
        hedef: parsed.hedef ?? varsayilan.hedef,
        guncellemeTarihi: parsed.guncellemeTarihi ?? varsayilan.guncellemeTarihi,
      };
    }
    return varsayilan;
  } catch (error) {
    console.error('Tesbih sayacı yüklenirken hata:', error);
    return varsayilan;
  }
}

/**
 * Tesbih sayacı verilerini kaydeder
 */
export async function kaydetTesbihSayaci(veri: TesbihSayaciVeri): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TESBIH_SAYACI, JSON.stringify(veri));
  } catch (error) {
    console.error('Tesbih sayacı kaydedilirken hata:', error);
    throw error;
  }
}

/**
 * Tesbih sayacını sıfırlar
 */
export async function sifirlaTesbihSayaci(): Promise<TesbihSayaciVeri> {
  const sifirlanmis: TesbihSayaciVeri = {
    sayac: 0,
    hedef: 33,
    guncellemeTarihi: Date.now(),
  };

  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TESBIH_SAYACI, JSON.stringify(sifirlanmis));
  } catch (error) {
    console.error('Tesbih sayacı sıfırlanırken hata:', error);
  }

  return sifirlanmis;
}

// ========== TESBIH KAYITLARI ==========

/**
 * Tüm tesbih kayıtlarını yükler
 */
export async function yukleTesbihKayitlari(): Promise<TesbihKaydi[]> {
  try {
    const veri = await AsyncStorage.getItem(STORAGE_KEYS.TESBIH_KAYITLARI);
    if (veri) {
      return JSON.parse(veri);
    }
    return [];
  } catch (error) {
    console.error('Tesbih kayıtları yüklenirken hata:', error);
    return [];
  }
}

/**
 * Yeni tesbih kaydı ekler
 */
export async function kaydetTesbihKaydi(kayit: TesbihKaydi): Promise<void> {
  try {
    const mevcutKayitlar = await yukleTesbihKayitlari();
    mevcutKayitlar.unshift(kayit); // En yeni kayıt başa eklensin

    // Maksimum 100 kayıt tut
    const sinirliKayitlar = mevcutKayitlar.slice(0, 100);

    await AsyncStorage.setItem(STORAGE_KEYS.TESBIH_KAYITLARI, JSON.stringify(sinirliKayitlar));
  } catch (error) {
    console.error('Tesbih kaydı eklenirken hata:', error);
    throw error;
  }
}

/**
 * Tesbih kaydını siler
 */
export async function silTesbihKaydi(kayitId: string): Promise<void> {
  try {
    const mevcutKayitlar = await yukleTesbihKayitlari();
    const filtrelenmis = mevcutKayitlar.filter(k => k.id !== kayitId);
    await AsyncStorage.setItem(STORAGE_KEYS.TESBIH_KAYITLARI, JSON.stringify(filtrelenmis));
  } catch (error) {
    console.error('Tesbih kaydı silinirken hata:', error);
    throw error;
  }
}

/**
 * Tüm tesbih kayıtlarını temizler
 */
export async function temizleTesbihKayitlari(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TESBIH_KAYITLARI);
  } catch (error) {
    console.error('Tesbih kayıtları temizlenirken hata:', error);
    throw error;
  }
}

// ========== SEHIR ==========

/**
 * Seçili şehri yükler
 */
export async function yukleSehir(): Promise<Sehir | null> {
  try {
    const veri = await AsyncStorage.getItem(STORAGE_KEYS.SEHIR);
    if (veri) {
      return JSON.parse(veri);
    }
    // Varsayılan: İstanbul
    return { id: 34, isim: 'İstanbul' };
  } catch (error) {
    console.error('Şehir yüklenirken hata:', error);
    return { id: 34, isim: 'İstanbul' };
  }
}

/**
 * Seçili şehri kaydeder
 */
export async function kaydetSehir(sehir: Sehir): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SEHIR, JSON.stringify(sehir));
  } catch (error) {
    console.error('Şehir kaydedilirken hata:', error);
    throw error;
  }
}

// ========== İSTATİSTİKLER ==========

/**
 * İstatistikleri hesaplar ve getirir
 */
export async function getirIstatistikler(): Promise<{
  toplamOruc: number;
  kesintisizZincir: number;
  yuzdelik: number;
  toplamGun: number;
  haftalikOruc: number[];
}> {
  try {
    const orucVerileri = await yukleOrucVerileri();
    const ramazanTarihleri = getRamazan2026Tarihleri();

    const toplamGun = ramazanTarihleri.length;
    const toplamOruc = Object.values(orucVerileri).filter(Boolean).length;
    const yuzdelik = toplamGun > 0 ? Math.round((toplamOruc / toplamGun) * 100) : 0;

    // Kesintisiz en uzun zinciri bul
    let kesintisizZincir = 0;
    let mevcutZincir = 0;

    ramazanTarihleri.forEach(tarih => {
      const tarihString = tarihToString(tarih);
      if (orucVerileri[tarihString] === true) {
        mevcutZincir++;
        kesintisizZincir = Math.max(kesintisizZincir, mevcutZincir);
      } else {
        mevcutZincir = 0;
      }
    });

    // Haftalık oruç sayıları (4 hafta)
    const haftalikOruc: number[] = [];
    for (let hafta = 0; hafta < 4; hafta++) {
      const haftaBaslangic = hafta * 7;
      const haftaBitis = Math.min(haftaBaslangic + 7, toplamGun);
      let haftaOruc = 0;

      for (let i = haftaBaslangic; i < haftaBitis; i++) {
        const tarih = ramazanTarihleri[i];
        const tarihString = tarihToString(tarih);
        if (orucVerileri[tarihString] === true) {
          haftaOruc++;
        }
      }
      haftalikOruc.push(haftaOruc);
    }

    return {
      toplamOruc,
      kesintisizZincir,
      yuzdelik,
      toplamGun,
      haftalikOruc,
    };
  } catch (error) {
    console.error('İstatistikler hesaplanırken hata:', error);
    return {
      toplamOruc: 0,
      kesintisizZincir: 0,
      yuzdelik: 0,
      toplamGun: 30,
      haftalikOruc: [0, 0, 0, 0],
    };
  }
}


// ========== NATIVE SYNC ==========

/**
 * Namaz vakitlerini ve şehir bilgisini native widget'ların okuyabileceği yere kaydeder
 */
export async function senkronizeWidgetVerileri(sehirAdi: string, vakitler: NamazVakitleri): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      const WidgetBridge = NativeModules.WidgetBridge;
      if (WidgetBridge && WidgetBridge.updateWidgetData) {
        // İmsak ve Akşam (İftar) vakitlerini gönderiyoruz
        await WidgetBridge.updateWidgetData(sehirAdi, vakitler.imsak, vakitler.aksam);
        console.log('[Widget Sync] Android Widget verileri güncellendi');
      }
    } else if (Platform.OS === 'ios') {
      // iOS WidgetKit entegrasyonu için hazırlık
      console.log('[Widget Sync] iOS için veri hazır (Henüz WidgetKit eklenmedi):', { sehirAdi, vakitler });
    }
  } catch (error) {
    console.error('Widget senkronizasyonu hatası:', error);
  }
}
