import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Switch,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { ProgressBar } from '../components/ProgressBar';
import {
  kaydetTesbihSayaci,
  sifirlaTesbihSayaci,
  yukleTesbihSayaci,
  yukleTesbihKayitlari,
  kaydetTesbihKaydi,
  silTesbihKaydi,
} from '../utils/storage';
import { TesbihKaydi } from '../types';

const HIZLI_HEDEFLER = [33, 99, 100];
const { width: EKRAN_GENISLIK } = Dimensions.get('window');
const TESBIH_BOYUT = Math.min(EKRAN_GENISLIK * 0.85, 340);
const BONCUK_SAYISI = 33;

const ZIKIR_SECENEKLERI = [
  { id: 'subhanallah', adi: 'Sübhanallah', emoji: '📿' },
  { id: 'elhamdulillah', adi: 'Elhamdülillah', emoji: '🤲' },
  { id: 'allahuekber', adi: 'Allahuekber', emoji: '☪️' },
  { id: 'laIlaheIllallah', adi: 'Lâ ilâhe illallah', emoji: '🕌' },
  { id: 'estagfirullah', adi: 'Estağfirullah', emoji: '🙏' },
  { id: 'salavat', adi: 'Salavat', emoji: '💚' },
  { id: 'diger', adi: 'Diğer', emoji: '✨' },
];

// Tesbih boncuğu bileşeni
const TesbihBoncugu = ({
  index,
  aktif,
  gecmis,
  toplam,
  animasyonDeger
}: {
  index: number;
  aktif: boolean;
  gecmis: boolean;
  toplam: number;
  animasyonDeger: Animated.Value;
}) => {
  const aci = (index / toplam) * 2 * Math.PI - Math.PI / 2;
  const yaricap = TESBIH_BOYUT / 2 - 25;
  const x = Math.cos(aci) * yaricap;
  const y = Math.sin(aci) * yaricap;

  const olcek = animasyonDeger.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: aktif ? [1, 1.4, 1] : [1, 1, 1],
  });

  return (
    <Animated.View
      style={[
        styles.boncuk,
        {
          left: TESBIH_BOYUT / 2 + x - 12,
          top: TESBIH_BOYUT / 2 + y - 12,
          backgroundColor: gecmis
            ? ISLAMI_RENKLER.altinOrta
            : aktif
              ? ISLAMI_RENKLER.altinAcik
              : 'rgba(255, 255, 255, 0.2)',
          transform: [{ scale: olcek }],
          shadowOpacity: aktif ? 0.6 : 0.2,
        },
      ]}
    />
  );
};

export default function TesbihScreen() {
  const [sayac, setSayac] = useState(0);
  const [hedef, setHedef] = useState(33);
  const [hedefInput, setHedefInput] = useState('33');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [seciliZikir, setSeciliZikir] = useState(ZIKIR_SECENEKLERI[0]);
  const [kayitlar, setKayitlar] = useState<TesbihKaydi[]>([]);
  const [kayitlarGoster, setKayitlarGoster] = useState(false);

  // Ayarlar
  const [titresimAktif, setTitresimAktif] = useState(true);
  const [sesAktif, setSesAktif] = useState(true);
  const [ayarlarGoster, setAyarlarGoster] = useState(false);

  // Animasyon
  const animasyonDeger = useRef(new Animated.Value(0)).current;
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let aktif = true;

    const yukleVeri = async () => {
      const veri = await yukleTesbihSayaci();
      const kayitlarVeri = await yukleTesbihKayitlari();
      if (!aktif) return;
      setSayac(veri.sayac);
      setHedef(veri.hedef);
      setHedefInput(String(veri.hedef));
      setKayitlar(kayitlarVeri);
      setYukleniyor(false);
    };

    yukleVeri();
    sesiYukle();

    return () => {
      aktif = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const sesiYukle = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/ney.mp3'),
        { volume: 0.3 }
      );
      soundRef.current = sound;
    } catch (error) {
      console.log('Ses yüklenirken hata:', error);
    }
  };

  const sesCal = async () => {
    if (sesAktif && soundRef.current) {
      try {
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
        // Kısa süre sonra durdur (tık sesi için)
        setTimeout(async () => {
          if (soundRef.current) {
            await soundRef.current.stopAsync();
          }
        }, 150);
      } catch (error) {
        // Ignore
      }
    }
  };

  useEffect(() => {
    if (yukleniyor) return;
    kaydetTesbihSayaci({
      sayac,
      hedef,
      guncellemeTarihi: Date.now(),
    }).catch((error) => {
      console.error('Tesbih sayacı kaydedilirken hata:', error);
    });
  }, [sayac, hedef, yukleniyor]);

  const handleArtir = async () => {
    // Titreşim
    if (titresimAktif) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Ses
    sesCal();

    // Animasyon
    animasyonDeger.setValue(0);
    Animated.timing(animasyonDeger, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    setSayac((onceki) => onceki + 1);
  };

  const handleAzalt = () => {
    if (titresimAktif) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSayac((onceki) => Math.max(0, onceki - 1));
  };

  const handleKaydetVeSifirla = async () => {
    if (sayac === 0) {
      Alert.alert('Uyarı', 'Kaydetmek için en az 1 kez tesbih çekmelisiniz.');
      return;
    }

    const yeniKayit: TesbihKaydi = {
      id: Date.now().toString(),
      zikirAdi: seciliZikir.adi,
      adet: sayac,
      tarih: Date.now(),
    };

    try {
      await kaydetTesbihKaydi(yeniKayit);
      const guncelKayitlar = await yukleTesbihKayitlari();
      setKayitlar(guncelKayitlar);

      const sifirlanmis = await sifirlaTesbihSayaci();
      setSayac(sifirlanmis.sayac);
      setHedef(sifirlanmis.hedef);
      setHedefInput(String(sifirlanmis.hedef));

      if (titresimAktif) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert(
        '✅ Kaydedildi',
        `${sayac} adet ${seciliZikir.adi} çekildi ve kaydedildi.`
      );
    } catch (error) {
      Alert.alert('Hata', 'Kayıt yapılırken bir hata oluştu.');
    }
  };

  const handleSifirla = async () => {
    Alert.alert(
      'Sıfırla',
      'Sayacı sıfırlamak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            const sifirlanmis = await sifirlaTesbihSayaci();
            setSayac(sifirlanmis.sayac);
            setHedef(sifirlanmis.hedef);
            setHedefInput(String(sifirlanmis.hedef));
            if (titresimAktif) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          },
        },
      ]
    );
  };

  const handleKayitSil = async (kayitId: string) => {
    Alert.alert(
      'Kaydı Sil',
      'Bu kaydı silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await silTesbihKaydi(kayitId);
            const guncelKayitlar = await yukleTesbihKayitlari();
            setKayitlar(guncelKayitlar);
          },
        },
      ]
    );
  };

  const handleHedefAyarla = (deger: number) => {
    if (!Number.isFinite(deger) || deger < 1 || deger > 10000) {
      Alert.alert('Hata', 'Hedef 1 ile 10.000 arasında olmalıdır.');
      return;
    }
    setHedef(deger);
    setHedefInput(String(deger));
  };

  const handleHedefKaydet = () => {
    const sayi = parseInt(hedefInput, 10);
    if (Number.isNaN(sayi)) {
      Alert.alert('Hata', 'Geçerli bir hedef girin.');
      return;
    }
    handleHedefAyarla(sayi);
  };

  const formatTarih = (timestamp: number) => {
    const tarih = new Date(timestamp);
    const gun = tarih.getDate().toString().padStart(2, '0');
    const ay = (tarih.getMonth() + 1).toString().padStart(2, '0');
    const yil = tarih.getFullYear();
    const saat = tarih.getHours().toString().padStart(2, '0');
    const dakika = tarih.getMinutes().toString().padStart(2, '0');
    return `${gun}.${ay}.${yil} ${saat}:${dakika}`;
  };

  const ilerlemeYuzde = hedef > 0 ? Math.min(100, (sayac / hedef) * 100) : 0;
  const kalan = Math.max(0, hedef - sayac);
  const boncukSayisi = Math.min(hedef, BONCUK_SAYISI);
  const aktifBoncuk = sayac % boncukSayisi;

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecor />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📿 Tesbih Sayacı</Text>

        {/* Zikir Seçimi */}
        <View style={styles.zikirSecimKart}>
          <Text style={styles.bolumBaslik}>🕌 Zikir Seçin</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.zikirScrollContainer}
          >
            {ZIKIR_SECENEKLERI.map((zikir) => (
              <TouchableOpacity
                key={zikir.id}
                style={[
                  styles.zikirChip,
                  seciliZikir.id === zikir.id && styles.zikirChipAktif,
                ]}
                onPress={() => setSeciliZikir(zikir)}
              >
                <Text style={styles.zikirEmoji}>{zikir.emoji}</Text>
                <Text style={[
                  styles.zikirChipText,
                  seciliZikir.id === zikir.id && styles.zikirChipTextAktif,
                ]}>
                  {zikir.adi}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Görsel Tesbih */}
        <TouchableOpacity
          style={styles.tesbihContainer}
          onPress={handleArtir}
          activeOpacity={0.9}
        >
          <View style={styles.tesbihDaire}>
            {/* Boncuklar */}
            {Array.from({ length: boncukSayisi }).map((_, index) => (
              <TesbihBoncugu
                key={index}
                index={index}
                aktif={index === aktifBoncuk}
                gecmis={index < aktifBoncuk || (sayac >= boncukSayisi && sayac % boncukSayisi > index)}
                toplam={boncukSayisi}
                animasyonDeger={animasyonDeger}
              />
            ))}

            {/* Merkez Sayaç */}
            <View style={styles.merkezContainer}>
              <Text style={styles.seciliZikirText}>{seciliZikir.emoji}</Text>
              <Text style={styles.sayacDeger}>{sayac}</Text>
              <Text style={styles.hedefText}>/ {hedef}</Text>
              <Text style={styles.turText}>
                {Math.floor(sayac / boncukSayisi)}. tur
              </Text>
            </View>
          </View>

          <Text style={styles.dokunText}>Çekmek için dokun</Text>
        </TouchableOpacity>

        {/* İlerleme */}
        <View style={styles.ilerlemeBilgi}>
          <ProgressBar yuzdelik={ilerlemeYuzde} yukseklik={10} gosterYuzde={false} />
          <View style={styles.kalanSatir}>
            <Text style={styles.kalanLabel}>Kalan: {kalan}</Text>
            {sayac >= hedef && (
              <Text style={styles.hedefTamamText}>🎉 Hedef tamam!</Text>
            )}
          </View>
        </View>

        {/* Kontrol Butonları */}
        <View style={styles.butonlarSatir}>
          <TouchableOpacity style={styles.kontrolButonu} onPress={handleAzalt}>
            <Text style={styles.kontrolButonuText}>-1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sifirlaButonu} onPress={handleSifirla}>
            <Text style={styles.kontrolButonuText}>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ayarlarButonu}
            onPress={() => setAyarlarGoster(!ayarlarGoster)}
          >
            <Text style={styles.kontrolButonuText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Ayarlar Paneli */}
        {ayarlarGoster && (
          <View style={styles.ayarlarKart}>
            <Text style={styles.bolumBaslik}>⚙️ Ayarlar</Text>

            <View style={styles.ayarSatir}>
              <Text style={styles.ayarLabel}>📳 Titreşim</Text>
              <Switch
                value={titresimAktif}
                onValueChange={setTitresimAktif}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: ISLAMI_RENKLER.altinOrta }}
                thumbColor={titresimAktif ? ISLAMI_RENKLER.altinAcik : '#f4f3f4'}
              />
            </View>

            <View style={styles.ayarSatir}>
              <Text style={styles.ayarLabel}>🔊 Ses</Text>
              <Switch
                value={sesAktif}
                onValueChange={setSesAktif}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: ISLAMI_RENKLER.altinOrta }}
                thumbColor={sesAktif ? ISLAMI_RENKLER.altinAcik : '#f4f3f4'}
              />
            </View>
          </View>
        )}

        {/* Kaydet Butonu */}
        <TouchableOpacity
          style={styles.kaydetButonu}
          onPress={handleKaydetVeSifirla}
          activeOpacity={0.85}
        >
          <Text style={styles.kaydetButonuText}>💾 Kaydet & Sıfırla</Text>
        </TouchableOpacity>

        {/* Hedef Ayarları */}
        <View style={styles.hedefKart}>
          <Text style={styles.bolumBaslik}>🎯 Hızlı Hedefler</Text>
          <View style={styles.hedefChipSatir}>
            {HIZLI_HEDEFLER.map((deger) => (
              <TouchableOpacity
                key={deger}
                style={[styles.hedefChip, hedef === deger && styles.hedefChipAktif]}
                onPress={() => handleHedefAyarla(deger)}
              >
                <Text style={styles.hedefChipText}>{deger}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.bolumBaslik}>✍️ Özel Hedef</Text>
          <View style={styles.hedefInputSatir}>
            <TextInput
              style={styles.hedefInput}
              placeholder="Örn: 250"
              placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
              value={hedefInput}
              onChangeText={setHedefInput}
              keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.hedefKaydetButonu} onPress={handleHedefKaydet}>
              <Text style={styles.hedefKaydetButonuText}>Ayarla</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Geçmiş Kayıtlar */}
        <View style={styles.kayitlarKart}>
          <TouchableOpacity
            style={styles.kayitlarBaslik}
            onPress={() => setKayitlarGoster(!kayitlarGoster)}
          >
            <Text style={styles.bolumBaslik}>📜 Geçmiş ({kayitlar.length})</Text>
            <Text style={styles.acKapaIcon}>{kayitlarGoster ? '▼' : '▶'}</Text>
          </TouchableOpacity>

          {kayitlarGoster && (
            <View style={styles.kayitlarListe}>
              {kayitlar.length === 0 ? (
                <Text style={styles.bosKayitText}>Henüz kayıt yok.</Text>
              ) : (
                kayitlar.slice(0, 10).map((kayit) => (
                  <View key={kayit.id} style={styles.kayitItem}>
                    <View style={styles.kayitIcerik}>
                      <Text style={styles.kayitZikir}>{kayit.zikirAdi}</Text>
                      <Text style={styles.kayitTarih}>{formatTarih(kayit.tarih)}</Text>
                    </View>
                    <View style={styles.kayitSagTaraf}>
                      <View style={styles.kayitAdetContainer}>
                        <Text style={styles.kayitAdet}>{kayit.adet}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.silButonu}
                        onPress={() => handleKayitSil(kayit.id)}
                      >
                        <Text style={styles.silButonuText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.display,
  },
  zikirSecimKart: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  zikirScrollContainer: {
    gap: 10,
    paddingVertical: 4,
  },
  zikirChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 6,
  },
  zikirChipAktif: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderColor: ISLAMI_RENKLER.altinAcik,
  },
  zikirEmoji: {
    fontSize: 16,
  },
  zikirChipText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 13,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.body,
  },
  zikirChipTextAktif: {
    fontWeight: '700',
  },
  tesbihContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tesbihDaire: {
    width: TESBIH_BOYUT,
    height: TESBIH_BOYUT,
    borderRadius: TESBIH_BOYUT / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 3,
    borderColor: ISLAMI_RENKLER.altinOrta,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ISLAMI_RENKLER.altinOrta,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  boncuk: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  merkezContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: TESBIH_BOYUT * 0.55,
    height: TESBIH_BOYUT * 0.55,
    borderRadius: TESBIH_BOYUT * 0.275,
    borderWidth: 2,
    borderColor: ISLAMI_RENKLER.altinOrta,
  },
  seciliZikirText: {
    fontSize: 28,
    marginBottom: 4,
  },
  sayacDeger: {
    fontSize: 52,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 1,
  },
  hedefText: {
    fontSize: 18,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
  },
  turText: {
    fontSize: 12,
    color: ISLAMI_RENKLER.altinOrta,
    marginTop: 4,
    fontFamily: TYPOGRAPHY.body,
  },
  dokunText: {
    marginTop: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.body,
  },
  ilerlemeBilgi: {
    width: '100%',
    marginBottom: 20,
  },
  kalanSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  kalanLabel: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
  },
  hedefTamamText: {
    color: ISLAMI_RENKLER.yesilParlak,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.display,
  },
  butonlarSatir: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
    width: '100%',
  },
  kontrolButonu: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sifirlaButonu: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 100, 100, 0.2)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 100, 100, 0.3)',
  },
  ayarlarButonu: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  kontrolButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.display,
  },
  ayarlarKart: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ayarSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ayarLabel: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.body,
  },
  kaydetButonu: {
    backgroundColor: ISLAMI_RENKLER.yesilParlak,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: ISLAMI_RENKLER.yesilParlak,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
  },
  kaydetButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.display,
  },
  hedefKart: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
    width: '100%',
  },
  bolumBaslik: {
    fontSize: 16,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 12,
    fontFamily: TYPOGRAPHY.display,
  },
  hedefChipSatir: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  hedefChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  hedefChipAktif: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
  },
  hedefChipText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.display,
  },
  hedefInputSatir: {
    flexDirection: 'row',
    gap: 12,
  },
  hedefInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    color: ISLAMI_RENKLER.yaziBeyaz,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    fontFamily: TYPOGRAPHY.body,
  },
  hedefKaydetButonu: {
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: ISLAMI_RENKLER.altinOrta,
  },
  hedefKaydetButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.display,
  },
  kayitlarKart: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  kayitlarBaslik: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  acKapaIcon: {
    fontSize: 14,
    color: ISLAMI_RENKLER.altinAcik,
  },
  kayitlarListe: {
    marginTop: 12,
  },
  bosKayitText: {
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
    fontFamily: TYPOGRAPHY.body,
  },
  kayitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  kayitIcerik: {
    flex: 1,
  },
  kayitZikir: {
    fontSize: 15,
    fontWeight: '600',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
  },
  kayitTarih: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 4,
    fontFamily: TYPOGRAPHY.body,
  },
  kayitSagTaraf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  kayitAdetContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  kayitAdet: {
    fontSize: 18,
    fontWeight: '700',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
  },
  silButonu: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 100, 100, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  silButonuText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '600',
  },
});
