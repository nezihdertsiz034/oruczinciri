import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';

const { width } = Dimensions.get('window');

interface HayatDonemi {
    id: string;
    baslik: string;
    tarih: string;
    ikon: string;
    aciklama: string;
    detaylar: string[];
}

const HAYAT_DONEMLERI: HayatDonemi[] = [
    {
        id: 'dogum',
        baslik: 'Doğumu',
        tarih: '571 - Mekke',
        ikon: '🌙',
        aciklama: 'Hz. Muhammed (S.A.V.), 571 yılında Rebiülevvel ayının 12. gecesi (Mevlid Kandili) Mekke\'de dünyaya geldi.',
        detaylar: [
            'Babası Abdullah, doğumundan önce vefat etti',
            'Annesi Âmine binti Vehb\'dir',
            'Kureyş kabilesinin Haşimoğulları kolundandır',
            'Doğduğu gece Kâbe\'deki putlar yüzüstü düştü',
            'Sütannesi Halime\'ye verildi',
        ],
    },
    {
        id: 'cocukluk',
        baslik: 'Çocukluk ve Gençlik',
        tarih: '571 - 595',
        ikon: '👶',
        aciklama: 'Yetim olarak büyüdü. Önce dedesi Abdulmuttalib, sonra amcası Ebu Talib himayesinde yetişti.',
        detaylar: [
            '6 yaşında annesi Âmine vefat etti',
            '8 yaşında dedesi Abdulmuttalib vefat etti',
            'Amcası Ebu Talib\'in yanında büyüdü',
            '12 yaşında Suriye\'ye ticaret kervanına katıldı',
            'Rahip Bahira, O\'nda peygamberlik alametleri gördü',
            'Güvenilirliği ile "el-Emin" (güvenilir) lakabını aldı',
        ],
    },
    {
        id: 'evlilik',
        baslik: 'Hz. Hatice ile Evlilik',
        tarih: '595',
        ikon: '💍',
        aciklama: 'Hz. Muhammed (S.A.V.), 25 yaşında Hz. Hatice (R.A.) ile evlendi. Hz. Hatice 40 yaşındaydı.',
        detaylar: [
            'Hz. Hatice zengin ve saygın bir tüccar kadındı',
            'Hz. Muhammed\'in dürüstlüğünü takdir ederek evlilik teklif etti',
            'Bu evlilikten 6 çocukları oldu',
            'Oğulları: Kasım, Abdullah',
            'Kızları: Zeynep, Rukiye, Ümmü Gülsüm, Fatıma',
            'Hz. Hatice, ilk Müslüman olan kişidir',
        ],
    },
    {
        id: 'vahiy',
        baslik: 'İlk Vahiy',
        tarih: '610 - Hira Mağarası',
        ikon: '📖',
        aciklama: '40 yaşında Hira Mağarası\'nda Cebrail (A.S.) aracılığıyla ilk vahiy geldi.',
        detaylar: [
            'Ramazan ayının Kadir Gecesi\'nde gerçekleşti',
            'İlk inen ayetler: "Oku!" (Alak Suresi 1-5)',
            'Cebrail (A.S.) "Oku!" emrini 3 kez tekrarladı',
            'Hz. Hatice O\'nu teselli etti ve inandı',
            'Varaka bin Nevfel, peygamberliğini tasdik etti',
            '23 yıl boyunca vahiy devam etti',
        ],
    },
    {
        id: 'mekke',
        baslik: 'Mekke Dönemi',
        tarih: '610 - 622',
        ikon: '🕋',
        aciklama: '13 yıl boyunca Mekke\'de İslam\'ı tebliğ etti. Müşriklerden büyük zulüm gördü.',
        detaylar: [
            'İlk 3 yıl gizli davet dönemi',
            'Sonra açık davet başladı',
            'Müşriklerin boykotu 3 yıl sürdü',
            'Hüzün Yılı: Hz. Hatice ve Ebu Talib vefat etti',
            'İsra ve Miraç mucizesi gerçekleşti',
            '5 vakit namaz farz kılındı',
            'Birinci ve İkinci Akabe Biatları',
        ],
    },
    {
        id: 'hicret',
        baslik: 'Hicret',
        tarih: '622 - Mekke\'den Medine\'ye',
        ikon: '🐪',
        aciklama: 'Hz. Ebu Bekir ile birlikte Mekke\'den Medine\'ye hicret etti. İslam takviminin başlangıcı.',
        detaylar: [
            'Müşrikler O\'nu öldürmeye karar verdi',
            'Hz. Ali, yatağında kalarak canını tehlikeye attı',
            'Sevr Mağarası\'nda 3 gün saklandılar',
            'Örümcek ağı ve güvercin yuvası mucizesi',
            'Kuba\'da ilk mescid inşa edildi',
            'Medine\'de Ensar-Muhacir kardeşliği kuruldu',
        ],
    },
    {
        id: 'medine',
        baslik: 'Medine Dönemi',
        tarih: '622 - 632',
        ikon: '🕌',
        aciklama: '10 yıl boyunca İslam devletini kurdu, savaşlar yaptı ve İslam\'ı tüm Arabistan\'a yaydı.',
        detaylar: [
            'Mescid-i Nebevi inşa edildi',
            'Medine Vesikası ile ilk anayasa hazırlandı',
            'Bedir, Uhud, Hendek savaşları',
            'Hudeybiye Antlaşması',
            'Mekke\'nin fethi (630)',
            'Veda Haccı ve Veda Hutbesi',
        ],
    },
    {
        id: 'vefat',
        baslik: 'Vefatı',
        tarih: '632 - Medine',
        ikon: '🌹',
        aciklama: '63 yaşında Rebiülevvel ayının 12\'sinde Pazartesi günü Medine\'de vefat etti.',
        detaylar: [
            'Veda Haccı\'ndan sonra hastalandı',
            'Son günlerini Hz. Aişe\'nin odasında geçirdi',
            'Son sözleri: "Allah\'ım, Refik-i A\'la\'ya (en yüce dosta)..."',
            'Ravza-i Mutahhara\'ya defnedildi',
            'Geride 9 hanımı ve kızı Fatıma kaldı',
            '124.000\'den fazla sahabe bıraktı',
        ],
    },
];

const GUZEL_AHLAKI = [
    { baslik: 'Doğruluk', aciklama: 'Hayatı boyunca hiç yalan söylemedi', ikon: '✓' },
    { baslik: 'Merhamet', aciklama: 'Tüm canlılara şefkat gösterdi', ikon: '❤️' },
    { baslik: 'Tevazu', aciklama: 'Hizmetçisiyle birlikte yemek yerdi', ikon: '🙏' },
    { baslik: 'Cömertlik', aciklama: 'Elindeki her şeyi paylaşırdı', ikon: '🎁' },
    { baslik: 'Sabır', aciklama: 'En zor anlarda bile sabırlıydı', ikon: '⏳' },
    { baslik: 'Affedicilik', aciklama: 'Mekke\'nin fethinde herkesi affetti', ikon: '🕊️' },
];

export default function PeygamberHayatiScreen() {
    const [seciliDonem, setSeciliDonem] = useState<HayatDonemi | null>(null);
    const [aktifTab, setAktifTab] = useState<'hayat' | 'ahlak'>('hayat');

    return (
        <SafeAreaView style={styles.container}>
            <BackgroundDecor />
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Başlık */}
                <View style={styles.baslikContainer}>
                    <Text style={styles.baslikEmoji}>☪️</Text>
                    <Text style={styles.baslik}>Hz. Muhammed</Text>
                    <Text style={styles.altBaslik}>Sallallahu Aleyhi ve Sellem</Text>
                    <View style={styles.ayrac}>
                        <View style={styles.ayracCizgi} />
                        <Text style={styles.ayracYildiz}>✦</Text>
                        <View style={styles.ayracCizgi} />
                    </View>
                </View>

                {/* Tab Butonları */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tabButon, aktifTab === 'hayat' && styles.tabButonAktif]}
                        onPress={() => setAktifTab('hayat')}
                    >
                        <Text style={[styles.tabButonText, aktifTab === 'hayat' && styles.tabButonTextAktif]}>
                            📜 Hayatı
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButon, aktifTab === 'ahlak' && styles.tabButonAktif]}
                        onPress={() => setAktifTab('ahlak')}
                    >
                        <Text style={[styles.tabButonText, aktifTab === 'ahlak' && styles.tabButonTextAktif]}>
                            💎 Güzel Ahlakı
                        </Text>
                    </TouchableOpacity>
                </View>

                {aktifTab === 'hayat' ? (
                    <>
                        {/* Giriş Metni */}
                        <View style={styles.girisKart}>
                            <Text style={styles.girisBaslik}>🌟 Son Peygamber</Text>
                            <Text style={styles.girisMetin}>
                                Hz. Muhammed (S.A.V.), Allah'ın insanlığa gönderdiği son peygamberdir.
                                571 yılında Mekke'de doğmuş, 63 yıllık hayatıyla insanlığa en güzel örnek olmuştur.
                                Kur'an-ı Kerim'i tebliğ etmiş ve İslam dinini dünyaya yaymıştır.
                            </Text>
                        </View>

                        {/* Zaman Çizelgesi */}
                        <Text style={styles.bolumBaslik}>📅 Hayat Kronolojisi</Text>

                        <View style={styles.zamanCizelgesi}>
                            {HAYAT_DONEMLERI.map((donem, index) => (
                                <TouchableOpacity
                                    key={donem.id}
                                    style={[
                                        styles.donemKart,
                                        seciliDonem?.id === donem.id && styles.donemKartAktif,
                                    ]}
                                    onPress={() => setSeciliDonem(
                                        seciliDonem?.id === donem.id ? null : donem
                                    )}
                                    activeOpacity={0.8}
                                >
                                    {/* Zaman çizgisi */}
                                    <View style={styles.zamanCizgisiContainer}>
                                        <View style={[
                                            styles.zamanNoktasi,
                                            seciliDonem?.id === donem.id && styles.zamanNoktasiAktif,
                                        ]}>
                                            <Text style={styles.donemIkon}>{donem.ikon}</Text>
                                        </View>
                                        {index < HAYAT_DONEMLERI.length - 1 && (
                                            <View style={styles.zamanCizgisi} />
                                        )}
                                    </View>

                                    {/* Dönem içeriği */}
                                    <View style={styles.donemIcerik}>
                                        <View style={styles.donemBaslikSatir}>
                                            <Text style={styles.donemBaslik}>{donem.baslik}</Text>
                                            <Text style={styles.donemTarih}>{donem.tarih}</Text>
                                        </View>
                                        <Text style={styles.donemAciklama}>{donem.aciklama}</Text>

                                        {/* Detaylar (açık ise) */}
                                        {seciliDonem?.id === donem.id && (
                                            <View style={styles.detaylarContainer}>
                                                {donem.detaylar.map((detay, detayIndex) => (
                                                    <View key={detayIndex} style={styles.detayItem}>
                                                        <Text style={styles.detayBullet}>•</Text>
                                                        <Text style={styles.detayText}>{detay}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}

                                        <Text style={styles.donemDevam}>
                                            {seciliDonem?.id === donem.id ? '▲ Kapat' : '▼ Detaylar'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                ) : (
                    <>
                        {/* Güzel Ahlakı */}
                        <View style={styles.ahlakGiris}>
                            <Text style={styles.ahlakGirisMetin}>
                                "Ben güzel ahlakı tamamlamak için gönderildim."
                            </Text>
                            <Text style={styles.ahlakGirisKaynak}>— Hz. Muhammed (S.A.V.)</Text>
                        </View>

                        <View style={styles.ahlakGrid}>
                            {GUZEL_AHLAKI.map((ahlak, index) => (
                                <View key={index} style={styles.ahlakKart}>
                                    <Text style={styles.ahlakIkon}>{ahlak.ikon}</Text>
                                    <Text style={styles.ahlakBaslik}>{ahlak.baslik}</Text>
                                    <Text style={styles.ahlakAciklama}>{ahlak.aciklama}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Hadis-i Şerif */}
                        <View style={styles.hadisKart}>
                            <Text style={styles.hadisBaslik}>📿 Hadis-i Şerifler</Text>

                            <View style={styles.hadisItem}>
                                <Text style={styles.hadisMetin}>
                                    "Sizin en hayırlınız, ahlakı en güzel olanınızdır."
                                </Text>
                            </View>

                            <View style={styles.hadisItem}>
                                <Text style={styles.hadisMetin}>
                                    "Kolaylaştırın, zorlaştırmayın. Müjdeleyin, nefret ettirmeyin."
                                </Text>
                            </View>

                            <View style={styles.hadisItem}>
                                <Text style={styles.hadisMetin}>
                                    "Müslüman, elinden ve dilinden diğer Müslümanların güvende olduğu kimsedir."
                                </Text>
                            </View>

                            <View style={styles.hadisItem}>
                                <Text style={styles.hadisMetin}>
                                    "Hiçbiriniz, kendisi için istediğini kardeşi için de istemedikçe gerçek mümin olamaz."
                                </Text>
                            </View>
                        </View>
                    </>
                )}

                {/* Alt Dua */}
                <View style={styles.duaContainer}>
                    <Text style={styles.duaArapca}>
                        اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ
                    </Text>
                    <Text style={styles.duaTurkce}>
                        "Allah'ım! Muhammed'e ve Muhammed'in ailesine salât eyle."
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    baslikContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    baslikEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    baslik: {
        fontSize: 32,
        fontWeight: '800',
        color: ISLAMI_RENKLER.altinAcik,
        fontFamily: TYPOGRAPHY.display,
        textAlign: 'center',
        textShadowColor: 'rgba(218, 165, 32, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    altBaslik: {
        fontSize: 16,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
        marginTop: 4,
        fontStyle: 'italic',
    },
    ayrac: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    ayracCizgi: {
        width: 40,
        height: 1,
        backgroundColor: ISLAMI_RENKLER.altinOrta,
    },
    ayracYildiz: {
        fontSize: 14,
        color: ISLAMI_RENKLER.altinAcik,
        marginHorizontal: 12,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 4,
        marginBottom: 20,
    },
    tabButon: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    tabButonAktif: {
        backgroundColor: ISLAMI_RENKLER.altinOrta,
    },
    tabButonText: {
        fontSize: 14,
        fontWeight: '600',
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.display,
    },
    tabButonTextAktif: {
        color: ISLAMI_RENKLER.yaziBeyaz,
    },
    girisKart: {
        backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    girisBaslik: {
        fontSize: 18,
        fontWeight: '700',
        color: ISLAMI_RENKLER.altinAcik,
        marginBottom: 12,
        fontFamily: TYPOGRAPHY.display,
    },
    girisMetin: {
        fontSize: 15,
        color: ISLAMI_RENKLER.yaziBeyaz,
        lineHeight: 24,
        fontFamily: TYPOGRAPHY.body,
    },
    bolumBaslik: {
        fontSize: 20,
        fontWeight: '700',
        color: ISLAMI_RENKLER.yaziBeyaz,
        marginBottom: 16,
        fontFamily: TYPOGRAPHY.display,
    },
    zamanCizelgesi: {
        marginBottom: 24,
    },
    donemKart: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    donemKartAktif: {
        // Aktif dönem stili
    },
    zamanCizgisiContainer: {
        alignItems: 'center',
        width: 50,
    },
    zamanNoktasi: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(218, 165, 32, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: ISLAMI_RENKLER.altinOrta,
    },
    zamanNoktasiAktif: {
        backgroundColor: ISLAMI_RENKLER.altinOrta,
    },
    donemIkon: {
        fontSize: 18,
    },
    zamanCizgisi: {
        width: 2,
        flex: 1,
        minHeight: 20,
        backgroundColor: 'rgba(218, 165, 32, 0.3)',
    },
    donemIcerik: {
        flex: 1,
        backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
        borderRadius: 16,
        padding: 16,
        marginLeft: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    donemBaslikSatir: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    donemBaslik: {
        fontSize: 17,
        fontWeight: '700',
        color: ISLAMI_RENKLER.altinAcik,
        fontFamily: TYPOGRAPHY.display,
    },
    donemTarih: {
        fontSize: 12,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
    },
    donemAciklama: {
        fontSize: 14,
        color: ISLAMI_RENKLER.yaziBeyaz,
        lineHeight: 22,
        fontFamily: TYPOGRAPHY.body,
    },
    donemDevam: {
        fontSize: 12,
        color: ISLAMI_RENKLER.altinOrta,
        marginTop: 10,
        textAlign: 'right',
        fontFamily: TYPOGRAPHY.body,
    },
    detaylarContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    detayItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detayBullet: {
        fontSize: 14,
        color: ISLAMI_RENKLER.altinAcik,
        marginRight: 8,
        width: 12,
    },
    detayText: {
        flex: 1,
        fontSize: 13,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        lineHeight: 20,
        fontFamily: TYPOGRAPHY.body,
    },
    ahlakGiris: {
        backgroundColor: 'rgba(218, 165, 32, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(218, 165, 32, 0.3)',
        alignItems: 'center',
    },
    ahlakGirisMetin: {
        fontSize: 16,
        color: ISLAMI_RENKLER.altinAcik,
        fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: TYPOGRAPHY.body,
        lineHeight: 24,
    },
    ahlakGirisKaynak: {
        fontSize: 13,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        marginTop: 8,
        fontFamily: TYPOGRAPHY.body,
    },
    ahlakGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    ahlakKart: {
        width: (width - 52) / 2,
        backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    ahlakIkon: {
        fontSize: 28,
        marginBottom: 8,
    },
    ahlakBaslik: {
        fontSize: 15,
        fontWeight: '700',
        color: ISLAMI_RENKLER.altinAcik,
        marginBottom: 6,
        fontFamily: TYPOGRAPHY.display,
    },
    ahlakAciklama: {
        fontSize: 12,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        textAlign: 'center',
        fontFamily: TYPOGRAPHY.body,
        lineHeight: 18,
    },
    hadisKart: {
        backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    hadisBaslik: {
        fontSize: 18,
        fontWeight: '700',
        color: ISLAMI_RENKLER.altinAcik,
        marginBottom: 16,
        fontFamily: TYPOGRAPHY.display,
    },
    hadisItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: ISLAMI_RENKLER.altinOrta,
    },
    hadisMetin: {
        fontSize: 14,
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontStyle: 'italic',
        lineHeight: 22,
        fontFamily: TYPOGRAPHY.body,
    },
    duaContainer: {
        backgroundColor: 'rgba(218, 165, 32, 0.12)',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(218, 165, 32, 0.25)',
    },
    duaArapca: {
        fontSize: 24,
        color: ISLAMI_RENKLER.altinAcik,
        marginBottom: 12,
        textAlign: 'center',
        lineHeight: 40,
    },
    duaTurkce: {
        fontSize: 14,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: TYPOGRAPHY.body,
    },
});
