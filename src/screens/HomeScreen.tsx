import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Text, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { DiniDuvarSaati } from '../components/DiniDuvarSaati';
import { OrucSayaci } from '../components/OrucSayaci';
import { OrucZinciri } from '../components/OrucZinciri';
import { HadisGosterici } from '../components/HadisGosterici';
import { AkordeonMenu } from '../components/AkordeonMenu';
import { OrucFaydalari } from '../components/OrucFaydalari';
import { useNamazVakitleri } from '../hooks/useNamazVakitleri';
import { useOrucZinciri } from '../hooks/useOrucZinciri';
import { useBildirimler } from '../hooks/useBildirimler';
import { ISLAMI_RENKLER } from '../constants/renkler';

export default function HomeScreen() {
  const navigation = useNavigation();
  // Bildirimleri başlat
  useBildirimler();
  const { vakitler, yukleniyor, hata } = useNamazVakitleri();
  const { zincirHalkalari, yukleniyor: zincirYukleniyor, toplamIsaretli, gunuIsaretle } = useOrucZinciri();
  
  // Bugünün gün numarasını bul
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const bugununHalkasi = zincirHalkalari.find(h => {
    const halkaTarih = new Date(h.tarih);
    halkaTarih.setHours(0, 0, 0, 0);
    return halkaTarih.getTime() === bugun.getTime();
  });
  const bugununGunNumarasi = bugununHalkasi?.gunNumarasi || 1;

  const handleHalkaPress = async (tarih: Date, mevcutDurum: boolean) => {
    try {
      const yeniDurum = !mevcutDurum;
      await gunuIsaretle(tarih, yeniDurum);
    } catch (error) {
      Alert.alert('Hata', 'Gün işaretlenirken bir hata oluştu.');
      console.error('Halka işaretlenirken hata:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DiniDuvarSaati />
        
        <OrucSayaci vakitler={vakitler} yukleniyor={yukleniyor} />

        <OrucZinciri
          halkalar={zincirHalkalari}
          yukleniyor={zincirYukleniyor}
          onHalkaPress={handleHalkaPress}
        />

        {hata && (
          <View style={styles.hataContainer}>
            <Text style={styles.hataText}>{hata}</Text>
          </View>
        )}

        {/* Hadis gösterici en altta */}
        <View style={styles.hadisContainer}>
          <HadisGosterici gunNumarasi={bugununGunNumarasi} />
        </View>

        {/* Oruç Faydaları - Günlük Bilgi */}
        <OrucFaydalari />

        {/* Akordeon Menü Bölümü */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>📱 Menü</Text>
          <AkordeonMenu
            kategoriler={[
              {
                id: 'takip',
                baslik: 'Takip ve İstatistikler',
                ikon: '📊',
                items: [
                  {
                    id: 'istatistikler',
                    ikon: '📊',
                    baslik: 'İstatistikler',
                    aciklama: 'Oruç performansınızı görüntüleyin',
                    onPress: () => navigation.navigate('İstatistikler' as never),
                    renk: ISLAMI_RENKLER.maviAcik,
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
                    aciklama: 'Sahur ve iftar duaları',
                    onPress: () => navigation.navigate('Dualar' as never),
                    renk: ISLAMI_RENKLER.altinAcik,
                  },
                  {
                    id: 'kuran',
                    ikon: '📖',
                    baslik: 'Kur\'an Ayetleri',
                    aciklama: 'Günlük ayetler ve sureler',
                    onPress: () => navigation.navigate('Kur\'an Ayetleri' as never),
                    renk: ISLAMI_RENKLER.yesilParlak,
                  },
                ],
              },
              {
                id: 'kisisel',
                baslik: 'Kişisel',
                ikon: '📝',
                items: [
                  {
                    id: 'notlar',
                    ikon: '📝',
                    baslik: 'Notlar',
                    aciklama: 'Kişisel notlarınızı kaydedin',
                    onPress: () => navigation.navigate('Notlar' as never),
                    renk: ISLAMI_RENKLER.maviCokAcik,
                  },
                ],
              },
              {
                id: 'ozellikler',
                baslik: 'Özellikler ve Ayarlar',
                ikon: '⚙️',
                items: [
                  {
                    id: 'ekstra',
                    ikon: '✨',
                    baslik: 'Ekstra Özellikler',
                    aciklama: 'Kıble yönü, teravih ve daha fazlası',
                    onPress: () => navigation.navigate('Ekstra Özellikler' as never),
                    renk: ISLAMI_RENKLER.altinParlak,
                  },
                  {
                    id: 'ayarlar',
                    ikon: '⚙️',
                    baslik: 'Ayarlar',
                    aciklama: 'Bildirimler ve uygulama ayarları',
                    onPress: () => navigation.navigate('Ayarlar' as never),
                    renk: ISLAMI_RENKLER.griOrta,
                  },
                ],
              },
            ]}
          />
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  hataContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.kirmiziYumusak,
  },
  hataText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
  },
  hadisContainer: {
    marginTop: 8,
  },
  menuSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  menuSectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginHorizontal: 16,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
});

