import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { NamazVakitleri } from '../types';
import { saniyeToZaman } from '../utils/namazVakitleri';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';

const { width } = Dimensions.get('window');

interface SonrakiNamazSayaciProps {
    vakitler: NamazVakitleri | null;
    yukleniyor?: boolean;
}

interface VakitBilgisi {
    isim: string;
    saat: string;
    emoji: string;
    saniye: number; // Gece yarısından itibaren saniye
}

/**
 * Sonraki namaza geri sayım ve tüm vakitleri gösteren bileşen
 */
export const SonrakiNamazSayaci: React.FC<SonrakiNamazSayaciProps> = ({ vakitler, yukleniyor = false }) => {
    const [sonrakiVakit, setSonrakiVakit] = useState<VakitBilgisi | null>(null);
    const [kalanSure, setKalanSure] = useState<number>(0);
    const [aktifVakitIndex, setAktifVakitIndex] = useState<number>(-1);

    // Vakit listesi
    const vakitListesi: VakitBilgisi[] = vakitler ? [
        { isim: 'İmsak', saat: vakitler.imsak, emoji: '🌙', saniye: saatToSaniye(vakitler.imsak) },
        { isim: 'Güneş', saat: vakitler.gunes, emoji: '🌅', saniye: saatToSaniye(vakitler.gunes) },
        { isim: 'Öğle', saat: vakitler.ogle, emoji: '☀️', saniye: saatToSaniye(vakitler.ogle) },
        { isim: 'İkindi', saat: vakitler.ikindi, emoji: '🌤️', saniye: saatToSaniye(vakitler.ikindi) },
        { isim: 'Akşam', saat: vakitler.aksam, emoji: '🌆', saniye: saatToSaniye(vakitler.aksam) },
        { isim: 'Yatsı', saat: vakitler.yatsi, emoji: '🌃', saniye: saatToSaniye(vakitler.yatsi) },
    ] : [];

    function saatToSaniye(saat: string): number {
        const [h, m] = saat.split(':').map(Number);
        return h * 3600 + m * 60;
    }

    useEffect(() => {
        if (!vakitler || vakitListesi.length === 0) return;

        const guncelle = () => {
            const simdi = new Date();
            const simdiSaniye = simdi.getHours() * 3600 + simdi.getMinutes() * 60 + simdi.getSeconds();

            // Sonraki vakti bul
            let bulunan = false;
            for (let i = 0; i < vakitListesi.length; i++) {
                if (vakitListesi[i].saniye > simdiSaniye) {
                    setSonrakiVakit(vakitListesi[i]);
                    setKalanSure(vakitListesi[i].saniye - simdiSaniye);
                    setAktifVakitIndex(i);
                    bulunan = true;
                    break;
                }
            }

            // Tüm vakitler geçtiyse yarının ilk vaktini göster
            if (!bulunan) {
                const yarinImsak = vakitListesi[0];
                const kalanYarin = (24 * 3600 - simdiSaniye) + yarinImsak.saniye;
                setSonrakiVakit(yarinImsak);
                setKalanSure(kalanYarin);
                setAktifVakitIndex(0);
            }
        };

        guncelle();
        const timer = setInterval(guncelle, 1000);
        return () => clearInterval(timer);
    }, [vakitler]);

    if (yukleniyor || !vakitler) {
        return null;
    }

    const zaman = saniyeToZaman(kalanSure);

    return (
        <View style={styles.container}>
            {/* Başlık */}
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>🕌</Text>
                <Text style={styles.headerTitle}>Namaz Vakitleri</Text>
            </View>

            {/* Sonraki Namaz Sayacı */}
            {sonrakiVakit && (
                <View style={styles.sayacContainer}>
                    <View style={styles.sayacHeader}>
                        <Text style={styles.sonrakiLabel}>Sonraki: </Text>
                        <Text style={styles.sonrakiVakit}>{sonrakiVakit.emoji} {sonrakiVakit.isim}</Text>
                    </View>
                    <View style={styles.sayacZaman}>
                        <Text style={styles.zamanText}>
                            {String(zaman.saat).padStart(2, '0')}:{String(zaman.dakika).padStart(2, '0')}:{String(zaman.saniye).padStart(2, '0')}
                        </Text>
                    </View>
                </View>
            )}

            {/* Tüm Vakitler Grid */}
            <View style={styles.vakitlerGrid}>
                {vakitListesi.map((vakit, index) => {
                    const gecmis = vakit.saniye <= (new Date().getHours() * 3600 + new Date().getMinutes() * 60);
                    const aktif = index === aktifVakitIndex;

                    return (
                        <View
                            key={vakit.isim}
                            style={[
                                styles.vakitItem,
                                gecmis && styles.vakitGecmis,
                                aktif && styles.vakitAktif,
                            ]}
                        >
                            <Text style={styles.vakitEmoji}>{vakit.emoji}</Text>
                            <Text style={[styles.vakitIsim, gecmis && styles.vakitIsimGecmis]}>{vakit.isim}</Text>
                            <Text style={[styles.vakitSaat, aktif && styles.vakitSaatAktif]}>{vakit.saat}</Text>
                        </View>
                    );
                })}
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerEmoji: {
        fontSize: 24,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.display,
    },
    // Sayaç
    sayacContainer: {
        backgroundColor: 'rgba(218, 165, 32, 0.15)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(218, 165, 32, 0.3)',
    },
    sayacHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sonrakiLabel: {
        fontSize: 14,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
    },
    sonrakiVakit: {
        fontSize: 16,
        fontWeight: '700',
        color: ISLAMI_RENKLER.altinAcik,
        fontFamily: TYPOGRAPHY.display,
    },
    sayacZaman: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    zamanText: {
        fontSize: 36,
        fontWeight: '800',
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.display,
        letterSpacing: 2,
    },
    // Vakitler Grid
    vakitlerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    vakitItem: {
        width: (width - 80) / 3,
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    vakitGecmis: {
        opacity: 0.5,
    },
    vakitAktif: {
        backgroundColor: 'rgba(218, 165, 32, 0.2)',
        borderWidth: 1,
        borderColor: ISLAMI_RENKLER.altinOrta,
    },
    vakitEmoji: {
        fontSize: 20,
        marginBottom: 4,
    },
    vakitIsim: {
        fontSize: 12,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
        marginBottom: 2,
    },
    vakitIsimGecmis: {
        color: 'rgba(255, 255, 255, 0.4)',
    },
    vakitSaat: {
        fontSize: 15,
        fontWeight: '700',
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.display,
    },
    vakitSaatAktif: {
        color: ISLAMI_RENKLER.altinAcik,
    },
});
