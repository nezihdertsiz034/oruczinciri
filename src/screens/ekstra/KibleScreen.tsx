import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EkstraScreenLayout } from '../../components/EkstraScreenLayout';
import { KibleYonu as KibleYonuComponent } from '../../components/KibleYonu';
import { useKibleYonu } from '../../hooks/useKibleYonu';
import { ISLAMI_RENKLER } from '../../constants/renkler';
import { TYPOGRAPHY } from '../../constants/typography';

interface KibleScreenProps { }

export default function KibleScreen(_props: KibleScreenProps) {
  const { kibleYonu, kibleOkAcisi, pusulaAcisi, yukleniyor, hata } = useKibleYonu();

  return (
    <EkstraScreenLayout gosterBaslik={false}>
      <KibleYonuComponent
        kibleYonu={kibleYonu}
        kibleOkAcisi={kibleOkAcisi}
        pusulaAcisi={pusulaAcisi}
        yukleniyor={yukleniyor}
        hata={hata}
      />
      <View style={styles.bilgiKart}>
        <Text style={styles.bilgiText}>
          Pusulanın çalışması için telefonunuzu düz tutun ve hareket ettirerek kalibre edin.
        </Text>
      </View>
    </EkstraScreenLayout>
  );
}

const styles = StyleSheet.create({
  bilgiKart: {
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesilOrta,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bilgiText: {
    fontSize: 14,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
    textAlign: 'center',
  },
});
