/**
 * HomeScreen için sabit veriler
 */

// Günün ayetleri
export const GUNUN_AYETLERI = [
    { ayet: '"Ey iman edenler! Oruç, sizden öncekilere farz kılındığı gibi size de farz kılındı."', kaynak: 'Bakara, 183' },
    { ayet: '"Şüphesiz Allah sabredenlerle beraberdir."', kaynak: 'Bakara, 153' },
    { ayet: '"Kim Allah\'a tevekkül ederse, O ona yeter."', kaynak: 'Talak, 3' },
    { ayet: '"Rabbinizden mağfiret dileyin. Çünkü O çok bağışlayandır."', kaynak: 'Nuh, 10' },
    { ayet: '"Allah\'ı çok zikredin ki kurtuluşa eresiniz."', kaynak: 'Cuma, 10' },
    { ayet: '"Ve Rabbine sabret. Çünkü sen gözlerimizin önündesin."', kaynak: 'Tur, 48' },
    { ayet: '"Namazı dosdoğru kılın, zekatı verin."', kaynak: 'Bakara, 43' },
];

// Hadis-i Şerifler
export const HADISLER = [
    { hadis: '"Oruç bir kalkandır. Oruçlu kötü söz söylemesin."', kaynak: 'Buhari' },
    { hadis: '"Sizin en hayırlınız, ahlakı en güzel olanınızdır."', kaynak: 'Buhari' },
    { hadis: '"Kolaylaştırın, zorlaştırmayın. Müjdeleyin, nefret ettirmeyin."', kaynak: 'Buhari' },
    { hadis: '"Güzel söz sadakadır."', kaynak: 'Buhari' },
    { hadis: '"Temizlik imanın yarısıdır."', kaynak: 'Müslim' },
];

// Hızlı erişim kartları - Satır 1 (4 adet)
export const HIZLI_ERISIM_1 = [
    { id: 'tesbih', baslik: 'Tesbih', ikon: '📿', tab: 'Takip', screen: 'TesbihSayaci', renk: '#FFD700' },
    { id: 'dualar', baslik: 'Dualar', ikon: '🤲', tab: 'İbadet', screen: 'DualarMain', renk: '#90EE90' },
    { id: 'kible', baslik: 'Kıble', ikon: '🧭', tab: 'Araçlar', screen: 'Kıble', renk: '#87CEEB' },
    { id: 'esma', baslik: 'Esmaül Hüsna', ikon: '☪️', tab: 'İbadet', screen: 'EsmaulHusna', renk: '#DDA0DD' },
];

// Hızlı erişim kartları - Satır 2 (4 adet) 
export const HIZLI_ERISIM_2 = [
    { id: 'peygamber', baslik: 'Hz. Muhammed (S.A.V.)', ikon: '🌙', tab: 'İbadet', screen: 'PeygamberHayati', renk: '#98FB98' },
    { id: 'kuran', baslik: 'Kur\'an-ı Kerim', ikon: '📖', tab: 'İbadet', screen: 'KuranKerim', renk: '#2C5F2D' },
    { id: 'zekat', baslik: 'Zekat', ikon: '💰', tab: 'Araçlar', screen: 'Zekat', renk: '#F0E68C' },
    { id: 'istatistik', baslik: 'İstatistikler', ikon: '📊', tab: 'Takip', screen: 'IstatistiklerMain', renk: '#B0C4DE' },
];
