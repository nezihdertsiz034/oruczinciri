import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Share } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { Istatistikler } from '../types';

interface PaylasButonuProps {
  istatistikler: Istatistikler;
  style?: any;
}

/**
 * İstatistik paylaşım butonu
 */
export const PaylasButonu: React.FC<PaylasButonuProps> = ({
  istatistikler,
  style,
}) => {
  const handlePaylas = async () => {
    try {
      const paylasMetni = `📿 Şükür365 - Günlük Manevi Takip

✅ Toplam Oruç: ${istatistikler.toplamOruc} / ${istatistikler.toplamGun} gün
🔗 Kesintisiz Zincir: ${istatistikler.kesintisizZincir} gün
📊 İlerleme: %${istatistikler.yuzdelik}

${istatistikler.rozetler.length > 0 ? `🏆 Rozetler: ${istatistikler.rozetler.join(', ')}` : ''}

Manevi gelişimime devam ediyorum! 💪`;

      await Share.share({
        message: paylasMetni,
      });
    } catch (error) {
      console.error('Paylaşım hatası:', error);
      Alert.alert('Hata', 'Paylaşım sırasında bir hata oluştu.');
    }
  };

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={handlePaylas}>
      <Text style={styles.text}>📤 İlerlemeyi Paylaş</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.altinAcik,
  },
  text: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 16,
    fontWeight: 'bold',
  },
});






