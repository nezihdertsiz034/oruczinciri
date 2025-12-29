import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { getSukurAyetiByGun, SukurAyeti } from '../constants/sukurAyetleri';
import { useOrucZinciri } from '../hooks/useOrucZinciri';

/**
 * Şükür ile ilgili günlük ayet gösterici
 */
export const OrucFaydalari: React.FC = () => {
  const { zincirHalkalari } = useOrucZinciri();
  const [gununAyeti, setGununAyeti] = useState<SukurAyeti | null>(null);
  const [genisletildi, setGenisletildi] = useState(false);

  useEffect(() => {
    // Bugünün gün numarasını bul
    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);
    const bugununHalkasi = zincirHalkalari.find(h => {
      const halkaTarih = new Date(h.tarih);
      halkaTarih.setHours(0, 0, 0, 0);
      return halkaTarih.getTime() === bugun.getTime();
    });
    const gunNumarasi = bugununHalkasi?.gunNumarasi || bugun.getDate();
    
    const ayet = getSukurAyetiByGun(gunNumarasi);
    setGununAyeti(ayet);
  }, [zincirHalkalari]);

  if (!gununAyeti) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setGenisletildi(!genisletildi)}
        activeOpacity={0.8}
      >
        <View style={styles.headerContent}>
          <Text style={styles.baslik}>Günün Şükür Ayeti</Text>
          <Text style={styles.acilmaIkon}>{genisletildi ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>
      
      {genisletildi && (
        <View style={styles.icerik}>
          <View style={styles.ayetBilgisi}>
            <Text style={styles.sureBaslik}>{gununAyeti.sure} Suresi</Text>
            <Text style={styles.ayetNumarasi}>{gununAyeti.ayetNumarasi}. Ayet</Text>
          </View>
          
          <ScrollView style={styles.arapcaContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.arapca}>{gununAyeti.arapca}</Text>
          </ScrollView>
          
          <View style={styles.mealContainer}>
            <Text style={styles.mealLabel}>Türkçe Meali:</Text>
            <Text style={styles.meal}>{gununAyeti.turkceMeal}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginTop: 8,
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  baslik: {
    fontSize: 18,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    letterSpacing: 0.5,
    flex: 1,
  },
  acilmaIkon: {
    fontSize: 14,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '600',
    marginLeft: 12,
  },
  icerik: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  ayetBilgisi: {
    marginTop: 16,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sureBaslik: {
    fontSize: 18,
    fontWeight: '800',
    color: ISLAMI_RENKLER.altinAcik,
    marginBottom: 4,
    textAlign: 'center',
  },
  ayetNumarasi: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontWeight: '600',
  },
  arapcaContainer: {
    maxHeight: 150,
    marginBottom: 16,
  },
  arapca: {
    fontSize: 22,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'right',
    lineHeight: 36,
    fontWeight: '500',
    fontFamily: 'System', // Arapça font için
  },
  mealContainer: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  mealLabel: {
    fontSize: 13,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  meal: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    lineHeight: 24,
    fontWeight: '500',
    textAlign: 'justify',
  },
});

