import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';

const { width, height } = Dimensions.get('window');

interface SplashWelcomeScreenProps {
  onContinue: () => void;
}

/**
 * Modern karşılama ekranı - Hoşgeldiniz ve Besmele
 * Gold yazılar ve İslami dekoratif unsurlar
 */
export default function SplashWelcomeScreen({ onContinue }: SplashWelcomeScreenProps) {
  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const besmeleFade = useRef(new Animated.Value(0)).current;
  const besmeleSlide = useRef(new Animated.Value(20)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(30)).current;
  const decorFade = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sıralı animasyonlar
    Animated.sequence([
      // Dekoratif elementler
      Animated.timing(decorFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Ana başlık animasyonu
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Besmele animasyonu
      Animated.parallel([
        Animated.timing(besmeleFade, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(besmeleSlide, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Buton animasyonu
      Animated.parallel([
        Animated.timing(buttonFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Pulse animasyonu (sürekli)
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Arka plan dekoratif elementler */}
      <View style={styles.backgroundDecor}>
        <Animated.View style={[styles.decorCircle1, { opacity: decorFade }]} />
        <Animated.View style={[styles.decorCircle2, { opacity: decorFade }]} />
        <Animated.View style={[styles.decorCircle3, { opacity: decorFade }]} />

        {/* Geometrik İslami desen */}
        <Animated.View style={[styles.geometricPattern, { opacity: decorFade }]}>
          <View style={styles.patternLine1} />
          <View style={styles.patternLine2} />
          <View style={styles.patternLine3} />
          <View style={styles.patternLine4} />
        </Animated.View>
      </View>

      <View style={styles.content}>
        {/* Üst dekoratif çizgi */}
        <Animated.View style={[styles.topDecorLine, { opacity: decorFade }]} />

        {/* Besmele - Arapça */}
        <Animated.View
          style={[
            styles.besmeleContainer,
            {
              opacity: besmeleFade,
              transform: [
                { translateY: besmeleSlide },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <View style={styles.besmeleDecorLeft} />
          <Text style={styles.besmeleText}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Text>
          <View style={styles.besmeleDecorRight} />
        </Animated.View>

        {/* Hoşgeldiniz Başlık */}
        <Animated.View
          style={[
            styles.welcomeContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* İkon container with glow effect */}
          <View style={styles.iconGlowContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.mainIcon}>📿</Text>
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Hoşgeldiniz</Text>
          <View style={styles.titleUnderline} />

          <Text style={styles.appName}>Şükür365</Text>
          <Text style={styles.appSubtitle}>Günlük Manevi Takip</Text>

          {/* Dekoratif ayraç */}
          <View style={styles.decorativeDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerIcon}>☪</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.welcomeDescription}>
            Bereketli bir Ramazan için{'\n'}
            yanınızdayız
          </Text>
        </Animated.View>

        {/* Devam Et Butonu */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonFade,
              transform: [{ translateY: buttonSlide }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onContinue}
            activeOpacity={0.85}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.continueButtonText}>Başlayalım</Text>
              <Text style={styles.buttonArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Alt dekoratif çizgi */}
        <Animated.View style={[styles.bottomDecorLine, { opacity: decorFade }]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(218, 165, 32, 0.05)',
    top: -100,
    right: -100,
  },
  decorCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(218, 165, 32, 0.03)',
    bottom: 100,
    left: -80,
  },
  decorCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 215, 0, 0.04)',
    bottom: -50,
    right: 50,
  },
  geometricPattern: {
    position: 'absolute',
    top: height * 0.15,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  patternLine1: {
    position: 'absolute',
    width: width * 0.8,
    height: 1,
    backgroundColor: 'rgba(218, 165, 32, 0.1)',
    transform: [{ rotate: '45deg' }],
  },
  patternLine2: {
    position: 'absolute',
    width: width * 0.8,
    height: 1,
    backgroundColor: 'rgba(218, 165, 32, 0.1)',
    transform: [{ rotate: '-45deg' }],
  },
  patternLine3: {
    position: 'absolute',
    width: width * 0.6,
    height: 1,
    backgroundColor: 'rgba(218, 165, 32, 0.08)',
    top: 50,
    transform: [{ rotate: '45deg' }],
  },
  patternLine4: {
    position: 'absolute',
    width: width * 0.6,
    height: 1,
    backgroundColor: 'rgba(218, 165, 32, 0.08)',
    top: 50,
    transform: [{ rotate: '-45deg' }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topDecorLine: {
    position: 'absolute',
    top: 40,
    width: 80,
    height: 3,
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 2,
    opacity: 0.6,
  },
  besmeleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  besmeleDecorLeft: {
    width: 30,
    height: 2,
    backgroundColor: ISLAMI_RENKLER.altinAcik,
    marginRight: 15,
    borderRadius: 1,
  },
  besmeleDecorRight: {
    width: 30,
    height: 2,
    backgroundColor: ISLAMI_RENKLER.altinAcik,
    marginLeft: 15,
    borderRadius: 1,
  },
  besmeleText: {
    fontSize: 28,
    fontWeight: '500',
    color: ISLAMI_RENKLER.altinAcik,
    textAlign: 'center',
    lineHeight: 50,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  iconGlowContainer: {
    marginBottom: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(218, 165, 32, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(218, 165, 32, 0.3)',
    shadowColor: ISLAMI_RENKLER.altinAcik,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  mainIcon: {
    fontSize: 48,
  },
  welcomeTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: ISLAMI_RENKLER.altinAcik,
    letterSpacing: 2,
    marginBottom: 10,
    textShadowColor: 'rgba(255, 215, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  titleUnderline: {
    width: 100,
    height: 3,
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 2,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyaz,
    letterSpacing: 1,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: ISLAMI_RENKLER.altinOrta,
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  decorativeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(218, 165, 32, 0.5)',
  },
  dividerIcon: {
    fontSize: 18,
    color: ISLAMI_RENKLER.altinOrta,
    marginHorizontal: 12,
  },
  welcomeDescription: {
    fontSize: 17,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  continueButton: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: ISLAMI_RENKLER.altinOrta,
    overflow: 'hidden',
    shadowColor: ISLAMI_RENKLER.altinAcik,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(218, 165, 32, 0.15)',
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: ISLAMI_RENKLER.altinAcik,
    letterSpacing: 1,
    marginRight: 10,
  },
  buttonArrow: {
    fontSize: 22,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '400',
  },
  bottomDecorLine: {
    position: 'absolute',
    bottom: 40,
    width: 60,
    height: 3,
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 2,
    opacity: 0.4,
  },
});
