import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Animated, Dimensions } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { NamazVakitleri } from '../types';
import { saniyeToZaman } from '../utils/namazVakitleri';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { getSukurAyetiByGun, SukurAyeti } from '../constants/sukurAyetleri';
import { useOrucZinciri } from '../hooks/useOrucZinciri';

const { width } = Dimensions.get('window');

interface OrucSayaciProps {
  vakitler: NamazVakitleri | null;
  yukleniyor?: boolean;
}

/**
 * Modernleştirilmiş Oruç Sayacı bileşeni
 */
export const OrucSayaci: React.FC<OrucSayaciProps> = ({ vakitler, yukleniyor = false }) => {
  const { zincirHalkalari } = useOrucZinciri();
  const [kalanSure, setKalanSure] = useState<number | null>(null);
  const [durum, setDurum] = useState<'beklemede' | 'devam' | 'bitti'>('beklemede');
  const [gununAyeti, setGununAyeti] = useState<SukurAyeti | null>(null);

  // Animasyonlar
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  // Pulse animasyonu
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    glow.start();

    return () => {
      pulse.stop();
      glow.stop();
    };
  }, []);

  useEffect(() => {
    if (!vakitler) return;

    const guncelleSayac = () => {
      const simdi = new Date();
      const simdiSaat = simdi.getHours();
      const simdiDakika = simdi.getMinutes();
      const simdiToplam = simdiSaat * 3600 + simdiDakika * 60 + simdi.getSeconds();

      const [imsakSaat, imsakDakika] = vakitler.imsak.split(':').map(Number);
      const [aksamSaat, aksamDakika] = vakitler.aksam.split(':').map(Number);

      const imsakToplam = imsakSaat * 3600 + imsakDakika * 60;
      const aksamToplam = aksamSaat * 3600 + aksamDakika * 60;

      if (simdiToplam < imsakToplam) {
        setDurum('beklemede');
        const kalan = imsakToplam - simdiToplam;
        setKalanSure(kalan);
      } else if (simdiToplam >= imsakToplam && simdiToplam < aksamToplam) {
        setDurum('devam');
        const kalan = aksamToplam - simdiToplam;
        setKalanSure(kalan);
      } else {
        setDurum('bitti');
        setKalanSure(0);
      }
    };

    guncelleSayac();
    const timer = setInterval(guncelleSayac, 1000);
    return () => clearInterval(timer);
  }, [vakitler]);

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
        <ActivityIndicator size="large" color={ISLAMI_RENKLER.altinAcik} />
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

  // Progress hesaplama
  const [imsakSaat, imsakDakika] = vakitler.imsak.split(':').map(Number);
  const [aksamSaat, aksamDakika] = vakitler.aksam.split(':').map(Number);
  const imsakToplam = imsakSaat * 3600 + imsakDakika * 60;
  const aksamToplam = aksamSaat * 3600 + aksamDakika * 60;

  let progressYuzde = 0;
  if (durum === 'beklemede') {
    // Gece yarısından imsaka
    const geceBaslangic = 0;
    progressYuzde = ((imsakToplam - kalanSure) / imsakToplam) * 100;
  } else if (durum === 'devam') {
    const toplamSure = aksamToplam - imsakToplam;
    progressYuzde = ((toplamSure - kalanSure) / toplamSure) * 100;
  }

  // SVG Circle için stroke-dasharray hesaplama
  const circleRadius = 95;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progressYuzde / 100) * circumference;

  return (
    <View style={styles.container}>
      {/* Başlık */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerEmoji}>
          {durum === 'beklemede' ? '🌙' : durum === 'devam' ? '☀️' : '✨'}
        </Text>
        <Text style={styles.headerTitle}>
          {durum === 'beklemede' ? 'Sahura Kalan' : durum === 'devam' ? 'İftara Kalan' : 'Oruç Tamamlandı!'}
        </Text>
      </View>

      {durum !== 'bitti' && (
        <>
          {/* Ana Sayaç Kartı */}
          <Animated.View style={[styles.sayacKart, { transform: [{ scale: pulseAnim }] }]}>
            {/* Glow efekti */}
            <Animated.View style={[styles.glowEffect, { opacity: glowAnim }]} />

            {/* SVG Circular Progress */}
            <View style={styles.circleContainer}>
              <Svg width={220} height={220} style={styles.svgCircle}>
                <Defs>
                  <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={ISLAMI_RENKLER.altinAcik} />
                    <Stop offset="100%" stopColor={ISLAMI_RENKLER.altinOrta} />
                  </LinearGradient>
                </Defs>

                {/* Arka plan dairesi */}
                <Circle
                  cx="110"
                  cy="110"
                  r={circleRadius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="8"
                />

                {/* Progress dairesi */}
                <Circle
                  cx="110"
                  cy="110"
                  r={circleRadius}
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90, 110, 110)"
                />

                {/* İç dekoratif daire */}
                <Circle
                  cx="110"
                  cy="110"
                  r={circleRadius - 20}
                  fill="none"
                  stroke="rgba(218, 165, 32, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="8,4"
                />
              </Svg>

              {/* Merkez içerik */}
              <View style={styles.centerContent}>
                <Text style={styles.arabicAllah}>الله</Text>
                <View style={styles.timeContainer}>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeNumber}>{String(zaman.saat).padStart(2, '0')}</Text>
                    <Text style={styles.timeLabel}>saat</Text>
                  </View>
                  <Text style={styles.timeSeparator}>:</Text>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeNumber}>{String(zaman.dakika).padStart(2, '0')}</Text>
                    <Text style={styles.timeLabel}>dakika</Text>
                  </View>
                  <Text style={styles.timeSeparator}>:</Text>
                  <View style={styles.timeBlock}>
                    <Text style={[styles.timeNumber, styles.secondsNumber]}>{String(zaman.saniye).padStart(2, '0')}</Text>
                    <Text style={styles.timeLabel}>saniye</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Vakit Bilgileri - Yatay Kompakt */}
          <View style={styles.vakitBilgileri}>
            <View style={styles.vakitItem}>
              <Text style={styles.vakitEmoji}>🌙</Text>
              <Text style={styles.vakitLabel}>İmsak</Text>
              <Text style={styles.vakitSaat}>{vakitler.imsak}</Text>
            </View>

            <View style={styles.vakitDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerIcon}>☪️</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.vakitItem}>
              <Text style={styles.vakitEmoji}>🌅</Text>
              <Text style={styles.vakitLabel}>İftar</Text>
              <Text style={styles.vakitSaat}>{vakitler.aksam}</Text>
            </View>
          </View>
        </>
      )}

      {durum === 'bitti' && (
        <>
          <View style={styles.bittiContainer}>
            <Text style={styles.bittiEmoji}>🎉</Text>
            <Text style={styles.bittiText}>Allah kabul etsin!</Text>
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
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 28,
    margin: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  yukleniyorText: {
    marginTop: 12,
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
  },
  hataText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.body,
  },
  // Header
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerEmoji: {
    fontSize: 28,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 0.5,
  },
  // Sayaç Kartı
  sayacKart: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  glowEffect: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    opacity: 0.15,
  },
  circleContainer: {
    position: 'relative',
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgCircle: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arabicAllah: {
    fontSize: 36,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '400',
    marginBottom: 4,
    textShadowColor: 'rgba(218, 165, 32, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  centerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  timeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 1,
  },
  secondsNumber: {
    color: ISLAMI_RENKLER.altinAcik,
  },
  timeLabel: {
    fontSize: 9,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textTransform: 'uppercase',
    fontFamily: TYPOGRAPHY.body,
    marginTop: 2,
  },
  timeSeparator: {
    fontSize: 28,
    fontWeight: '300',
    color: ISLAMI_RENKLER.altinOrta,
    marginHorizontal: 6,
    marginTop: 2,
  },
  // Vakit Bilgileri - Yeni Tasarım
  vakitBilgileri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  vakitItem: {
    alignItems: 'center',
    flex: 1,
  },
  vakitEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  vakitLabel: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  vakitSaat: {
    fontSize: 20,
    fontWeight: '800',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
  },
  vakitDivider: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dividerLine: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(218, 165, 32, 0.3)',
  },
  dividerIcon: {
    fontSize: 16,
    marginVertical: 6,
  },
  // Bitti durumu
  bittiContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  bittiEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  bittiText: {
    fontSize: 24,
    fontWeight: '800',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
  },
  sukurAyetiContainer: {
    width: '100%',
    marginTop: 8,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
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
    fontFamily: TYPOGRAPHY.display,
  },
  ayetNumarasi: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.body,
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
    fontFamily: TYPOGRAPHY.arabic,
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
    fontFamily: TYPOGRAPHY.body,
  },
  meal: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    lineHeight: 24,
    fontWeight: '500',
    textAlign: 'justify',
    fontFamily: TYPOGRAPHY.body,
  },
});
