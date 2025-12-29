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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
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

export default function AyarlarScreen() {
  const { bildirimleriAyarla } = useBildirimler();
  const [bildirimAyarlari, setBildirimAyarlari] = useState<BildirimAyarlari | null>(null);
  const [sehir, setSehir] = useState<Sehir | null>(null);
  const [sehirModalVisible, setSehirModalVisible] = useState(false);
  const [sahurSaatModalVisible, setSahurSaatModalVisible] = useState(false);
  const [iftarSaatModalVisible, setIftarSaatModalVisible] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);

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
        <View style={styles.centerContainer}>
          <Text style={styles.yukleniyorText}>Ayarlar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>⚙️ Ayarlar</Text>

        {/* Şehir Seçimi */}
        <View style={styles.ayarBolumu}>
          <Text style={styles.ayarBaslik}>📍 Şehir Seçimi</Text>
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
            Oruç Zinciri - 2026 Ramazan{'\n'}
            Versiyon: 1.0.0{'\n\n'}
            Bu uygulama, Ramazan ayında oruç tutmanızı takip etmenize ve
            motivasyonunuzu artırmanıza yardımcı olmak için tasarlanmıştır.
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
  },
  yukleniyorText: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
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
  },
  switchAltLabel: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 4,
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
  },
  hakkindaText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    lineHeight: 22,
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
  },
  sehirItemTextSecili: {
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
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
  },
});

