/**
 * Şükür ile ilgili Kur'an ayetleri
 * Her gün farklı bir ayet gösterilir
 */

export interface SukurAyeti {
  id: string;
  sure: string;
  ayetNumarasi: number;
  arapca: string;
  turkceMeal: string;
}

export const SUKUR_AYETLERI: SukurAyeti[] = [
  {
    id: 'sukur-1',
    sure: 'İbrahim',
    ayetNumarasi: 7,
    arapca: 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    turkceMeal: 'Rabbiniz şöyle bildirdi: "Eğer şükrederseniz, elbette size (nimetimi) artıracağım."',
  },
  {
    id: 'sukur-2',
    sure: 'Bakara',
    ayetNumarasi: 152,
    arapca: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    turkceMeal: 'Beni anın, ben de sizi anayım. Bana şükredin, sakın nankörlük etmeyin.',
  },
  {
    id: 'sukur-3',
    sure: 'A\'raf',
    ayetNumarasi: 10,
    arapca: 'وَلَقَدْ مَكَّنَّاكُمْ فِي الْأَرْضِ وَجَعَلْنَا لَكُمْ فِيهَا مَعَايِشَ ۗ قَلِيلًا مَّا تَشْكُرُونَ',
    turkceMeal: 'Andolsun, sizi yeryüzüne yerleştirdik ve orada size geçimlikler verdik. Ne kadar az şükrediyorsunuz!',
  },
  {
    id: 'sukur-4',
    sure: 'Nahl',
    ayetNumarasi: 114,
    arapca: 'فَكُلُوا مِمَّا رَزَقَكُمُ اللَّهُ حَلَالًا طَيِّبًا وَاشْكُرُوا نِعْمَتَ اللَّهِ',
    turkceMeal: 'Allah\'ın size helal ve temiz olarak verdiği rızıklardan yiyin ve Allah\'ın nimetine şükredin.',
  },
  {
    id: 'sukur-5',
    sure: 'Lokman',
    ayetNumarasi: 12,
    arapca: 'وَلَقَدْ آتَيْنَا لُقْمَانَ الْحِكْمَةَ أَنِ اشْكُرْ لِلَّهِ',
    turkceMeal: 'Andolsun biz Lokman\'a hikmet verdik: "Allah\'a şükret!"',
  },
  {
    id: 'sukur-6',
    sure: 'Zümer',
    ayetNumarasi: 66,
    arapca: 'بَلِ اللَّهَ فَاعْبُدْ وَكُن مِّنَ الشَّاكِرِينَ',
    turkceMeal: 'Hayır! Yalnız Allah\'a ibadet et ve şükredenlerden ol.',
  },
  {
    id: 'sukur-7',
    sure: 'Neml',
    ayetNumarasi: 19,
    arapca: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ',
    turkceMeal: 'Rabbim! Bana ve ana babama verdiğin nimete şükretmemi ve razı olacağın salih bir amel işlememi ilham et.',
  },
  {
    id: 'sukur-8',
    sure: 'İbrahim',
    ayetNumarasi: 34,
    arapca: 'وَآتَاكُم مِّن كُلِّ مَا سَأَلْتُمُوهُ ۚ وَإِن تَعُدُّوا نِعْمَتَ اللَّهِ لَا تُحْصُوهَا',
    turkceMeal: 'Size istediğiniz her şeyden verdi. Eğer Allah\'ın nimetlerini saymaya kalkışsanız, onları sayamazsınız.',
  },
  {
    id: 'sukur-9',
    sure: 'Nahl',
    ayetNumarasi: 18,
    arapca: 'وَإِن تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا ۗ إِنَّ اللَّهَ لَغَفُورٌ رَّحِيمٌ',
    turkceMeal: 'Eğer Allah\'ın nimetlerini saymaya kalkışsanız, onları sayamazsınız. Şüphesiz Allah çok bağışlayandır, çok merhamet edendir.',
  },
  {
    id: 'sukur-10',
    sure: 'Bakara',
    ayetNumarasi: 172,
    arapca: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُلُوا مِن طَيِّبَاتِ مَا رَزَقْنَاكُمْ وَاشْكُرُوا لِلَّهِ',
    turkceMeal: 'Ey iman edenler! Size verdiğimiz rızıkların temiz olanlarından yiyin ve Allah\'a şükredin.',
  },
  {
    id: 'sukur-11',
    sure: 'İbrahim',
    ayetNumarasi: 37,
    arapca: 'رَّبَّنَا إِنِّي أَسْكَنتُ مِن ذُرِّيَّتِي بِوَادٍ غَيْرِ ذِي زَرْعٍ عِندَ بَيْتِكَ الْمُحَرَّمِ رَبَّنَا لِيُقِيمُوا الصَّلَاةَ فَاجْعَلْ أَفْئِدَةً مِّنَ النَّاسِ تَهْوِي إِلَيْهِمْ وَارْزُقْهُم مِّنَ الثَّمَرَاتِ لَعَلَّهُمْ يَشْكُرُونَ',
    turkceMeal: 'Rabbimiz! Ben, çocuklarımdan bir kısmını senin Beyt-i Haram\'ının yanında, ekin bitmez bir vadiye yerleştirdim. Rabbimiz! Namazı dosdoğru kılsınlar diye (böyle yaptım). Artık sen de insanlardan bir kısmının gönüllerini onlara meylettir ve onları çeşitli meyvelerle rızıklandır ki şükretsinler.',
  },
  {
    id: 'sukur-12',
    sure: 'Nahl',
    ayetNumarasi: 78,
    arapca: 'وَاللَّهُ أَخْرَجَكُم مِّن بُطُونِ أُمَّهَاتِكُمْ لَا تَعْلَمُونَ شَيْئًا وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ ۙ لَعَلَّكُمْ تَشْكُرُونَ',
    turkceMeal: 'Allah sizi annelerinizin karnından hiçbir şey bilmez halde çıkardı. Şükredesiniz diye size kulaklar, gözler ve kalpler verdi.',
  },
  {
    id: 'sukur-13',
    sure: 'Mü\'minun',
    ayetNumarasi: 78,
    arapca: 'وَهُوَ الَّذِي أَنشَأَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ ۚ قَلِيلًا مَّا تَشْكُرُونَ',
    turkceMeal: 'O, sizin için kulakları, gözleri ve kalpleri yaratandır. Ne kadar az şükrediyorsunuz!',
  },
  {
    id: 'sukur-14',
    sure: 'Yunus',
    ayetNumarasi: 60,
    arapca: 'وَمَا ظَنُّ الَّذِينَ يَفْتَرُونَ عَلَى اللَّهِ الْكَذِبَ يَوْمَ الْقِيَامَةِ ۗ إِنَّ اللَّهَ لَذُو فَضْلٍ عَلَى النَّاسِ وَلَٰكِنَّ أَكْثَرَهُمْ لَا يَشْكُرُونَ',
    turkceMeal: 'Kıyamet günü Allah\'a karşı yalan uyduranların durumu ne olacak? Şüphesiz Allah, insanlara karşı lütuf sahibidir; fakat çoğu şükretmez.',
  },
  {
    id: 'sukur-15',
    sure: 'Neml',
    ayetNumarasi: 40,
    arapca: 'قَالَ الَّذِي عِندَهُ عِلْمٌ مِّنَ الْكِتَابِ أَنَا آتِيكَ بِهِ قَبْلَ أَن يَرْتَدَّ إِلَيْكَ طَرْفُكَ ۚ فَلَمَّا رَآهُ مُسْتَقِرًّا عِندَهُ قَالَ هَٰذَا مِن فَضْلِ رَبِّي لِيَبْلُوَنِي أَأَشْكُرُ أَمْ أَكْفُرُ',
    turkceMeal: 'Kitaptan bilgisi olan biri dedi ki: "Ben onu sana, gözünü açıp kapamadan önce getiririm." Derken (Süleyman) onu yanında durur vaziyette görünce: "Bu, dedi, şükür mü edeceğim, yoksa nankörlük mü edeceğim diye beni sınamak için Rabbimin lütfundandır."',
  },
  {
    id: 'sukur-16',
    sure: 'İsra',
    ayetNumarasi: 3,
    arapca: 'ذُرِّيَّةَ مَنْ حَمَلْنَا مَعَ نُوحٍ ۚ إِنَّهُ كَانَ عَبْدًا شَكُورًا',
    turkceMeal: 'Nuh ile birlikte (gemide) taşıdığımız kimselerin soyundan olanlara (şunu hatırlat): Şüphesiz o çok şükreden bir kuldu.',
  },
  {
    id: 'sukur-17',
    sure: 'Furkan',
    ayetNumarasi: 62,
    arapca: 'وَهُوَ الَّذِي جَعَلَ اللَّيْلَ وَالنَّهَارَ خِلْفَةً لِّمَنْ أَرَادَ أَن يَذَّكَّرَ أَوْ أَرَادَ شُكُورًا',
    turkceMeal: 'Gece ile gündüzü birbirini takip eder hale getiren O\'dur. Düşünüp ibret almak isteyen veya şükretmek isteyen kimseler için.',
  },
  {
    id: 'sukur-18',
    sure: 'Sebe',
    ayetNumarasi: 13,
    arapca: 'يَعْمَلُونَ لَهُ مَا يَشَاءُ مِن مَّحَارِيبَ وَتَمَاثِيلَ وَجِفَانٍ كَالْجَوَابِ وَقُدُورٍ رَّاسِيَاتٍ ۚ اعْمَلُوا آلَ دَاوُودَ شُكْرًا',
    turkceMeal: 'Onlar, Süleyman\'ın istediği gibi, mihraplar, heykeller, havuzlar gibi çanaklar ve sabit kazanlar yapıyorlardı. Ey Davud ailesi! Şükür için çalışın.',
  },
  {
    id: 'sukur-19',
    sure: 'Duhan',
    ayetNumarasi: 13,
    arapca: 'كَيْفَ يَكُونُ لَهُمُ الذِّكْرَىٰ وَقَدْ جَاءَهُمْ رَسُولٌ مُّبِينٌ',
    turkceMeal: 'Onlara açık bir elçi gelmişti de, yine de ondan yüz çevirdiler ve "Bu öğretilmiş bir delidir" dediler.',
  },
  {
    id: 'sukur-20',
    sure: 'İnsan',
    ayetNumarasi: 3,
    arapca: 'إِنَّا هَدَيْنَاهُ السَّبِيلَ إِمَّا شَاكِرًا وَإِمَّا كَفُورًا',
    turkceMeal: 'Şüphesiz biz ona yolu gösterdik. İster şükredici olsun, ister nankör.',
  },
  {
    id: 'sukur-21',
    sure: 'Nisa',
    ayetNumarasi: 147,
    arapca: 'مَّا يَفْعَلُ اللَّهُ بِعَذَابِكُمْ إِن شَكَرْتُمْ وَآمَنتُمْ ۚ وَكَانَ اللَّهُ شَاكِرًا عَلِيمًا',
    turkceMeal: 'Eğer şükreder ve iman ederseniz, Allah size azap etmez. Allah şükrün karşılığını verendir, hakkıyla bilendir.',
  },
  {
    id: 'sukur-22',
    sure: 'İsra',
    ayetNumarasi: 111,
    arapca: 'وَقُلِ الْحَمْدُ لِلَّهِ الَّذِي لَمْ يَتَّخِذْ وَلَدًا وَلَمْ يَكُن لَّهُ شَرِيكٌ فِي الْمُلْكِ',
    turkceMeal: 'De ki: "Çocuk edinmeyen, mülkte ortağı olmayan ve acizlikten ötürü yardımcıya da ihtiyacı bulunmayan Allah\'a hamdolsun."',
  },
  {
    id: 'sukur-23',
    sure: 'Fatır',
    ayetNumarasi: 3,
    arapca: 'يَا أَيُّهَا النَّاسُ اذْكُرُوا نِعْمَتَ اللَّهِ عَلَيْكُمْ ۚ هَلْ مِنْ خَالِقٍ غَيْرُ اللَّهِ',
    turkceMeal: 'Ey insanlar! Allah\'ın üzerinizdeki nimetini hatırlayın. Allah\'tan başka bir yaratıcı var mı?',
  },
  {
    id: 'sukur-24',
    sure: 'Rum',
    ayetNumarasi: 46,
    arapca: 'وَمِنْ آيَاتِهِ أَن يُرْسِلَ الرِّيَاحَ مُبَشِّرَاتٍ وَلِيُذِيقَكُم مِّن رَّحْمَتِهِ',
    turkceMeal: 'Rüzgarları müjdeci olarak göndermesi de O\'nun ayetlerindendir. Size rahmetinden tattırmak için.',
  },
  {
    id: 'sukur-25',
    sure: 'Zümer',
    ayetNumarasi: 7,
    arapca: 'وَإِن تَكْفُرُوا فَإِنَّ اللَّهَ غَنِيٌّ عَنكُمْ ۚ وَلَا يَرْضَىٰ لِعِبَادِهِ الْكُفْرَ ۖ وَإِن تَشْكُرُوا يَرْضَهُ لَكُمْ',
    turkceMeal: 'Eğer nankörlük ederseniz, şüphesiz Allah sizden müstağnidir. Kullarının küfründen razı olmaz. Eğer şükrederseniz, sizden razı olur.',
  },
  {
    id: 'sukur-26',
    sure: 'Nahl',
    ayetNumarasi: 121,
    arapca: 'شَاكِرًا لِّأَنْعُمِهِ ۚ اجْتَبَاهُ وَهَدَاهُ إِلَىٰ صِرَاطٍ مُّسْتَقِيمٍ',
    turkceMeal: 'O, Allah\'ın nimetlerine şükrediyordu. Allah onu seçti ve doğru yola iletti.',
  },
  {
    id: 'sukur-27',
    sure: 'Neml',
    ayetNumarasi: 19,
    arapca: 'قَالَ رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ',
    turkceMeal: 'Rabbim! Bana ve ana babama verdiğin nimete şükretmemi ve razı olacağın salih bir amel işlememi ilham et.',
  },
  {
    id: 'sukur-28',
    sure: 'İbrahim',
    ayetNumarasi: 7,
    arapca: 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ',
    turkceMeal: 'Hatırlayın ki Rabbiniz şöyle bildirmişti: "Eğer şükrederseniz, elbette size (nimetimi) artıracağım ve eğer nankörlük ederseniz, hiç şüphesiz azabım çok şiddetlidir."',
  },
  {
    id: 'sukur-29',
    sure: 'Bakara',
    ayetNumarasi: 56,
    arapca: 'ثُمَّ بَعَثْنَاكُم مِّن بَعْدِ مَوْتِكُمْ لَعَلَّكُمْ تَشْكُرُونَ',
    turkceMeal: 'Sonra şükredesiniz diye sizi ölümünüzden sonra dirilttik.',
  },
  {
    id: 'sukur-30',
    sure: 'Nahl',
    ayetNumarasi: 14,
    arapca: 'وَهُوَ الَّذِي سَخَّرَ الْبَحْرَ لِتَأْكُلُوا مِنْهُ لَحْمًا طَرِيًّا وَتَسْتَخْرِجُوا مِنْهُ حِلْيَةً تَلْبَسُونَهَا ۖ وَتَرَى الْفُلْكَ مَوَاخِرَ فِيهِ وَلِتَبْتَغُوا مِن فَضْلِهِ وَلَعَلَّكُمْ تَشْكُرُونَ',
    turkceMeal: 'Denizi de sizin emrinize veren O\'dur. Ondan taze et yersiniz ve giyeceğiniz süs eşyası çıkarırsınız. Gemilerin denizde suyu yararak gittiğini görürsün. (Bunlar) O\'nun lütfunu aramanız ve şükretmeniz içindir.',
  },
];

/**
 * Gün numarasına göre şükür ayeti döndürür
 */
export function getSukurAyetiByGun(gunNumarasi: number): SukurAyeti {
  const index = (gunNumarasi - 1) % SUKUR_AYETLERI.length;
  return SUKUR_AYETLERI[index];
}

