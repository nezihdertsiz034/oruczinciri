import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getHadisByGun, Hadis } from '../constants/hadisler';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface HadisGostericiProps {
  gunNumarasi: number;
}

/**
 * Günlük hadis-i şerif gösterici bileşeni
 */
export const HadisGosterici: React.FC<HadisGostericiProps> = ({
  gunNumarasi,
}) => {
  const [hadis, setHadis] = useState<Hadis | null>(null);

  useEffect(() => {
    const hadisData = getHadisByGun(gunNumarasi);
    setHadis(hadisData);
  }, [gunNumarasi]);

  if (!hadis) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.baslikContainer}>
        <Text style={styles.baslik}>📖 {gunNumarasi}. Gün Hadis-i Şerif</Text>
      </View>
      
      <ScrollView style={styles.hadisContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.hadisMetin}>"{hadis.metin}"</Text>
        {hadis.kaynak && (
          <Text style={styles.hadisKaynak}>— {hadis.kaynak}</Text>
        )}
      </ScrollView>
      
      <View style={styles.altBilgi}>
        <Text style={styles.altBilgiText}>
          🌙 Ramazan ayının {gunNumarasi}. günü
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginTop: 8,
    padding: 28,
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  baslik: {
    fontSize: 22,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  hadisContainer: {
    minHeight: 120,
    marginBottom: 16,
  },
  hadisMetin: {
    fontSize: 17,
    lineHeight: 28,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'justify',
    fontStyle: 'italic',
    marginBottom: 16,
    fontWeight: '400',
  },
  hadisKaynak: {
    fontSize: 14,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 12,
  },
  altBilgi: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  altBilgiText: {
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontWeight: '500',
  },
});

