import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
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
  yukleTesbihKayitlari,
  kaydetTesbihKaydi,
  silTesbihKaydi,
} from '../utils/storage';
import { TesbihKaydi } from '../types';

const HIZLI_HEDEFLER = [33, 99, 100];

const ZIKIR_SECENEKLERI = [
  { id: 'subhanallah', adi: 'Sübhanallah', emoji: '📿' },
  { id: 'elhamdulillah', adi: 'Elhamdülillah', emoji: '🤲' },
  { id: 'allahuekber', adi: 'Allahuekber', emoji: '☪️' },
  { id: 'laIlaheIllallah', adi: 'Lâ ilâhe illallah', emoji: '🕌' },
  { id: 'estagfirullah', adi: 'Estağfirullah', emoji: '🙏' },
  { id: 'salavat', adi: 'Salavat', emoji: '💚' },
  { id: 'diger', adi: 'Diğer', emoji: '✨' },
];

export default function TesbihScreen() {
  const [sayac, setSayac] = useState(0);
  const [hedef, setHedef] = useState(33);
  const [hedefInput, setHedefInput] = useState('33');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [seciliZikir, setSeciliZikir] = useState(ZIKIR_SECENEKLERI[0]);
  const [kayitlar, setKayitlar] = useState<TesbihKaydi[]>([]);
  const [kayitlarGoster, setKayitlarGoster] = useState(false);

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

  const handleKaydetVeSifirla = async () => {
    if (sayac === 0) {
      Alert.alert('Uyarı', 'Kaydetmek için en az 1 kez tesbih çekmelisiniz.');
      return;
    }

    // Kaydı oluştur
    const yeniKayit: TesbihKaydi = {
      id: Date.now().toString(),
      zikirAdi: seciliZikir.adi,
      adet: sayac,
      tarih: Date.now(),
    };

    try {
      await kaydetTesbihKaydi(yeniKayit);

      // Kayıtları güncelle
      const guncelKayitlar = await yukleTesbihKayitlari();
      setKayitlar(guncelKayitlar);

      // Sayacı sıfırla
      const sifirlanmis = await sifirlaTesbihSayaci();
      setSayac(sifirlanmis.sayac);
      setHedef(sifirlanmis.hedef);
      setHedefInput(String(sifirlanmis.hedef));

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
      'Sayacı sıfırlamak istediğinize emin misiniz? (Kaydetmeden sıfırlanacak)',
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

  const renderKayit = ({ item }: { item: TesbihKaydi }) => (
    <View style={styles.kayitItem}>
      <View style={styles.kayitIcerik}>
        <Text style={styles.kayitZikir}>{item.zikirAdi}</Text>
        <Text style={styles.kayitTarih}>{formatTarih(item.tarih)}</Text>
      </View>
      <View style={styles.kayitSagTaraf}>
        <View style={styles.kayitAdetContainer}>
          <Text style={styles.kayitAdet}>{item.adet}</Text>
          <Text style={styles.kayitAdetLabel}>adet</Text>
        </View>
        <TouchableOpacity
          style={styles.silButonu}
          onPress={() => handleKayitSil(item.id)}
        >
          <Text style={styles.silButonuText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

        {/* Sayaç Kartı */}
        <View style={styles.sayacKart}>
          <Text style={styles.seciliZikirText}>{seciliZikir.emoji} {seciliZikir.adi}</Text>
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

        {/* Kontrol Butonları */}
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
            <Text style={styles.bolumBaslik}>📜 Geçmiş Kayıtlar ({kayitlar.length})</Text>
            <Text style={styles.acKapaIcon}>{kayitlarGoster ? '▼' : '▶'}</Text>
          </TouchableOpacity>

          {kayitlarGoster && (
            <View style={styles.kayitlarListe}>
              {kayitlar.length === 0 ? (
                <Text style={styles.bosKayitText}>Henüz kayıt yok. Tesbih çekip kaydedin!</Text>
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
                        <Text style={styles.kayitAdetLabel}>adet</Text>
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
              {kayitlar.length > 10 && (
                <Text style={styles.dahaFazlaText}>... ve {kayitlar.length - 10} kayıt daha</Text>
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
  zikirSecimKart: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
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
  sayacKart: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  seciliZikirText: {
    fontSize: 16,
    color: ISLAMI_RENKLER.altinAcik,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.display,
  },
  sayacDeger: {
    fontSize: 64,
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
    marginBottom: 16,
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
  kaydetButonu: {
    backgroundColor: ISLAMI_RENKLER.yesilParlak,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: ISLAMI_RENKLER.yesilParlak,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
  kayitAdetLabel: {
    fontSize: 10,
    color: ISLAMI_RENKLER.altinOrta,
    fontFamily: TYPOGRAPHY.body,
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
  dahaFazlaText: {
    textAlign: 'center',
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontSize: 12,
    marginTop: 8,
    fontFamily: TYPOGRAPHY.body,
  },
});
