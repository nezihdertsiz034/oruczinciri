import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { useOrucZinciri } from '../hooks/useOrucZinciri';
import { bugunRamazanMi } from '../utils/ramazanTarihleri';

// Hücre boyutları - Yüzde bazlı genişlik ve sabit yükseklik ile hizalamayı garanti altına alıyoruz
const CELL_WIDTH = '14.28%';
const CELL_HEIGHT = 46;

interface RamazanTakvimiProps {
    onGunSec?: (tarih: Date) => void;
}

/**
 * Kompakt Ramazan Takvimi bileşeni
 * 30 günlük grid + oruç durumu gösterimi
 */
export const RamazanTakvimi: React.FC<RamazanTakvimiProps> = ({ onGunSec }) => {
    const { zincirHalkalari, toplamIsaretli } = useOrucZinciri();
    const [viewDate, setViewDate] = useState(new Date());

    const handlePreviousMonth = () => {
        const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        setViewDate(prev);
    };

    const handleNextMonth = () => {
        const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        setViewDate(next);
    };

    // Mevcut ay bilgilerini hesapla
    const ayBilgileri = useMemo(() => {
        const simdi = viewDate;
        const yil = simdi.getFullYear();
        const ay = simdi.getMonth(); // 0-11

        // Ay ismini al (Türkçe)
        const ayIsmi = new Intl.DateTimeFormat('tr-TR', { month: 'long' }).format(simdi);
        const ayIsmiBuyuk = ayIsmi.charAt(0).toUpperCase() + ayIsmi.slice(1);

        // Ayın ilk günü ve son gününü bul
        const ilkGun = new Date(yil, ay, 1);
        const sonGun = new Date(yil, ay + 1, 0);
        const gunSayisi = sonGun.getDate();

        const gunler = [];
        const bugun = new Date();
        bugun.setHours(0, 0, 0, 0);

        for (let i = 1; i <= gunSayisi; i++) {
            const tarih = new Date(yil, ay, i);
            const bugunMu = tarih.getTime() === bugun.getTime();

            // Oruç durumunu kontrol et
            const halka = zincirHalkalari.find(h => {
                const hTarih = new Date(h.tarih);
                hTarih.setHours(0, 0, 0, 0);
                return hTarih.getTime() === tarih.getTime();
            });

            gunler.push({
                tarih,
                gunNo: i,
                orucTutuldu: halka?.isaretli ?? false,
                bugunMu,
                isRamazan: bugunRamazanMi(tarih),
            });
        }

        return {
            ayIsmi: ayIsmiBuyuk,
            yil,
            gunler,
            ilkGunHaftaGunu: ilkGun.getDay(),
            toplamGun: gunSayisi
        };
    }, [zincirHalkalari, viewDate]);

    // Hafta günleri başlıkları (Pazartesi ile başlama tercihi olabilir ama standart Pazar)
    const haftaGunleri = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];

    // Grid için boş hücreler ekle
    const bosluklar = Array(ayBilgileri.ilkGunHaftaGunu).fill(null);
    const tumHucreler = [...bosluklar, ...ayBilgileri.gunler];

    return (
        <View style={styles.container}>
            {/* Başlık */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.calendarIcon}>
                        <Text style={styles.headerEmoji}>📅</Text>
                    </View>
                    <View style={styles.titleSection}>
                        <View style={styles.monthNav}>
                            <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
                                <Ionicons name="chevron-back" size={20} color={ISLAMI_RENKLER.altinAcik} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>{ayBilgileri.ayIsmi}</Text>
                            <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                                <Ionicons name="chevron-forward" size={20} color={ISLAMI_RENKLER.altinAcik} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.yearSubTitle}>{ayBilgileri.yil}</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.orucSayisi}>{toplamIsaretli}/{ayBilgileri.toplamGun}</Text>
                    <Text style={styles.orucLabel}>tamamlandı</Text>
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
                                gun.isRamazan && styles.ramazanHucre,
                                gun.bugunMu && styles.bugunHucre,
                                gun.orucTutuldu && styles.orucTutulduHucre,
                            ]}
                            onPress={() => onGunSec?.(gun.tarih)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.gunNumara,
                                gun.isRamazan && styles.ramazanNumara,
                                gun.bugunMu && styles.bugunNumara,
                                gun.orucTutuldu && styles.orucTutulduNumara,
                            ]}>
                                {gun.gunNo}
                            </Text>
                            {(gun.orucTutuldu || (gun.isRamazan && gun.tarih < new Date())) && (
                                <View style={styles.orucIsareti}>
                                    <Text style={styles.orucEmoji}>{gun.orucTutuldu ? '✓' : ''}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Açıklama */}
            <View style={styles.aciklama}>
                <View style={styles.aciklamaItem}>
                    <View style={styles.ornekBugün} />
                    <Text style={styles.aciklamaText}>Bugün</Text>
                </View>
                <View style={styles.aciklamaItem}>
                    <View style={styles.ornekOruc} />
                    <Text style={styles.aciklamaText}>Tutuldu</Text>
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
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    calendarIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(218, 165, 32, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerEmoji: {
        fontSize: 18,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: ISLAMI_RENKLER.yaziBeyaz,
        fontFamily: TYPOGRAPHY.display,
        minWidth: 80,
        textAlign: 'center',
    },
    titleSection: {
        justifyContent: 'center',
    },
    monthNav: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navButton: {
        padding: 5,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    yearSubTitle: {
        fontSize: 10,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        marginTop: -2,
        opacity: 0.6,
        textAlign: 'center',
        fontWeight: '700',
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    orucSayisi: {
        fontSize: 20,
        fontWeight: '800',
        color: ISLAMI_RENKLER.altinAcik,
        fontFamily: TYPOGRAPHY.display,
        lineHeight: 22,
    },
    orucLabel: {
        fontSize: 10,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    haftaBasliklari: {
        flexDirection: 'row',
        marginBottom: 12,
        justifyContent: 'space-between',
    },
    haftaGunuBaslik: {
        width: CELL_WIDTH,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '700',
        color: ISLAMI_RENKLER.altinOrta,
        fontFamily: TYPOGRAPHY.body,
        opacity: 0.8,
    },
    takvimGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
    bosHucre: {
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        marginBottom: 6,
    },
    gunHucre: {
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    bugunHucre: {
        backgroundColor: 'rgba(218, 165, 32, 0.2)',
        borderWidth: 1.5,
        borderColor: ISLAMI_RENKLER.altinOrta,
    },
    orucTutulduHucre: {
        backgroundColor: 'rgba(46, 204, 113, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(46, 204, 113, 0.3)',
    },
    gunNumara: {
        fontSize: 15,
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
        right: 4,
    },
    orucEmoji: {
        fontSize: 10,
        color: '#2ecc71',
    },
    aciklama: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.08)',
    },
    aciklamaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    ornekBugün: {
        width: 10,
        height: 10,
        borderRadius: 3,
        backgroundColor: 'rgba(218, 165, 32, 0.2)',
        borderWidth: 1,
        borderColor: ISLAMI_RENKLER.altinOrta,
        marginRight: 6,
    },
    ornekOruc: {
        width: 10,
        height: 10,
        borderRadius: 3,
        backgroundColor: 'rgba(46, 204, 113, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(46, 204, 113, 0.3)',
        marginRight: 6,
    },
    aciklamaText: {
        fontSize: 11,
        color: ISLAMI_RENKLER.yaziBeyazYumusak,
        fontFamily: TYPOGRAPHY.body,
    },
    ramazanHucre: {
        backgroundColor: 'rgba(218, 165, 32, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(218, 165, 32, 0.3)',
        shadowColor: ISLAMI_RENKLER.altinAcik,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    ramazanNumara: {
        color: ISLAMI_RENKLER.altinAcik,
        fontWeight: '700',
    },
});
