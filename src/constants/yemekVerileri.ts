export interface YemekVerisi {
    id: string;
    isim: string;
    kalori: number;
    kategori: 'corba' | 'ana_yemek' | 'icecek' | 'tatli' | 'atistirmalik' | 'temel';
}

export const YEMEK_VERILERI: YemekVerisi[] = [
    // Temel
    { id: '1', isim: 'Hurma (1 adet)', kalori: 20, kategori: 'temel' },
    { id: '2', isim: 'Zeytin (1 adet)', kalori: 5, kategori: 'temel' },
    { id: '3', isim: 'Ramazan Pidesi (1 dilim)', kalori: 70, kategori: 'temel' },
    { id: '4', isim: 'Su (1 bardak)', kalori: 0, kategori: 'temel' },

    // Çorbalar
    { id: '5', isim: 'Mercimek Çorbası (1 kepçe)', kalori: 140, kategori: 'corba' },
    { id: '6', isim: 'Ezogelin Çorbası (1 kepçe)', kalori: 130, kategori: 'corba' },
    { id: '7', isim: 'Tarhana Çorbası (1 kepçe)', kalori: 150, kategori: 'corba' },

    // Ana Yemekler
    { id: '8', isim: 'Etli Kurufasulye (1 porsiyon)', kalori: 350, kategori: 'ana_yemek' },
    { id: '9', isim: 'Pirinç Pilavı (1 porsiyon)', kalori: 300, kategori: 'ana_yemek' },
    { id: '10', isim: 'Bulgur Pilavı (1 porsiyon)', kalori: 250, kategori: 'ana_yemek' },
    { id: '11', isim: 'Tavuk Sote (1 porsiyon)', kalori: 280, kategori: 'ana_yemek' },
    { id: '12', isim: 'Izgara Köfte (3 adet)', kalori: 180, kategori: 'ana_yemek' },

    // Tatlılar
    { id: '13', isim: 'Güllaç (1 dilim)', kalori: 250, kategori: 'tatli' },
    { id: '14', isim: 'Baklava (1 dilim)', kalori: 160, kategori: 'tatli' },
    { id: '15', isim: 'Sütlaç (1 kase)', kalori: 300, kategori: 'tatli' },

    // İçecekler
    { id: '16', isim: 'Ayran (1 bardak)', kalori: 80, kategori: 'icecek' },
    { id: '17', isim: 'Ramazan Şerbeti (1 bardak)', kalori: 150, kategori: 'icecek' },
    { id: '18', isim: 'Çay (Şekersiz)', kalori: 0, kategori: 'icecek' },
];
