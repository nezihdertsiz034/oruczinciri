import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { useOrucZinciri } from '../hooks/useOrucZinciri';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 64) / 7; // 7 gün için

interface RamazanTakvimiProps {
    onGunSec?: (tarih: Date) => void;
}

/**
 * Kompakt Ramazan Takvimi bileşeni
 * 30 günlük grid + oruç durumu gösterimi
 */
export const RamazanTakvimi: React.FC<RamazanTakvimiProps> = ({ onGunSec }) => {
    const { zincirHalkalari, toplamIsaretli } = useOrucZinciri();

    // Ramazan başlangıç ve bitiş tarihlerini hesapla (2026 Ramazan)
    const ramazanGunleri = useMemo(() => {
        // 2026 Ramazan: 19 Şubat - 19 Mart
        const ramazanBaslangic = new Date(2026, 1, 19); // Şubat = 1

        const bugun = new Date();
        bugun.setHours(0, 0, 0, 0);

        const gunler: { tarih: Date; gunNo: number; orucTutuldu: boolean; bugunMu: boolean }[] = [];

        for (let i = 0; i < 30; i++) {
            const tarih = new Date(ramazanBaslangic);
            tarih.setDate(ramazanBaslangic.getDate() + i);
            tarih.setHours(0, 0, 0, 0);

            const bugunMu = tarih.getTime() === bugun.getTime();


            // Oruç tutulup tutulmadığını kontrol et
            const halka = zincirHalkalari.find(h => {
                const hTarih = new Date(h.tarih);
                hTarih.setHours(0, 0, 0, 0);
                return hTarih.getTime() === tarih.getTime();
            });

            gunler.push({
                tarih,
                gunNo: i + 1,
                orucTutuldu: halka?.isaretli ?? false,
                bugunMu,
            });
        }

        return gunler;
    }, [zincirHalkalari]);

    // Hafta günleri başlıkları
    const haftaGunleri = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];

    // İlk günün haftanın hangi gününe denk geldiğini bul
    const ilkGunHaftaGunu = ramazanGunleri.length > 0 ? ramazanGunleri[0].tarih.getDay() : 0;

    // Grid için boş hücreler ekle
    const bosluklar = Array(ilkGunHaftaGunu).fill(null);
    const tumHucreler = [...bosluklar, ...ramazanGunleri];

    return (
        <View style={styles.container}>
            {/* Başlık */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerEmoji}>📅</Text>
                    <Text style={styles.headerTitle}>Ramazan Takvimi</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.orucSayisi}>{toplamIsaretli}/30</Text>
                    <Text style={styles.orucLabel}>oruç</Text>
                </View>
            </View>

            {/* Hafta günleri başlıkları */}
            <View style={styles.haftaBasliklari}>
                {haftaGunleri.map((gun, index) => (
                    <Text key={index} style={styles.haftaGunuBaslik}>{gun}</Text>
                ))}
            </View>

            {/* Takvim Grid */}
            <View style={styles.takvimGrid}>
                {tumHucreler.map((gun, index) => {
                    if (gun === null) {
                        return <View key={`bos-${index}`} style={styles.bosHucre} />;
                    }

                    return (
                        <TouchableOpacity
                            key={gun.gunNo}
                            style={[
                                styles.gunHucre,
                                gun.bugunMu && styles.bugunHucre,
                                gun.orucTutuldu && styles.orucTutulduHucre,
                            ]}
                            onPress={() => onGunSec?.(gun.tarih)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.gunNumara,
                                gun.bugunMu && styles.bugunNumara,
                                gun.orucTutuldu && styles.orucTutulduNumara,
                            ]}>
                                {gun.gunNo}
                            </Text>
                            {gun.orucTutuldu && (
                                <View style={styles.orucIsareti}>
                                    <Text style={styles.orucEmoji}>✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Açıklama */}
            <View style={styles.aciklama}>
                <View style={styles.aciklamaItem}>
                    <View style={[styles.ornek, styles.ornekBugün]} />
                    <Text style={styles.aciklamaText}>Bugün</Text>
                </View>
                <View style={styles.aciklamaItem}>
                    <View style={[styles.ornek, styles.ornekOruc]} />
                    <Text style={styles.aciklamaText}>Oruç tutuldu</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: ISLAMI_RENKLER.glassBackground,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: ISLAMI_RENKLER.glassBorder,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerEmoji: {
        fontSize: 22,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.display,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    orucSayisi: {
        fontSize: 20,
        fontWeight: '800',
        color: ISLAMI_RENKLER.altinAcik,
        fontFamily: TYPOGRAPHY.display,
    },
    orucLabel: {
        fontSize: 11,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
    },
    // Hafta başlıkları
    haftaBasliklari: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    haftaGunuBaslik: {
        width: CELL_SIZE,
        textAlign: 'center',
        fontSize: 11,
        fontWeight: '600',
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
    },
    // Grid
    takvimGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    bosHucre: {
        width: CELL_SIZE,
        height: CELL_SIZE,
    },
    gunHucre: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    bugunHucre: {
        backgroundColor: 'rgba(218, 165, 32, 0.25)',
        borderWidth: 2,
        borderColor: ISLAMI_RENKLER.altinOrta,
    },
    orucTutulduHucre: {
        backgroundColor: 'rgba(46, 204, 113, 0.25)',
    },
    gunNumara: {
        fontSize: 14,
        fontWeight: '600',
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.body,
    },
    bugunNumara: {
        color: ISLAMI_RENKLER.altinAcik,
        fontWeight: '800',
    },
    orucTutulduNumara: {
        color: '#2ecc71',
    },
    orucIsareti: {
        position: 'absolute',
        bottom: 2,
        right: 2,
    },
    orucEmoji: {
        fontSize: 10,
        color: '#2ecc71',
    },
    // Açıklama
    aciklama: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    aciklamaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
    },
    ornek: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 6,
    },
    ornekBugün: {
        backgroundColor: 'rgba(218, 165, 32, 0.25)',
        borderWidth: 2,
        borderColor: ISLAMI_RENKLER.altinOrta,
    },
    ornekOruc: {
        backgroundColor: 'rgba(46, 204, 113, 0.25)',
    },
    aciklamaText: {
        fontSize: 11,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
    },
});
