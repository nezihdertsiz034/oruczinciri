import React, { useState, useEffect, useRef } from 'react';
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
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { SEHIRLER } from '../constants/sehirler';
import { Sehir, KullaniciProfili } from '../types';
import { kaydetSehir, yukleUygulamaAyarlari, kaydetUygulamaAyarlari } from '../utils/storage';

const { width } = Dimensions.get('window');

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [isim, setIsim] = useState('');
  const [cinsiyet, setCinsiyet] = useState<'erkek' | 'kadin' | 'belirtilmemis'>('belirtilmemis');
  const [aramaMetni, setAramaMetni] = useState('');
  const [filtrelenmisSehirler, setFiltrelenmisSehirler] = useState<Sehir[]>(SEHIRLER);
  const [seciliSehir, setSeciliSehir] = useState<Sehir | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const stepSlideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    ]).start();
  }, []);

  useEffect(() => {
    if (aramaMetni.trim() === '') {
      setFiltrelenmisSehirler(SEHIRLER);
    } else {
      const filtrelenmis = SEHIRLER.filter(sehir =>
        sehir.isim.toLowerCase().includes(aramaMetni.toLowerCase())
      );
      setFiltrelenmisSehirler(filtrelenmis);
    }
  }, [aramaMetni]);

  const handleNextStep = () => {
    if (isim.trim() === '' || cinsiyet === 'belirtilmemis') return;

    Animated.timing(stepSlideAnim, {
      toValue: -width,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleSehirSec = async (sehir: Sehir) => {
    try {
      setYukleniyor(true);
      setSeciliSehir(sehir);

      // Profili oluştur
      const profil: KullaniciProfili = {
        isim: isim.trim(),
        cinsiyet: cinsiyet,
        unvan: cinsiyet === 'erkek' ? 'Bey' : 'Hanım',
      };

      // Ayarları güncelle ve kaydet
      const ayarlar = await yukleUygulamaAyarlari();
      await kaydetUygulamaAyarlari({
        ...ayarlar,
        kullaniciProfil: profil,
      });

      // Şehri kaydet
      await kaydetSehir(sehir);

      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (error) {
      console.error('Veriler kaydedilirken hata:', error);
      setYukleniyor(false);
    }
  };

  const renderSehirItem = ({ item }: { item: Sehir }) => {
    const seciliMi = seciliSehir?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.sehirItem, seciliMi && styles.sehirItemSecili]}
        onPress={() => handleSehirSec(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.sehirItemText, seciliMi && styles.sehirItemTextSecili]}>
          {item.isim}
        </Text>
        {seciliMi && <Text style={styles.seciliIcon}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          <Animated.View style={[styles.stepsWrapper, { transform: [{ translateX: stepSlideAnim }] }]}>

            {/* STEP 1: İSİM & CİNSİYET */}
            <View style={styles.stepContainer}>
              <View style={styles.baslikContainer}>
                <Text style={styles.emoji}>✨</Text>
                <Text style={styles.baslik}>Hoş Geldiniz</Text>
                <Text style={styles.aciklama}>Size nasıl hitap etmemizi istersiniz?</Text>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>İsminiz</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Adınızı girin..."
                    placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
                    value={isim}
                    onChangeText={setIsim}
                    autoFocus={true}
                  />
                </View>

                <Text style={[styles.inputLabel, { marginTop: 24 }]}>Cinsiyetiniz</Text>
                <View style={styles.cinsiyetContainer}>
                  <TouchableOpacity
                    style={[styles.cinsiyetButton, cinsiyet === 'erkek' && styles.cinsiyetButtonSelected]}
                    onPress={() => setCinsiyet('erkek')}
                  >
                    <Text style={styles.cinsiyetEmoji}>👨</Text>
                    <Text style={[styles.cinsiyetText, cinsiyet === 'erkek' && styles.cinsiyetTextSelected]}>Bey</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.cinsiyetButton, cinsiyet === 'kadin' && styles.cinsiyetButtonSelected]}
                    onPress={() => setCinsiyet('kadin')}
                  >
                    <Text style={styles.cinsiyetEmoji}>👩</Text>
                    <Text style={[styles.cinsiyetText, cinsiyet === 'kadin' && styles.cinsiyetTextSelected]}>Hanım</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.devamButton, (isim.trim() === '' || cinsiyet === 'belirtilmemis') && styles.devamButtonDisabled]}
                onPress={handleNextStep}
                disabled={isim.trim() === '' || cinsiyet === 'belirtilmemis'}
              >
                <Text style={styles.devamButtonText}>Devam Et</Text>
              </TouchableOpacity>
            </View>

            {/* STEP 2: ŞEHİR SEÇİMİ */}
            <View style={styles.stepContainer}>
              <View style={styles.baslikContainer}>
                <Text style={styles.emoji}>📍</Text>
                <Text style={styles.baslik}>{isim} {cinsiyet === 'erkek' ? 'Bey' : 'Hanım'}</Text>
                <Text style={styles.aciklama}>Namaz vakitleri için şehrinizi seçin</Text>
              </View>

              <View style={styles.sehirContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔍</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Şehir ara..."
                    placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
                    value={aramaMetni}
                    onChangeText={setAramaMetni}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.listeContainer}>
                  <FlatList
                    data={filtrelenmisSehirler}
                    renderItem={renderSehirItem}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                      <View style={styles.bosListeContainer}>
                        <Text style={styles.bosListeText}>Şehir bulunamadı</Text>
                      </View>
                    }
                  />
                </View>
              </View>
            </View>

          </Animated.View>

          {/* Yükleniyor */}
          {yukleniyor && (
            <View style={styles.yukleniyorContainer}>
              <Text style={styles.yukleniyorText}>Hazırlanıyor...</Text>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ISLAMI_RENKLER.arkaPlanYesil },
  keyboardView: { flex: 1 },
  content: { flex: 1, overflow: 'hidden' },
  stepsWrapper: { flexDirection: 'row', width: width * 2, flex: 1 },
  stepContainer: { width: width, flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  baslikContainer: { alignItems: 'center', marginBottom: 32 },
  emoji: { fontSize: 64, marginBottom: 16 },
  baslik: { fontSize: 32, fontWeight: '800', color: ISLAMI_RENKLER.yaziBeyaz, textAlign: 'center' },
  aciklama: { fontSize: 16, color: ISLAMI_RENKLER.yaziBeyazYumusak, textAlign: 'center', marginTop: 8 },
  inputSection: { flex: 1, justifyContent: 'center' },
  inputLabel: { fontSize: 14, fontWeight: '700', color: ISLAMI_RENKLER.altinAcik, marginBottom: 8, textTransform: 'uppercase' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  input: { flex: 1, fontSize: 18, color: ISLAMI_RENKLER.yaziBeyaz, fontWeight: '600' },
  inputIcon: { fontSize: 20, marginRight: 12 },
  cinsiyetContainer: { flexDirection: 'row', gap: 12 },
  cinsiyetButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cinsiyetButtonSelected: {
    backgroundColor: ISLAMI_RENKLER.altinOrta + '20',
    borderColor: ISLAMI_RENKLER.altinAcik,
  },
  cinsiyetEmoji: { fontSize: 32, marginBottom: 8 },
  cinsiyetText: { fontSize: 16, fontWeight: '700', color: ISLAMI_RENKLER.yaziBeyazYumusak },
  cinsiyetTextSelected: { color: ISLAMI_RENKLER.altinAcik },
  devamButton: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: ISLAMI_RENKLER.altinOrta,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  devamButtonDisabled: { opacity: 0.5 },
  devamButtonText: { color: ISLAMI_RENKLER.arkaPlanYesil, fontSize: 18, fontWeight: '800' },
  sehirContainer: { flex: 1 },
  listeContainer: { flex: 1, marginTop: 12, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 20, padding: 8 },
  sehirItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', justifyContent: 'space-between' },
  sehirItemSecili: { backgroundColor: ISLAMI_RENKLER.altinOrta + '20' },
  sehirItemText: { fontSize: 16, color: ISLAMI_RENKLER.yaziBeyaz, fontWeight: '600' },
  sehirItemTextSecili: { color: ISLAMI_RENKLER.altinAcik },
  seciliIcon: { color: ISLAMI_RENKLER.altinAcik, fontWeight: '800' },
  bosListeContainer: { padding: 40, alignItems: 'center' },
  bosListeText: { color: ISLAMI_RENKLER.yaziBeyazYumusak },
  yukleniyorContainer: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  yukleniyorText: { color: ISLAMI_RENKLER.altinAcik, fontWeight: '700' },
});
