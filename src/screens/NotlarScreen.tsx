import React, { useState } from 'react';
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

export default function NotlarScreen() {
  const { notlar, yukleniyor, notKaydet, notSil } = useNotlar();
  const [modalVisible, setModalVisible] = useState(false);
  const [seciliNot, setSeciliNot] = useState<Not | null>(null);
  const [baslik, setBaslik] = useState('');
  const [icerik, setIcerik] = useState('');

  const route = useRoute<RouteProp<{ params: { date?: string } }, 'params'>>();

  // Dışarıdan gelen tarih parametresini kontrol et
  React.useEffect(() => {
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
    setModalVisible(true);
  };

  const handleNotDuzenle = (not: Not) => {
    setSeciliNot(not);
    setBaslik(not.baslik || '');
    setIcerik(not.icerik);
    setModalVisible(true);
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
      };

      await notKaydet(yeniNot);
      setModalVisible(false);
      setBaslik('');
      setIcerik('');
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

  if (yukleniyor) {
    return (
      <SafeAreaView style={styles.container}>
        <BackgroundDecor />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={ISLAMI_RENKLER.altinAcik} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecor />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>📝 Notlar</Text>
          <TouchableOpacity style={styles.ekleButonu} onPress={handleNotEkle}>
            <Text style={styles.ekleButonuText}>+ Yeni Not</Text>
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
                style={styles.notKart}
                onPress={() => handleNotDuzenle(not)}
                onLongPress={() => handleNotSil(not)}
              >
                <View style={styles.notHeader}>
                  <Text style={styles.notTarih}>{formatTarih(not.tarih)}</Text>
                  <TouchableOpacity
                    onPress={() => handleNotSil(not)}
                    style={styles.silButonu}
                  >
                    <Text style={styles.silButonuText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
                {not.baslik && (
                  <Text style={styles.notBaslik}>{not.baslik}</Text>
                )}
                <Text style={styles.notIcerik} numberOfLines={3}>
                  {not.icerik}
                </Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalBaslik}>
              {seciliNot ? 'Notu Düzenle' : 'Yeni Not Ekle'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Başlık (opsiyonel)"
              placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
              value={baslik}
              onChangeText={setBaslik}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Not içeriği..."
              placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
              value={icerik}
              onChangeText={setIcerik}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />

            <View style={styles.modalButonlar}>
              <TouchableOpacity
                style={[styles.modalButonu, styles.iptalButonu]}
                onPress={() => {
                  setModalVisible(false);
                  setBaslik('');
                  setIcerik('');
                  setSeciliNot(null);
                }}
              >
                <Text style={styles.modalButonuText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButonu, styles.kaydetButonu]}
                onPress={handleNotKaydet}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 8,
    fontFamily: TYPOGRAPHY.display,
  },
  notIcerik: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
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
});
