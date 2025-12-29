import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { ZincirHalkasi } from '../types';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface OrucZinciriProps {
  halkalar: ZincirHalkasi[];
  yukleniyor?: boolean;
  onHalkaPress: (tarih: Date, mevcutDurum: boolean) => void;
}

/**
 * 2026 Ramazan oruç zinciri görselleştirme bileşeni
 */
export const OrucZinciri: React.FC<OrucZinciriProps> = ({
  halkalar,
  yukleniyor = false,
  onHalkaPress,
}) => {
  const formatTarih = (tarih: Date): string => {
    const gun = String(tarih.getDate()).padStart(2, '0');
    const ay = String(tarih.getMonth() + 1).padStart(2, '0');
    return `${gun}.${ay}`;
  };

  const formatGunAdi = (tarih: Date): string => {
    const gunler = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    return gunler[tarih.getDay()];
  };

  const isaretliSayisi = halkalar.filter(h => h.isaretli).length;
  const toplamGun = halkalar.length;

  if (yukleniyor) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={ISLAMI_RENKLER.yesilOrta} />
        <Text style={styles.yukleniyorText}>Zincir yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.baslikContainer}>
        <Text style={styles.baslik}>📿 2026 Ramazan Oruç Zinciri</Text>
        <Text style={styles.istatistik}>
          {isaretliSayisi} / {toplamGun} gün
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.zincirContainer}
      >
        {halkalar.map((halka, index) => (
          <TouchableOpacity
            key={`${halka.tarih.getTime()}-${index}`}
            style={[
              styles.halka,
              halka.isaretli && styles.halkaIsaretli,
              halka.bugunMu && styles.halkaBugun,
            ]}
            onPress={() => onHalkaPress(halka.tarih, halka.isaretli)}
            activeOpacity={0.7}
          >
            <Text style={styles.halkaGunNumarasi}>{halka.gunNumarasi}</Text>
            <Text
              style={[
                styles.halkaTarih,
                halka.isaretli && styles.halkaTarihIsaretli,
              ]}
            >
              {formatTarih(halka.tarih)}
            </Text>
            <Text
              style={[
                styles.halkaGunAdi,
                halka.isaretli && styles.halkaGunAdiIsaretli,
              ]}
            >
              {formatGunAdi(halka.tarih)}
            </Text>
            {halka.isaretli && (
              <Text style={styles.halkaIsaret}>✓</Text>
            )}
            {halka.bugunMu && (
              <View style={styles.bugunGostergesi}>
                <Text style={styles.bugunText}>BUGÜN</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.aciklama}>
        💡 Günlere dokunarak oruç tuttuğunuz günleri işaretleyin
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginTop: 8,
    padding: 24,
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  baslikContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  baslik: {
    fontSize: 20,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  istatistik: {
    fontSize: 20,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '800',
    letterSpacing: 1,
  },
  zincirContainer: {
    paddingVertical: 8,
  },
  halka: {
    width: 80,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    marginRight: 14,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  halkaIsaretli: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: ISLAMI_RENKLER.altinAcik,
    borderWidth: 2.5,
    shadowColor: ISLAMI_RENKLER.altinAcik,
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  halkaBugun: {
    borderColor: ISLAMI_RENKLER.altinAcik,
    borderWidth: 3,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    shadowColor: ISLAMI_RENKLER.altinAcik,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    transform: [{ scale: 1.05 }],
  },
  halkaGunNumarasi: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 4,
  },
  halkaTarih: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 2,
    fontWeight: '500',
  },
  halkaTarihIsaretli: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '700',
  },
  halkaGunAdi: {
    fontSize: 10,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  halkaGunAdiIsaretli: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '700',
  },
  halkaIsaret: {
    position: 'absolute',
    top: 6,
    right: 6,
    fontSize: 18,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: 'bold',
  },
  bugunGostergesi: {
    position: 'absolute',
    bottom: -12,
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: ISLAMI_RENKLER.altinAcik,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  bugunText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  yukleniyorText: {
    marginTop: 12,
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  aciklama: {
    marginTop: 20,
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});

