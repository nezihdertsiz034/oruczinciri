import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { OrucSayaci } from '../components/OrucSayaci';
import { OrucZinciri } from '../components/OrucZinciri';
import { useNamazVakitleri } from '../hooks/useNamazVakitleri';

/**
 * Ana ekran - Oruç sayacı ve zincir özeti
 */
export default function HomeScreen() {
  const { vakitler, yukleniyor, hata } = useNamazVakitleri();

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecor />
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Oruç Sayacı */}
        <OrucSayaci vakitler={vakitler} yukleniyor={yukleniyor} />

        {/* Oruç Zinciri */}
        <OrucZinciri />

        {/* Hata Mesajı */}
        {hata && (
          <View style={styles.hataContainer}>
            <Text style={styles.hataText}>⚠️ {hata}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    overflow: 'hidden',
  },
  content: {
    paddingBottom: 20,
    paddingTop: 4,
  },
  hataContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: ISLAMI_RENKLER.kirmiziYumusak + '20',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.kirmiziYumusak,
  },
  hataText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
    textAlign: 'center',
    fontWeight: '600',
  },
});
