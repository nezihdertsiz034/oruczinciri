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
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { SEHIRLER } from '../constants/sehirler';
import {
  yukleBildirimAyarlari,
  kaydetBildirimAyarlari,
  yukleSehir,
} from '../utils/storage';
import { BildirimAyarlari, Sehir, UygulamaAyarlari } from '../types';
import { useSettings } from '../context/SettingsContext';
import { temizleOrucVerileri } from '../utils/orucStorage';
import { SaatSecici } from '../components/SaatSecici';
import { useBildirimler } from '../hooks/useBildirimler';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { konumdanSehirBul } from '../utils/konumServisi';
import { useTheme } from '../hooks/useTheme';

export default function AyarlarScreen() {
  const { getScheduledNotifications, bildirimleriAyarla } =
    useBildirimler();
  const navigation = useNavigation<any>();
  const { uygulamaAyarlari, guncelleUygulamaAyarlari, sehir: contextSehir, guncelleSehir } = useSettings();
  const tema = useTheme(); // Artık global ayarları otomatik dinler

  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const playSound = async (type: 'ney' | 'ezan') => {
    try {
      setPlayingSound(type);
      const soundFile = type === 'ney'
        ? require('../../assets/yunus_emre.mp3')
        : require('../../assets/ezan.mp3');

      const { sound } = await Audio.Sound.createAsync(
        soundFile,
        { shouldPlay: true, positionMillis: type === 'ezan' ? 9000 : 0 }
      );
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
  const [sehir, setSehir] = useState<Sehir | null>(contextSehir);
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
    value: boolean | string | number
  ) => {
    if (!bildirimAyarlari) return;

    try {
      const yeniAyarlar = { ...bildirimAyarlari, [key]: value };
      setBildirimAyarlari(yeniAyarlar);
      await kaydetBildirimAyarlari(yeniAyarlar);
      await bildirimleriAyarla();

      // Eğer bir özellik aktif edildiyse, bir sonraki bildirime ne kadar kaldığını göster
      if (value === true && (key === 'abdestHatirlaticiAktif' || key === 'namazVakitleriAktif' || key === 'sahurAktif' || key === 'iftarAktif')) {
        setTimeout(async () => {
          const planli = await getScheduledNotifications();
          if (planli.length > 0) {
            // Şimdiki zamana en yakın olanı bul
            const simdi = Date.now();
            const gelecekBildirimler = planli
              .map(n => {
                const trigger = n.trigger as any;
                return trigger.value || trigger.timestamp || trigger.date;
              })
              .filter(t => t > simdi)
              .sort((a, b) => a - b);

            if (gelecekBildirimler.length > 0) {
              const farkMs = gelecekBildirimler[0] - simdi;
              const toplamDakika = Math.floor(farkMs / (1000 * 60));
              const saat = Math.floor(toplamDakika / 60);
              const dakika = toplamDakika % 60;

              let mesaj = 'Hatırlatıcı kuruldu: ';
              if (saat > 0) mesaj += `${saat} saat `;
              mesaj += `${dakika} dakika sonra ilk bildiriminiz gelecektir.`;

              Alert.alert('✅ Bildirim Aktif', mesaj);
            }
          }
        }, 1000); // Bildirimlerin planlanması için kısa bir süre bekle
      }
    } catch (error) {
      console.error('Bildirim ayarı değiştirilemedi:', error);
      Alert.alert('Hata', 'Ayar kaydedilirken bir hata oluştu.');
      await verileriYukle();
    }
  };

  const handleUygulamaAyarDegistir = async (
    key: keyof UygulamaAyarlari,
    value: any
  ) => {
    if (!uygulamaAyarlari) return;

    try {
      await guncelleUygulamaAyarlari({ [key]: value });
    } catch (error) {
      console.error('Uygulama ayarı değiştirilemedi:', error);
      Alert.alert('Hata', 'Ayar kaydedilirken bir hata oluştu.');
      await verileriYukle();
    }
  };

  const handleSehirSec = async (seciliSehir: Sehir) => {
    try {
      setSehir(seciliSehir);
      await guncelleSehir(seciliSehir);
      setSehirModalVisible(false);
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
              await verileriYukle();
            } catch (error) {
              Alert.alert('Hata', 'Veriler sıfırlanırken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  if (yukleniyor || !bildirimAyarlari || !sehir || !uygulamaAyarlari) {
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
        <Text style={styles.title}>Ayarlar</Text>

        {/* Hata Ayıklama / Test - Sadece geliştirme/test için */}
        <View style={[styles.ayarBolumu, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20` }]}>
          <Text style={styles.ayarBaslik}>🛠️ Hata Ayıklama</Text>
          <TouchableOpacity
            style={[styles.ayarItem, { backgroundColor: '#e8f5e9' }]}
            onPress={() => navigation.navigate('BildirimTest')}
          >
            <Text style={[styles.ayarItemText, { color: '#2e7d32', fontWeight: 'bold' }]}>
              🔔 Bildirim Paneli
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', gap: 10, padding: 10 }}>
            <TouchableOpacity
              style={[
                styles.testButon,
                { backgroundColor: ISLAMI_RENKLER.arkaPlanYesil, flex: 1 },
                uygulamaAyarlari?.temaTercih === 'gunduz' && styles.seciliButon
              ]}
              onPress={() => guncelleUygulamaAyarlari({ temaTercih: 'gunduz' })}
            >
              <Text style={styles.testButonText}>☀️ Gündüz</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.testButon,
                { backgroundColor: '#05111A', flex: 1, borderWidth: 1, borderColor: '#DFBD69' },
                uygulamaAyarlari?.temaTercih === 'gece' && styles.seciliButon
              ]}
              onPress={() => guncelleUygulamaAyarlari({ temaTercih: 'gece' })}
            >
              <Text style={styles.testButonText}>🌙 Gece</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.testButon,
                { backgroundColor: '#78909c', flex: 1 },
                uygulamaAyarlari?.temaTercih === 'otomatik' && styles.seciliButon
              ]}
              onPress={() => guncelleUygulamaAyarlari({ temaTercih: 'otomatik' })}
            >
              <Text style={styles.testButonText}>🔄 Otomatik</Text>
            </TouchableOpacity>
          </View>
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
        <View style={[styles.ayarBolumu, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20` }]}>
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
        <View style={[styles.ayarBolumu, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20` }]}>
          <Text style={styles.ayarBaslik}>🔔 Bildirim Ayarları</Text>

          <View style={styles.switchItem}>
            <View style={styles.switchItemLeft}>
              <Text style={styles.switchLabel}>Sahur Hatırlatıcısı</Text>
              <Text style={styles.switchAltLabel}>
                İmsak vaktinden 45 dakika önce hatırlat
              </Text>
            </View>
            <Switch
              value={bildirimAyarlari.sahurAktif}
              onValueChange={async (value) => {
                await handleBildirimAyarDegistir('sahurAktif', value);
                await bildirimleriAyarla();
              }}
              trackColor={{
                false: 'rgba(255, 255, 255, 0.3)',
                true: ISLAMI_RENKLER.yesilParlak,
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
                true: ISLAMI_RENKLER.yesilParlak,
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
                true: ISLAMI_RENKLER.yesilParlak,
              }}
              thumbColor={ISLAMI_RENKLER.yaziBeyaz}
            />
          </View>

          {bildirimAyarlari.namazVakitleriAktif && (
            <>
              <View style={styles.switchItem}>
                <View>
                  <Text style={styles.switchLabel}>Abdest Hatırlatıcısı</Text>
                  <Text style={styles.switchAltLabel}>
                    Ezanlardan 10 dakika önce güçlü titreşimle uyar
                  </Text>
                </View>
                <Switch
                  value={bildirimAyarlari.abdestHatirlaticiAktif}
                  onValueChange={async (value) => {
                    await handleBildirimAyarDegistir('abdestHatirlaticiAktif', value);
                  }}
                  trackColor={{
                    false: 'rgba(255, 255, 255, 0.3)',
                    true: ISLAMI_RENKLER.yesilParlak,
                  }}
                  thumbColor={ISLAMI_RENKLER.yaziBeyaz}
                />
              </View>

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
                    true: ISLAMI_RENKLER.yesilParlak,
                  }}
                  thumbColor={ISLAMI_RENKLER.yaziBeyaz}
                />
              </View>
            </>
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
                true: ISLAMI_RENKLER.yesilParlak,
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
                <Text style={styles.debugButonText}>🕌 Yunus Emre Sesi Test Et</Text>
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
        <View style={[styles.ayarBolumu, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20` }]}>
          <Text style={styles.ayarBaslik}>🗑️ Veri Yönetimi</Text>
          <TouchableOpacity style={styles.sifirlaButonu} onPress={handleVeriSifirla}>
            <Text style={styles.sifirlaButonuText}>Tüm Verileri Sıfırla</Text>
          </TouchableOpacity>
        </View>

        {/* Widget Ayarları */}
        <View style={[styles.ayarBolumu, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20` }]}>
          <Text style={styles.ayarBaslik}>📱 Widget Ayarları</Text>

          <View style={styles.switchItem}>
            <View>
              <Text style={styles.switchLabel}>Ana Ekran Widget'ı</Text>
              <Text style={styles.switchAltLabel}>
                Namaz vakitlerini ana ekranınızda görün
              </Text>
            </View>
            <Switch
              value={uygulamaAyarlari.widgetAktif}
              onValueChange={(value) => handleUygulamaAyarDegistir('widgetAktif', value)}
              trackColor={{
                false: 'rgba(255, 255, 255, 0.3)',
                true: ISLAMI_RENKLER.yesilParlak,
              }}
              thumbColor={ISLAMI_RENKLER.yaziBeyaz}
            />
          </View>

          <View style={styles.switchItem}>
            <View>
              <Text style={styles.switchLabel}>Kilidi Ekranı Widget'ı</Text>
              <Text style={styles.switchAltLabel}>
                Sonraki namaz vaktini kilit ekranında görün
              </Text>
            </View>
            <Switch
              value={uygulamaAyarlari.widgetKilitEkraniAktif}
              onValueChange={(value) => handleUygulamaAyarDegistir('widgetKilitEkraniAktif', value)}
              trackColor={{
                false: 'rgba(255, 255, 255, 0.3)',
                true: ISLAMI_RENKLER.yesilParlak,
              }}
              thumbColor={ISLAMI_RENKLER.yaziBeyaz}
            />
          </View>

          <TouchableOpacity
            style={styles.ayarItem}
            onPress={() => Alert.alert('Widget Rengi', 'Koyu veya açık tema seçebilirsiniz.', [
              { text: 'Koyu Tema', onPress: () => handleUygulamaAyarDegistir('widgetTema', 'koyu') },
              { text: 'Açık Tema', onPress: () => handleUygulamaAyarDegistir('widgetTema', 'acik') },
              { text: 'İptal', style: 'cancel' }
            ])}
          >
            <Text style={styles.ayarItemText}>Widget Teması</Text>
            <Text style={styles.ayarItemValue}>{uygulamaAyarlari.widgetTema === 'koyu' ? 'Koyu' : 'Açık'}</Text>
          </TouchableOpacity>
        </View>

        {/* Görünüm ve Erişilebilirlik */}
        <View style={[styles.ayarBolumu, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20` }]}>
          <Text style={styles.ayarBaslik}>👁️ Görünüm ve Erişilebilirlik</Text>

          <View style={styles.bilgiKutusu}>
            <Text style={styles.bilgiText}>
              Aşağıdaki seçenek ile uygulama içindeki yazıların boyutunu kendinize en uygun şekilde ayarlayabilirsiniz.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.ayarItem, { height: 70 }]}
            onPress={() => Alert.alert('Yazı Boyutu', 'Size en uygun okuma boyutunu seçin', [
              { text: 'Küçük', onPress: () => handleUygulamaAyarDegistir('yaziBoyutu', 'kucuk') },
              { text: 'Normal', onPress: () => handleUygulamaAyarDegistir('yaziBoyutu', 'normal') },
              { text: 'Büyük', onPress: () => handleUygulamaAyarDegistir('yaziBoyutu', 'buyuk') },
              { text: 'Çok Büyük', onPress: () => handleUygulamaAyarDegistir('yaziBoyutu', 'cokbuyuk') },
              { text: 'Dev (En Büyük)', onPress: () => handleUygulamaAyarDegistir('yaziBoyutu', 'dev') },
              { text: 'Yaşlı Modu', onPress: () => handleUygulamaAyarDegistir('yaziBoyutu', 'yasli') },
              { text: 'İptal', style: 'cancel' }
            ])}
          >
            <View>
              <Text style={[styles.ayarItemText, { fontSize: 18 }]}>Yazı Boyutu</Text>
              <Text style={styles.ayarItemValueAlt}>
                Şu an: {
                  uygulamaAyarlari.yaziBoyutu === 'kucuk' ? 'Küçük' :
                    uygulamaAyarlari.yaziBoyutu === 'normal' ? 'Normal' :
                      uygulamaAyarlari.yaziBoyutu === 'buyuk' ? 'Büyük' :
                        uygulamaAyarlari.yaziBoyutu === 'cokbuyuk' ? 'Çok Büyük' :
                          uygulamaAyarlari.yaziBoyutu === 'dev' ? 'Dev (En Büyük)' : 'Yaşlı Modu'
                }
              </Text>
            </View>
            <Text style={styles.ayarItemOk}>›</Text>
          </TouchableOpacity>

          <View style={styles.switchItem}>
            <View>
              <Text style={styles.switchLabel}>Arapça Yazı Göster</Text>
              <Text style={styles.switchAltLabel}>
                Sayaçlarda Arapça "الله" yazısı
              </Text>
            </View>
            <Switch
              value={uygulamaAyarlari.arapcaYaziGoster}
              onValueChange={(value) => handleUygulamaAyarDegistir('arapcaYaziGoster', value)}
              trackColor={{
                false: 'rgba(255, 255, 255, 0.3)',
                true: ISLAMI_RENKLER.yesilParlak,
              }}
              thumbColor={ISLAMI_RENKLER.yaziBeyaz}
            />
          </View>
        </View>


        {/* Kıble Ayarları */}
        <View style={[styles.ayarBolumu, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20` }]}>
          <Text style={styles.ayarBaslik}>🧭 Kıble Ayarları</Text>

          <View style={styles.switchItem}>
            <View>
              <Text style={styles.switchLabel}>Kıble Titreşimi</Text>
              <Text style={styles.switchAltLabel}>
                Kıble yönüne hizalandığında titret
              </Text>
            </View>
            <Switch
              value={uygulamaAyarlari.kibleTitresimAktif}
              onValueChange={(value) => handleUygulamaAyarDegistir('kibleTitresimAktif', value)}
              trackColor={{
                false: 'rgba(255, 255, 255, 0.3)',
                true: ISLAMI_RENKLER.yesilParlak,
              }}
              thumbColor={ISLAMI_RENKLER.yaziBeyaz}
            />
          </View>

          <TouchableOpacity
            style={styles.ayarItem}
            onPress={() => Alert.alert('Pusula Kalibrasyonu', 'Telefonunuzu 8 şeklinde hareket ettirerek pusulanızı kalibre edin.')}
          >
            <Text style={styles.ayarItemText}>Pusulayı Kalibre Et</Text>
            <Text style={styles.ayarItemOk}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Uygulama Ayarları */}
        <View style={[styles.ayarBolumu, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20` }]}>
          <Text style={styles.ayarBaslik}>⚙️ Uygulama Ayarları</Text>

          <TouchableOpacity
            style={styles.ayarItem}
            onPress={() => Alert.alert('Dil Seçimi', 'Uygulama dilini seçin', [
              { text: 'Türkçe', onPress: () => handleUygulamaAyarDegistir('dil', 'tr') },
              { text: 'English', onPress: () => handleUygulamaAyarDegistir('dil', 'en') },
              { text: 'العربية', onPress: () => handleUygulamaAyarDegistir('dil', 'ar') },
              { text: 'İptal', style: 'cancel' }
            ])}
          >
            <Text style={styles.ayarItemText}>Uygulama Dili</Text>
            <Text style={styles.ayarItemValue}>{uygulamaAyarlari.dil === 'tr' ? 'Türkçe' : uygulamaAyarlari.dil === 'en' ? 'English' : 'العربية'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ayarItem}
            onPress={() => Alert.alert('Hesaplama Metodu', 'Namaz vakti hesaplama metodunu seçin', [
              { text: 'Diyanet (Türkiye)', onPress: () => handleUygulamaAyarDegistir('hesaplamaMetodu', 'diyanet') },
              { text: 'Ümm-ul Kura', onPress: () => handleUygulamaAyarDegistir('hesaplamaMetodu', 'umm-ul-kura') },
              { text: 'ISNA', onPress: () => handleUygulamaAyarDegistir('hesaplamaMetodu', 'isna') },
              { text: 'Muslim World League', onPress: () => handleUygulamaAyarDegistir('hesaplamaMetodu', 'mwl') },
              { text: 'İptal', style: 'cancel' }
            ])}
          >
            <Text style={styles.ayarItemText}>Hesaplama Metodu</Text>
            <Text style={styles.ayarItemValue}>{uygulamaAyarlari.hesaplamaMetodu === 'diyanet' ? 'Diyanet' : uygulamaAyarlari.hesaplamaMetodu.toUpperCase()}</Text>
          </TouchableOpacity>

          <View style={styles.switchItem}>
            <View>
              <Text style={styles.switchLabel}>Otomatik Konum</Text>
              <Text style={styles.switchAltLabel}>
                Açılışta konumu otomatik algıla
              </Text>
            </View>
            <Switch
              value={uygulamaAyarlari.otomatikKonum}
              onValueChange={(value) => handleUygulamaAyarDegistir('otomatikKonum', value)}
              trackColor={{
                false: 'rgba(255, 255, 255, 0.3)',
                true: ISLAMI_RENKLER.yesilParlak,
              }}
              thumbColor={ISLAMI_RENKLER.yaziBeyaz}
            />
          </View>


          <View style={styles.switchItem}>
            <View>
              <Text style={styles.switchLabel}>Ekranı Açık Tut</Text>
              <Text style={styles.switchAltLabel}>
                Tesbih ve Kıble ekranlarında
              </Text>
            </View>
            <Switch
              value={uygulamaAyarlari.ekraniAcikTut}
              onValueChange={(value) => handleUygulamaAyarDegistir('ekraniAcikTut', value)}
              trackColor={{
                false: 'rgba(255, 255, 255, 0.3)',
                true: ISLAMI_RENKLER.yesilParlak,
              }}
              thumbColor={ISLAMI_RENKLER.yaziBeyaz}
            />
          </View>
        </View>


        {/* Hakkında */}
        <View style={[styles.ayarBolumu, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}20` }]}>
          <Text style={styles.ayarBaslik}>ℹ️ Hakkında</Text>
          <Text style={styles.hakkindaText}>
            Şükür365 - Günlük Manevi Takip{'\n'}
            Versiyon: 1.0.4{'\n'}
            2026{'\n\n'}
            Bu uygulama, oruç tutmanızı takip etmenize,
            namaz vakitlerini öğrenmenize ve dini içeriklerle manevi yolculuğunuzu
            zenginleştirmenize yardımcı olmak için tasarlanmıştır.{'\n\n'}
            <Text style={{ fontWeight: 'bold', color: tema.vurgu }}>
              📧 İletişim / Tavsiye / Şikayet{'\n'}
            </Text>
            Her türlü görüşünüz için: {' '}
            <Text
              style={{ color: tema.vurgu, textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL('mailto:nzhdrtsz034@gmail.com')}
            >
              nzhdrtsz034@gmail.com
            </Text>{'\n\n'}
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
  hataText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.kirmiziYumusak,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.body,
  },
  testButon: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  seciliButon: {
    borderWidth: 2,
    borderColor: '#DFBD69',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  ayarItemValue: {
    color: ISLAMI_RENKLER.altinAcik,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.body,
  },
  ayarItemValueAlt: {
    color: ISLAMI_RENKLER.altinAcik,
    fontSize: 12,
    marginTop: 2,
    fontFamily: TYPOGRAPHY.body,
  },
  bilgiKutusu: {
    backgroundColor: 'rgba(218, 165, 32, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: ISLAMI_RENKLER.altinOrta,
  },
  bilgiText: {
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: TYPOGRAPHY.body,
  },
});
