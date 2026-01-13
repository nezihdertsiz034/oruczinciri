import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { SEHIRLER } from '../constants/sehirler';
import { Sehir } from '../types';
import { kaydetSehir } from '../utils/storage';

interface WelcomeScreenProps {
  onComplete: () => void;
}

/**
 * Modern giriş ekranı - Şehir seçimi
 */
export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [aramaMetni, setAramaMetni] = useState('');
  const [filtrelenmisSehirler, setFiltrelenmisSehirler] = useState<Sehir[]>(SEHIRLER);
  const [seciliSehir, setSeciliSehir] = useState<Sehir | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  // Animasyon değerleri
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Giriş animasyonu
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
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Şehir arama filtresi
    if (aramaMetni.trim() === '') {
      setFiltrelenmisSehirler(SEHIRLER);
    } else {
      const filtrelenmis = SEHIRLER.filter(sehir =>
        sehir.isim.toLowerCase().includes(aramaMetni.toLowerCase())
      );
      setFiltrelenmisSehirler(filtrelenmis);
    }
  }, [aramaMetni]);

  const handleSehirSec = async (sehir: Sehir) => {
    try {
      setYukleniyor(true);
      setSeciliSehir(sehir);

      // Şehri kaydet
      await kaydetSehir(sehir);

      // Kısa bir gecikme sonrası ana ekrana geç
      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (error) {
      console.error('Şehir kaydedilirken hata:', error);
      setYukleniyor(false);
    }
  };

  const renderSehirItem = ({ item }: { item: Sehir }) => {
    const seciliMi = seciliSehir?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.sehirItem,
          seciliMi && styles.sehirItemSecili,
        ]}
        onPress={() => handleSehirSec(item)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.sehirItemText,
            seciliMi && styles.sehirItemTextSecili,
          ]}
        >
          {item.isim}
        </Text>
        {seciliMi && (
          <Text style={styles.seciliIcon}>✓</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Başlık Bölümü */}
          <View style={styles.baslikContainer}>
            <Text style={styles.emoji}>📿</Text>
            <Text style={styles.baslik}>Şükür365</Text>
            <Text style={styles.altBaslik}>Günlük Manevi Takip</Text>
            <View style={styles.ayrac} />
            <Text style={styles.aciklama}>
              Namaz vakitlerinizi doğru alabilmek için{'\n'}
              şehrinizi seçin
            </Text>
          </View>

          {/* Şehir Seçim Bölümü */}
          <View style={styles.sehirContainer}>
            <View style={styles.aramaContainer}>
              <Text style={styles.aramaLabel}>Şehir Seçin</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔍</Text>
                <TextInput
                  style={styles.aramaInput}
                  placeholder="Şehir ara..."
                  placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
                  value={aramaMetni}
                  onChangeText={setAramaMetni}
                  autoCapitalize="words"
                />
                {aramaMetni.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setAramaMetni('')}
                    style={styles.temizleButton}
                  >
                    <Text style={styles.temizleIcon}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Şehir Listesi */}
            <View style={styles.listeContainer}>
              <FlatList
                data={filtrelenmisSehirler}
                renderItem={renderSehirItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.bosListeContainer}>
                    <Text style={styles.bosListeText}>
                      Aradığınız şehir bulunamadı
                    </Text>
                  </View>
                }
                initialNumToRender={20}
                maxToRenderPerBatch={10}
                windowSize={10}
              />
            </View>
          </View>

          {/* Yükleniyor Göstergesi */}
          {yukleniyor && (
            <View style={styles.yukleniyorContainer}>
              <Text style={styles.yukleniyorText}>
                {seciliSehir?.isim} seçiliyor...
              </Text>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  baslikContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  baslik: {
    fontSize: 32,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    letterSpacing: 1,
    marginBottom: 8,
  },
  altBaslik: {
    fontSize: 18,
    fontWeight: '600',
    color: ISLAMI_RENKLER.altinAcik,
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  ayrac: {
    width: 60,
    height: 3,
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 2,
    marginBottom: 24,
  },
  aciklama: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    lineHeight: 24,
  },
  sehirContainer: {
    flex: 1,
  },
  aramaContainer: {
    marginBottom: 20,
  },
  aramaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: ISLAMI_RENKLER.glassBorder,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: ISLAMI_RENKLER.glassShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  aramaInput: {
    flex: 1,
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '500',
  },
  temizleButton: {
    padding: 4,
  },
  temizleIcon: {
    fontSize: 18,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontWeight: '600',
  },
  listeContainer: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: ISLAMI_RENKLER.glassBorder,
    padding: 12,
    shadowColor: ISLAMI_RENKLER.glassShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  sehirItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sehirItemSecili: {
    backgroundColor: ISLAMI_RENKLER.altinOrta + '40',
    borderColor: ISLAMI_RENKLER.altinAcik,
    borderWidth: 2,
  },
  sehirItemText: {
    fontSize: 17,
    fontWeight: '600',
    color: ISLAMI_RENKLER.yaziBeyaz,
    letterSpacing: 0.3,
  },
  sehirItemTextSecili: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '700',
  },
  seciliIcon: {
    fontSize: 20,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '800',
  },
  bosListeContainer: {
    padding: 40,
    alignItems: 'center',
  },
  bosListeText: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
  },
  yukleniyorContainer: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  yukleniyorText: {
    fontSize: 16,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '600',
  },
});

