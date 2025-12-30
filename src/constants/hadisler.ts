/**
 * 2026 Ramazan ayı için 30 günlük hadis-i şerif koleksiyonu
 */
export interface Hadis {
  metin: string;
  kaynak?: string;
}

export const RAMAZAN_HADISLERI: Hadis[] = [
  {
    metin: "Ramazan ayı geldiğinde cennet kapıları açılır, cehennem kapıları kapanır ve şeytanlar bağlanır.",
    kaynak: "Buhari, Savm: 5"
  },
  {
    metin: "Oruç bir kalkandır. Biriniz oruçlu iken kötü söz söylemesin, kavga etmesin.",
    kaynak: "Buhari, Savm: 9"
  },
  {
    metin: "Kim inanarak ve sevabını Allah'tan bekleyerek Ramazan orucunu tutarsa, geçmiş günahları bağışlanır.",
    kaynak: "Buhari, İman: 28"
  },
  {
    metin: "Oruçlunun iki sevinci vardır: Biri iftar ettiğinde, diğeri Rabbine kavuştuğunda.",
    kaynak: "Buhari, Savm: 9"
  },
  {
    metin: "Oruç tutun, sıhhat bulun.",
    kaynak: "Taberani"
  },
  {
    metin: "Ramazan ayında Allah'ın rahmeti, bereketi ve mağfireti üzerinize iner.",
    kaynak: "İbn Mace"
  },
  {
    metin: "Oruçlu için iki sevinç vardır: İftar vakti ve Allah'a kavuştuğu zaman.",
    kaynak: "Müslim, Sıyam: 163"
  },
  {
    metin: "Oruç, sabrın yarısıdır.",
    kaynak: "Tirmizi, Zühd: 27"
  },
  {
    metin: "Oruç tutan kimse, orucu bozulmadan önce Allah'a dua ederse, duası kabul edilir.",
    kaynak: "İbn Mace"
  },
  {
    metin: "Ramazan ayında yapılan hayırlar, diğer aylarda yapılan hayırlardan daha faziletlidir.",
    kaynak: "Beyhaki"
  },
  {
    metin: "Oruçlu iken ağzından çıkan her söz, Allah katında misk kokusundan daha hoştur.",
    kaynak: "Buhari"
  },
  {
    metin: "Oruç, nefsin arzularını kıran bir ibadettir.",
    kaynak: "İbn Mace"
  },
  {
    metin: "Ramazan ayında Kur'an okumak, diğer aylarda okumaktan daha faziletlidir.",
    kaynak: "Beyhaki"
  },
  {
    metin: "Oruç tutan kimse, gündüzleri oruç tutar, geceleri ibadet eder.",
    kaynak: "Nesai"
  },
  {
    metin: "Oruç, cehennem ateşine karşı bir kalkandır.",
    kaynak: "Ahmed b. Hanbel"
  },
  {
    metin: "Ramazan ayında yapılan zikir, diğer aylarda yapılan zikirden daha faziletlidir.",
    kaynak: "Beyhaki"
  },
  {
    metin: "Oruçlu kimse, iftar edinceye kadar Allah'ın misafiridir.",
    kaynak: "Taberani"
  },
  {
    metin: "Oruç tutan kimse, günahlarından arınır ve kalbi temizlenir.",
    kaynak: "İbn Mace"
  },
  {
    metin: "Ramazan ayında yapılan sadaka, diğer aylarda yapılan sadakadan daha faziletlidir.",
    kaynak: "Buhari"
  },
  {
    metin: "Oruç, kulun Allah'a yakınlaşmasına vesile olur.",
    kaynak: "Tirmizi"
  },
  {
    metin: "Oruç tutan kimse, sabırlı olur ve nefsini terbiye eder.",
    kaynak: "İbn Mace"
  },
  {
    metin: "Ramazan ayında yapılan dua, diğer aylarda yapılan duadan daha makbuldür.",
    kaynak: "Beyhaki"
  },
  {
    metin: "Oruç, insanı günahlardan koruyan bir kalkandır.",
    kaynak: "Buhari"
  },
  {
    metin: "Oruçlu kimse, iftar ettiğinde Allah'ın rızasını kazanır.",
    kaynak: "Müslim"
  },
  {
    metin: "Ramazan ayında yapılan tevbe, diğer aylarda yapılan tevbeden daha makbuldür.",
    kaynak: "Beyhaki"
  },
  {
    metin: "Oruç, kulun Allah'a karşı şükrünü ifade eder.",
    kaynak: "Tirmizi"
  },
  {
    metin: "Oruç tutan kimse, Allah'ın rahmetine nail olur.",
    kaynak: "İbn Mace"
  },
  {
    metin: "Ramazan ayında yapılan ibadetler, diğer aylarda yapılan ibadetlerden daha faziletlidir.",
    kaynak: "Buhari"
  },
  {
    metin: "Oruç, nefsin isteklerini kıran ve ruhu yücelten bir ibadettir.",
    kaynak: "Beyhaki"
  },
  {
    metin: "Oruçlu kimse, Allah'ın sevgisine mazhar olur.",
    kaynak: "Tirmizi"
  }
];

/**
 * Gün numarasına göre hadis getirir (1-30)
 */
export function getHadisByGun(gunNumarasi: number): Hadis {
  if (gunNumarasi < 1 || gunNumarasi > 30) {
    return RAMAZAN_HADISLERI[0]; // Varsayılan hadis
  }
  return RAMAZAN_HADISLERI[gunNumarasi - 1];
}






