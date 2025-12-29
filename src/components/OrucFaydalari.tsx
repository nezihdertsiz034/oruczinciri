import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';

/**
 * Oruç faydaları - günlük bilgi kartı
 */
const ORUC_FAYDALARI = [
  {
    baslik: '💚 Fiziksel Sağlık',
    icerik: 'Oruç, vücudun detoks mekanizmasını harekete geçirir ve hücre yenilenmesini destekler.',
  },
  {
    baslik: '🧠 Zihinsel Berraklık',
    icerik: 'Oruç tutmak zihinsel odaklanmayı artırır ve hafızayı güçlendirir.',
  },
  {
    baslik: '❤️ Kalp Sağlığı',
    icerik: 'Düzenli oruç, kolesterol seviyelerini düşürür ve kalp sağlığını korur.',
  },
  {
    baslik: '⚖️ Kilo Kontrolü',
    icerik: 'Oruç, metabolizmayı düzenleyerek sağlıklı kilo yönetimine yardımcı olur.',
  },
  {
    baslik: '🛡️ Bağışıklık Sistemi',
    icerik: 'Oruç, bağışıklık sistemini güçlendirir ve hastalıklara karşı direnci artırır.',
  },
  {
    baslik: '🧘 Ruhsal Huzur',
    icerik: 'Oruç, sabır ve şükür duygularını geliştirerek ruhsal huzur sağlar.',
  },
  {
    baslik: '🔋 Enerji Seviyesi',
    icerik: 'Oruç, vücudun enerji kullanımını optimize eder ve dayanıklılığı artırır.',
  },
  {
    baslik: '🌱 Hücre Yenilenmesi',
    icerik: 'Oruç, hücrelerin kendini onarma ve yenileme sürecini hızlandırır.',
  },
  {
    baslik: '🧬 Uzun Ömür',
    icerik: 'Araştırmalar, düzenli oruç tutmanın yaşam süresini uzatabileceğini gösteriyor.',
  },
  {
    baslik: '💪 Kas Korunması',
    icerik: 'Oruç, yağ yakımını artırırken kas kütlesini korumaya yardımcı olur.',
  },
  {
    baslik: '🧪 İnsülin Duyarlılığı',
    icerik: 'Oruç, insülin duyarlılığını iyileştirerek diyabet riskini azaltır.',
  },
  {
    baslik: '🎯 Odaklanma',
    icerik: 'Oruç, zihinsel netliği artırarak günlük işlerde daha iyi performans sağlar.',
  },
  {
    baslik: '🌙 Uyku Kalitesi',
    icerik: 'Oruç, uyku düzenini iyileştirerek daha kaliteli bir uyku sağlar.',
  },
  {
    baslik: '🧹 Toksin Temizliği',
    icerik: 'Oruç, vücuttaki toksinlerin atılmasını hızlandırarak temizlik sağlar.',
  },
  {
    baslik: '💎 Cilt Sağlığı',
    icerik: 'Oruç, cilt hücrelerinin yenilenmesini destekleyerek daha sağlıklı bir cilt sağlar.',
  },
  {
    baslik: '🎁 Şükür ve Sabır',
    icerik: 'Oruç, nimetlerin kıymetini anlamayı ve sabır göstermeyi öğretir.',
  },
  {
    baslik: '🔬 Kanser Önleme',
    icerik: 'Araştırmalar, orucun bazı kanser türlerine karşı koruyucu olabileceğini gösteriyor.',
  },
  {
    baslik: '🧠 Beyin Sağlığı',
    icerik: 'Oruç, beyin hücrelerinin büyümesini destekleyerek bilişsel sağlığı korur.',
  },
  {
    baslik: '💧 Su Dengesi',
    icerik: 'Oruç, vücudun su dengesini düzenleyerek optimal hidrasyon sağlar.',
  },
  {
    baslik: '🌟 Manevi Gelişim',
    icerik: 'Oruç, manevi gelişimi destekleyerek iç huzur ve barış sağlar.',
  },
  {
    baslik: '⚡ Metabolik Sağlık',
    icerik: 'Oruç, metabolik sağlığı iyileştirerek genel sağlık durumunu destekler.',
  },
  {
    baslik: '🎨 Yaratıcılık',
    icerik: 'Oruç, zihinsel netlik sağlayarak yaratıcı düşünceyi artırır.',
  },
  {
    baslik: '🔄 Hücre Otofajisi',
    icerik: 'Oruç, hücrelerin kendini temizleme sürecini (otofaji) aktive eder.',
  },
  {
    baslik: '💊 İlaç Etkisi',
    icerik: 'Oruç, vücudun doğal iyileşme mekanizmalarını harekete geçirir.',
  },
  {
    baslik: '🌍 Çevre Bilinci',
    icerik: 'Oruç, tüketim alışkanlıklarını gözden geçirerek çevre bilincini artırır.',
  },
  {
    baslik: '🤝 Empati',
    icerik: 'Oruç, açlık deneyimiyle empati kurmayı ve yardımlaşmayı öğretir.',
  },
  {
    baslik: '📚 Öz Disiplin',
    icerik: 'Oruç, öz disiplin ve irade gücünü geliştirerek kişisel gelişimi destekler.',
  },
  {
    baslik: '🎯 Hedef Odaklılık',
    icerik: 'Oruç, hedeflere odaklanmayı ve kararlılığı güçlendirir.',
  },
  {
    baslik: '🌱 Büyüme Hormonu',
    icerik: 'Oruç, büyüme hormonu seviyelerini artırarak kas ve kemik sağlığını destekler.',
  },
  {
    baslik: '🧬 DNA Onarımı',
    icerik: 'Oruç, DNA onarım mekanizmalarını aktive ederek hücre sağlığını korur.',
  },
  {
    baslik: '💚 Kalp Ritmi',
    icerik: 'Oruç, kalp ritmini düzenleyerek kardiyovasküler sağlığı iyileştirir.',
  },
];

export const OrucFaydalari: React.FC = () => {
  const [gununFaydasi, setGununFaydasi] = useState(ORUC_FAYDALARI[0]);
  const [genisletildi, setGenisletildi] = useState(false);

  useEffect(() => {
    // Bugünün tarihine göre günlük fayda seç
    const bugun = new Date();
    const gunNumarasi = bugun.getDate(); // Ayın günü (1-31)
    const faydaIndex = (gunNumarasi - 1) % ORUC_FAYDALARI.length;
    setGununFaydasi(ORUC_FAYDALARI[faydaIndex]);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setGenisletildi(!genisletildi)}
        activeOpacity={0.8}
      >
        <View style={styles.headerContent}>
          <Text style={styles.baslik}>{gununFaydasi.baslik}</Text>
          <Text style={styles.acilmaIkon}>{genisletildi ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>
      
      {genisletildi && (
        <View style={styles.icerik}>
          <Text style={styles.icerikText}>{gununFaydasi.icerik}</Text>
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
    fontSize: 16,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyaz,
    letterSpacing: 0.3,
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
  icerikText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    lineHeight: 20,
    marginTop: 12,
    fontWeight: '500',
  },
});

