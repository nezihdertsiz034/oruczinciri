import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { useOrucZinciri } from '../hooks/useOrucZinciri';
import { OrucTamamlamaModal } from './OrucTamamlamaModal';

export const OrucZinciri: React.FC = () => {
  const { zincirHalkalari, yukleniyor, toplamIsaretli, gunuIsaretle } = useOrucZinciri();
  const [modalVisible, setModalVisible] = useState(false);
  const [secilenGun, setSecilenGun] = useState(1);

  const yuzde = useMemo(() => {
    if (zincirHalkalari.length === 0) return 0;
    return Math.round((toplamIsaretli / zincirHalkalari.length) * 100);
  }, [toplamIsaretli, zincirHalkalari.length]);

  if (yukleniyor) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={ISLAMI_RENKLER.altinAcik} />
        <Text style={styles.yukleniyorText}>Zincir yükleniyor...</Text>
      </View>
    );
  }

  if (zincirHalkalari.length === 0) return null;

  const handleHalkaPress = async (tarih: Date, isaretli: boolean, gunNumarasi: number) => {
    try {
      await gunuIsaretle(tarih, !isaretli);
      if (!isaretli) {
        setSecilenGun(gunNumarasi);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Halka işaretlenirken hata:', error);
    }
  };

  const haftalar: typeof zincirHalkalari[] = [];
  for (let i = 0; i < zincirHalkalari.length; i += 7) {
    haftalar.push(zincirHalkalari.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      {/* Header with Progress Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.baslik}>🔗 Şükür365</Text>
          <Text style={styles.progressText}>{toplamIsaretli} / {zincirHalkalari.length} Gün</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.percentCircle}>
            <Text style={styles.percentText}>%{yuzde}</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${yuzde}%` }]} />
      </View>

      <Text style={styles.ayBasligi}>🌙 Ramazan-ı Şerif</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {haftalar.map((hafta, haftaIndex) => (
          <View key={haftaIndex} style={styles.haftaGroup}>
            <Text style={styles.haftaLabel}>{haftaIndex + 1}. HAFTA</Text>
            <View style={styles.chainRow}>
              {hafta.map((halka, index) => {
                const globalIndex = haftaIndex * 7 + index;
                const isFirst = index === 0;

                return (
                  <View key={globalIndex} style={styles.linkWrapper}>
                    {/* Horizontal Connector Line */}
                    {!isFirst && (
                      <View style={[
                        styles.connector,
                        halka.isaretli && hafta[index - 1]?.isaretli && styles.connectorActive
                      ]} />
                    )}

                    <TouchableOpacity
                      style={[
                        styles.link,
                        halka.isaretli && styles.linkCompleted,
                        halka.bugunMu && styles.linkToday,
                      ]}
                      onPress={() => handleHalkaPress(halka.tarih, halka.isaretli, halka.gunNumarasi)}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.linkText,
                        halka.isaretli && styles.linkTextCompleted
                      ]}>
                        {halka.gunNumarasi}
                      </Text>
                      {halka.isaretli && (
                        <View style={styles.checkmarkContainer}>
                          <Ionicons name="checkmark-circle" size={24} color={ISLAMI_RENKLER.altinAcik} />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modern Legend */}
      <View style={styles.footer}>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={styles.dotPending} />
            <Text style={styles.legendLabel}>Bekliyor</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.dotCompleted} />
            <Text style={styles.legendLabel}>Şükür</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.dotToday} />
            <Text style={styles.legendLabel}>Bugün</Text>
          </View>
        </View>
        <Text style={styles.hintText}>* Halkaları birleştirerek zinciri tamamlama vakti!</Text>
      </View>

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
    backgroundColor: 'rgba(25, 60, 45, 0.45)',
    borderRadius: 30,
    margin: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  baslik: {
    fontSize: 20,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
  },
  progressText: {
    fontSize: 13,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '600',
    marginTop: 4,
  },
  headerRight: {
    marginLeft: 15,
  },
  percentCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(218, 165, 32, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
  },
  percentText: {
    fontSize: 12,
    fontWeight: '800',
    color: ISLAMI_RENKLER.altinAcik,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 3,
  },
  scrollContent: {
    paddingRight: 20,
  },
  haftaGroup: {
    marginRight: 24,
  },
  haftaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 12,
    opacity: 0.6,
    letterSpacing: 1,
  },
  chainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  connector: {
    width: 14,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: -1,
  },
  connectorActive: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
  },
  link: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  linkCompleted: {
    backgroundColor: ISLAMI_RENKLER.altinOrta + '30',
    borderColor: ISLAMI_RENKLER.altinAcik,
    transform: [{ scale: 1.05 }],
  },
  linkToday: {
    borderColor: ISLAMI_RENKLER.yesilAcik,
    borderWidth: 3,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
  },
  linkTextCompleted: {
    color: ISLAMI_RENKLER.altinAcik,
    fontSize: 10,
    opacity: 0.3, // Numara arkada hafif kalsın
  },
  checkmarkContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  ayBasligi: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotPending: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotCompleted: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ISLAMI_RENKLER.altinAcik,
  },
  dotToday: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: ISLAMI_RENKLER.yesilAcik,
  },
  legendLabel: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontWeight: '600',
    opacity: 0.8,
  },
  hintText: {
    fontSize: 11,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.5,
  },
  yukleniyorText: {
    marginTop: 8,
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    textAlign: 'center',
  },
});

