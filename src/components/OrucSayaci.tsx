import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NamazVakitleri } from '../types';
import { saatFarkiHesapla, saniyeToZaman } from '../utils/namazVakitleri';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface OrucSayaciProps {
  vakitler: NamazVakitleri | null;
  yukleniyor?: boolean;
}

/**
 * Sabah ezanı ile akşam namazı arasındaki süreyi gösteren sayaç bileşeni
 */
export const OrucSayaci: React.FC<OrucSayaciProps> = ({ vakitler, yukleniyor = false }) => {
  const [kalanSure, setKalanSure] = useState<number | null>(null);
  const [durum, setDurum] = useState<'beklemede' | 'devam' | 'bitti'>('beklemede');

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
    fontSize: 22,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 28,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sayacContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  zamanKutusu: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    padding: 20,
    borderRadius: 20,
    minWidth: 90,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  zamanSayisi: {
    fontSize: 44,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 8,
    letterSpacing: 1,
  },
  zamanEtiketi: {
    fontSize: 11,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  ikiNokta: {
    fontSize: 36,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginHorizontal: 10,
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

