import React, { useState, useEffect, Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { useNamazVakitleri } from '../hooks/useNamazVakitleri';

/**
 * Minimal analog saat bileşeni (akrep-yelkovanlı)
 */
export const DiniDuvarSaati: React.FC = () => {
  const [saat, setSaat] = useState(new Date());
  const { vakitler } = useNamazVakitleri();
  
  // Oruç saatleri içinde mi kontrol et
  const [orucSaati, setOrucSaati] = useState(false);

  useEffect(() => {
    // Her saniye güncelle
    const timer = setInterval(() => {
      setSaat(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!vakitler) return;

    const kontrolOrucSaati = () => {
      const simdi = new Date();
      const simdiSaat = simdi.getHours();
      const simdiDakika = simdi.getMinutes();
      const simdiToplam = simdiSaat * 3600 + simdiDakika * 60 + simdi.getSeconds();

      // Sabah ezanı (imsak) ve akşam namazı saatlerini parse et
      const [imsakSaat, imsakDakika] = vakitler.imsak.split(':').map(Number);
      const [aksamSaat, aksamDakika] = vakitler.aksam.split(':').map(Number);

      const imsakToplam = imsakSaat * 3600 + imsakDakika * 60;
      const aksamToplam = aksamSaat * 3600 + aksamDakika * 60;

      // Oruç saatleri içinde mi? (sabah ezanı ile akşam namazı arası)
      const orucIci = simdiToplam >= imsakToplam && simdiToplam < aksamToplam;
      setOrucSaati(orucIci);
    };

    kontrolOrucSaati();
    const timer = setInterval(kontrolOrucSaati, 1000);

    return () => clearInterval(timer);
  }, [vakitler]);

  // Saat, dakika ve saniye değerlerini al
  const saatDegeri = saat.getHours() % 12;
  const dakikaDegeri = saat.getMinutes();
  const saniyeDegeri = saat.getSeconds();

  // Açı hesaplamaları (derece cinsinden)
  // Her saat 30 derece (360/12), her dakika 0.5 derece ekler
  const akrepAcisi = (saatDegeri * 30) + (dakikaDegeri * 0.5);
  // Her dakika 6 derece (360/60)
  const yelkovanAcisi = dakikaDegeri * 6;
  // Her saniye 6 derece
  const saniyeAcisi = saniyeDegeri * 6;

  const formatTarih = (date: Date): string => {
    const gunler = ['Pazar', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const aylar = [
      'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
      'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'
    ];

    const gun = gunler[date.getDay()];
    const gunNumarasi = date.getDate();
    const ay = aylar[date.getMonth()];
    const yil = date.getFullYear();

    return `${gun}, ${gunNumarasi} ${ay} ${yil}`;
  };

  const formatSaat = (date: Date): string => {
    const saat = String(date.getHours()).padStart(2, '0');
    const dakika = String(date.getMinutes()).padStart(2, '0');
    return `${saat}:${dakika}`;
  };

  // Saat işaretlerini oluştur (12, 3, 6, 9 ve diğerleri için noktalar)
  const saatIsaretleri = Array.from({ length: 12 }, (_, i) => {
    const aci = i * 30; // Her saat 30 derece
    const radyan = (aci - 90) * (Math.PI / 180); // -90 derece başlangıç (12 yönü)
    const yaricapIsaret = 85; // İşaret yarıçapı
    const yaricapNumara = 95; // Numara yarıçapı (daha dışarıda)
    const xIsaret = Math.cos(radyan) * yaricapIsaret;
    const yIsaret = Math.sin(radyan) * yaricapIsaret;
    const xNumara = Math.cos(radyan) * yaricapNumara;
    const yNumara = Math.sin(radyan) * yaricapNumara;
    
    return {
      aci,
      xIsaret: 100 + xIsaret, // İşaret konumu
      yIsaret: 100 + yIsaret,
      xNumara: 100 + xNumara, // Numara konumu
      yNumara: 100 + yNumara,
      buyuk: i % 3 === 0, // 12, 3, 6, 9 için büyük işaret
      numara: i === 0 ? 12 : i, // 12 için 12, diğerleri için kendi numarası
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.saatCercevesi}>
        {/* Saat kadranı */}
        <View style={styles.kadran}>
          {/* Saat işaretleri ve numaraları */}
          {saatIsaretleri.map((isaret, index) => (
            <Fragment key={index}>
              <View
                style={[
                  styles.saatIsareti,
                  isaret.buyuk && styles.saatIsaretiBuyuk,
                  {
                    position: 'absolute',
                    left: isaret.xIsaret - (isaret.buyuk ? 3 : 2),
                    top: isaret.yIsaret - (isaret.buyuk ? 3 : 2),
                  },
                ]}
              />
              {isaret.buyuk && (
                <Text
                  style={[
                    styles.saatNumarasi,
                    {
                      position: 'absolute',
                      left: isaret.xNumara - 7,
                      top: isaret.yNumara - 10,
                    },
                  ]}
                >
                  {isaret.numara}
                </Text>
              )}
            </Fragment>
          ))}

          {/* Yelkovan (dakika) */}
          <View
            style={[
              styles.yelkovan,
              {
                transform: [{ rotate: `${yelkovanAcisi}deg` }],
              },
            ]}
          >
            <View style={[
              styles.yelkovanCizgi,
              orucSaati && styles.yelkovanCizgiOruc
            ]} />
          </View>

          {/* Akrep (saat) */}
          <View
            style={[
              styles.akrep,
              {
                transform: [{ rotate: `${akrepAcisi}deg` }],
              },
            ]}
          >
            <View style={[
              styles.akrepCizgi,
              orucSaati && styles.akrepCizgiOruc
            ]} />
          </View>

          {/* Saniye göstergesi (ince çizgi) */}
          <View
            style={[
              styles.saniye,
              {
                transform: [{ rotate: `${saniyeAcisi}deg` }],
              },
            ]}
          >
            <View style={[
              styles.saniyeCizgi,
              orucSaati && styles.saniyeCizgiOruc
            ]} />
          </View>

          {/* Merkez nokta */}
          <View style={[
            styles.merkezNokta,
            orucSaati && styles.merkezNoktaOruc
          ]} />
          
          {/* Arapça Allah yazısı - merkez */}
          <View style={styles.allahYazisiContainer}>
            <Text style={styles.allahYazisi}>الله</Text>
          </View>
        </View>

        {/* Alt bilgi */}
        <View style={styles.altBilgi}>
          <Text style={styles.saatMetin}>{formatSaat(saat)}</Text>
          <Text style={styles.tarihMetin}>{formatTarih(saat)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  saatCercevesi: {
    width: '100%',
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 28,
    padding: 24,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  kadran: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 0,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  saatIsareti: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ISLAMI_RENKLER.yaziBeyaz,
    opacity: 0.6,
  },
  saatIsaretiBuyuk: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.8,
  },
  saatNumarasi: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyaz,
    transform: [{ translateX: -7 }, { translateY: -7 }],
  },
  akrep: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  akrepCizgi: {
    width: 4,
    height: 60,
    backgroundColor: ISLAMI_RENKLER.yaziBeyaz,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  akrepCizgiOruc: {
    backgroundColor: ISLAMI_RENKLER.altinAcik,
    shadowColor: ISLAMI_RENKLER.altinAcik,
    shadowOpacity: 0.5,
  },
  yelkovan: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  yelkovanCizgi: {
    width: 3,
    height: 80,
    backgroundColor: ISLAMI_RENKLER.yaziBeyaz,
    borderRadius: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  yelkovanCizgiOruc: {
    backgroundColor: ISLAMI_RENKLER.altinAcik,
    shadowColor: ISLAMI_RENKLER.altinAcik,
    shadowOpacity: 0.5,
  },
  saniye: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 5,
  },
  saniyeCizgi: {
    width: 1,
    height: 90,
    backgroundColor: ISLAMI_RENKLER.altinAcik,
    opacity: 0.7,
  },
  saniyeCizgiOruc: {
    backgroundColor: ISLAMI_RENKLER.altinParlak,
    opacity: 1,
  },
  merkezNokta: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ISLAMI_RENKLER.yaziBeyaz,
    borderWidth: 2,
    borderColor: ISLAMI_RENKLER.arkaPlanYesil,
    zIndex: 10,
  },
  merkezNoktaOruc: {
    backgroundColor: ISLAMI_RENKLER.altinAcik,
    borderColor: ISLAMI_RENKLER.altinParlak,
  },
  allahYazisiContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  allahYazisi: {
    fontSize: 48,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    opacity: 0.3,
    writingDirection: 'rtl',
    textAlign: 'center',
  },
  altBilgi: {
    alignItems: 'center',
    marginTop: 8,
  },
  saatMetin: {
    fontSize: 24,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyaz,
    letterSpacing: 1,
    marginBottom: 4,
  },
  tarihMetin: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontWeight: '500',
  },
});
