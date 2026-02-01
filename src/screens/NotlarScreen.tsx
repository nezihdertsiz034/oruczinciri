import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { useNotlar } from '../hooks/useNotlar';
import { Not } from '../types';
import { tarihToString } from '../utils/ramazanTarihleri';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { useTheme } from '../hooks/useTheme';
import { SaatSecici } from '../components/SaatSecici';
import { TarihSecici } from '../components/TarihSecici';
import { scheduleNotBildirimi, cancelNotBildirimi } from '../hooks/useBildirimler';

const NOT_SABLONLARI = [
  { id: '1', baslik: '🌙 İftar Daveti', icerik: 'İftara gidilecek. Yer: ', ikon: '🥘' },
  { id: '2', baslik: '🥘 İftar Verilecek', icerik: 'İftar daveti verilecek. Menü: ', ikon: '👨‍👩‍👧‍👦' },
  { id: '3', baslik: '☕ Sahur Programı', icerik: 'Sahur için hazırlık yapılacak.', ikon: '🌙' },
  { id: '4', baslik: '🕌 Teravih Namazı', icerik: 'Bu akşam Teravih için camiye gidilecek.', ikon: '🕋' },
  { id: '5', baslik: '📖 Kur\'an Mukabelesi', icerik: 'Günün cüzü okunacak.', ikon: '📖' },
  { id: '6', baslik: '🤝 Akraba Ziyareti', icerik: 'Sıla-i rahim yapılacak.', ikon: '🏠' },
  { id: '7', baslik: '🤲 Kandil Özel', icerik: 'Mübarek gecenin ihyası için dua ve ibadet.', ikon: '✨' },
];

export default function NotlarScreen() {
  const { notlar, yukleniyor, notKaydet, notSil } = useNotlar();
  const tema = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [seciliNot, setSeciliNot] = useState<Not | null>(null);
  const [baslik, setBaslik] = useState('');
  const [icerik, setIcerik] = useState('');
  const [hatirlatici, setHatirlatici] = useState<number | undefined>(undefined);

  const [tarihModalVisible, setTarihModalVisible] = useState(false);
  const [saatModalVisible, setSaatModalVisible] = useState(false);

  const route = useRoute<RouteProp<{ params: { date?: string } }, 'params'>>();

  // Dışarıdan gelen tarih parametresini kontrol et
  useEffect(() => {
    if (route.params?.date && !yukleniyor) {
      const hedefTarih = route.params.date;
      const mevcutNot = notlar.find(n => n.tarih === hedefTarih);

      if (mevcutNot) {
        handleNotDuzenle(mevcutNot);
      } else {
        // Yeni not ekle modunda aç ve tarihi ayarla
        setSeciliNot(null);
        setBaslik('');
        setIcerik('');
        setModalVisible(true);
        // Not kaydederken bu tarihi kullanması için geçici bir state veya 
        // handleNotKaydet içinde tarih kontrolü gerekebilir.
        // Mevcut handleNotKaydet zaten seciliNot?.tarih yoksa bugünü alıyor.
        // Bu yüzden seciliNot'a sadece tarih içeren boş bir obje verelim.
        setSeciliNot({
          id: '',
          tarih: hedefTarih,
          icerik: '',
          olusturmaTarihi: Date.now()
        } as Not);
      }
    }
  }, [route.params?.date, yukleniyor, notlar]);

  const handleNotEkle = () => {
    setSeciliNot(null);
    setBaslik('');
    setIcerik('');
    setHatirlatici(undefined);
    setModalVisible(true);
  };

  const handleNotDuzenle = (not: Not) => {
    setSeciliNot(not);
    setBaslik(not.baslik || '');
    setIcerik(not.icerik);
    setHatirlatici(not.hatirlatici);
    setModalVisible(true);
  };

  const applySablon = (sablon: typeof NOT_SABLONLARI[0]) => {
    setBaslik(sablon.baslik);
    setIcerik(sablon.icerik);
  };

  const handleNotKaydet = async () => {
    if (!icerik.trim()) {
      Alert.alert('Hata', 'Not içeriği boş olamaz.');
      return;
    }

    try {
      const bugun = new Date();
      const yeniNot: Not = {
        id: seciliNot?.id || `not-${Date.now()}`,
        tarih: seciliNot?.tarih || tarihToString(bugun),
        baslik: baslik.trim() || undefined,
        icerik: icerik.trim(),
        olusturmaTarihi: seciliNot?.olusturmaTarihi || Date.now(),
        hatirlatici,
      };

      await notKaydet(yeniNot);

      // Bildirim Planla/Güncelle
      if (hatirlatici) {
        await scheduleNotBildirimi(yeniNot);
      } else if (seciliNot?.id) {
        // Önceden vardıysa ama şimdi silindiyse iptal et
        await cancelNotBildirimi(seciliNot.id);
      }

      setModalVisible(false);
      setBaslik('');
      setIcerik('');
      setHatirlatici(undefined);
      setSeciliNot(null);
    } catch (error) {
      Alert.alert('Hata', 'Not kaydedilirken bir hata oluştu.');
    }
  };

  const handleNotSil = (not: Not) => {
    Alert.alert(
      'Notu Sil',
      'Bu notu silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await notSil(not.id);
              await cancelNotBildirimi(not.id);
            } catch (error) {
              Alert.alert('Hata', 'Not silinirken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  const formatTarih = (tarihString: string): string => {
    const [yil, ay, gun] = tarihString.split('-');
    const aylar = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return `${gun} ${aylar[parseInt(ay) - 1]} ${yil}`;
  };

  const formatHatirlatici = (ts?: number): string => {
    if (!ts) return '';
    const date = new Date(ts);
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${formatTarih(tarihToString(date))} saat ${h}:${m}`;
  };

  if (yukleniyor) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]}>
        <BackgroundDecor />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={tema.vurgu} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]}>
      <BackgroundDecor />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: ISLAMI_RENKLER.yaziBeyaz }]}>📝 Notlar</Text>
          <TouchableOpacity style={[styles.ekleButonu, { backgroundColor: tema.vurgu }]} onPress={handleNotEkle}>
            <Text style={[styles.ekleButonuText, { color: '#000' }]}>+ Yeni Not</Text>
          </TouchableOpacity>
        </View>

        {notlar.length === 0 ? (
          <View style={styles.bosContainer}>
            <Text style={styles.bosText}>Henüz not eklenmemiş.</Text>
            <Text style={styles.bosAltText}>Yeni not eklemek için yukarıdaki butona tıklayın.</Text>
          </View>
        ) : (
          <View style={styles.notlarListContainer}>
            {notlar.map((not) => (
              <TouchableOpacity
                key={not.id}
                style={[
                  styles.notKart,
                  { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : ISLAMI_RENKLER.arkaPlanYesilOrta },
                  { borderColor: `${tema.vurgu}20` }
                ]}
                onPress={() => handleNotDuzenle(not)}
                onLongPress={() => handleNotSil(not)}
              >
                <View style={styles.notHeader}>
                  <View style={styles.notTarihContainer}>
                    <Text style={[styles.notTarih, { color: tema.vurgu }]}>{formatTarih(not.tarih)}</Text>
                    {not.hatirlatici && (
                      <Text style={styles.hatirlaticiIcon}> 🔔</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleNotSil(not)}
                    style={styles.silButonu}
                  >
                    <Text style={styles.silButonuText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
                {not.baslik && (
                  <Text style={[styles.notBaslik, { color: tema.yaziRenk }]}>{not.baslik}</Text>
                )}
                <Text style={[styles.notIcerik, { color: tema.yaziRenk }]} numberOfLines={2}>
                  {not.icerik}
                </Text>
                {not.hatirlatici && (
                  <Text style={[styles.notHatirlaticiText, { color: tema.vurgu }]}>
                    ⏰ {formatHatirlatici(not.hatirlatici)}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Not Ekleme/Düzenleme Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: tema.arkaPlan === '#05111A' ? '#0A1A26' : ISLAMI_RENKLER.arkaPlanYesilOrta, borderColor: `${tema.vurgu}33`, borderWidth: 1 }]}>
            <Text style={[styles.modalBaslik, { color: tema.yaziRenk }]}>
              {seciliNot ? 'Notu Düzenle' : 'Yeni Not Ekle'}
            </Text>

            {!seciliNot && (
              <View style={styles.sablonlarContainer}>
                <Text style={[styles.sablonBaslik, { color: tema.yaziRenkSoluk }]}>Hızlı Şablonlar</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sablonScroll}>
                  {NOT_SABLONLARI.map(sablon => (
                    <TouchableOpacity
                      key={sablon.id}
                      style={[styles.sablonChip, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: `${tema.vurgu}30` }]}
                      onPress={() => applySablon(sablon)}
                    >
                      <Text style={styles.sablonText}>{sablon.ikon} {sablon.baslik.split(' ')[1]}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <TextInput
              style={[styles.input, { color: tema.yaziRenk, borderColor: `${tema.vurgu}20`, backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.15)' }]}
              placeholder="Başlık (opsiyonel)"
              placeholderTextColor={tema.yaziRenkSoluk}
              value={baslik}
              onChangeText={setBaslik}
            />

            <TextInput
              style={[styles.input, styles.textArea, { color: tema.yaziRenk, borderColor: `${tema.vurgu}20`, backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.15)' }]}
              placeholder="Not içeriği..."
              placeholderTextColor={tema.yaziRenkSoluk}
              value={icerik}
              onChangeText={setIcerik}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />

            <View style={styles.hatirlaticiSection}>
              <Text style={[styles.sectionLabel, { color: tema.yaziRenk }]}>⏰ Hatırlatıcı</Text>
              {hatirlatici ? (
                <View style={styles.hatirlaticiAktifContainer}>
                  <View style={styles.hatirlaticiBilgi}>
                    <Text style={[styles.hatirlaticiText, { color: tema.yaziRenk }]}>
                      {formatHatirlatici(hatirlatici)}
                    </Text>
                  </View>
                  <View style={styles.hatirlaticiAksiyonlar}>
                    <TouchableOpacity
                      onPress={() => setTarihModalVisible(true)}
                      style={[styles.miniButon, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
                    >
                      <Text style={{ fontSize: 16 }}>📅</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setSaatModalVisible(true)}
                      style={[styles.miniButon, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
                    >
                      <Text style={{ fontSize: 16 }}>🕒</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setHatirlatici(undefined)}
                      style={[styles.miniButon, { backgroundColor: 'rgba(255,50,50,0.2)' }]}
                    >
                      <Text style={{ fontSize: 16 }}>✖️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.hatirlaticiEkleButonu, { borderColor: `${tema.vurgu}40` }]}
                  onPress={() => {
                    const d = new Date();
                    d.setHours(d.getHours() + 1);
                    d.setMinutes(0);
                    setHatirlatici(d.getTime());
                  }}
                >
                  <Text style={[styles.hatirlaticiEkleText, { color: tema.vurgu }]}>+ Hatırlatıcı Ekle</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.modalButonlar}>
              <TouchableOpacity
                style={[styles.modalButonu, styles.iptalButonu, { backgroundColor: tema.arkaPlan === '#05111A' ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.15)' }]}
                onPress={() => {
                  setModalVisible(false);
                  setBaslik('');
                  setIcerik('');
                  setSeciliNot(null);
                }}
              >
                <Text style={[styles.modalButonuText, { color: tema.yaziRenk }]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButonu, styles.kaydetButonu, { backgroundColor: tema.vurgu }]}
                onPress={handleNotKaydet}
              >
                <Text style={[styles.modalButonuText, { color: '#000' }]}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Tarih Seçici */}
      <TarihSecici
        visible={tarihModalVisible}
        mevcutTarih={new Date(hatirlatici || Date.now())}
        onClose={() => setTarihModalVisible(false)}
        onTarihSec={(tarih) => {
          const eski = new Date(hatirlatici || Date.now());
          tarih.setHours(eski.getHours());
          tarih.setMinutes(eski.getMinutes());
          setHatirlatici(tarih.getTime());
        }}
        baslik="Hatırlatma Tarihi"
      />

      {/* Saat Seçici */}
      <SaatSecici
        visible={saatModalVisible}
        mevcutSaat={hatirlatici ? `${String(new Date(hatirlatici).getHours()).padStart(2, '0')}:${String(new Date(hatirlatici).getMinutes()).padStart(2, '0')}` : '12:00'}
        onClose={() => setSaatModalVisible(false)}
        onSaatSec={(saatString) => {
          const [h, m] = saatString.split(':').map(Number);
          const yeni = new Date(hatirlatici || Date.now());
          yeni.setHours(h);
          yeni.setMinutes(m);
          setHatirlatici(yeni.getTime());
        }}
        baslik="Hatırlatma Saati"
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 0.4,
  },
  ekleButonu: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ekleButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: TYPOGRAPHY.body,
  },
  bosContainer: {
    alignItems: 'center',
    padding: 40,
  },
  bosText: {
    fontSize: 18,
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 8,
    fontFamily: TYPOGRAPHY.display,
  },
  bosAltText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.body,
  },
  notlarListContainer: {
    gap: 12,
  },
  notKart: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  notHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notTarih: {
    fontSize: 12,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 0.2,
  },
  silButonu: {
    padding: 4,
  },
  silButonuText: {
    fontSize: 18,
  },
  notBaslik: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FF3B30', // Başlık kırmızı
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.display,
  },
  notIcerik: {
    fontSize: 14,
    color: '#FFFFFF', // İçerik beyaz
    lineHeight: 20,
    fontFamily: TYPOGRAPHY.body,
    opacity: 0.9,
  },
  notTarihContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hatirlaticiIcon: {
    fontSize: 12,
  },
  notHatirlaticiText: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.body,
    marginTop: 8,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  hatirlaticiSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: TYPOGRAPHY.body,
  },
  hatirlaticiEkleButonu: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  hatirlaticiEkleText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.body,
  },
  hatirlaticiAktifContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 10,
  },
  hatirlaticiBilgi: {
    flex: 1,
  },
  hatirlaticiText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.body,
  },
  hatirlaticiAksiyonlar: {
    flexDirection: 'row',
    gap: 8,
  },
  miniButon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 0.3,
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
    fontFamily: TYPOGRAPHY.body,
  },
  textArea: {
    height: 150,
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
    fontFamily: TYPOGRAPHY.body,
  },
  sablonlarContainer: {
    marginBottom: 16,
  },
  sablonBaslik: {
    fontSize: 12,
    marginBottom: 8,
    fontFamily: TYPOGRAPHY.body,
    paddingLeft: 4,
  },
  sablonScroll: {
    flexDirection: 'row',
  },
  sablonChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
  },
  sablonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
