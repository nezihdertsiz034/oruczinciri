import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { ProgressBar } from '../components/ProgressBar';
import {
  kaydetTesbihSayaci,
  sifirlaTesbihSayaci,
  yukleTesbihSayaci,
} from '../utils/storage';

const HIZLI_HEDEFLER = [33, 99, 100];

export default function TesbihScreen() {
  const [sayac, setSayac] = useState(0);
  const [hedef, setHedef] = useState(33);
  const [hedefInput, setHedefInput] = useState('33');
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    let aktif = true;

    const yukleVeri = async () => {
      const veri = await yukleTesbihSayaci();
      if (!aktif) return;
      setSayac(veri.sayac);
      setHedef(veri.hedef);
      setHedefInput(String(veri.hedef));
      setYukleniyor(false);
    };

    yukleVeri();

    return () => {
      aktif = false;
    };
  }, []);

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

  const handleArtir = () => {
    setSayac((onceki) => onceki + 1);
  };

  const handleAzalt = () => {
    setSayac((onceki) => Math.max(0, onceki - 1));
  };

  const handleSifirla = async () => {
    const sifirlanmis = await sifirlaTesbihSayaci();
    setSayac(sifirlanmis.sayac);
    setHedef(sifirlanmis.hedef);
    setHedefInput(String(sifirlanmis.hedef));
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

  const ilerlemeYuzde = hedef > 0 ? Math.min(100, (sayac / hedef) * 100) : 0;
  const kalan = Math.max(0, hedef - sayac);

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecor />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📿 Tesbih Sayacı</Text>

        <View style={styles.sayacKart}>
          <Text style={styles.sayacDeger}>{sayac}</Text>
          <Text style={styles.hedefText}>Hedef: {hedef}</Text>
          <ProgressBar yuzdelik={ilerlemeYuzde} yukseklik={12} gosterYuzde={false} />
          <View style={styles.kalanSatir}>
            <Text style={styles.kalanLabel}>Kalan</Text>
            <Text style={styles.kalanDeger}>{kalan}</Text>
          </View>
          {sayac >= hedef && (
            <Text style={styles.hedefTamamText}>Hedef tamamlandı! 🎉</Text>
          )}
        </View>

        <View style={styles.butonlarSatir}>
          <TouchableOpacity style={styles.kontrolButonu} onPress={handleAzalt}>
            <Text style={styles.kontrolButonuText}>-1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tiklaButonu} onPress={handleArtir} activeOpacity={0.85}>
            <Text style={styles.tiklaButonuText}>+1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.kontrolButonu} onPress={handleSifirla}>
            <Text style={styles.kontrolButonuText}>Sıfırla</Text>
          </TouchableOpacity>
        </View>

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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 0.4,
  },
  sayacKart: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sayacDeger: {
    fontSize: 56,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 1,
  },
  hedefText: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: TYPOGRAPHY.body,
  },
  kalanSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  kalanLabel: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
  },
  kalanDeger: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.display,
  },
  hedefTamamText: {
    marginTop: 12,
    textAlign: 'center',
    color: ISLAMI_RENKLER.yesilParlak,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.display,
  },
  butonlarSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  kontrolButonu: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  kontrolButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.display,
  },
  tiklaButonu: {
    flex: 1.3,
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tiklaButonuText: {
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
});
