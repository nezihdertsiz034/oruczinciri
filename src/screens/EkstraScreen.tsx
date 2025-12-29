import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { KibleYonu as KibleYonuComponent } from '../components/KibleYonu';
import { useKibleYonu } from '../hooks/useKibleYonu';
import {
  yukleTeravihler,
  kaydetTeravih,
  getirTarihTeravih,
  yukleSadakalar,
  kaydetSadaka,
  getirToplamSadaka,
  yukleBildirimAyarlari,
  kaydetBildirimAyarlari,
} from '../utils/storage';
import { useBildirimler } from '../hooks/useBildirimler';
import { Teravih, Sadaka } from '../types';
import { tarihToString } from '../utils/ramazanTarihleri';

export default function EkstraScreen() {
  const { kibleYonu, yukleniyor: kibleYukleniyor, hata: kibleHata } = useKibleYonu();
  const { bildirimleriAyarla } = useBildirimler();
  const [teravihler, setTeravihler] = useState<Teravih[]>([]);
  const [sadakalar, setSadakalar] = useState<Sadaka[]>([]);
  const [toplamSadaka, setToplamSadaka] = useState(0);
  const [suHatirlatici, setSuHatirlatici] = useState(false);
  const [suIcmeAraligi, setSuIcmeAraligi] = useState('30');
  const [teravihModalVisible, setTeravihModalVisible] = useState(false);
  const [sadakaModalVisible, setSadakaModalVisible] = useState(false);
  const [seciliTeravih, setSeciliTeravih] = useState<Teravih | null>(null);
  const [sadakaMiktar, setSadakaMiktar] = useState('');
  const [sadakaAciklama, setSadakaAciklama] = useState('');
  
  // Hesaplayıcılar için state'ler
  const [zekatMalVarligi, setZekatMalVarligi] = useState('');
  const [zekatSonuc, setZekatSonuc] = useState<number | null>(null);
  const [fitreKisiSayisi, setFitreKisiSayisi] = useState('1');
  const [fitreSonuc, setFitreSonuc] = useState<number | null>(null);
  const [kaloriMenuler, setKaloriMenuler] = useState<Array<{isim: string, kalori: string}>>([]);
  const [toplamKalori, setToplamKalori] = useState(0);

  useEffect(() => {
    verileriYukle();
    bildirimAyarlariniYukle();
  }, []);

  const bildirimAyarlariniYukle = async () => {
    try {
      const ayarlar = await yukleBildirimAyarlari();
      setSuHatirlatici(ayarlar.suIcmeHatirlaticiAktif || false);
      setSuIcmeAraligi(String(ayarlar.suIcmeAraligi || 30));
    } catch (error) {
      console.error('Bildirim ayarları yüklenirken hata:', error);
    }
  };

  const suHatirlaticiDegistir = async (aktif: boolean) => {
    try {
      setSuHatirlatici(aktif);
      const ayarlar = await yukleBildirimAyarlari();
      const guncellenmisAyarlar = {
        ...ayarlar,
        suIcmeHatirlaticiAktif: aktif,
        suIcmeAraligi: parseInt(suIcmeAraligi) || 30,
      };
      await kaydetBildirimAyarlari(guncellenmisAyarlar);
      await bildirimleriAyarla();
      Alert.alert('Başarılı', aktif ? 'Sahur su içme hatırlatıcısı aktif edildi.' : 'Sahur su içme hatırlatıcısı kapatıldı.');
    } catch (error) {
      console.error('Bildirim ayarları kaydedilirken hata:', error);
      Alert.alert('Hata', 'Ayarlar kaydedilirken bir hata oluştu.');
    }
  };

  const suIcmeAraligiDegistir = async (aralik: string) => {
    try {
      const aralikNum = parseInt(aralik);
      if (isNaN(aralikNum) || aralikNum < 15 || aralikNum > 120) {
        Alert.alert('Hata', 'Aralık 15-120 dakika arasında olmalıdır.');
        return;
      }
      setSuIcmeAraligi(aralik);
      const ayarlar = await yukleBildirimAyarlari();
      const guncellenmisAyarlar = {
        ...ayarlar,
        suIcmeAraligi: aralikNum,
      };
      await kaydetBildirimAyarlari(guncellenmisAyarlar);
      if (suHatirlatici) {
        await bildirimleriAyarla();
      }
    } catch (error) {
      console.error('Bildirim ayarları kaydedilirken hata:', error);
    }
  };

  const verileriYukle = async () => {
    try {
      const [teravihVerileri, sadakaVerileri, toplam] = await Promise.all([
        yukleTeravihler(),
        yukleSadakalar(),
        getirToplamSadaka(),
      ]);
      setTeravihler(teravihVerileri);
      setSadakalar(sadakaVerileri);
      setToplamSadaka(toplam);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    }
  };

  const handleTeravihEkle = async () => {
    try {
      const bugun = new Date();
      const tarih = tarihToString(bugun);
      const mevcutTeravih = await getirTarihTeravih(tarih);

      if (mevcutTeravih) {
        const guncellenmis: Teravih = {
          ...mevcutTeravih,
          tamamlandi: !mevcutTeravih.tamamlandi,
        };
        await kaydetTeravih(guncellenmis);
      } else {
        const yeniTeravih: Teravih = {
          id: `teravih-${Date.now()}`,
          tarih,
          rekatSayisi: 20,
          tamamlandi: true,
          olusturmaTarihi: Date.now(),
        };
        await kaydetTeravih(yeniTeravih);
      }
      await verileriYukle();
      setTeravihModalVisible(false);
    } catch (error) {
      Alert.alert('Hata', 'Teravih kaydedilirken bir hata oluştu.');
    }
  };

  const handleSadakaEkle = async () => {
    if (!sadakaMiktar.trim()) {
      Alert.alert('Hata', 'Lütfen miktar girin.');
      return;
    }

    try {
      const bugun = new Date();
      const yeniSadaka: Sadaka = {
        id: `sadaka-${Date.now()}`,
        tarih: tarihToString(bugun),
        miktar: parseFloat(sadakaMiktar),
        aciklama: sadakaAciklama.trim() || undefined,
        olusturmaTarihi: Date.now(),
      };
      await kaydetSadaka(yeniSadaka);
      setSadakaMiktar('');
      setSadakaAciklama('');
      setSadakaModalVisible(false);
      await verileriYukle();
    } catch (error) {
      Alert.alert('Hata', 'Sadaka kaydedilirken bir hata oluştu.');
    }
  };

  const formatTarih = (tarihString: string): string => {
    const [yil, ay, gun] = tarihString.split('-');
    return `${gun}.${ay}.${yil}`;
  };

  const tamamlananTeravihSayisi = teravihler.filter(t => t.tamamlandi).length;

  // Zekat hesaplama (Mal varlığının %2.5'i)
  const hesaplaZekat = () => {
    const malVarligi = parseFloat(zekatMalVarligi);
    if (isNaN(malVarligi) || malVarligi <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir mal varlığı girin.');
      return;
    }
    // Nisab miktarı (2026 için yaklaşık 85 gram altın değeri)
    const nisab = 85000; // Yaklaşık 85 gram altın değeri (TL)
    if (malVarligi < nisab) {
      Alert.alert('Bilgi', `Mal varlığınız nisab miktarının (${nisab.toLocaleString('tr-TR')} ₺) altında. Zekat vermeniz gerekmez.`);
      setZekatSonuc(0);
      return;
    }
    const zekat = malVarligi * 0.025; // %2.5
    setZekatSonuc(zekat);
  };

  // Fitre hesaplama (2026 için yaklaşık değer)
  const hesaplaFitre = () => {
    const kisiSayisi = parseInt(fitreKisiSayisi);
    if (isNaN(kisiSayisi) || kisiSayisi <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir kişi sayısı girin.');
      return;
    }
    // 2026 için fitre miktarı (yaklaşık 1.5 kg buğday değeri)
    const fitreMiktari = 150; // TL (yaklaşık değer, güncel fiyatlara göre güncellenebilir)
    const toplam = fitreMiktari * kisiSayisi;
    setFitreSonuc(toplam);
  };

  // Kalori hesaplama
  const kaloriEkle = () => {
    const yeniMenu = { isim: '', kalori: '' };
    setKaloriMenuler([...kaloriMenuler, yeniMenu]);
  };

  const kaloriGuncelle = (index: number, field: 'isim' | 'kalori', value: string) => {
    const guncellenmis = [...kaloriMenuler];
    guncellenmis[index] = { ...guncellenmis[index], [field]: value };
    setKaloriMenuler(guncellenmis);
    
    // Toplam kaloriyi hesapla
    const toplam = guncellenmis.reduce((sum, menu) => {
      const kalori = parseFloat(menu.kalori) || 0;
      return sum + kalori;
    }, 0);
    setToplamKalori(toplam);
  };

  const kaloriSil = (index: number) => {
    const guncellenmis = kaloriMenuler.filter((_, i) => i !== index);
    setKaloriMenuler(guncellenmis);
    
    const toplam = guncellenmis.reduce((sum, menu) => {
      const kalori = parseFloat(menu.kalori) || 0;
      return sum + kalori;
    }, 0);
    setToplamKalori(toplam);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>✨ Ekstra Özellikler</Text>

        {/* Zekat Hesaplayıcı */}
        <View style={styles.bolum}>
          <Text style={styles.bolumBaslik}>💰 Zekat Hesaplayıcı</Text>
          <Text style={styles.bilgiText}>
            Mal varlığınızın nisab miktarını (85 gr altın değeri) aşması durumunda zekat vermeniz gerekir.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Mal varlığı (₺)"
            placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
            value={zekatMalVarligi}
            onChangeText={setZekatMalVarligi}
            keyboardType="decimal-pad"
          />
          <TouchableOpacity
            style={styles.hesaplaButonu}
            onPress={hesaplaZekat}
          >
            <Text style={styles.hesaplaButonuText}>Hesapla</Text>
          </TouchableOpacity>
          {zekatSonuc !== null && (
            <View style={styles.sonucKart}>
              <Text style={styles.sonucLabel}>Zekat Miktarı:</Text>
              <Text style={styles.sonucDeger}>{zekatSonuc.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</Text>
              <Text style={styles.sonucAciklama}>
                (Mal varlığınızın %2.5'i)
              </Text>
            </View>
          )}
        </View>

        {/* Fitre Hesaplayıcı */}
        <View style={styles.bolum}>
          <Text style={styles.bolumBaslik}>🌾 Fitre Hesaplayıcı</Text>
          <Text style={styles.bilgiText}>
            Fitre, Ramazan ayında verilmesi gereken sadakadır. Kişi başı yaklaşık 150 ₺ (2026).
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Kişi sayısı"
            placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
            value={fitreKisiSayisi}
            onChangeText={setFitreKisiSayisi}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={styles.hesaplaButonu}
            onPress={hesaplaFitre}
          >
            <Text style={styles.hesaplaButonuText}>Hesapla</Text>
          </TouchableOpacity>
          {fitreSonuc !== null && (
            <View style={styles.sonucKart}>
              <Text style={styles.sonucLabel}>Toplam Fitre:</Text>
              <Text style={styles.sonucDeger}>{fitreSonuc.toLocaleString('tr-TR')} ₺</Text>
              <Text style={styles.sonucAciklama}>
                ({fitreKisiSayisi} kişi × 150 ₺)
              </Text>
            </View>
          )}
        </View>

        {/* İftar Kalori Hesaplayıcı */}
        <View style={styles.bolum}>
          <View style={styles.bolumHeader}>
            <Text style={styles.bolumBaslik}>🍽️ İftar Kalori Takibi</Text>
            <TouchableOpacity
              style={styles.ekleButonu}
              onPress={kaloriEkle}
            >
              <Text style={styles.ekleButonuText}>+</Text>
            </TouchableOpacity>
          </View>
          {kaloriMenuler.length > 0 && (
            <>
              {kaloriMenuler.map((menu, index) => (
                <View key={index} style={styles.kaloriItem}>
                  <TextInput
                    style={[styles.kaloriInput, { flex: 2 }]}
                    placeholder="Yemek adı"
                    placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
                    value={menu.isim}
                    onChangeText={(value) => kaloriGuncelle(index, 'isim', value)}
                  />
                  <TextInput
                    style={[styles.kaloriInput, { flex: 1, marginLeft: 8 }]}
                    placeholder="Kalori"
                    placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
                    value={menu.kalori}
                    onChangeText={(value) => kaloriGuncelle(index, 'kalori', value)}
                    keyboardType="decimal-pad"
                  />
                  <TouchableOpacity
                    style={styles.silButonu}
                    onPress={() => kaloriSil(index)}
                  >
                    <Text style={styles.silButonuText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {toplamKalori > 0 && (
                <View style={styles.toplamKaloriKart}>
                  <Text style={styles.toplamKaloriLabel}>Toplam Kalori:</Text>
                  <Text style={styles.toplamKaloriDeger}>{toplamKalori.toLocaleString('tr-TR')} kcal</Text>
                </View>
              )}
            </>
          )}
          {kaloriMenuler.length === 0 && (
            <Text style={styles.bilgiText}>
              İftar menünüze eklemek için + butonuna tıklayın.
            </Text>
          )}
        </View>

        {/* Kıble Yönü */}
        <KibleYonuComponent
          kibleYonu={kibleYonu}
          yukleniyor={kibleYukleniyor}
          hata={kibleHata}
        />

        {/* Teravih Takibi */}
        <View style={styles.bolum}>
          <View style={styles.bolumHeader}>
            <Text style={styles.bolumBaslik}>🕌 Teravih Namazı Takibi</Text>
            <TouchableOpacity
              style={styles.ekleButonu}
              onPress={() => setTeravihModalVisible(true)}
            >
              <Text style={styles.ekleButonuText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.istatistikKart}>
            <Text style={styles.istatistikDeger}>{tamamlananTeravihSayisi}</Text>
            <Text style={styles.istatistikLabel}>Tamamlanan Teravih</Text>
          </View>
        </View>

        {/* Sadaka Takibi */}
        <View style={styles.bolum}>
          <View style={styles.bolumHeader}>
            <Text style={styles.bolumBaslik}>💝 Sadaka Takibi</Text>
            <TouchableOpacity
              style={styles.ekleButonu}
              onPress={() => setSadakaModalVisible(true)}
            >
              <Text style={styles.ekleButonuText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.istatistikKart}>
            <Text style={styles.istatistikDeger}>{toplamSadaka.toFixed(2)} ₺</Text>
            <Text style={styles.istatistikLabel}>Toplam Sadaka</Text>
          </View>
          {sadakalar.length > 0 && (
            <View style={styles.listeContainer}>
              {sadakalar.slice(0, 5).map((sadaka) => (
                <View key={sadaka.id} style={styles.listeItem}>
                  <View>
                    <Text style={styles.listeItemBaslik}>
                      {sadaka.miktar.toFixed(2)} ₺
                    </Text>
                    <Text style={styles.listeItemTarih}>
                      {formatTarih(sadaka.tarih)}
                    </Text>
                  </View>
                  {sadaka.aciklama && (
                    <Text style={styles.listeItemAciklama}>{sadaka.aciklama}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Su İçme Hatırlatıcısı */}
        <View style={styles.bolum}>
          <Text style={styles.bolumBaslik}>💧 Sahur Su İçme Hatırlatıcısı</Text>
          <Text style={styles.bilgiText}>
            2026 Ramazan ayı için sahur saatlerinden önce su içme hatırlatıcıları. Sahur saatinden sonra hatırlatma yapılmaz.
          </Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Hatırlatıcıyı Aktif Et</Text>
            <Switch
              value={suHatirlatici}
              onValueChange={suHatirlaticiDegistir}
              trackColor={{
                false: 'rgba(255, 255, 255, 0.3)',
                true: ISLAMI_RENKLER.altinOrta,
              }}
              thumbColor={ISLAMI_RENKLER.yaziBeyaz}
            />
          </View>
          {suHatirlatici && (
            <View style={styles.aralikContainer}>
              <Text style={styles.switchLabel}>Hatırlatma Aralığı (dakika)</Text>
              <TextInput
                style={styles.input}
                placeholder="30"
                placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
                value={suIcmeAraligi}
                onChangeText={setSuIcmeAraligi}
                onBlur={() => suIcmeAraligiDegistir(suIcmeAraligi)}
                keyboardType="number-pad"
              />
              <Text style={styles.bilgiText}>
                Her {suIcmeAraligi} dakikada bir sahur saatinden önce hatırlatılacak (15-120 dakika arası).
              </Text>
            </View>
          )}
        </View>

        {/* İftar Menüsü Önerileri */}
        <View style={styles.bolum}>
          <Text style={styles.bolumBaslik}>💡 İftar Menüsü Önerileri</Text>
          <View style={styles.menuListContainer}>
            {[
              'Çorba (Mercimek, Yayla, Tarhana)',
              'Ana Yemek (Etli yemek, Tavuk, Balık)',
              'Pilav veya Makarna',
              'Salata',
              'Tatlı (Güllaç, Baklava, Sütlaç)',
              'Hurma ve Su',
            ].map((menu, index) => (
              <View key={index} style={styles.menuItem}>
                <Text style={styles.menuItemText}>• {menu}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Teravih Modal */}
      <Modal
        visible={teravihModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTeravihModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalBaslik}>Teravih Namazı</Text>
            <Text style={styles.modalAciklama}>
              Bugünkü teravih namazını tamamladınız mı?
            </Text>
            <View style={styles.modalButonlar}>
              <TouchableOpacity
                style={[styles.modalButonu, styles.iptalButonu]}
                onPress={() => setTeravihModalVisible(false)}
              >
                <Text style={styles.modalButonuText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButonu, styles.kaydetButonu]}
                onPress={handleTeravihEkle}
              >
                <Text style={styles.modalButonuText}>Tamamlandı</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sadaka Modal */}
      <Modal
        visible={sadakaModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSadakaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalBaslik}>Sadaka Ekle</Text>
            <TextInput
              style={styles.input}
              placeholder="Miktar (₺)"
              placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
              value={sadakaMiktar}
              onChangeText={setSadakaMiktar}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Açıklama (opsiyonel)"
              placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
              value={sadakaAciklama}
              onChangeText={setSadakaAciklama}
              multiline
            />
            <View style={styles.modalButonlar}>
              <TouchableOpacity
                style={[styles.modalButonu, styles.iptalButonu]}
                onPress={() => {
                  setSadakaModalVisible(false);
                  setSadakaMiktar('');
                  setSadakaAciklama('');
                }}
              >
                <Text style={styles.modalButonuText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButonu, styles.kaydetButonu]}
                onPress={handleSadakaEkle}
              >
                <Text style={styles.modalButonuText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
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
  bolum: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bolumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bolumBaslik: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
  },
  ekleButonu: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ekleButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 24,
    fontWeight: 'bold',
  },
  istatistikKart: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  istatistikDeger: {
    fontSize: 36,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    marginBottom: 8,
  },
  istatistikLabel: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  listeContainer: {
    marginTop: 16,
    gap: 8,
  },
  listeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  listeItemBaslik: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 4,
  },
  listeItemTarih: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  listeItemAciklama: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
  },
  aralikContainer: {
    marginTop: 16,
  },
  bilgiText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 12,
    fontStyle: 'italic',
  },
  menuListContainer: {
    marginTop: 12,
    gap: 8,
  },
  menuItem: {
    padding: 8,
  },
  menuItemText: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    lineHeight: 24,
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
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalBaslik: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalAciklama: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButonlar: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButonu: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  iptalButonu: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  kaydetButonu: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
  },
  modalButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: 'bold',
    fontSize: 16,
  },
  hesaplaButonu: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  hesaplaButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sonucKart: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.altinAcik,
  },
  sonucLabel: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 8,
  },
  sonucDeger: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    marginBottom: 4,
  },
  sonucAciklama: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontStyle: 'italic',
  },
  kaloriItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  kaloriInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 12,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  silButonu: {
    backgroundColor: 'rgba(198, 40, 40, 0.3)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  silButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 20,
    fontWeight: 'bold',
  },
  toplamKaloriKart: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.yesilParlak,
  },
  toplamKaloriLabel: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '600',
  },
  toplamKaloriDeger: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yesilParlak,
  },
});

