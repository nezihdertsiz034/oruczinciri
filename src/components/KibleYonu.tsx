import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { KibleYonu as KibleYonuType } from '../types';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface KibleYonuProps {
  kibleYonu: KibleYonuType | null;
  yukleniyor?: boolean;
  hata?: string | null;
}

/**
 * Kıble yönü göstergesi bileşeni
 */
export const KibleYonu: React.FC<KibleYonuProps> = ({
  kibleYonu,
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
          {/* Pusula çerçevesi */}
          <View style={styles.pusulaCerceve}>
            {/* Yön göstergesi */}
            <View
              style={[
                styles.yonGostergesi,
                {
                  transform: [{ rotate: `${kibleYonu.aci}deg` }],
                },
              ]}
            >
              <View style={styles.ok} />
            </View>
            
            {/* Pusula noktaları */}
            <Text style={[styles.pusulaNokta, styles.kuzey]}>K</Text>
            <Text style={[styles.pusulaNokta, styles.guney]}>G</Text>
            <Text style={[styles.pusulaNokta, styles.dogu]}>D</Text>
            <Text style={[styles.pusulaNokta, styles.bati]}>B</Text>
          </View>
        </View>
      </View>

      <View style={styles.bilgiContainer}>
        <Text style={styles.yonText}>{yonIsimleri[kibleYonu.yon]}</Text>
        <Text style={styles.aciText}>{Math.round(kibleYonu.aci)}°</Text>
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
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  pusula: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  pusulaCerceve: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: ISLAMI_RENKLER.altinAcik,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yonGostergesi: {
    position: 'absolute',
    width: 4,
    height: 80,
    top: '50%',
    left: '50%',
    marginLeft: -2,
    marginTop: -80,
  },
  ok: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 60,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: ISLAMI_RENKLER.altinAcik,
  },
  pusulaNokta: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
  },
  kuzey: {
    top: 10,
    left: '50%',
    marginLeft: -8,
  },
  guney: {
    bottom: 10,
    left: '50%',
    marginLeft: -8,
  },
  dogu: {
    right: 10,
    top: '50%',
    marginTop: -10,
  },
  bati: {
    left: 10,
    top: '50%',
    marginTop: -10,
  },
  bilgiContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  yonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    marginBottom: 8,
  },
  aciText: {
    fontSize: 16,
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






