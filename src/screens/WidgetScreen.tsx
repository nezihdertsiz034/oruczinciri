import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { useNamazVakitleri } from '../hooks/useNamazVakitleri';
import { saniyeToZaman } from '../utils/namazVakitleri';

export default function WidgetScreen() {
  const { vakitler, yukleniyor, hata } = useNamazVakitleri();
  const [kalanSure, setKalanSure] = useState<number | null>(null);
  const [kalanEtiket, setKalanEtiket] = useState('İftara kalan');

  const bugunMetni = useMemo(() => {
    const bugun = new Date();
    return bugun.toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, []);

  useEffect(() => {
    if (!vakitler) return;

    const guncelleKalanSure = () => {
      const simdi = new Date();
      const simdiToplam = simdi.getHours() * 3600 + simdi.getMinutes() * 60 + simdi.getSeconds();

      const [imsakSaat, imsakDakika] = vakitler.imsak.split(':').map(Number);
      const [aksamSaat, aksamDakika] = vakitler.aksam.split(':').map(Number);

      const imsakToplam = imsakSaat * 3600 + imsakDakika * 60;
      const aksamToplam = aksamSaat * 3600 + aksamDakika * 60;

      if (simdiToplam < imsakToplam) {
        setKalanEtiket('Sahura kalan');
        setKalanSure(imsakToplam - simdiToplam);
        return;
      }

      if (simdiToplam < aksamToplam) {
        setKalanEtiket('İftara kalan');
        setKalanSure(aksamToplam - simdiToplam);
        return;
      }

      setKalanEtiket('Yarın için hazır');
      setKalanSure(null);
    };

    guncelleKalanSure();
    const timer = setInterval(guncelleKalanSure, 1000);

    return () => clearInterval(timer);
  }, [vakitler]);

  const formatKalanSure = (sure: number | null) => {
    if (sure === null) return '--:--:--';
    const zaman = saniyeToZaman(Math.max(0, sure));
    return `${String(zaman.saat).padStart(2, '0')}:${String(zaman.dakika).padStart(2, '0')}:${String(zaman.saniye).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecor />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🧩 Ana Ekran Widget</Text>

        <View style={styles.bolum}>
          <Text style={styles.bolumBaslik}>🔎 Widget Önizleme</Text>
          <View style={styles.widgetKart}>
            <Text style={styles.widgetBaslik}>Oruç Zinciri</Text>
            <Text style={styles.widgetTarih}>{bugunMetni}</Text>
            <View style={styles.widgetSatir}>
              <Text style={styles.widgetEtiket}>İmsak</Text>
              <Text style={styles.widgetDeger}>{vakitler?.imsak || '--:--'}</Text>
            </View>
            <View style={styles.widgetSatir}>
              <Text style={styles.widgetEtiket}>İftar</Text>
              <Text style={styles.widgetDeger}>{vakitler?.aksam || '--:--'}</Text>
            </View>
            <View style={styles.widgetKalan}>
              <Text style={styles.widgetKalanEtiket}>{kalanEtiket}</Text>
              <Text style={styles.widgetKalanDeger}>{formatKalanSure(kalanSure)}</Text>
            </View>
            {yukleniyor && (
              <Text style={styles.widgetBilgi}>Namaz vakitleri yükleniyor...</Text>
            )}
            {hata && (
              <Text style={styles.widgetBilgi}>Vakit verisi alınamadı.</Text>
            )}
          </View>
        </View>

        <View style={styles.bolum}>
          <Text style={styles.bolumBaslik}>📱 Ana Ekrana Ekleme</Text>
          <Text style={styles.adimText}>
            iOS: Ana ekranda boş bir alana basılı tutun -> \"+\" -> \"Oruç Zinciri\" widgetını seçin.
          </Text>
          <Text style={styles.adimText}>
            Android: Ana ekranda boş bir alana basılı tutun -> \"Widget'lar\" -> \"Oruç Zinciri\" widgetını seçin.
          </Text>
          <Text style={styles.bilgiText}>
            Widget için gösterilen içerik (imsak, iftar, kalan süre) bu ekrandaki önizleme ile aynıdır.
          </Text>
        </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 0.4,
  },
  bolum: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bolumBaslik: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 12,
    fontFamily: TYPOGRAPHY.display,
  },
  widgetKart: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  widgetBaslik: {
    fontSize: 18,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
  },
  widgetTarih: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
  },
  widgetSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  widgetEtiket: {
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.body,
  },
  widgetDeger: {
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.display,
  },
  widgetKalan: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
  },
  widgetKalanEtiket: {
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.body,
  },
  widgetKalanDeger: {
    color: ISLAMI_RENKLER.altinAcik,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.display,
    marginTop: 4,
  },
  widgetBilgi: {
    marginTop: 10,
    textAlign: 'center',
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontSize: 12,
    fontFamily: TYPOGRAPHY.body,
  },
  adimText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 10,
    lineHeight: 20,
    fontFamily: TYPOGRAPHY.body,
  },
  bilgiText: {
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 6,
    fontStyle: 'italic',
    fontFamily: TYPOGRAPHY.body,
  },
});
