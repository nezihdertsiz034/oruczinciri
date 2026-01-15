/**
 * Kur'an Okuma Component'i
 * 
 * Arapça metin + Türkçe meal gösterir
 * Kitap formatında, baştan sona okuma
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { QuranAyah } from '../types/quran';
import { KURAN_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';

interface QuranReaderProps {
    arabicAyahs: QuranAyah[];
    turkishAyahs: QuranAyah[];
    currentSurahNumber: number;
    currentSurahName: string;
    onBookmark?: (ayahNumber: number, ayahNumberInSurah: number) => void;
    onFavorite?: (ayahNumber: number) => void;
    onShare?: (ayahNumber: number) => void;
    bookmarkedAyahs?: number[];
    favoriteAyahs?: number[];
    fontSize?: 'kucuk' | 'normal' | 'buyuk' | 'cokbuyuk' | 'dev' | 'yasli';
}

export function QuranReader({
    arabicAyahs,
    turkishAyahs,
    currentSurahNumber,
    currentSurahName,
    onBookmark,
    onFavorite,
    onShare,
    bookmarkedAyahs = [],
    favoriteAyahs = [],
    fontSize = 'normal',
}: QuranReaderProps) {

    const getFontSize = () => {
        switch (fontSize) {
            case 'kucuk':
                return { arabic: 22, turkish: 14, ayahNumber: 12, lineHeigh: 36 };
            case 'buyuk':
                return { arabic: 30, turkish: 18, ayahNumber: 14, lineHeigh: 48 };
            case 'cokbuyuk':
                return { arabic: 34, turkish: 22, ayahNumber: 16, lineHeigh: 54 };
            case 'dev':
                return { arabic: 42, turkish: 26, ayahNumber: 18, lineHeigh: 64 };
            case 'yasli':
                return { arabic: 50, turkish: 32, ayahNumber: 20, lineHeigh: 72 };
            case 'normal':
            default:
                return { arabic: 26, turkish: 16, ayahNumber: 13, lineHeigh: 42 };
        }
    };

    const fonts = getFontSize();

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Sure Başlığı */}
            <View style={styles.surahHeader}>
                <Text style={styles.surahNumber}>Sure {currentSurahNumber}</Text>
                <Text style={styles.surahName}>{currentSurahName}</Text>
                <View style={styles.divider} />
            </View>

            {/* Besmele (Tevbe suresi hariç) */}
            {currentSurahNumber !== 9 && currentSurahNumber !== 1 && (
                <View style={styles.besmeleContainer}>
                    <Text style={[styles.arabicText, { fontSize: fonts.arabic }]}>
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </Text>
                </View>
            )}

            {/* Ayetler */}
            {arabicAyahs.map((arabicAyah, index) => {
                const turkishAyah = turkishAyahs[index];
                const isBookmarked = bookmarkedAyahs.includes(arabicAyah.number);
                const isFavorite = favoriteAyahs.includes(arabicAyah.number);

                return (
                    <View key={arabicAyah.number} style={styles.ayahContainer}>
                        {/* Arapça Metin */}
                        <Text style={[styles.arabicText, { fontSize: fonts.arabic, lineHeight: fonts.lineHeigh }]}>
                            {arabicAyah.text}
                        </Text>

                        {/* Türkçe Meal */}
                        <Text style={[styles.turkishText, { fontSize: fonts.turkish }]}>
                            {turkishAyah.text}
                        </Text>

                        {/* Ayet Bilgileri ve Aksiyonlar */}
                        <View style={styles.ayahFooter}>
                            {/* Ayet Numarası */}
                            <View style={styles.ayahNumberContainer}>
                                <Text style={[styles.ayahNumber, { fontSize: fonts.ayahNumber }]}>
                                    {arabicAyah.numberInSurah}
                                </Text>
                            </View>

                            {/* Aksiyon Butonları */}
                            <View style={styles.actionButtons}>
                                {/* Bookmark */}
                                {onBookmark && (
                                    <TouchableOpacity
                                        onPress={() => onBookmark(arabicAyah.number, arabicAyah.numberInSurah)}
                                        style={styles.actionButton}
                                    >
                                        <Text style={[
                                            styles.actionIcon,
                                            isBookmarked && styles.actionIconActive
                                        ]}>
                                            {isBookmarked ? '🔖' : '📑'}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                {/* Favorite */}
                                {onFavorite && (
                                    <TouchableOpacity
                                        onPress={() => onFavorite(arabicAyah.number)}
                                        style={styles.actionButton}
                                    >
                                        <Text style={[
                                            styles.actionIcon,
                                            isFavorite && styles.actionIconActive
                                        ]}>
                                            {isFavorite ? '❤️' : '🤍'}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                {/* Share */}
                                {onShare && (
                                    <TouchableOpacity
                                        onPress={() => onShare(arabicAyah.number)}
                                        style={styles.actionButton}
                                    >
                                        <Text style={styles.actionIcon}>📤</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* Ayırıcı Çizgi */}
                        {index < arabicAyahs.length - 1 && <View style={styles.ayahDivider} />}
                    </View>
                );
            })}

            {/* Sure Sonu Boşluğu */}
            <View style={styles.surahEnd} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KURAN_RENKLER.background,
    },
    surahHeader: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
        backgroundColor: KURAN_RENKLER.cardBackground,
        borderBottomWidth: 2,
        borderBottomColor: KURAN_RENKLER.sureBaslik,
    },
    surahNumber: {
        fontSize: 14,
        color: KURAN_RENKLER.ayetNumarasi,
        fontWeight: '600',
        marginBottom: 4,
    },
    surahName: {
        fontSize: 24,
        color: KURAN_RENKLER.sureBaslik,
        fontWeight: 'bold',
        fontFamily: TYPOGRAPHY.body,
    },
    divider: {
        width: 60,
        height: 3,
        backgroundColor: KURAN_RENKLER.ayetNumarasi,
        marginTop: 12,
        borderRadius: 2,
    },
    besmeleContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: KURAN_RENKLER.cardBackground,
        marginBottom: 8,
    },
    ayahContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: KURAN_RENKLER.cardBackground,
        marginBottom: 8,
    },
    arabicText: {
        color: KURAN_RENKLER.arapcaMetin,
        textAlign: 'right',
        lineHeight: 42,
        fontWeight: '600',
        marginBottom: 12,
    },
    turkishText: {
        color: KURAN_RENKLER.turkceMeal,
        textAlign: 'left',
        lineHeight: 24,
        fontFamily: TYPOGRAPHY.body,
        marginBottom: 12,
    },
    ayahFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    ayahNumberContainer: {
        backgroundColor: KURAN_RENKLER.ayetNumarasi,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    ayahNumber: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 4,
    },
    actionIcon: {
        fontSize: 20,
        opacity: 0.6,
    },
    actionIconActive: {
        opacity: 1,
    },
    ayahDivider: {
        height: 1,
        backgroundColor: KURAN_RENKLER.border,
        marginTop: 12,
        opacity: 0.3,
    },
    surahEnd: {
        height: 40,
    },
});
