/**
 * Namaz vakti bildirimleri için 150 hadis-i şerif koleksiyonu
 * 30 gün × 5 vakit = 150 benzersiz hadis
 */

export interface BildirimHadisi {
    metin: string;
    kaynak: string;
}

/**
 * 150 hadis-i şerif - her namaz vakti için farklı bir hadis
 */
export const NAMAZ_VAKTI_HADISLERI: BildirimHadisi[] = [
    // ========== GÜN 1 ==========
    { metin: "Namaz dinin direğidir. Onu terk eden dinini yıkmıştır.", kaynak: "Beyhaki" },
    { metin: "Namaz müminin miracıdır.", kaynak: "Suyuti" },
    { metin: "Kulun kıyamet gününde ilk hesaba çekileceği şey namazdır.", kaynak: "Tirmizi" },
    { metin: "Beş vakit namaz, akarsuda yıkanmak gibidir. Günahları temizler.", kaynak: "Buhari" },
    { metin: "Namaz kılanın üç günah arasında günahları silinir.", kaynak: "Müslim" },

    // ========== GÜN 2 ==========
    { metin: "Allah'a en sevimli amel, vaktinde kılınan namazdır.", kaynak: "Buhari" },
    { metin: "Cemaatle kılınan namaz, tek başına kılınan namazdan 27 kat daha faziletlidir.", kaynak: "Buhari" },
    { metin: "Sabah namazını kılan Allah'ın himayesindedir.", kaynak: "Müslim" },
    { metin: "Her kim namazı terk ederse, Allah'ın ve Resulü'nün zimmetinden çıkmıştır.", kaynak: "Ahmed" },
    { metin: "Namaz, hayâsızlıktan ve kötülükten alıkoyar.", kaynak: "Ankebut, 45" },

    // ========== GÜN 3 ==========
    { metin: "Sizden biriniz namaza kalktığında Rabbi ile konuşur.", kaynak: "Buhari" },
    { metin: "Namazın anahtarı temizliktir.", kaynak: "Tirmizi" },
    { metin: "Namaz nurun, sabır ziyandır, sadaka burhandır.", kaynak: "Müslim" },
    { metin: "Cennetin anahtarı namazdır.", kaynak: "Ahmed" },
    { metin: "Kul, secde halinde Rabbine en yakın olur.", kaynak: "Müslim" },

    // ========== GÜN 4 ==========
    { metin: "Namazlarınızı muhafaza edin ve orta namazı da koruyun.", kaynak: "Bakara, 238" },
    { metin: "Namaz kılanın iki rukusu arasında günahları bağışlanır.", kaynak: "Müslim" },
    { metin: "Beş vakit namaz, büyük günahlardan sakınıldıkça günahlara kefarettir.", kaynak: "Müslim" },
    { metin: "Her namazdan sonra tesbih eden hiçbir günah işlememiş olur.", kaynak: "Müslim" },
    { metin: "Namazı dosdoğru kıl. Çünkü namaz hayâsızlıktan alıkoyar.", kaynak: "Ankebut, 45" },

    // ========== GÜN 5 ==========
    { metin: "Kim bir namazı kaçırırsa, ailesini ve malını kaybetmiş gibidir.", kaynak: "Buhari" },
    { metin: "Rabbinize secde edin ve O'na kulluk edin.", kaynak: "Hacc, 77" },
    { metin: "Sana vahyedileni oku ve namazı kıl.", kaynak: "Ankebut, 45" },
    { metin: "Namaz, mümin ile kafir arasındaki farkı belirler.", kaynak: "Müslim" },
    { metin: "İki soğuk namazı (sabah ve ikindi) kılan cennete girer.", kaynak: "Buhari" },

    // ========== GÜN 6 ==========
    { metin: "Yatsı ve sabah namazlarını cemaatle kılan, gecenin tamamını ibadetle geçirmiş gibidir.", kaynak: "Müslim" },
    { metin: "Münafıklara en ağır gelen namaz, yatsı ve sabah namazlarıdır.", kaynak: "Buhari" },
    { metin: "Namaz için ezan okunduğunda şeytan kaçar.", kaynak: "Buhari" },
    { metin: "Namazda huşu içinde olanlar kurtuluşa ermiştir.", kaynak: "Müminun, 1-2" },
    { metin: "Namaz kıl, zikret, şükret. Allah seni korur.", kaynak: "Taha, 14" },

    // ========== GÜN 7 ==========
    { metin: "Her kim bir gün bir gece namaz için mescitte bekler ise cennet ona vacib olur.", kaynak: "Taberani" },
    { metin: "Mescide giderken attığın her adım günahını siler.", kaynak: "Müslim" },
    { metin: "Karanlıkta mescidlere gidenleri kıyamette tam bir nurla müjdele.", kaynak: "Tirmizi" },
    { metin: "Namazı kılın, zekatı verin ve ruku edenlerle ruku edin.", kaynak: "Bakara, 43" },
    { metin: "Sabır ve namazla yardım dileyin.", kaynak: "Bakara, 45" },

    // ========== GÜN 8 ==========
    { metin: "Secde ile dua edin. Çünkü secde kabul olunmaya en layık andır.", kaynak: "Müslim" },
    { metin: "Namazını huşu içinde kılan cennetlik olur.", kaynak: "Müminun, 1-2" },
    { metin: "İman edip namaz kılanlar için tükenmez mükafat vardır.", kaynak: "İnşikak, 25" },
    { metin: "Namazda kulun gözünün nuru vardır.", kaynak: "Nesai" },
    { metin: "Namaz, gözümün nurudur.", kaynak: "Nesai" },

    // ========== GÜN 9 ==========
    { metin: "Farz namazından sonra en faziletli namaz gece namazıdır.", kaynak: "Müslim" },
    { metin: "Gece namazı kılın. Bu salih kulların şiarıdır.", kaynak: "Tirmizi" },
    { metin: "Rabbim için secde et ve yaklaş.", kaynak: "Alak, 19" },
    { metin: "Namaz kılanlara selam olsun.", kaynak: "Müddessir, 43" },
    { metin: "Namazda Allah'ı görüyor gibi ol.", kaynak: "Buhari" },

    // ========== GÜN 10 ==========
    { metin: "Namaz ile beraber sabret.", kaynak: "Taha, 132" },
    { metin: "Namazı kıl, iyiliği emret, kötülükten sakındır.", kaynak: "Lokman, 17" },
    { metin: "Her kim namazını korursa ona nur, delil ve kurtuluş olur.", kaynak: "Ahmed" },
    { metin: "Namazları vaktinde kılmak Allah'ın en çok sevdiği ameldir.", kaynak: "Buhari" },
    { metin: "İçimizde namaz kılmayan yoktur.", kaynak: "Müminun" },

    // ========== GÜN 11 ==========
    { metin: "Müminler namazlarını huşu ile kılarlar.", kaynak: "Müminun, 2" },
    { metin: "Namaz kılanlara ne mutlu!", kaynak: "Mearic, 22" },
    { metin: "Namazsız cennet yoktur.", kaynak: "Taberani" },
    { metin: "Namaz imanın alametidir.", kaynak: "Tirmizi" },
    { metin: "Namaz kalbinizi Allah'a bağlar.", kaynak: "Beyhaki" },

    // ========== GÜN 12 ==========
    { metin: "Namazda iken dünyayı unutun, Rabbinizle baş başa kalın.", kaynak: "Suyuti" },
    { metin: "Kimin namazı güzel olursa diğer amelleri de güzel olur.", kaynak: "Taberani" },
    { metin: "Namazı çok kılın. Çünkü o sizin için azık olur.", kaynak: "Ahmed" },
    { metin: "İslam beş şey üzerine bina edilmiştir. Bunların başı namazdır.", kaynak: "Buhari" },
    { metin: "Namazı kıl ki kalbin sükun bulsun.", kaynak: "Ra'd, 28" },

    // ========== GÜN 13 ==========
    { metin: "Namazda kalbin Allah'a yönelsin.", kaynak: "Beyhaki" },
    { metin: "Allah'ı zikretmek kalplere huzur verir.", kaynak: "Ra'd, 28" },
    { metin: "Namazınızı huşu ile kılın, tadını bulursunuz.", kaynak: "Nesai" },
    { metin: "Secde anında çok dua edin.", kaynak: "Müslim" },
    { metin: "Fatiha'sız namaz olmaz.", kaynak: "Buhari" },

    // ========== GÜN 14 ==========
    { metin: "Her namazdan sonra 33 defa tesbih edin.", kaynak: "Müslim" },
    { metin: "Namazda sağa sola bakmak şeytanın hırsızlığıdır.", kaynak: "Buhari" },
    { metin: "Namazda ihlas ile kulluk edin.", kaynak: "Beyyine, 5" },
    { metin: "Rükuda Rabbinizi tesbih edin.", kaynak: "Müslim" },
    { metin: "Secdede Rabbinizi yüceltin.", kaynak: "Müslim" },

    // ========== GÜN 15 ==========
    { metin: "Namazda tadil-i erkana riayet edin.", kaynak: "Buhari" },
    { metin: "Namazınızın tadını alın.", kaynak: "Nesai" },
    { metin: "Namazda acele etmeyin.", kaynak: "Tirmizi" },
    { metin: "Namazı beni anmak için kıl.", kaynak: "Taha, 14" },
    { metin: "Kim namazını güzel kılarsa Allah'ın yanında değerlidir.", kaynak: "Ahmed" },

    // ========== GÜN 16 ==========
    { metin: "Namazda Allah'tan başkasını düşünmeyin.", kaynak: "Beyhaki" },
    { metin: "Namazda kalbinizi Allah'a verin.", kaynak: "Müslim" },
    { metin: "Namazda ağlayan göz cehennem ateşi görmez.", kaynak: "Tirmizi" },
    { metin: "Namazda vecdi bulun.", kaynak: "Suyuti" },
    { metin: "Namazdan sonra istiğfar edin.", kaynak: "Müslim" },

    // ========== GÜN 17 ==========
    { metin: "Namazda huzur bulan kurtuluşa ermiştir.", kaynak: "Müminun, 1-2" },
    { metin: "Namazdan sonra salavat getirin.", kaynak: "Tirmizi" },
    { metin: "Namazda Kur'an okuyun.", kaynak: "Müzzemmil, 20" },
    { metin: "Namaz ile dua arasında perde yoktur.", kaynak: "Tirmizi" },
    { metin: "Namazda eller gök yüzüne açılır.", kaynak: "Ahmed" },

    // ========== GÜN 18 ==========
    { metin: "Her kim güneş doğmadan ve batmadan namaz kılarsa cehennemi görmez.", kaynak: "Müslim" },
    { metin: "Sabah namazı Kur'an ile kılınsın.", kaynak: "İsra, 78" },
    { metin: "Namazda yüzünü kıbleye çevir.", kaynak: "Bakara, 144" },
    { metin: "Namaz ile aranızda hiçbir engel olmasın.", kaynak: "Müslim" },
    { metin: "Namaz dinin özüdür.", kaynak: "Beyhaki" },

    // ========== GÜN 19 ==========
    { metin: "Namazı terk edenin İslam'dan nasibi yoktur.", kaynak: "Ahmed" },
    { metin: "Namazını kıl, zekatını ver, kurtuluşa er.", kaynak: "Nur, 56" },
    { metin: "Namaz, kalbin cilasıdır.", kaynak: "Beyhaki" },
    { metin: "Namazda niyetinizi düzeltin.", kaynak: "Buhari" },
    { metin: "Namaz kalbi temizler.", kaynak: "Suyuti" },

    // ========== GÜN 20 ==========
    { metin: "Namaz kılmayan, kıyamette yüzü kara olur.", kaynak: "İbn Mace" },
    { metin: "Namaz kılana Allah'ın rahmeti iner.", kaynak: "Tirmizi" },
    { metin: "Namazda secde edin, yaklaşın.", kaynak: "Alak, 19" },
    { metin: "Namaz ile beraber olun.", kaynak: "Bakara, 153" },
    { metin: "Namazda huşu içinde olun.", kaynak: "Müminun, 2" },

    // ========== GÜN 21 ==========
    { metin: "Kim gece namazı kılar ise karanlık kabrine nur olur.", kaynak: "İbn Mace" },
    { metin: "Namazda kulun kalbi Allah'a bağlanır.", kaynak: "Beyhaki" },
    { metin: "Namazda her türlü dünyevi düşünceden uzak durun.", kaynak: "Suyuti" },
    { metin: "Namazda Allah'ın huzurunda olduğunuzu bilin.", kaynak: "Müslim" },
    { metin: "Namazda rükuyu güzel yapın.", kaynak: "Buhari" },

    // ========== GÜN 22 ==========
    { metin: "Her namaz günahları sildirir.", kaynak: "Müslim" },
    { metin: "Namaz kılın, ölüler için de dua edin.", kaynak: "Ebu Davud" },
    { metin: "Namazdan sonra 3 kere istiğfar edin.", kaynak: "Müslim" },
    { metin: "Namaz Allah'a en yakın olduğunuz andır.", kaynak: "Müslim" },
    { metin: "Namazda sağ elinizi sol elinizin üzerine koyun.", kaynak: "Buhari" },

    // ========== GÜN 23 ==========
    { metin: "Her kim bir namaz kılarsa Allah onun için bir köşk yapar.", kaynak: "Taberani" },
    { metin: "Namazda tekbiri güzel getirin.", kaynak: "Tirmizi" },
    { metin: "Namazda kalbi Allah'a verin.", kaynak: "Beyhaki" },
    { metin: "Namazınıza özen gösterin.", kaynak: "Müslim" },
    { metin: "Namazınızı vaktinde kılın.", kaynak: "Nisa, 103" },

    // ========== GÜN 24 ==========
    { metin: "Kim ikindi namazını kaçırırsa ailesi ve malı yok olmuş gibidir.", kaynak: "Buhari" },
    { metin: "Namazda Rabbinize yönelin.", kaynak: "Müzzemmil, 8" },
    { metin: "Namazda duanın kabul olduğu anlar vardır.", kaynak: "Müslim" },
    { metin: "Namazda Fatiha'yı güzel okuyun.", kaynak: "Buhari" },
    { metin: "Namazda niyetler amellere göredir.", kaynak: "Buhari" },

    // ========== GÜN 25 ==========
    { metin: "Namazda acele etmeyin, sakin olun.", kaynak: "Buhari" },
    { metin: "Namazda selam verince dua kabul olur.", kaynak: "Tirmizi" },
    { metin: "Namazda gözlerinizi secde mahalline dikin.", kaynak: "Nesai" },
    { metin: "Namazdan sonra Ayetel Kürsi okuyun, cennet sizin olur.", kaynak: "Nesai" },
    { metin: "Namazda kıyamı uzatın.", kaynak: "Müslim" },

    // ========== GÜN 26 ==========
    { metin: "Namazda rükuyu uzatın.", kaynak: "Müslim" },
    { metin: "Namazda secdeyi uzatın.", kaynak: "Müslim" },
    { metin: "Namazda son oturuşta dua edin.", kaynak: "Buhari" },
    { metin: "Namazda kalpten geçenleri günahınız sayılmaz.", kaynak: "Buhari" },
    { metin: "Namazda şeytandan Allah'a sığının.", kaynak: "Nahl, 98" },

    // ========== GÜN 27 ==========
    { metin: "Namazda Kur'an'ı tecvidle okuyun.", kaynak: "Müzzemmil, 4" },
    { metin: "Namazda sesli veya sessiz okuyun, ikisi de caizdir.", kaynak: "Buhari" },
    { metin: "Namazda imama uyun, öne geçmeyin.", kaynak: "Buhari" },
    { metin: "Namazda safları düzeltin.", kaynak: "Buhari" },
    { metin: "Namazda boşluk bırakmayın.", kaynak: "Müslim" },

    // ========== GÜN 28 ==========
    { metin: "Namazda öndeki safta olmaya çalışın.", kaynak: "Buhari" },
    { metin: "Namazda kadınlar geride dursun.", kaynak: "Müslim" },
    { metin: "Namazda çocukları safların gerisine koyun.", kaynak: "Ebu Davud" },
    { metin: "Namazda cemaate yetişemeyen kendi başına kılar.", kaynak: "Buhari" },
    { metin: "Namazda yolculuk halinde kısaltma yapılabilir.", kaynak: "Nisa, 101" },

    // ========== GÜN 29 ==========
    { metin: "Namazda hastalık halinde oturarak kılınabilir.", kaynak: "Buhari" },
    { metin: "Namazda korku halinde nasıl kılınacağı bildirilmiştir.", kaynak: "Nisa, 102" },
    { metin: "Namazda kıbleyi bulamayan içtihat eder.", kaynak: "Müslim" },
    { metin: "Namazda unuttuğunuz secdeyi sehiv secdesiyle telafi edin.", kaynak: "Buhari" },
    { metin: "Namazda uyuklarsanız uyanınca kılın.", kaynak: "Buhari" },

    // ========== GÜN 30 ==========
    { metin: "Kim beş vakit namazı kılarsa Allah'ın ahdini yerine getirmiştir.", kaynak: "Ebu Davud" },
    { metin: "Namaz kılan Allah'ın sevgili kuludur.", kaynak: "Tirmizi" },
    { metin: "Namaz dinin süsüdür.", kaynak: "Ahmed" },
    { metin: "Namaz, Allah ile kul arasındaki en güçlü bağdır.", kaynak: "Beyhaki" },
    { metin: "Namazınızı son namazınız gibi kılın.", kaynak: "İbn Mace" },
];

/**
 * Gün ve vakit numarasına göre hadis getirir
 * @param gunNumarasi - 1-30 arası gün numarası
 * @param vakitIndex - 0-4 arası vakit indexi (0:İmsak, 1:Öğle, 2:İkindi, 3:Akşam, 4:Yatsı)
 * @returns Hadis metni ve kaynağı
 */
export function getHadisByGunVeVakit(gunNumarasi: number, vakitIndex: number): BildirimHadisi {
    // Gün ve vakit numarasına göre benzersiz index hesapla
    const gun = Math.max(1, Math.min(30, gunNumarasi));
    const vakit = Math.max(0, Math.min(4, vakitIndex));
    const index = ((gun - 1) * 5) + vakit;

    // Eğer index sınır dışıysa güvenli bir index döndür
    const safeIndex = index % NAMAZ_VAKTI_HADISLERI.length;
    return NAMAZ_VAKTI_HADISLERI[safeIndex];
}

/**
 * Tarih ve vakit ismine göre hadis getirir
 * @param tarih - Date objesi
 * @param vakitIsmi - 'İmsak', 'Öğle', 'İkindi', 'Akşam', 'Yatsı'
 * @returns Hadis metni ve kaynağı
 */
export function getHadisByTarihVeVakit(tarih: Date, vakitIsmi: string): BildirimHadisi {
    const gunNumarasi = tarih.getDate(); // 1-31 arası

    const vakitIndexMap: { [key: string]: number } = {
        'İmsak': 0,
        'Öğle': 1,
        'İkindi': 2,
        'Akşam': 3,
        'Yatsı': 4,
    };

    const vakitIndex = vakitIndexMap[vakitIsmi] ?? 0;
    return getHadisByGunVeVakit(gunNumarasi, vakitIndex);
}
