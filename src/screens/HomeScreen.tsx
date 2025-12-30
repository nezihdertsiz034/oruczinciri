import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { OrucSayaci } from '../components/OrucSayaci';
import { OrucZinciri } from '../components/OrucZinciri';
import { useNamazVakitleri } from '../hooks/useNamazVakitleri';

const { width } = Dimensions.get('window');

// Günün ayetleri
const GUNUN_AYETLERI = [
  { ayet: '"Ey iman edenler! Oruç, sizden öncekilere farz kılındığı gibi size de farz kılındı."', kaynak: 'Bakara, 183' },
  { ayet: '"Şüphesiz Allah sabredenlerle beraberdir."', kaynak: 'Bakara, 153' },
  { ayet: '"Kim Allah\'a tevekkül ederse, O ona yeter."', kaynak: 'Talak, 3' },
  { ayet: '"Rabbinizden mağfiret dileyin. Çünkü O çok bağışlayandır."', kaynak: 'Nuh, 10' },
  { ayet: '"Allah\'ı çok zikredin ki kurtuluşa eresiniz."', kaynak: 'Cuma, 10' },
  { ayet: '"Ve Rabbine sabret. Çünkü sen gözlerimizin önündesin."', kaynak: 'Tur, 48' },
  { ayet: '"Namazı dosdoğru kılın, zekatı verin."', kaynak: 'Bakara, 43' },
];

// Hadis-i Şerifler
const HADISLER = [
  { hadis: '"Oruç bir kalkandır. Oruçlu kötü söz söylemesin."', kaynak: 'Buhari' },
  { hadis: '"Sizin en hayırlınız, ahlakı en güzel olanınızdır."', kaynak: 'Buhari' },
  { hadis: '"Kolaylaştırın, zorlaştırmayın. Müjdeleyin, nefret ettirmeyin."', kaynak: 'Buhari' },
  { hadis: '"Güzel söz sadakadır."', kaynak: 'Buhari' },
  { hadis: '"Temizlik imanın yarısıdır."', kaynak: 'Müslim' },
];

// Hızlı erişim kartları - Satır 1 (4 adet)
const HIZLI_ERISIM_1 = [
  { id: 'tesbih', baslik: 'Tesbih', ikon: '📿', tab: 'Takip', screen: 'TesbihSayaci', renk: '#FFD700' },
  { id: 'dualar', baslik: 'Dualar', ikon: '🤲', tab: 'İbadet', screen: 'DualarMain', renk: '#90EE90' },
  { id: 'kible', baslik: 'Kıble', ikon: '🧭', tab: 'Araçlar', screen: 'Kıble', renk: '#87CEEB' },
  { id: 'esma', baslik: 'Esmaül Hüsna', ikon: '☪️', tab: 'İbadet', screen: 'EsmaulHusna', renk: '#DDA0DD' },
];

// Hızlı erişim kartları - Satır 2 (4 adet) 
const HIZLI_ERISIM_2 = [
  { id: 'peygamber', baslik: 'Hz. Muhammed', ikon: '🌙', tab: 'İbadet', screen: 'PeygamberHayati', renk: '#98FB98' },
  { id: 'kuran', baslik: 'Kur\'an', ikon: '📖', tab: 'İbadet', screen: 'KuranAyetleri', renk: '#FFB6C1' },
  { id: 'zekat', baslik: 'Zekat', ikon: '💰', tab: 'Araçlar', screen: 'Zekat', renk: '#F0E68C' },
  { id: 'istatistik', baslik: 'İstatistikler', ikon: '📊', tab: 'Takip', screen: 'IstatistiklerMain', renk: '#B0C4DE' },
];

export default function HomeScreen() {
  const { vakitler, yukleniyor, hata } = useNamazVakitleri();
  const navigation = useNavigation<any>();

  // Günün ayeti ve hadisi (günlük değişir)
  const gunIndex = new Date().getDate() % GUNUN_AYETLERI.length;
  const hadisIndex = new Date().getDate() % HADISLER.length;
  const gununAyeti = GUNUN_AYETLERI[gunIndex];
  const gununHadisi = HADISLER[hadisIndex];

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
        {/* Oruç Sayacı */}
        <OrucSayaci vakitler={vakitler} yukleniyor={yukleniyor} />

        {/* Oruç Zinciri - Sayacın hemen altında */}
        <OrucZinciri />

        {/* Hızlı Erişim Kartları */}
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
