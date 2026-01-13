import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { useOrucZinciri } from '../hooks/useOrucZinciri';
import { OrucTamamlamaModal } from './OrucTamamlamaModal';

/**
 * Oruç zinciri görselleştirme bileşeni
 * Her halka bir günü temsil eder ve tıklanabilir
 */
export const OrucZinciri: React.FC = () => {
  const { zincirHalkalari, yukleniyor, toplamIsaretli, gunuIsaretle } = useOrucZinciri();
  const [modalVisible, setModalVisible] = useState(false);
  const [secilenGun, setSecilenGun] = useState(1);

  if (yukleniyor) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={ISLAMI_RENKLER.altinAcik} />
        <Text style={styles.yukleniyorText}>Zincir yükleniyor...</Text>
      </View>
    );
  }

  if (zincirHalkalari.length === 0) {
    return null;
  }

  const handleHalkaPress = async (tarih: Date, isaretli: boolean, gunNumarasi: number) => {
    try {
      await gunuIsaretle(tarih, !isaretli);

      // Sadece oruç tamamlandığında (işaretlendiğinde) modalı göster
      if (!isaretli) {
        setSecilenGun(gunNumarasi);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Halka işaretlenirken hata:', error);
    }
  };

  // Haftalara göre grupla (her hafta 7 gün)
  const haftalar: typeof zincirHalkalari[] = [];
  for (let i = 0; i < zincirHalkalari.length; i += 7) {
    haftalar.push(zincirHalkalari.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <View style={styles.baslikContainer}>
        <Text style={styles.baslik}>🔗 Şükür365</Text>
        <Text style={styles.altBaslik}>
          {toplamIsaretli} / {zincirHalkalari.length} gün tamamlandı
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {haftalar.map((hafta, haftaIndex) => (
          <View key={haftaIndex} style={styles.haftaContainer}>
            <Text style={styles.haftaBaslik}>{haftaIndex + 1}. Hafta</Text>
            <View style={styles.halkalarContainer}>
              {hafta.map((halka, index) => {
                const globalIndex = haftaIndex * 7 + index;
                const halkaStyle = [
                  styles.halka,
                  halka.isaretli && styles.halkaIsaretli,
                  halka.bugunMu && styles.halkaBugun,
                ];

                return (
                  <TouchableOpacity
                    key={globalIndex}
                    style={halkaStyle}
                    onPress={() => handleHalkaPress(halka.tarih, halka.isaretli, halka.gunNumarasi)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.halkaNumara}>{halka.gunNumarasi}</Text>
                    {halka.isaretli && <Text style={styles.halkaIsaret}>✓</Text>}
                    {halka.bugunMu && <View style={styles.bugunGostergesi} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.aciklamaContainer}>
        <View style={styles.legenda}>
          <View style={styles.legendaItem}>
            <View style={[styles.legendaKutu, styles.legendaBos]} />
            <Text style={styles.legendaText}>Bekleyen</Text>
          </View>
          <View style={styles.legendaItem}>
            <View style={[styles.legendaKutu, styles.legendaIsaretli]} />
            <Text style={styles.legendaText}>Tamamlandı</Text>
          </View>
          <View style={styles.legendaItem}>
            <View style={[styles.legendaKutu, styles.legendaBugun]} />
            <Text style={styles.legendaText}>Bugün</Text>
          </View>
        </View>
        <Text style={styles.aciklamaText}>
          💡 Halkalara dokunarak oruç günlerinizi işaretleyebilirsiniz
        </Text>
      </View>

      {/* Oruç Tamamlama Modalı */}
      <OrucTamamlamaModal
        visible={modalVisible}
        gunNumarasi={secilenGun}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 28,
    margin: 16,
    marginTop: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  baslikContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  baslik: {
    fontSize: 22,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  altBaslik: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  haftaContainer: {
    marginRight: 20,
    alignItems: 'center',
  },
  haftaBaslik: {
    fontSize: 14,
    fontWeight: '700',
    color: ISLAMI_RENKLER.altinAcik,
    marginBottom: 12,
  },
  halkalarContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  halka: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  halkaIsaretli: {
    backgroundColor: ISLAMI_RENKLER.altinOrta + '40',
    borderColor: ISLAMI_RENKLER.altinAcik,
    borderWidth: 2.5,
  },
  halkaBugun: {
    borderColor: ISLAMI_RENKLER.yesilOrta,
    borderWidth: 3,
  },
  halkaNumara: {
    fontSize: 14,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyaz,
  },
  halkaIsaret: {
    position: 'absolute',
    fontSize: 18,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '800',
  },
  bugunGostergesi: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ISLAMI_RENKLER.yesilOrta,
    borderWidth: 2,
    borderColor: ISLAMI_RENKLER.arkaPlanYesil,
  },
  aciklamaContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  legenda: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 16,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendaKutu: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  legendaBos: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  legendaIsaretli: {
    backgroundColor: ISLAMI_RENKLER.altinOrta + '40',
    borderColor: ISLAMI_RENKLER.altinAcik,
  },
  legendaBugun: {
    backgroundColor: 'transparent',
    borderColor: ISLAMI_RENKLER.yesilOrta,
  },
  legendaText: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontWeight: '500',
  },
  aciklamaText: {
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  yukleniyorText: {
    marginTop: 8,
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
});
