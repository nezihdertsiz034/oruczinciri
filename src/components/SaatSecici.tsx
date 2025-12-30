import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface SaatSeciciProps {
  visible: boolean;
  mevcutSaat: string; // "HH:mm" formatında
  onClose: () => void;
  onSaatSec: (saat: string) => void;
  baslik: string;
}

/**
 * Saat seçici modal bileşeni
 */
export const SaatSecici: React.FC<SaatSeciciProps> = ({
  visible,
  mevcutSaat,
  onClose,
  onSaatSec,
  baslik,
}) => {
  const [saat, setSaat] = useState(() => {
    const [h, m] = mevcutSaat.split(':').map(Number);
    return { saat: h || 0, dakika: m || 0 };
  });

  const saatler = Array.from({ length: 24 }, (_, i) => i);
  const dakikalar = Array.from({ length: 60 }, (_, i) => i);

  const handleKaydet = () => {
    const saatString = `${String(saat.saat).padStart(2, '0')}:${String(saat.dakika).padStart(2, '0')}`;
    onSaatSec(saatString);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalBaslik}>{baslik}</Text>

          <View style={styles.seciliciContainer}>
            {/* Saat Seçici */}
            <View style={styles.secilici}>
              <Text style={styles.seciliciLabel}>Saat</Text>
              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {saatler.map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={[
                      styles.seciliciItem,
                      saat.saat === h && styles.seciliciItemSecili,
                    ]}
                    onPress={() => setSaat({ ...saat, saat: h })}
                  >
                    <Text
                      style={[
                        styles.seciliciItemText,
                        saat.saat === h && styles.seciliciItemTextSecili,
                      ]}
                    >
                      {String(h).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* İki Nokta */}
            <Text style={styles.ikiNokta}>:</Text>

            {/* Dakika Seçici */}
            <View style={styles.secilici}>
              <Text style={styles.seciliciLabel}>Dakika</Text>
              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {dakikalar.map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.seciliciItem,
                      saat.dakika === m && styles.seciliciItemSecili,
                    ]}
                    onPress={() => setSaat({ ...saat, dakika: m })}
                  >
                    <Text
                      style={[
                        styles.seciliciItemText,
                        saat.dakika === m && styles.seciliciItemTextSecili,
                      ]}
                    >
                      {String(m).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.seciliSaatContainer}>
            <Text style={styles.seciliSaatLabel}>Seçili Saat:</Text>
            <Text style={styles.seciliSaat}>
              {String(saat.saat).padStart(2, '0')}:
              {String(saat.dakika).padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.butonlar}>
            <TouchableOpacity style={styles.iptalButonu} onPress={onClose}>
              <Text style={styles.iptalButonuText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.kaydetButonu} onPress={handleKaydet}>
              <Text style={styles.kaydetButonuText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalBaslik: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 24,
    textAlign: 'center',
  },
  seciliciContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  secilici: {
    flex: 1,
    alignItems: 'center',
  },
  seciliciLabel: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 8,
    fontWeight: '600',
  },
  scrollView: {
    maxHeight: 200,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
  },
  seciliciItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 2,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  seciliciItemSecili: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
  },
  seciliciItemText: {
    fontSize: 18,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: '500',
  },
  seciliciItemTextSecili: {
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
  },
  ikiNokta: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginHorizontal: 12,
    marginTop: 20,
  },
  seciliSaatContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  seciliSaatLabel: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginBottom: 8,
  },
  seciliSaat: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.altinAcik,
  },
  butonlar: {
    flexDirection: 'row',
    gap: 12,
  },
  iptalButonu: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  iptalButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: 'bold',
    fontSize: 16,
  },
  kaydetButonu: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  kaydetButonuText: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontWeight: 'bold',
    fontSize: 16,
  },
});




