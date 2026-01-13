import { Sehir } from '../types';

/**
 * Türkiye şehirleri listesi (namaz vakitleri API için)
 * Büyük şehirler listenin başında (İstanbul, Ankara, İzmir, Bursa, Antalya)
 */
export const SEHIRLER: Sehir[] = [
  // === En Büyük Şehirler (üstte) ===
  { id: 34, isim: 'İstanbul' },
  { id: 6, isim: 'Ankara' },
  { id: 35, isim: 'İzmir' },
  { id: 16, isim: 'Bursa' },
  { id: 7, isim: 'Antalya' },
  { id: 42, isim: 'Konya' },
  { id: 27, isim: 'Gaziantep' },
  { id: 21, isim: 'Diyarbakır' },
  { id: 55, isim: 'Samsun' },
  { id: 38, isim: 'Kayseri' },
  // === Diğer Şehirler (alfabetik) ===
  { id: 1, isim: 'Adana' },
  { id: 2, isim: 'Adıyaman' },
  { id: 3, isim: 'Afyonkarahisar' },
  { id: 4, isim: 'Ağrı' },
  { id: 68, isim: 'Aksaray' },
  { id: 5, isim: 'Amasya' },
  { id: 75, isim: 'Ardahan' },
  { id: 8, isim: 'Artvin' },
  { id: 9, isim: 'Aydın' },
  { id: 10, isim: 'Balıkesir' },
  { id: 74, isim: 'Bartın' },
  { id: 72, isim: 'Batman' },
  { id: 69, isim: 'Bayburt' },
  { id: 11, isim: 'Bilecik' },
  { id: 12, isim: 'Bingöl' },
  { id: 13, isim: 'Bitlis' },
  { id: 14, isim: 'Bolu' },
  { id: 15, isim: 'Burdur' },
  { id: 17, isim: 'Çanakkale' },
  { id: 18, isim: 'Çankırı' },
  { id: 19, isim: 'Çorum' },
  { id: 20, isim: 'Denizli' },
  { id: 81, isim: 'Düzce' },
  { id: 22, isim: 'Edirne' },
  { id: 23, isim: 'Elazığ' },
  { id: 24, isim: 'Erzincan' },
  { id: 25, isim: 'Erzurum' },
  { id: 26, isim: 'Eskişehir' },
  { id: 28, isim: 'Giresun' },
  { id: 29, isim: 'Gümüşhane' },
  { id: 30, isim: 'Hakkari' },
  { id: 31, isim: 'Hatay' },
  { id: 76, isim: 'Iğdır' },
  { id: 32, isim: 'Isparta' },
  { id: 46, isim: 'Kahramanmaraş' },
  { id: 78, isim: 'Karabük' },
  { id: 70, isim: 'Karaman' },
  { id: 36, isim: 'Kars' },
  { id: 37, isim: 'Kastamonu' },
  { id: 79, isim: 'Kilis' },
  { id: 71, isim: 'Kırıkkale' },
  { id: 39, isim: 'Kırklareli' },
  { id: 40, isim: 'Kırşehir' },
  { id: 41, isim: 'Kocaeli' },
  { id: 43, isim: 'Kütahya' },
  { id: 44, isim: 'Malatya' },
  { id: 45, isim: 'Manisa' },
  { id: 47, isim: 'Mardin' },
  { id: 33, isim: 'Mersin' },
  { id: 48, isim: 'Muğla' },
  { id: 49, isim: 'Muş' },
  { id: 50, isim: 'Nevşehir' },
  { id: 51, isim: 'Niğde' },
  { id: 52, isim: 'Ordu' },
  { id: 80, isim: 'Osmaniye' },
  { id: 53, isim: 'Rize' },
  { id: 54, isim: 'Sakarya' },
  { id: 63, isim: 'Şanlıurfa' },
  { id: 56, isim: 'Siirt' },
  { id: 57, isim: 'Sinop' },
  { id: 73, isim: 'Şırnak' },
  { id: 58, isim: 'Sivas' },
  { id: 59, isim: 'Tekirdağ' },
  { id: 60, isim: 'Tokat' },
  { id: 61, isim: 'Trabzon' },
  { id: 62, isim: 'Tunceli' },
  { id: 64, isim: 'Uşak' },
  { id: 65, isim: 'Van' },
  { id: 77, isim: 'Yalova' },
  { id: 66, isim: 'Yozgat' },
  { id: 67, isim: 'Zonguldak' },
];


/**
 * ID'ye göre şehir getirir
 */
export function getSehirById(id: number): Sehir | undefined {
  return SEHIRLER.find(sehir => sehir.id === id);
}





