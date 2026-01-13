import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { getSukurAyetiByGun } from '../constants/sukurAyetleri';

interface OrucTamamlamaModalProps {
  visible: boolean;
  gunNumarasi: number;
  onClose: () => void;
}

/**
 * Oruç tamamlandığında gösterilen kutlama modalı
 * Şükür ayeti ve tebrik mesajı içerir
 */
export const OrucTamamlamaModal: React.FC<OrucTamamlamaModalProps> = ({
  visible,
  gunNumarasi,
  onClose,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Modal açılırken animasyon
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Modal kapanırken animasyon
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  const ayet = getSukurAyetiByGun(gunNumarasi);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              {/* Kutlama Emoji */}
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>🎉</Text>
              </View>

              {/* Başlık */}
              <View style={styles.baslikContainer}>
                <Text style={styles.baslik}>✨ Oruç Tamamlandı!</Text>
              </View>

              {/* Allah kabul etsin mesajı */}
              <View style={styles.mesajContainer}>
                <Text style={styles.mesaj}>Allah kabul etsin!</Text>
              </View>

              {/* Sure Bilgisi */}
              <View style={styles.sureBilgisi}>
                <Text style={styles.sureBaslik}>{ayet.sure} Suresi</Text>
                <Text style={styles.ayetNumarasi}>{ayet.ayetNumarasi}. Ayet</Text>
              </View>

              {/* Arapça Ayet */}
              <ScrollView
                style={styles.arapcaScrollContainer}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.arapcaMetin}>{ayet.arapca}</Text>
              </ScrollView>

              {/* Türkçe Meal */}
              <View style={styles.mealContainer}>
                <Text style={styles.mealBaslik}>TÜRKÇE MEALI:</Text>
                <Text style={styles.mealMetin}>{ayet.turkceMeal}</Text>
              </View>

              {/* Kapat Butonu */}
              <TouchableOpacity
                style={styles.kapatButon}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.kapatButonText}>Kapat</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 450,
    maxHeight: height * 0.85,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 64,
  },
  baslikContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  baslik: {
    fontSize: 26,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  mesajContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mesaj: {
    fontSize: 22,
    fontWeight: '700',
    color: ISLAMI_RENKLER.altinAcik,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  sureBilgisi: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  sureBaslik: {
    fontSize: 20,
    fontWeight: '800',
    color: ISLAMI_RENKLER.altinAcik,
    marginBottom: 4,
    textAlign: 'center',
  },
  ayetNumarasi: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontWeight: '600',
    textAlign: 'center',
  },
  arapcaScrollContainer: {
    maxHeight: 180,
    marginBottom: 20,
  },
  arapcaMetin: {
    fontSize: 24,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'right',
    lineHeight: 40,
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  mealContainer: {
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  mealBaslik: {
    fontSize: 13,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 1,
  },
  mealMetin: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
    lineHeight: 26,
    fontWeight: '500',
    textAlign: 'left',
  },
  kapatButon: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  kapatButonText: {
    fontSize: 17,
    fontWeight: '700',
    color: ISLAMI_RENKLER.arkaPlanYesil,
    letterSpacing: 0.5,
  },
});
