import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import {
  yukleBildirimAyarlari,
  kaydetBildirimAyarlari,
  yukleSehir,
  kaydetSehir,
} from '../utils/storage';
import { BildirimAyarlari, Sehir } from '../types';
import { SEHIRLER } from '../constants/sehirler';
import { temizleOrucVerileri } from '../utils/orucStorage';
import { SaatSecici } from '../components/SaatSecici';
import { useBildirimler } from '../hooks/useBildirimler';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { konumdanSehirBul } from '../utils/konumServisi';

export default function AyarlarScreen() {
  const { sendTestNotification, getScheduledNotifications, bildirimleriAyarla } =
    useBildirimler();

  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const playSound = async (type: 'ney' | 'ezan') => {
    try {
      setPlayingSound(type);
      const soundFile = type === 'ney'
        ? require('../../assets/ney.mp3')
        : require('../../assets/ezan.mp3');

      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingSound(null);
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Ses çalınamadı:', error);
      setPlayingSound(null);
      Alert.alert('Hata', 'Ses dosyası oynatılamadı.');
    }
  };

  const [bildirimAyarlari, setBildirimAyarlari] = useState<BildirimAyarlari | null>(null);
  const [sehir, setSehir] = useState<Sehir | null>(null);
  const [sehirModalVisible, setSehirModalVisible] = useState(false);
  const [sahurSaatModalVisible, setSahurSaatModalVisible] = useState(false);
  const [iftarSaatModalVisible, setIftarSaatModalVisible] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [konumBuluyor, setKonumBuluyor] = useState(false);

  useEffect(() => {
    verileriYukle();
  }, []);

  const verileriYukle = async () => {
    try {
      setYukleniyor(true);
      const [ayarlar, sehirData] = await Promise.all([
        yukleBildirimAyarlari(),
        yukleSehir(),
      ]);
      setBildirimAyarlari(ayarlar);
      setSehir(sehirData);
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  };

  const handleBildirimAyarDegistir = async (
    key: keyof BildirimAyarlari,
    value: boolean | string
  ) => {
    if (!bildirimAyarlari) return;

    try {
      const yeniAyarlar = { ...bildirimAyarlari, [key]: value };
      setBildirimAyarlari(yeniAyarlar);
      await kaydetBildirimAyarlari(yeniAyarlar);
    } catch (error) {
      Alert.alert('Hata', 'Ayar kaydedilirken bir hata oluştu.');
      await verileriYukle(); // Geri yükle
    }
  };

  const handleSehirSec = async (seciliSehir: Sehir) => {
    try {
      setSehir(seciliSehir);
      await kaydetSehir(seciliSehir);
      setSehirModalVisible(false);
      // Şehir değiştiğinde bildirimleri yeniden ayarla
      await bildirimleriAyarla();
      Alert.alert('Başarılı', 'Şehir güncellendi. Namaz vakitleri otomatik olarak güncellenecek.');
    } catch (error) {
      Alert.alert('Hata', 'Şehir kaydedilirken bir hata oluştu.');
    }
  };

  const handleSaatSec = async (tip: 'sahur' | 'iftar', saat: string) => {
    if (!bildirimAyarlari) return;

    try {
      const yeniAyarlar = {
        ...bildirimAyarlari,
        [tip === 'sahur' ? 'sahurSaat' : 'iftarSaat']: saat,
      };
      setBildirimAyarlari(yeniAyarlar);
      await kaydetBildirimAyarlari(yeniAyarlar);
      await bildirimleriAyarla();
    } catch (error) {
      Alert.alert('Hata', 'Saat kaydedilirken bir hata oluştu.');
    }
  };

  const handleVeriSifirla = () => {
    Alert.alert(
      'Verileri Sıfırla',
      'Tüm verileriniz silinecek. Bu işlem geri alınamaz. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            try {
              await temizleOrucVerileri();
              Alert.alert('Başarılı', 'Tüm veriler sıfırlandı.');
              // Diğer verileri de sıfırlamak için storage fonksiyonları eklenebilir
            } catch (error) {
              Alert.alert('Hata', 'Veriler sıfırlanırken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  if (yukleniyor || !bildirimAyarlari || !sehir) {
    return (
      <SafeAreaView style={styles.container}>
        <BackgroundDecor />
        <View style={styles.centerContainer}>
          <Text style={styles.yukleniyorText}>Ayarlar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecor />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>⚙️ Ayarlar</Text>

        {/* Hata Ayıklama / Test - Sadece geliştirme/test için */}
        <View style={styles.ayarBolumu}>
          <Text style={styles.ayarBaslik}>🛠️ Hata Ayıklama</Text>
          <TouchableOpacity
            style={[styles.ayarItem, { backgroundColor: '#e8f5e9' }]}
            onPress={async () => {
              const success = await sendTestNotification();
              if (success) {
                Alert.alert('Test', '3 saniye içinde bildirim gelecek. Gelmezse lütfen bildirim izinlerini kontrol edin.');
              }
            }}
          >
            <Text style={[styles.ayarItemText, { color: '#2e7d32', fontWeight: 'bold' }]}>
              🔔 Bildirimleri Test Et
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ayarItem}
            onPress={async () => {
              const planli = await getScheduledNotifications();
              Alert.alert('Planlı Bildirimler', `Şu an ${planli.length} adet bildirim zamanlanmış durumda.`);
            }}
          >
            <Text style={styles.ayarItemText}>
              📅 Zamanlananları Kontrol Et
            </Text>
          </TouchableOpacity>
        </View>

        {/* Şehir Seçimi */}
        <View style={styles.ayarBolumu}>
          <Text style={styles.ayarBaslik}>📍 Şehir Seçimi</Text>

          {/* Konumdan Şehir Bul Butonu */}
          <TouchableOpacity
            style={[styles.ayarItem, { backgroundColor: 'rgba(46, 204, 113, 0.2)', marginBottom: 8 }]}
            onPress={async () => {
              setKonumBuluyor(true);
              try {
                const bulunanSehir = await konumdanSehirBul();
                if (bulunanSehir) {
                  await handleSehirSec(bulunanSehir);
                  Alert.alert('✅ Şehir Bulundu', `Konumunuza göre şehriniz: ${bulunanSehir.isim}`);
                }
              } finally {
                setKonumBuluyor(false);
              }
            }}
            disabled={konumBuluyor}
          >
            {konumBuluyor ? (
              <ActivityIndicator size="small" color="#2ecc71" />
            ) : (
              <Text style={[styles.ayarItemText, { color: '#2ecc71', fontWeight: 'bold' }]}>
                🌐 Konumumu Bul
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ayarItem}
            onPress={() => setSehirModalVisible(true)}
          >
            <Text style={styles.ayarItemText}>{sehir.isim}</Text>
            <Text style={styles.ayarItemOk}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Bildirim Ayarları */}
        <View style={styles.ayarBolumu}>
          <Text style={styles.ayarBaslik}>🔔 Bildirim Ayarları</Text>

          <View style={styles.switchItem}>
            <View style={styles.switchItemLeft}>
              <Text style={styles.switchLabel}>Sahur Hatırlatıcısı</Text>
              <TouchableOpacity
                onPress={() => setSahurSaatModalVisible(true)}
                style={styles.saatButonu}
              >
                <Text style={styles.saatButonuText}>
                  {bildirimAyarlari.sahurSaat}
                </Text>
              </TouchableOpacity>
            </View>
            <Switch
              value={bildirimAyarlari.sahurAktif}
              onValueChange={async (value) => {
                await handleBildirimAyarDegistir('sahurAktif', value);
                await bildirimleriAyarla();
              }}
              trackColor={{
                false: 'rgba(255, 255, 255, 0.3)',
                true: ISLAMI_RENKLER.altinOrta,
              }}
              thumbColor={ISLAMI_RENKLER.yaziBeyaz}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchItemLeft}>
              <Text style={styles.switchLabel}>İftar Hatırlatıcısı</Text>
              <TouchableOpacity
                onPress={() => setIftarSaatModalVisible(true)}
                style={styles.saatButonu}
              >
                <Text style={styles.saatButonuText}>
                  {bildirimAyarlari.iftarSaat}
                </Text>
              </TouchableOpacity>
            </View>
            <Switch
              value={bildirimAyarlari.iftarAktif}
              onValueChange={async (value) => {
                await handleBildirimAyarDegistir('iftarAktif', value);
                await bildirimleriAyarla();
              }}
              trackColor={{
                false: 'rgba(255, 255, 255, 0.3)',
                true: ISLAMI_RENKLER.altinOrta,
              }}
              thumbColor={ISLAMI_RENKLER.yaziBeyaz}
            />
          </View>

          <View style={styles.switchItem}>
            <View>
              <Text style={styles.switchLabel}>Namaz Vakitleri Bildirimleri</Text>
              <Text style={styles.switchAltLabel}>
                {sehir?.isim || 'İstanbul'} şehrine göre otomatik ayarlanır
              </Text>
            </View>
            <Switch
              value={bildirimAyarlari.namazVakitleriAktif}
              onValueChange={async (value) => {
                await handleBildirimAyarDegistir('namazVakitleriAktif', value);
                await bildirimleriAyarla();
              }}
              trackColor={{
                false: 'rgba(255, 255, 255, 0.3)',
                true: ISLAMI_RENKLER.altinOrta,
              }}
              thumbColor={ISLAMI_RENKLER.yaziBeyaz}
            />
          </View>

          {bildirimAyarlari.namazVakitleriAktif && (
            <View style={styles.switchItem}>
              <View>
                <Text style={styles.switchLabel}>Ezan Sesi</Text>
                <Text style={styles.switchAltLabel}>
                  Namaz vakitlerinde ezan sesi çal
                </Text>
              </View>
              <Switch
                value={bildirimAyarlari.ezanSesiAktif ?? true}
                onValueChange={async (value) => {
                  await handleBildirimAyarDegistir('ezanSesiAktif', value);
                  await bildirimleriAyarla();
                }}
                trackColor={{
                  false: 'rgba(255, 255, 255, 0.3)',
                  true: ISLAMI_RENKLER.altinOrta,
                }}
                thumbColor={ISLAMI_RENKLER.yaziBeyaz}
              />
            </View>
          )}

          <View style={styles.switchItem}>
            <View>
              <Text style={styles.switchLabel}>Günlük Oruç Hatırlatıcısı</Text>
              <Text style={styles.switchAltLabel}>
                {bildirimAyarlari.gunlukHatirlaticiSaat}
              </Text>
            </View>
            <Switch
              value={bildirimAyarlari.gunlukHatirlaticiAktif}
              onValueChange={(value) =>
                handleBildirimAyarDegistir('gunlukHatirlaticiAktif', value)
              }
              trackColor={{
                false: 'rgba(255, 255, 255, 0.3)',
                true: ISLAMI_RENKLER.altinOrta,
              }}
              thumbColor={ISLAMI_RENKLER.yaziBeyaz}
            />
          </View>

          {/* Ses Testleri */}
          <View style={styles.debugButonlar}>
            <TouchableOpacity
              style={[styles.debugButon, playingSound === 'ney' && styles.debugButonActive]}
              onPress={() => playSound('ney')}
              disabled={playingSound !== null}
            >
              {playingSound === 'ney' ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.debugButonText}>🪙 Ney Sesi Test Et</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.debugButon, playingSound === 'ezan' && styles.debugButonActive]}
              onPress={() => playSound('ezan')}
              disabled={playingSound !== null}
            >
              {playingSound === 'ezan' ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.debugButonText}>🕌 Ezan Sesi Test Et</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Veri Yönetimi */}
        <View style={styles.ayarBolumu}>
          <Text style={styles.ayarBaslik}>🗑️ Veri Yönetimi</Text>
          <TouchableOpacity style={styles.sifirlaButonu} onPress={handleVeriSifirla}>
            <Text style={styles.sifirlaButonuText}>Tüm Verileri Sıfırla</Text>
          </TouchableOpacity>
        </View>

        {/* Hakkında */}
        <View style={styles.ayarBolumu}>
          <Text style={styles.ayarBaslik}>ℹ️ Hakkında</Text>
          <Text style={styles.hakkindaText}>
            Şükür365 - Günlük Manevi Takip{'\n'}
            Versiyon: 1.0.0{'\n'}
            2026{'\n\n'}
            Bu uygulama, oruç tutmanızı takip etmenize,
            namaz vakitlerini öğrenmenize ve dini içeriklerle manevi yolculuğunuzu
            zenginleştirmenize yardımcı olmak için tasarlanmıştır.{'\n\n'}
            {'\n'}
            <Text style={{ fontWeight: 'bold', color: '#1a5f3f' }}>
              💚 Allah Rızası İçin{'\n'}
            </Text>
            Bu uygulama Nezih Dertsiz tarafından tamamen Allah rızası için geliştirilmiştir.
            Uygulama içinde hiçbir reklam, ücretli özellik veya satın alma bulunmamaktadır
            ve asla bulunmayacaktır. Tüm özellikler ücretsizdir ve her zaman ücretsiz kalacaktır.{'\n\n'}
            Dualarınızı bekliyoruz. 🤲
          </Text>
        </View>
      </ScrollView>

      {/* Şehir Seçim Modal */}
      <Modal
        visible={sehirModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSehirModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalBaslik}>Şehir Seçin</Text>
            <FlatList
              data={SEHIRLER}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.sehirItem,
                    sehir?.id === item.id && styles.sehirItemSecili,
                  ]}
                  onPress={() => handleSehirSec(item)}
                >
                  <Text
                    style={[
                      styles.sehirItemText,
                      sehir?.id === item.id && styles.sehirItemTextSecili,
                    ]}
                  >
                    {item.isim}
                  </Text>
                  {sehir?.id === item.id && (
                    <Text style={styles.seciliIsaret}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalKapatButonu}
              onPress={() => setSehirModalVisible(false)}
            >
              <Text style={styles.modalKapatButonuText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sahur Saat Seçici Modal */}
      <SaatSecici
        visible={sahurSaatModalVisible}
        mevcutSaat={bildirimAyarlari?.sahurSaat || '04:00'}
        onClose={() => setSahurSaatModalVisible(false)}
        onSaatSec={(saat) => handleSaatSec('sahur', saat)}
        baslik="Sahur Saatini Seçin"
      />

      {/* İftar Saat Seçici Modal */}
      <SaatSecici
        visible={iftarSaatModalVisible}
        mevcutSaat={bildirimAyarlari?.iftarSaat || '19:00'}
        onClose={() => setIftarSaatModalVisible(false)}
        onSaatSec={(saat) => handleSaatSec('iftar', saat)}
        baslik="İftar Saatini Seçin"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    overflow: 'hidden',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  yukleniyorText: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
  },
  ayarBolumu: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ayarBaslik: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 16,
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 0.2,
  },
  ayarItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  ayarItemText: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.body,
  },
  ayarItemOk: {
    fontSize: 24,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  switchItemLeft: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.body,
  },
  switchAltLabel: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 4,
    fontFamily: TYPOGRAPHY.body,
  },
  saatButonu: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  saatButonuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
  },
  sifirlaButonu: {
    backgroundColor: ISLAMI_RENKLER.kirmiziYumusak,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  sifirlaButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: TYPOGRAPHY.body,
  },
  hakkindaText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    lineHeight: 22,
    fontFamily: TYPOGRAPHY.body,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalBaslik: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 0.3,
  },
  sehirItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sehirItemSecili: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sehirItemText: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.body,
  },
  sehirItemTextSecili: {
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
  },
  seciliIsaret: {
    fontSize: 20,
    color: ISLAMI_RENKLER.altinAcik,
  },
  modalKapatButonu: {
    marginTop: 20,
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  modalKapatButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: TYPOGRAPHY.body,
  },
  debugButonlar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  debugButon: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  debugButonActive: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderColor: ISLAMI_RENKLER.altinAcik,
  },
  debugButonText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: TYPOGRAPHY.body,
    textAlign: 'center',
  },
});
