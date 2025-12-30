import { Dua } from '../types';

/**
 * Dualar koleksiyonu
 */
export const DUALAR: Dua[] = [
  // Sahur Duaları
  {
    id: 'sahur-1',
    baslik: 'Sahur Duası',
    arapca: 'وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ',
    turkceOkunus: 'Ve bi savmi ğadin neveytu min şehri ramazane',
    turkceAnlam: 'Ramazan ayının yarınki orucuna niyet ettim.',
    kategori: 'sahur',
  },
  {
    id: 'sahur-2',
    baslik: 'Sahur Bereket Duası',
    arapca: 'اللَّهُمَّ بَارِكْ لِي فِيمَا رَزَقْتَنِي',
    turkceOkunus: 'Allahümme barik li fima razakteni',
    turkceAnlam: 'Allah\'ım, bana verdiğin rızıkta bereket eyle.',
    kategori: 'sahur',
  },
  
  // İftar Duaları
  {
    id: 'iftar-1',
    baslik: 'İftar Duası',
    arapca: 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
    turkceOkunus: 'Allahümme leke sumtu ve bike amentu ve aleyke tevekkeltu ve ala rizkike eftartu',
    turkceAnlam: 'Allah\'ım! Senin için oruç tuttum, sana inandım, sana güvendim ve senin rızkınla iftar ettim.',
    kategori: 'iftar',
    kaynak: 'Ebu Davud',
  },
  {
    id: 'iftar-2',
    baslik: 'İftar Duası (Kısa)',
    arapca: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ',
    turkceOkunus: 'Zehebezzama\'u vebtelletil uruku ve sebetel ecru inşallah',
    turkceAnlam: 'Susuzluk gitti, damarlar ıslandı ve inşallah sevap sabit oldu.',
    kategori: 'iftar',
    kaynak: 'Ebu Davud',
  },
  
  // Oruç Duaları
  {
    id: 'oruc-1',
    baslik: 'Oruç Tutarken Okunacak Dua',
    arapca: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ',
    turkceOkunus: 'Allahümme inni es\'eluke bi rahmetikellezi vesiat kulle şey\'in',
    turkceAnlam: 'Allah\'ım! Her şeyi kuşatan rahmetinle senden istiyorum.',
    kategori: 'oruc',
  },
  {
    id: 'oruc-2',
    baslik: 'Oruç Sabır Duası',
    arapca: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    turkceOkunus: 'Allahümme a\'inni ala zikrike ve şükrike ve husni ibadetike',
    turkceAnlam: 'Allah\'ım! Seni zikretmeme, sana şükretmeme ve sana güzel ibadet etmeme yardım et.',
    kategori: 'oruc',
    kaynak: 'Ebu Davud',
  },
  
  // Genel Dualar
  {
    id: 'genel-1',
    baslik: 'Ramazan Duası',
    arapca: 'اللَّهُمَّ بَارِكْ لَنَا فِي رَمَضَانَ',
    turkceOkunus: 'Allahümme barik lena fi ramazane',
    turkceAnlam: 'Allah\'ım! Ramazan\'da bize bereket ver.',
    kategori: 'genel',
  },
  {
    id: 'genel-2',
    baslik: 'Mağfiret Duası',
    arapca: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    turkceOkunus: 'Allahümme inneke afuvvun tuhibbul afve fa\'fu anni',
    turkceAnlam: 'Allah\'ım! Sen affedicisin, affetmeyi seversin, beni affet.',
    kategori: 'genel',
    kaynak: 'Tirmizi',
  },
  {
    id: 'genel-3',
    baslik: 'Rızık Duası',
    arapca: 'اللَّهُمَّ ارْزُقْنَا رِزْقًا حَلَالًا طَيِّبًا',
    turkceOkunus: 'Allahümme erzukna rizkan halalen tayyiben',
    turkceAnlam: 'Allah\'ım! Bize helal ve temiz rızık ver.',
    kategori: 'genel',
  },
  {
    id: 'genel-4',
    baslik: 'Sağlık Duası',
    arapca: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي',
    turkceOkunus: 'Allahümme afini fi bedeni, Allahümme afini fi sem\'i, Allahümme afini fi basari',
    turkceAnlam: 'Allah\'ım! Bedenimde, kulağımda ve gözümde bana afiyet ver.',
    kategori: 'genel',
  },
  {
    id: 'genel-5',
    baslik: 'Hidayet Duası',
    arapca: 'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي',
    turkceOkunus: 'Allahümme ihdini ve seddini',
    turkceAnlam: 'Allah\'ım! Bana hidayet ver ve beni doğru yola ilet.',
    kategori: 'genel',
  },
];

/**
 * Kategoriye göre duaları getirir
 */
export function getDualarByKategori(kategori: Dua['kategori']): Dua[] {
  return DUALAR.filter(dua => dua.kategori === kategori);
}

/**
 * ID'ye göre dua getirir
 */
export function getDuaById(id: string): Dua | undefined {
  return DUALAR.find(dua => dua.id === id);
}






