import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
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

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { vakitler, yukleniyor, hata } = useNamazVakitleri();
  useBildirimler(); // Bildirimleri otomatik ayarla
  const navigation = useNavigation<any>();

  // Günün ayeti ve hadisi (günlük değişir) - useMemo ile optimize edildi
  const { gununAyeti, gununHadisi } = useMemo(() => {
    const bugun = new Date().getDate();
    const gunIndex = bugun % GUNUN_AYETLERI.length;
    const hadisIndex = bugun % HADISLER.length;

    return {
      gununAyeti: GUNUN_AYETLERI[gunIndex],
      gununHadisi: HADISLER[hadisIndex],
    };
  }, []); // Boş dependency array - sadece component mount olduğunda hesapla

  const handleHizliErisim = (tab: string, screen?: string) => {
    if (screen) {
      // Önce tab'a, sonra içindeki stack'in ilgili ekranına git
      navigation.navigate(tab, {
        screen: screen,
      });
    } else {
      // Sadece tab'a git
      navigation.navigate(tab);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <BackgroundDecor />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hızlı Erişim Kartları - EN ÜSTTE */}
        <View style={styles.hizliErisimContainer}>
          <Text style={styles.bolumBaslik}>⚡ Hızlı Erişim</Text>
          {/* Satır 1 */}
          <View style={styles.hizliErisimGrid}>
            {HIZLI_ERISIM_1.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.hizliKart}
                onPress={() => handleHizliErisim(item.tab, item.screen)}
                activeOpacity={0.8}
              >
                <View style={[styles.hizliIkon, { backgroundColor: `${item.renk}25` }]}>
                  <Text style={styles.hizliIkonText}>{item.ikon}</Text>
                </View>
                <Text style={styles.hizliBaslik}>{item.baslik}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Satır 2 */}
          <View style={[styles.hizliErisimGrid, { marginTop: 12 }]}>
            {HIZLI_ERISIM_2.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.hizliKart}
                onPress={() => handleHizliErisim(item.tab, item.screen)}
                activeOpacity={0.8}
              >
                <View style={[styles.hizliIkon, { backgroundColor: `${item.renk}25` }]}>
                  <Text style={styles.hizliIkonText}>{item.ikon}</Text>
                </View>
                <Text style={styles.hizliBaslik}>{item.baslik}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Oruç Sayacı - Hızlı Erişimin Altında */}
        <OrucSayaci vakitler={vakitler} yukleniyor={yukleniyor} />

        {/* Sonraki Namaz Sayacı - Tüm 6 vakit + geri sayım */}
        <SonrakiNamazSayaci vakitler={vakitler} yukleniyor={yukleniyor} />

        {/* Ramazan Takvimi - 30 günlük grid */}
        <RamazanTakvimi />

        {/* Oruç Zinciri */}
        <OrucZinciri />

        {/* Günün Ayeti */}
        <View style={styles.ayetKart}>
          <View style={styles.ayetHeader}>
            <Text style={styles.ayetBaslik}>📖 Günün Ayeti</Text>
            <Text style={styles.ayetTarih}>{new Date().toLocaleDateString('tr-TR')}</Text>
          </View>
          <View style={styles.ayetIcerik}>
            <Text style={styles.ayetText}>{gununAyeti.ayet}</Text>
            <Text style={styles.ayetKaynak}>— {gununAyeti.kaynak}</Text>
          </View>
        </View>

        {/* Günün Hadisi */}
        <View style={styles.hadisKart}>
          <View style={styles.hadisHeader}>
            <Text style={styles.hadisBaslik}>📿 Günün Hadisi</Text>
          </View>
          <Text style={styles.hadisText}>{gununHadisi.hadis}</Text>
          <Text style={styles.hadisKaynak}>— {gununHadisi.kaynak}</Text>
        </View>

        {/* Motivasyon Kartı */}
        <View style={styles.motivasyonKart}>
          <Text style={styles.motivasyonEmoji}>🌙</Text>
          <Text style={styles.motivasyonText}>
            Allah kabul etsin, bereketli bir Ramazan geçirmeniz dileğiyle...
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
    overflow: 'hidden',
  },
  content: {
    paddingBottom: 30,
    paddingTop: 4,
  },
  bolumBaslik: {
    fontSize: 18,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 14,
    fontFamily: TYPOGRAPHY.display,
  },
  // Hızlı Erişim
  hizliErisimContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  hizliErisimGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hizliKart: {
    width: (width - 56) / 4,
    alignItems: 'center',
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  hizliIkon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  hizliIkonText: {
    fontSize: 22,
  },
  hizliBaslik: {
    fontSize: 11,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.body,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Günün Ayeti
  ayetKart: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(218, 165, 32, 0.12)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.25)',
  },
  ayetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ayetBaslik: {
    fontSize: 16,
    fontWeight: '700',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
  },
  ayetTarih: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
  },
  ayetIcerik: {
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: ISLAMI_RENKLER.altinOrta,
  },
  ayetText: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontStyle: 'italic',
    lineHeight: 24,
    fontFamily: TYPOGRAPHY.body,
  },
  ayetKaynak: {
    fontSize: 12,
    color: ISLAMI_RENKLER.altinOrta,
    marginTop: 10,
    fontFamily: TYPOGRAPHY.body,
  },
  // Hadis
  hadisKart: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  hadisHeader: {
    marginBottom: 12,
  },
  hadisBaslik: {
    fontSize: 16,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
  },
  hadisText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontStyle: 'italic',
    lineHeight: 22,
    fontFamily: TYPOGRAPHY.body,
  },
  hadisKaynak: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 10,
    fontFamily: TYPOGRAPHY.body,
  },
  // Motivasyon
  motivasyonKart: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  motivasyonEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  motivasyonText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    fontFamily: TYPOGRAPHY.body,
  },
  // Hata
  hataContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: ISLAMI_RENKLER.kirmiziYumusak + '20',
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
