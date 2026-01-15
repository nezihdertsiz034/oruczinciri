import { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { OrucSayaci } from '../components/OrucSayaci';
import { OrucZinciri } from '../components/OrucZinciri';
import { SonrakiNamazSayaci } from '../components/SonrakiNamazSayaci';
import { RamazanTakvimi } from '../components/RamazanTakvimi';
import { useNamazVakitleri } from '../hooks/useNamazVakitleri';
import { useBildirimler } from '../hooks/useBildirimler';
import { GUNUN_AYETLERI, HADISLER, HIZLI_ERISIM_1, HIZLI_ERISIM_2 } from '../constants/homeScreenConstants';
import { yukleSehir, yukleUygulamaAyarlari } from '../utils/storage';
import { Sehir, KullaniciProfili } from '../types';
import { tarihToString } from '../utils/ramazanTarihleri';

const tumHizliErisim = [...HIZLI_ERISIM_1, ...HIZLI_ERISIM_2];

export default function HomeScreen() {
  const { vakitler, yukleniyor, hata } = useNamazVakitleri();
  useBildirimler(); // Bildirimleri otomatik ayarla
  const navigation = useNavigation<any>();
  const [sehir, setSehir] = useState<Sehir | null>(null);
  const [profil, setProfil] = useState<KullaniciProfili | null>(null);

  // Animasyon Değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Verileri yükle
    Promise.all([
      yukleSehir(),
      yukleUygulamaAyarlari()
    ]).then(([sehirVeri, ayarlar]) => {
      setSehir(sehirVeri);
      setProfil(ayarlar.kullaniciProfil);
    });

    // Giriş animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Günün sözlerini hesapla
  const { gununAyeti, gununHadisi, selamlama } = useMemo(() => {
    const bugun = new Date();
    const gun = bugun.getDate();
    const saat = bugun.getHours();

    let mesaj = 'Hayırlı Günler';
    if (saat >= 5 && saat < 11) mesaj = 'Hayırlı Sabahlar';
    else if (saat >= 11 && saat < 16) mesaj = 'Hayırlı Günler';
    else if (saat >= 16 && saat < 21) mesaj = 'Hayırlı Akşamlar';
    else mesaj = 'Hayırlı Geceler';

    return {
      gununAyeti: GUNUN_AYETLERI[gun % GUNUN_AYETLERI.length],
      gununHadisi: HADISLER[gun % HADISLER.length],
      selamlama: mesaj,
    };
  }, []);

  const handleHizliErisim = (tab: string, screen?: string) => {
    if (screen) {
      navigation.navigate(tab, { screen });
    } else {
      navigation.navigate(tab);
    }
  };

  const handleGunSec = (tarih: Date) => {
    const tarihStr = tarihToString(tarih);
    navigation.navigate('Araçlar', {
      screen: 'Notlar',
      params: { date: tarihStr }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <BackgroundDecor />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header Section */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View>
            <Text style={styles.selamText}>Selamun Aleyküm{profil?.isim ? `, ${profil.isim} ${profil.unvan}` : ''}</Text>
            <Text style={styles.vakitSelamText}>{selamlama} ✨</Text>
          </View>
          <View style={styles.konumContainer}>
            <View style={styles.konumBadge}>
              <Text style={styles.konumText}>📍 {sehir?.isim || 'İstanbul'}</Text>
            </View>
            <Text style={styles.tarihText}>
              {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
            </Text>
          </View>
        </Animated.View>

        {/* Premium Quick Access Bar (Horizontal) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚡ Hızlı Erişim</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hizliScroll}
          contentContainerStyle={styles.hizliScrollContent}
        >
          {tumHizliErisim.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.hizliKartYeni, { marginLeft: index === 0 ? 0 : 12 }]}
              onPress={() => handleHizliErisim(item.tab, item.screen)}
              activeOpacity={0.8}
            >
              <View style={[styles.hizliIkonYeni, { backgroundColor: `${item.renk}20` }]}>
                <Text style={styles.hizliIkonTextYeni}>{item.ikon}</Text>
              </View>
              <Text style={styles.hizliBaslikYeni}>{item.baslik}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Dashboard Components */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <OrucSayaci vakitler={vakitler} yukleniyor={yukleniyor} />
          <SonrakiNamazSayaci vakitler={vakitler} yukleniyor={yukleniyor} />
          <RamazanTakvimi onGunSec={handleGunSec} />
          <OrucZinciri />
        </Animated.View>

        {/* Günün Ayeti - Premium Card */}
        <View style={styles.premiumKart}>
          <View style={styles.kartSüs} />
          <View style={styles.ayetHeader}>
            <Text style={styles.ayetBaslik}>📖 Günün Ayeti</Text>
            <View style={styles.ayetBadge}>
              <Text style={styles.ayetBadgeText}>Kutsal Kur'an</Text>
            </View>
          </View>
          <View style={styles.ayetIcerik}>
            <Text style={styles.ayetText}>{gununAyeti.ayet}</Text>
            <Text style={styles.ayetKaynak}>— {gununAyeti.kaynak}</Text>
          </View>
        </View>

        {/* Günün Hadisi - Premium Card */}
        <View style={styles.premiumKart}>
          <View style={[styles.kartSüs, { backgroundColor: ISLAMI_RENKLER.yesilAcik }]} />
          <View style={styles.hadisHeader}>
            <Text style={styles.hadisBaslik}>📿 Günün Hadisi</Text>
          </View>
          <Text style={styles.hadisText}>{gununHadisi.hadis}</Text>
          <Text style={styles.hadisKaynak}>— {gununHadisi.kaynak}</Text>
        </View>

        {/* Motivasyon - Modern Glass */}
        <View style={styles.motivasyonGlass}>
          <Text style={styles.motivasyonEmoji}>⭐</Text>
          <Text style={styles.motivasyonText}>
            "Sabredenlere mükafatları hesapsız ödenecektir." (Zümer, 10)
          </Text>
        </View>

        {/* Hata Mesajı */}
        {hata && (
          <View style={styles.hataContainer}>
            <Text style={styles.hataText}>⚠️ {hata}</Text>
          </View>
        )}
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
    paddingBottom: 40,
    paddingTop: 10,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 5,
  },
  selamText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
    opacity: 0.8,
  },
  vakitSelamText: {
    fontSize: 22,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
    marginTop: 2,
  },
  konumContainer: {
    alignItems: 'flex-end',
  },
  konumBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  konumText: {
    fontSize: 12,
    fontWeight: '700',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.body,
  },
  tarihText: {
    fontSize: 11,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 6,
    fontFamily: TYPOGRAPHY.body,
  },
  // Sections
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
  },
  // Hızlı Erişim Yeni
  hizliScroll: {
    marginBottom: 20,
  },
  hizliScrollContent: {
    paddingHorizontal: 20,
  },
  hizliKartYeni: {
    width: 85,
    height: 100,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  hizliIkonYeni: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  hizliIkonTextYeni: {
    fontSize: 24,
  },
  hizliBaslikYeni: {
    fontSize: 11,
    fontWeight: '600',
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  // Premium Cards (Ayet/Hadis)
  premiumKart: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(25, 60, 45, 0.65)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  kartSüs: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    backgroundColor: ISLAMI_RENKLER.altinOrta + '15',
    borderBottomLeftRadius: 60,
  },
  ayetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  ayetBaslik: {
    fontSize: 16,
    fontWeight: '800',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
  },
  ayetBadge: {
    backgroundColor: 'rgba(218, 165, 32, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ayetBadgeText: {
    fontSize: 10,
    color: ISLAMI_RENKLER.altinOrta,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ayetIcerik: {
    borderLeftWidth: 2,
    borderLeftColor: ISLAMI_RENKLER.altinOrta,
    paddingLeft: 15,
  },
  ayetText: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    lineHeight: 25,
    fontStyle: 'italic',
    fontFamily: TYPOGRAPHY.body,
  },
  ayetKaynak: {
    fontSize: 12,
    color: ISLAMI_RENKLER.altinOrta,
    marginTop: 12,
    fontWeight: '600',
  },
  hadisHeader: {
    marginBottom: 12,
  },
  hadisBaslik: {
    fontSize: 16,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
  },
  hadisText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazAcik,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  hadisKaynak: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 10,
    opacity: 0.7,
  },
  // Motivasyon Glass
  motivasyonGlass: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  motivasyonEmoji: {
    fontSize: 28,
    marginBottom: 12,
  },
  motivasyonText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    opacity: 0.9,
  },
  // Hata
  hataContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.kirmiziYumusak,
  },
  hataText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
    fontWeight: '600',
  },
});
