import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Dua } from '../types';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface DuaKartProps {
  dua: Dua;
  onFavoriToggle?: (duaId: string) => void;
}

/**
 * Dua kartı bileşeni
 */
export const DuaKart: React.FC<DuaKartProps> = ({ dua, onFavoriToggle }) => {
  const [genisletildi, setGenisletildi] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.baslik}>{dua.baslik}</Text>
        {onFavoriToggle && (
          <TouchableOpacity onPress={() => onFavoriToggle(dua.id)}>
            <Text style={styles.favoriIcon}>
              {dua.favori ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.arapcaContainer}>
          <Text style={styles.arapca}>{dua.arapca}</Text>
        </View>

        {dua.turkceOkunus && (
          <View style={styles.okunusContainer}>
            <Text style={styles.okunusLabel}>Okunuş:</Text>
            <Text style={styles.okunus}>{dua.turkceOkunus}</Text>
          </View>
        )}

        <View style={styles.anlamContainer}>
          <Text style={styles.anlamLabel}>Anlam:</Text>
          <Text style={styles.anlam}>{dua.turkceAnlam}</Text>
        </View>

        {dua.kaynak && (
          <Text style={styles.kaynak}>— {dua.kaynak}</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.genisletButonu}
        onPress={() => setGenisletildi(!genisletildi)}
      >
        <Text style={styles.genisletText}>
          {genisletildi ? '▲ Daha Az' : '▼ Daha Fazla'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  baslik: {
    fontSize: 22,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    flex: 1,
    letterSpacing: 0.5,
  },
  favoriIcon: {
    fontSize: 24,
  },
  content: {
    maxHeight: 300,
  },
  arapcaContainer: {
    marginBottom: 18,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  arapca: {
    fontSize: 18,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'right',
    lineHeight: 32,
    writingDirection: 'rtl',
  },
  okunusContainer: {
    marginBottom: 12,
  },
  okunusLabel: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 4,
    fontWeight: '600',
  },
  okunus: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  anlamContainer: {
    marginBottom: 12,
  },
  anlamLabel: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 4,
    fontWeight: '600',
  },
  anlam: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyaz,
    lineHeight: 24,
  },
  kaynak: {
    fontSize: 13,
    color: ISLAMI_RENKLER.altinAcik,
    textAlign: 'right',
    fontStyle: 'italic',
    marginTop: 8,
  },
  genisletButonu: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  genisletText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.altinAcik,
    textAlign: 'center',
    fontWeight: '600',
  },
});


