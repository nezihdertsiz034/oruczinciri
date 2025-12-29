import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface IstatistikKartProps {
  baslik: string;
  deger: string | number;
  altBaslik?: string;
  ikon?: string;
}

/**
 * Tek bir istatistik kartı bileşeni
 */
export const IstatistikKart: React.FC<IstatistikKartProps> = ({
  baslik,
  deger,
  altBaslik,
  ikon,
}) => {
  return (
    <View style={styles.container}>
      {ikon && <Text style={styles.ikon}>{ikon}</Text>}
      <Text style={styles.baslik}>{baslik}</Text>
      <Text style={styles.deger}>{deger}</Text>
      {altBaslik && <Text style={styles.altBaslik}>{altBaslik}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    minWidth: 150,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  ikon: {
    fontSize: 32,
    marginBottom: 8,
  },
  baslik: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 8,
    textAlign: 'center',
  },
  deger: {
    fontSize: 36,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  altBaslik: {
    fontSize: 12,
    color: ISLAMI_RENKLER.altinAcik,
    textAlign: 'center',
  },
});

