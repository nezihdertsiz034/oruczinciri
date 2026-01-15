import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Line, Path, Defs, LinearGradient, Stop, G, Text as SvgText } from 'react-native-svg';
import { KibleYonu as KibleYonuType } from '../types';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';

const { width: EKRAN_GENISLIK } = Dimensions.get('window');
const PUSULA_BOYUT = Math.min(EKRAN_GENISLIK * 0.85, 320);

interface KibleYonuProps {
  kibleYonu: KibleYonuType | null;
  kibleOkAcisi?: number;
  pusulaAcisi?: number;
  yukleniyor?: boolean;
  hata?: string | null;
}

/**
 * Modern Kıble yönü göstergesi bileşeni - Gerçek zamanlı pusula ve titreşim destekli
 */
export const KibleYonu: React.FC<KibleYonuProps> = ({
  kibleYonu,
  kibleOkAcisi = 0,
  pusulaAcisi = 0,
  yukleniyor = false,
  hata = null,
}) => {
  const [sonTitresimZamani, setSonTitresimZamani] = useState(0);
  const [hizalandi, setHizalandi] = useState(false);
  const parlamaAnim = useRef(new Animated.Value(0)).current;

  const yonIsimleri: Record<KibleYonuType['yon'], string> = {
    K: 'Kuzey',
    KB: 'Kuzey-Batı',
    B: 'Batı',
    GB: 'Güney-Batı',
    G: 'Güney',
    GD: 'Güney-Doğu',
    D: 'Doğu',
    KD: 'Kuzey-Doğu',
  };

  // Kıble hizalama kontrolü ve titreşim
  useEffect(() => {
    const hizalamaToleransi = 5; // ±5 derece tolerans
    const mutlakFark = Math.abs(kibleOkAcisi);
    const kibleHizali = mutlakFark <= hizalamaToleransi || mutlakFark >= (360 - hizalamaToleransi);

    if (kibleHizali && !hizalandi) {
      setHizalandi(true);

      // Titreşim (1 saniyede bir)
      const simdi = Date.now();
      if (simdi - sonTitresimZamani > 1000) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setSonTitresimZamani(simdi);
      }

      // Parlama animasyonu
      Animated.loop(
        Animated.sequence([
          Animated.timing(parlamaAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(parlamaAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (!kibleHizali && hizalandi) {
      setHizalandi(false);
      parlamaAnim.stopAnimation();
      parlamaAnim.setValue(0);
    }
  }, [kibleOkAcisi, hizalandi, sonTitresimZamani, parlamaAnim]);

  const parlamaOpacity = parlamaAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  if (yukleniyor) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={ISLAMI_RENKLER.altinAcik} />
        <Text style={styles.yukleniyorText}>Kıble yönü hesaplanıyor...</Text>
      </View>
    );
  }

  if (hata) {
    return (
      <View style={styles.container}>
        <Text style={styles.hataText}>{hata}</Text>
      </View>
    );
  }

  if (!kibleYonu) {
    return null;
  }

  const merkez = PUSULA_BOYUT / 2;
  const disYaricap = PUSULA_BOYUT / 2 - 10;
  const icYaricap = PUSULA_BOYUT / 2 - 50;

  // Yön işaretlerini hesapla
  const yonlar = [
    { label: 'K', aci: 0, renk: ISLAMI_RENKLER.altinAcik },
    { label: 'KD', aci: 45, renk: ISLAMI_RENKLER.yaziBeyazYumusak },
    { label: 'D', aci: 90, renk: ISLAMI_RENKLER.yaziBeyaz },
    { label: 'GD', aci: 135, renk: ISLAMI_RENKLER.yaziBeyazYumusak },
    { label: 'G', aci: 180, renk: ISLAMI_RENKLER.yaziBeyaz },
    { label: 'GB', aci: 225, renk: ISLAMI_RENKLER.yaziBeyazYumusak },
    { label: 'B', aci: 270, renk: ISLAMI_RENKLER.yaziBeyaz },
    { label: 'KB', aci: 315, renk: ISLAMI_RENKLER.yaziBeyazYumusak },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>🕌 Kıble Yönü</Text>

      {/* Hizalama durumu */}
      {hizalandi && (
        <Animated.View style={[styles.hizalamaBildirim, { opacity: parlamaOpacity }]}>
          <Text style={styles.hizalamaBildirimText}>✅ Kıble Yönündesiniz!</Text>
        </Animated.View>
      )}

      <View style={styles.pusulaContainer}>
        {/* Parlama efekti */}
        {hizalandi && (
          <Animated.View
            style={[
              styles.parlamaHalkasi,
              {
                opacity: parlamaOpacity,
                transform: [{
                  scale: parlamaAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  })
                }]
              }
            ]}
          />
        )}

        <View style={[
          styles.pusulaWrapper,
          { transform: [{ rotate: `${-pusulaAcisi}deg` }] }
        ]}>
          <Svg width={PUSULA_BOYUT} height={PUSULA_BOYUT}>
            <Defs>
              <LinearGradient id="pusulaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="rgba(26, 95, 63, 0.9)" />
                <Stop offset="100%" stopColor="rgba(10, 50, 30, 0.95)" />
              </LinearGradient>
              <LinearGradient id="kibleOkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={ISLAMI_RENKLER.altinAcik} />
                <Stop offset="100%" stopColor={ISLAMI_RENKLER.altinOrta} />
              </LinearGradient>
            </Defs>

            {/* Dış halka */}
            <Circle
              cx={merkez}
              cy={merkez}
              r={disYaricap}
              fill="url(#pusulaGradient)"
              stroke={ISLAMI_RENKLER.altinOrta}
              strokeWidth={3}
            />

            {/* Derece işaretleri */}
            {Array.from({ length: 72 }).map((_, i) => {
              const aci = (i * 5 * Math.PI) / 180;
              const uzunluk = i % 2 === 0 ? 15 : 8;
              const x1 = merkez + Math.sin(aci) * (disYaricap - 5);
              const y1 = merkez - Math.cos(aci) * (disYaricap - 5);
              const x2 = merkez + Math.sin(aci) * (disYaricap - 5 - uzunluk);
              const y2 = merkez - Math.cos(aci) * (disYaricap - 5 - uzunluk);
              return (
                <Line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 18 === 0 ? ISLAMI_RENKLER.altinAcik : 'rgba(255,255,255,0.3)'}
                  strokeWidth={i % 18 === 0 ? 2 : 1}
                />
              );
            })}

            {/* Yön etiketleri */}
            {yonlar.map((yon) => {
              const radyan = (yon.aci * Math.PI) / 180;
              const yazicap = disYaricap - 35;
              const x = merkez + Math.sin(radyan) * yazicap;
              const y = merkez - Math.cos(radyan) * yazicap;
              return (
                <SvgText
                  key={yon.label}
                  x={x}
                  y={y + 5}
                  fontSize={yon.label.length === 1 ? 18 : 12}
                  fontWeight="bold"
                  fill={yon.renk}
                  textAnchor="middle"
                >
                  {yon.label}
                </SvgText>
              );
            })}

            {/* İç daire */}
            <Circle
              cx={merkez}
              cy={merkez}
              r={icYaricap}
              fill="rgba(0, 0, 0, 0.3)"
              stroke="rgba(218, 165, 32, 0.4)"
              strokeWidth={2}
            />
          </Svg>
        </View>

        {/* Kıble oku - Sabit, her zaman Kabe'yi gösterir */}
        <View style={[
          styles.kibleOkContainer,
          { transform: [{ rotate: `${kibleOkAcisi}deg` }] }
        ]}>
          <View style={[styles.kibleOk, hizalandi && styles.kibleOkHizali]}>
            <View style={styles.okUcu} />
          </View>
          <View style={styles.kabeIconContainer}>
            <Text style={styles.kabeIcon}>🕋</Text>
          </View>
        </View>

        {/* Merkez nokta */}
        <View style={styles.merkezNokta} />
      </View>

      {/* Bilgi kartı */}
      <View style={styles.bilgiContainer}>
        <View style={styles.yonKart}>
          <Text style={styles.yonLabel}>Kıble Yönü</Text>
          <Text style={styles.yonText}>{yonIsimleri[kibleYonu.yon]}</Text>
          <Text style={styles.aciText}>{Math.round(kibleYonu.aci)}° Kuzey'den</Text>
        </View>

        <View style={styles.durumKart}>
          <Text style={styles.durumLabel}>Cihaz Yönü</Text>
          <Text style={styles.durumDeger}>{Math.round(pusulaAcisi)}°</Text>
        </View>
      </View>

      {/* Talimatlar */}
      <View style={styles.talimatKart}>
        <Text style={styles.talimatText}>
          📱 Telefonunuzu yere paralel tutun{'\n'}
          🔄 8 şekli çizerek kalibre edin{'\n'}
          ✅ Kıble yönüne hizalandığınızda titreşim alırsınız
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 24,
    padding: 20,
    margin: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  baslik: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 16,
    fontFamily: TYPOGRAPHY.display,
  },
  hizalamaBildirim: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  hizalamaBildirimText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.display,
  },
  pusulaContainer: {
    width: PUSULA_BOYUT,
    height: PUSULA_BOYUT,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  parlamaHalkasi: {
    position: 'absolute',
    width: PUSULA_BOYUT + 40,
    height: PUSULA_BOYUT + 40,
    borderRadius: (PUSULA_BOYUT + 40) / 2,
    borderWidth: 4,
    borderColor: '#22c55e',
    backgroundColor: 'transparent',
  },
  pusulaWrapper: {
    width: PUSULA_BOYUT,
    height: PUSULA_BOYUT,
  },
  kibleOkContainer: {
    position: 'absolute',
    width: PUSULA_BOYUT,
    height: PUSULA_BOYUT,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  kibleOk: {
    width: 8,
    height: PUSULA_BOYUT / 2 - 60,
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 4,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: ISLAMI_RENKLER.altinAcik,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  kibleOkHizali: {
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
  },
  okUcu: {
    position: 'absolute',
    top: -15,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: ISLAMI_RENKLER.altinAcik,
  },
  kabeIconContainer: {
    position: 'absolute',
    top: 0,
  },
  kabeIcon: {
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  merkezNokta: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: ISLAMI_RENKLER.altinAcik,
    borderWidth: 3,
    borderColor: ISLAMI_RENKLER.arkaPlanYesil,
    shadowColor: ISLAMI_RENKLER.altinAcik,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  bilgiContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    width: '100%',
  },
  yonKart: {
    flex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
  },
  yonLabel: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.body,
  },
  yonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
  },
  aciText: {
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 4,
    fontFamily: TYPOGRAPHY.body,
  },
  durumKart: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  durumLabel: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.body,
  },
  durumDeger: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
  },
  talimatKart: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  talimatText: {
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  yukleniyorText: {
    marginTop: 12,
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
  },
  hataText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.kirmiziYumusak,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.body,
  },
});
