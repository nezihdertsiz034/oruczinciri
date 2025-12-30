import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { OrucSayaci } from '../components/OrucSayaci';
import { OrucZinciri } from '../components/OrucZinciri';
import { AkordeonMenu } from '../components/AkordeonMenu';
import { useNamazVakitleri } from '../hooks/useNamazVakitleri';

type RootStackParamList = {
  'Ana Sayfa': undefined;
  'İstatistikler': undefined;
  'Dualar': undefined;
  'Tesbih Sayacı': undefined;
  'Kur\'an Ayetleri': undefined;
  'Notlar': undefined;
  'Ekstra Özellikler': undefined;
  'Ana Ekran Widget': undefined;
  'Ayarlar': undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Ana ekran - Oruç sayacı ve navigasyon menüsü
 */
export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { vakitler, yukleniyor, hata } = useNamazVakitleri();

  const menuKategoriler = [
    {
      id: 'takip',
      baslik: 'Takip ve İstatistikler',
      ikon: '📊',
      items: [
        {
          id: 'istatistikler',
          ikon: '📈',
          baslik: 'İstatistikler',
          aciklama: 'Oruç istatistiklerinizi görüntüleyin',
          onPress: () => navigation.navigate('İstatistikler'),
          renk: ISLAMI_RENKLER.altinAcik,
        },
      ],
    },
    {
      id: 'dini',
      baslik: 'Dini İçerikler',
      ikon: '📿',
      items: [
        {
          id: 'dualar',
          ikon: '🤲',
          baslik: 'Dualar',
          aciklama: 'Ramazan duaları ve zikirler',
          onPress: () => navigation.navigate('Dualar'),
          renk: ISLAMI_RENKLER.yesilOrta,
        },
        {
          id: 'tesbih',
          ikon: '📿',
          baslik: 'Tesbih Sayacı',
          aciklama: 'Zikir sayacını hızlıca kullanın',
          onPress: () => navigation.navigate('Tesbih Sayacı'),
          renk: ISLAMI_RENKLER.altinAcik,
        },
        {
          id: 'kuran',
          ikon: '📖',
          baslik: 'Kur\'an Ayetleri',
          aciklama: 'Günlük Kur\'an ayetleri',
          onPress: () => navigation.navigate('Kur\'an Ayetleri'),
          renk: ISLAMI_RENKLER.altinOrta,
        },
      ],
    },
    {
      id: 'ekstra',
      baslik: 'Ekstra Özellikler',
      ikon: '✨',
      items: [
        {
          id: 'notlar',
          ikon: '📝',
          baslik: 'Notlar',
          aciklama: 'Kişisel notlarınızı kaydedin',
          onPress: () => navigation.navigate('Notlar'),
          renk: ISLAMI_RENKLER.yesilAcik,
        },
        {
          id: 'ekstra',
          ikon: '🌟',
          baslik: 'Ekstra Özellikler',
          aciklama: 'Kıble, teravih, sadaka ve daha fazlası',
          onPress: () => navigation.navigate('Ekstra Özellikler'),
          renk: ISLAMI_RENKLER.altinAcik,
        },
        {
          id: 'widget',
          ikon: '🧩',
          baslik: 'Ana Ekran Widget',
          aciklama: 'Widget önizleme ve kurulum bilgisi',
          onPress: () => navigation.navigate('Ana Ekran Widget'),
          renk: ISLAMI_RENKLER.yesilParlak,
        },
        {
          id: 'ayarlar',
          ikon: '⚙️',
          baslik: 'Ayarlar',
          aciklama: 'Uygulama ayarları',
          onPress: () => navigation.navigate('Ayarlar'),
          renk: ISLAMI_RENKLER.yaziBeyazYumusak,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecor />
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Oruç Sayacı */}
        <OrucSayaci vakitler={vakitler} yukleniyor={yukleniyor} />

        {/* Oruç Zinciri */}
        <OrucZinciri />

        {/* Navigasyon Menüsü */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuBaslik}>📱 Menü</Text>
          <AkordeonMenu kategoriler={menuKategoriler} />
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
    paddingBottom: 20,
    paddingTop: 4,
  },
  menuContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  menuBaslik: {
    fontSize: 22,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 16,
    marginHorizontal: 16,
    letterSpacing: 0.5,
    fontFamily: TYPOGRAPHY.display,
  },
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
