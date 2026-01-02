import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { ISLAMI_RENKLER } from '../../constants/renkler';
import { TYPOGRAPHY } from '../../constants/typography';
import { ekstraStiller } from './ekstraStyles';
import { YEMEK_VERILERI, YemekVerisi } from '../../constants/yemekVerileri';

interface KaloriMenu {
  id: string;
  isim: string;
  kalori: string;
}

export default function IftarKaloriScreen() {
  const [kaloriMenuler, setKaloriMenuler] = useState<KaloriMenu[]>([]);
  const [modalGorunur, setModalGorunur] = useState(false);
  const [aramaMetni, setAramaMetni] = useState('');

  const toplamKalori = kaloriMenuler.reduce((sum, menu) => {
    const kalori = Number.parseFloat(menu.kalori);
    return sum + (Number.isFinite(kalori) ? kalori : 0);
  }, 0);

  const manuelEkle = () => {
    setKaloriMenuler((onceki) => [
      ...onceki,
      { id: Date.now().toString(), isim: '', kalori: '' }
    ]);
  };

  const listedenEkle = (yemek: YemekVerisi) => {
    setKaloriMenuler((onceki) => [
      ...onceki,
      { id: Date.now().toString(), isim: yemek.isim, kalori: yemek.kalori.toString() }
    ]);
    setModalGorunur(false);
    setAramaMetni('');
  };

  const kaloriGuncelle = (id: string, field: keyof KaloriMenu, value: string) => {
    setKaloriMenuler((onceki) =>
      onceki.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const kaloriSil = (id: string) => {
    setKaloriMenuler((onceki) => onceki.filter((item) => item.id !== id));
  };

  const filtrelenmişYemekler = YEMEK_VERILERI.filter((y) =>
    y.isim.toLowerCase().includes(aramaMetni.toLowerCase())
  );

  return (
    <EkstraScreenLayout baslik="🍽️ İftar Kalori Takibi">
      <View style={ekstraStiller.bolum}>
        <View style={ekstraStiller.bolumHeader}>
          <Text style={ekstraStiller.bolumBaslik}>İftar Menüsü</Text>
          <View style={styles.butonGrup}>
            <TouchableOpacity
              style={[ekstraStiller.ekleButonu, { marginRight: 8 }]}
              onPress={() => setModalGorunur(true)}
            >
              <Text style={styles.butonEmoji}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ekstraStiller.ekleButonu} onPress={manuelEkle}>
              <Text style={ekstraStiller.ekleButonuText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {kaloriMenuler.length === 0 && (
          <Text style={ekstraStiller.bilgiText}>
            Yemek seçmek için 🔍, kendi yemeğinizi eklemek için + butonuna dokunun.
          </Text>
        )}

        <ScrollView style={styles.liste}>
          {kaloriMenuler.map((menu) => (
            <View key={menu.id} style={ekstraStiller.kaloriItem}>
              <TextInput
                style={[ekstraStiller.kaloriInput, styles.kaloriAd]}
                placeholder="Yemek adı"
                placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
                value={menu.isim}
                onChangeText={(value) => kaloriGuncelle(menu.id, 'isim', value)}
              />
              <TextInput
                style={[ekstraStiller.kaloriInput, styles.kaloriDeger]}
                placeholder="kcal"
                placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
                value={menu.kalori}
                onChangeText={(value) => kaloriGuncelle(menu.id, 'kalori', value)}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity style={ekstraStiller.silButonu} onPress={() => kaloriSil(menu.id)}>
                <Text style={ekstraStiller.silButonuText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {toplamKalori > 0 && (
          <View style={ekstraStiller.toplamKaloriKart}>
            <Text style={ekstraStiller.toplamKaloriLabel}>Toplam Kalori:</Text>
            <Text style={ekstraStiller.toplamKaloriDeger}>
              {toplamKalori.toLocaleString('tr-TR')} kcal
            </Text>
          </View>
        )}
      </View>

      {/* Yemek Seçme Modalı */}
      <Modal
        visible={modalGorunur}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalGorunur(false)}
      >
        <View style={ekstraStiller.modalOverlay}>
          <View style={[ekstraStiller.modalContent, { maxHeight: '80%' }]}>
            <Text style={ekstraStiller.modalBaslik}>Yemek Seçin</Text>

            <TextInput
              style={ekstraStiller.input}
              placeholder="Yemek ara..."
              placeholderTextColor={ISLAMI_RENKLER.yaziBeyazYumusak}
              value={aramaMetni}
              onChangeText={setAramaMetni}
            />

            <FlatList
              data={filtrelenmişYemekler}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.yemekSecenek}
                  onPress={() => listedenEkle(item)}
                >
                  <Text style={styles.yemekSecenekAd}>{item.isim}</Text>
                  <Text style={styles.yemekSecenekKalori}>{item.kalori} kcal</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.bosListeText}>Yemek bulunamadı.</Text>
              }
            />

            <TouchableOpacity
              style={[ekstraStiller.modalButonu, ekstraStiller.iptalButonu, { marginTop: 16 }]}
              onPress={() => setModalGorunur(false)}
            >
              <Text style={ekstraStiller.modalButonuText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </EkstraScreenLayout>
  );
}

const styles = StyleSheet.create({
  kaloriAd: {
    flex: 2,
  },
  kaloriDeger: {
    flex: 1,
    textAlign: 'center',
  },
  liste: {
    maxHeight: 400,
  },
  butonGrup: {
    flexDirection: 'row',
  },
  butonEmoji: {
    fontSize: 18,
  },
  yemekSecenek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  yemekSecenekAd: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.body,
  },
  yemekSecenekKalori: {
    color: ISLAMI_RENKLER.altinAcik,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.display,
  },
  bosListeText: {
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  }
});
