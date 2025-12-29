import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { NamazVakitleri } from '../types';
import { saatFarkiHesapla, saniyeToZaman } from '../utils/namazVakitleri';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { getSukurAyetiByGun, SukurAyeti } from '../constants/sukurAyetleri';
import { useOrucZinciri } from '../hooks/useOrucZinciri';

interface OrucSayaciProps {
  vakitler: NamazVakitleri | null;
  yukleniyor?: boolean;
}

/**
 * Sabah ezanı ile akşam namazı arasındaki süreyi gösteren sayaç bileşeni
 */
export const OrucSayaci: React.FC<OrucSayaciProps> = ({ vakitler, yukleniyor = false }) => {
  const { zincirHalkalari } = useOrucZinciri();
  const [kalanSure, setKalanSure] = useState<number | null>(null);
  const [durum, setDurum] = useState<'beklemede' | 'devam' | 'bitti'>('beklemede');
  const [gununAyeti, setGununAyeti] = useState<SukurAyeti | null>(null);

  useEffect(() => {
    if (!vakitler) return;

    const guncelleSayac = () => {
      const simdi = new Date();
      const simdiSaat = simdi.getHours();
      const simdiDakika = simdi.getMinutes();
      const simdiToplam = simdiSaat * 3600 + simdiDakika * 60 + simdi.getSeconds();

      // Sabah ezanı (imsak) ve akşam namazı saatlerini parse et
      const [imsakSaat, imsakDakika] = vakitler.imsak.split(':').map(Number);
      const [aksamSaat, aksamDakika] = vakitler.aksam.split(':').map(Number);

      const imsakToplam = imsakSaat * 3600 + imsakDakika * 60;
      const aksamToplam = aksamSaat * 3600 + aksamDakika * 60;

      // Şu anki durumu belirle
      if (simdiToplam < imsakToplam) {
        // Henüz sabah ezanı olmadı
        setDurum('beklemede');
        const kalan = imsakToplam - simdiToplam;
        setKalanSure(kalan);
      } else if (simdiToplam >= imsakToplam && simdiToplam < aksamToplam) {
        // Oruç devam ediyor
        setDurum('devam');
        const kalan = aksamToplam - simdiToplam;
        setKalanSure(kalan);
      } else {
        // Akşam namazı geçti, oruç bitti
        setDurum('bitti');
        setKalanSure(0);
      }
    };

    // İlk güncelleme
    guncelleSayac();

    // Her saniye güncelle
    const timer = setInterval(guncelleSayac, 1000);

    return () => clearInterval(timer);
  }, [vakitler]);

  // Şükür ayetini yükle
  useEffect(() => {
    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);
    const bugununHalkasi = zincirHalkalari.find(h => {
      const halkaTarih = new Date(h.tarih);
      halkaTarih.setHours(0, 0, 0, 0);
      return halkaTarih.getTime() === bugun.getTime();
    });
    const gunNumarasi = bugununHalkasi?.gunNumarasi || bugun.getDate();
    
    const ayet = getSukurAyetiByGun(gunNumarasi);
    setGununAyeti(ayet);
  }, [zincirHalkalari]);

  if (yukleniyor) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={ISLAMI_RENKLER.yesilOrta} />
        <Text style={styles.yukleniyorText}>Namaz vakitleri yükleniyor...</Text>
      </View>
    );
  }

  if (!vakitler || kalanSure === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.hataText}>Vakit bilgisi alınamadı</Text>
      </View>
    );
  }

  const zaman = saniyeToZaman(kalanSure);
  const durumMetni = durum === 'beklemede' 
    ? '🌅 Sabah ezanına kalan süre' 
    : durum === 'devam' 
    ? '🌇 Akşam namazına kalan süre' 
    : '✨ Oruç tamamlandı! Allah kabul etsin! 🎉';

  return (
    <View style={styles.container}>
      <Text style={styles.durumText}>{durumMetni}</Text>
      
      {durum !== 'bitti' && (
        <View style={styles.sayacContainer}>
          <View style={styles.zamanKutusu}>
            <Text style={styles.zamanSayisi}>{String(zaman.saat).padStart(2, '0')}</Text>
            <Text style={styles.zamanEtiketi}>Saat</Text>
          </View>
          <Text style={styles.ikiNokta}>:</Text>
          <View style={styles.zamanKutusu}>
            <Text style={styles.zamanSayisi}>{String(zaman.dakika).padStart(2, '0')}</Text>
            <Text style={styles.zamanEtiketi}>Dakika</Text>
          </View>
          <Text style={styles.ikiNokta}>:</Text>
          <View style={styles.zamanKutusu}>
            <Text style={styles.zamanSayisi}>{String(zaman.saniye).padStart(2, '0')}</Text>
            <Text style={styles.zamanEtiketi}>Saniye</Text>
          </View>
        </View>
      )}

      {durum === 'bitti' && (
        <>
          <View style={styles.bittiContainer}>
            <Text style={styles.bittiText}>🎉</Text>
          </View>
          
          {gununAyeti && (
            <View style={styles.sukurAyetiContainer}>
              <View style={styles.ayetBilgisi}>
                <Text style={styles.sureBaslik}>{gununAyeti.sure} Suresi</Text>
                <Text style={styles.ayetNumarasi}>{gununAyeti.ayetNumarasi}. Ayet</Text>
              </View>
              
              <ScrollView style={styles.arapcaContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.arapca}>{gununAyeti.arapca}</Text>
              </ScrollView>
              
              <View style={styles.mealContainer}>
                <Text style={styles.mealLabel}>Türkçe Meali:</Text>
                <Text style={styles.meal}>{gununAyeti.turkceMeal}</Text>
              </View>
            </View>
          )}
        </>
      )}

      <View style={styles.vakitBilgisi}>
        <Text style={styles.vakitText}>
          🌅 Sabah Ezanı: <Text style={styles.vakitSaat}>{vakitler.imsak}</Text>
        </Text>
        <Text style={styles.vakitText}>
          🌇 Akşam Namazı: <Text style={styles.vakitSaat}>{vakitler.aksam}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 28,
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 28,
    margin: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  yukleniyorText: {
    marginTop: 12,
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  hataText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
  },
  durumText: {
    fontSize: 24,
    fontWeight: '900',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sayacContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  zamanKutusu: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 24,
    borderRadius: 24,
    minWidth: 100,
    borderWidth: 2,
    borderColor: ISLAMI_RENKLER.altinOrta,
    shadowColor: ISLAMI_RENKLER.altinOrta,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  zamanSayisi: {
    fontSize: 52,
    fontWeight: '900',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 8,
    letterSpacing: 2,
  },
  zamanEtiketi: {
    fontSize: 11,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  ikiNokta: {
    fontSize: 44,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginHorizontal: 12,
  },
  bittiContainer: {
    padding: 24,
    marginBottom: 16,
  },
  bittiText: {
    fontSize: 48,
    textAlign: 'center',
  },
  sukurAyetiContainer: {
    width: '100%',
    marginTop: 8,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  ayetBilgisi: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sureBaslik: {
    fontSize: 18,
    fontWeight: '800',
    color: ISLAMI_RENKLER.altinAcik,
    marginBottom: 4,
    textAlign: 'center',
  },
  ayetNumarasi: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontWeight: '600',
  },
  arapcaContainer: {
    maxHeight: 120,
    marginBottom: 16,
  },
  arapca: {
    fontSize: 20,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'right',
    lineHeight: 32,
    fontWeight: '500',
    fontFamily: 'System',
  },
  mealContainer: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  mealLabel: {
    fontSize: 13,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  meal: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    lineHeight: 24,
    fontWeight: '500',
    textAlign: 'justify',
  },
  vakitBilgisi: {
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  vakitText: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginVertical: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  vakitSaat: {
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    fontSize: 16,
  },
});

