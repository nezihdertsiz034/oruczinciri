import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { KibleYonu as KibleYonuType } from '../types';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface KibleYonuProps {
  kibleYonu: KibleYonuType | null;
  kibleOkAcisi?: number;
  pusulaAcisi?: number;
  yukleniyor?: boolean;
  hata?: string | null;
}

/**
 * Kıble yönü göstergesi bileşeni - Gerçek zamanlı pusula destekli
 */
export const KibleYonu: React.FC<KibleYonuProps> = ({
  kibleYonu,
  kibleOkAcisi = 0,
  pusulaAcisi = 0,
  yukleniyor = false,
  hata = null,
}) => {
  const yonIsimleri: Record<KibleYonuType['yon'], string> = {
    K: 'Kuzey',
    KB: 'Kuzey-Batı',
    B: 'Batı',
    GB: 'Güney-Batı',
    G: 'Güney',
    GD: 'Güney-Doğu',
    D: 'Doğu',
    KD: 'Kuzey-Doğu',
  };

  if (yukleniyor) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={ISLAMI_RENKLER.altinAcik} />
        <Text style={styles.yukleniyorText}>Kıble yönü hesaplanıyor...</Text>
      </View>
    );
  }

  if (hata) {
    return (
      <View style={styles.container}>
        <Text style={styles.hataText}>{hata}</Text>
      </View>
    );
  }

  if (!kibleYonu) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>🕌 Kıble Yönü</Text>

      <View style={styles.pusulaContainer}>
        <View style={styles.pusula}>
          {/* Pusula çerçevesi ve yönler - Cihazın baktığı yöne göre döner */}
          <View
            style={[
              styles.pusulaCerceve,
              { transform: [{ rotate: `${-pusulaAcisi}deg` }] }
            ]}
          >
            <Text style={[styles.pusulaNokta, styles.kuzey]}>K</Text>
            <Text style={[styles.pusulaNokta, styles.guney]}>G</Text>
            <Text style={[styles.pusulaNokta, styles.dogu]}>D</Text>
            <Text style={[styles.pusulaNokta, styles.bati]}>B</Text>
          </View>

          {/* Kıble oku - Her zaman Kabe'yi gösterir */}
          <View
            style={[
              styles.yonGostergesi,
              {
                transform: [{ rotate: `${kibleOkAcisi}deg` }],
              },
            ]}
          >
            <View style={styles.ok} />
          </View>
        </View>
      </View>

      <View style={styles.bilgiContainer}>
        <Text style={styles.yonText}>{yonIsimleri[kibleYonu.yon]}</Text>
        <Text style={styles.aciText}>{Math.round(kibleYonu.aci)}° (Kuzey'den)</Text>
        <View style={styles.pusulaAciKarti}>
          <Text style={styles.pusulaAciText}>Cihaz Yönü: {pusulaAcisi}°</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  baslik: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 20,
  },
  pusulaContainer: {
    width: 250,
    height: 250,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pusula: {
    width: 220,
    height: 220,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pusulaCerceve: {
    width: '100%',
    height: '100%',
    borderRadius: 110,
    borderWidth: 3,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yonGostergesi: {
    position: 'absolute',
    width: 10,
    height: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // transform pivot noktası merkez olmalı
  },
  ok: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 80,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: ISLAMI_RENKLER.altinAcik,
    marginTop: -40, // Merkeze hizalamak için
  },
  pusulaNokta: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
  },
  kuzey: {
    top: 10,
    color: ISLAMI_RENKLER.altinAcik,
  },
  guney: {
    bottom: 10,
  },
  dogu: {
    right: 15,
  },
  bati: {
    left: 15,
  },
  bilgiContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  yonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    marginBottom: 4,
  },
  aciText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 8,
  },
  pusulaAciKarti: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pusulaAciText: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  yukleniyorText: {
    marginTop: 12,
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  hataText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.kirmiziYumusak,
    textAlign: 'center',
  },
});
