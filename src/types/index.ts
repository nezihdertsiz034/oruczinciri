// Namaz vakitleri tip tanımları
export interface NamazVakitleri {
  imsak: string; // Sabah ezanı
  gunes: string;
  ogle: string;
  ikindi: string;
  aksam: string; // Akşam namazı
  yatsi: string;
}

// Şehir bilgisi
export interface Sehir {
  id: number;
  isim: string;
}

// Oruç günü verisi
export interface OrucGunu {
  tarih: string;
  isaretli: boolean;
}

// Zincir halkası verisi
export interface ZincirHalkasi {
  tarih: Date;
  gunNumarasi: number;
  isaretli: boolean;
  bugunMu: boolean;
}

// İstatistikler
export interface Istatistikler {
  toplamOruc: number;
  kesintisizZincir: number;
  yuzdelik: number;
  toplamGun: number;
  haftalikOruc: number[];
  rozetler: string[];
}

// Bildirim ayarları
export interface BildirimAyarlari {
  sahurAktif: boolean;
  sahurSaat: string; // "05:00" formatında
  iftarAktif: boolean;
  iftarSaat: string;
  namazVakitleriAktif: boolean;
  gunlukHatirlaticiAktif: boolean;
  gunlukHatirlaticiSaat: string;
  suIcmeHatirlaticiAktif: boolean;
  suIcmeAraligi: number; // Dakika cinsinden (örn: 30 = her 30 dakikada bir)
  ezanSesiAktif: boolean; // Ezan sesi çalınsın mı
}

// Dua
export interface Dua {
  id: string;
  baslik: string;
  arapca: string;
  turkceOkunus?: string;
  turkceAnlam: string;
  kategori: 'sahur' | 'iftar' | 'oruc' | 'genel';
  kaynak?: string;
  favori?: boolean;
}

// Kur'an ayeti
export interface KuranAyeti {
  id: string;
  sure: string;
  ayetNumarasi: number;
  arapca: string;
  turkceMeal: string;
  favori?: boolean;
}

// Not
export interface Not {
  id: string;
  tarih: string; // YYYY-MM-DD formatında
  baslik?: string;
  icerik: string;
  olusturmaTarihi: number; // timestamp
}

// Sadaka
export interface Sadaka {
  id: string;
  tarih: string; // YYYY-MM-DD formatında
  miktar: number;
  aciklama?: string;
  olusturmaTarihi: number; // timestamp
}

// Teravih namazı
export interface Teravih {
  id: string;
  tarih: string; // YYYY-MM-DD formatında
  rekatSayisi: number; // Genellikle 20
  tamamlandi: boolean;
  olusturmaTarihi: number; // timestamp
}

// Kıble yönü
export interface KibleYonu {
  aci: number; // 0-360 derece
  yon: 'K' | 'KB' | 'B' | 'GB' | 'G' | 'GD' | 'D' | 'KD';
}

