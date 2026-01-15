/**
 * Kur'an-ı Kerim Okuma Ekranı
 * 
 * Kitap formatında baştan sona okuma
 * Opsiyonel sure seçimi ile atlama
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    FlatList,
    Share as RNShare,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuran } from '../hooks/useQuran';
import { QuranReader } from '../components/QuranReader';
import { QuranBookmark } from '../types/quran';
import { KURAN_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import { BackgroundDecor } from '../components/BackgroundDecor';
import { getSurahTurkishName } from '../utils/quranApi';
import { yukleUygulamaAyarlari, kaydetUygulamaAyarlari } from '../utils/storage';
import { UygulamaAyarlari } from '../types';

export default function QuranScreen() {
    const {
        surahs,
        currentSurah,
        loading,
        error,
        progress,
        bookmarks,
        favorites,
        loadSurah,
        addBookmark,
        removeBookmark,
        addFavorite,
        removeFavorite,
    } = useQuran();

    const [showSurahList, setShowSurahList] = useState(false);
    const [currentSurahIndex, setCurrentSurahIndex] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const [uygulamaAyarlari, setUygulamaAyarlari] = useState<UygulamaAyarlari | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await yukleUygulamaAyarlari();
            setUygulamaAyarlari(settings);
        };
        loadSettings();
    }, []);

    /**
     * İlk yükleme - kaldığı yerden devam veya Fatiha'dan başla
     */
    useEffect(() => {
        // Sadece bir kez çalışsın
        if (isInitialized || !progress) return;

        if (progress.lastReadSurah > 0) {
            // Kaldığı yerden devam
            loadSurah(progress.lastReadSurah);
            setCurrentSurahIndex(progress.lastReadSurah - 1);
        } else {
            // Fatiha'dan başla
            loadSurah(1);
            setCurrentSurahIndex(0);
        }

        setIsInitialized(true);
    }, [progress, isInitialized, loadSurah]);

    /**
     * Sonraki sureye geç
     */
    const goToNextSurah = useCallback(() => {
        if (currentSurahIndex < 113) { // 114 sure var (0-113 index)
            const nextIndex = currentSurahIndex + 1;
            setCurrentSurahIndex(nextIndex);
            loadSurah(nextIndex + 1);
        } else {
            Alert.alert('Hatim Tamamlandı', 'Kur\'an-ı Kerim\'i tamamladınız! 🎉');
        }
    }, [currentSurahIndex, loadSurah]);

    /**
     * Önceki sureye geç
     */
    const goToPreviousSurah = useCallback(() => {
        if (currentSurahIndex > 0) {
            const prevIndex = currentSurahIndex - 1;
            setCurrentSurahIndex(prevIndex);
            loadSurah(prevIndex + 1);
        }
    }, [currentSurahIndex, loadSurah]);

    /**
     * Belirli bir sureye atla
     */
    const goToSurah = useCallback((surahNumber: number) => {
        setCurrentSurahIndex(surahNumber - 1);
        loadSurah(surahNumber);
        setShowSurahList(false);
    }, [loadSurah]);

    /**
     * Bookmark ekle/çıkar
     */
    const handleBookmark = useCallback((ayahNumber: number, ayahNumberInSurah: number) => {
        if (!currentSurah) return;

        const existingBookmark = bookmarks.find(
            b => b.surahNumber === currentSurah.arabic.number && b.ayahNumberInSurah === ayahNumberInSurah
        );

        if (existingBookmark) {
            removeBookmark(existingBookmark.id);
        } else {
            const bookmark: QuranBookmark = {
                id: `${currentSurah.arabic.number}-${ayahNumberInSurah}-${Date.now()}`,
                surahNumber: currentSurah.arabic.number,
                surahName: currentSurah.arabic.englishName,
                ayahNumber,
                ayahNumberInSurah,
                timestamp: Date.now(),
            };
            addBookmark(bookmark);
        }
    }, [currentSurah, bookmarks, addBookmark, removeBookmark]);

    /**
     * Favori ekle/çıkar
     */
    const handleFavorite = useCallback((ayahNumber: number) => {
        if (favorites.includes(ayahNumber)) {
            removeFavorite(ayahNumber);
        } else {
            addFavorite(ayahNumber);
        }
    }, [favorites, addFavorite, removeFavorite]);

    /**
     * Ayet paylaş
     */
    const handleShare = useCallback(async (ayahNumber: number) => {
        if (!currentSurah) return;

        const ayahIndex = currentSurah.arabic.ayahs.findIndex(a => a.number === ayahNumber);
        if (ayahIndex === -1) return;

        const arabicText = currentSurah.arabic.ayahs[ayahIndex].text;
        const turkishText = currentSurah.turkish.ayahs[ayahIndex].text;
        const ayahNumberInSurah = currentSurah.arabic.ayahs[ayahIndex].numberInSurah;

        const shareText = `${currentSurah.arabic.englishName} Suresi, Ayet ${ayahNumberInSurah}\n\n${arabicText}\n\n${turkishText}\n\n- Şükür365`;

        try {
            await RNShare.share({
                message: shareText,
            });
        } catch (error) {
            console.error('Paylaşım hatası:', error);
        }
    }, [currentSurah]);

    /**
     * Yazı boyutunu hızlıca değiştir
     */
    const toggleFontSize = useCallback(async () => {
        if (!uygulamaAyarlari) return;

        const sizes: UygulamaAyarlari['yaziBoyutu'][] = ['kucuk', 'normal', 'buyuk', 'cokbuyuk', 'dev', 'yasli'];
        const currentIndex = sizes.indexOf(uygulamaAyarlari.yaziBoyutu);
        const nextIndex = (currentIndex + 1) % sizes.length;
        const nextSize = sizes[nextIndex];

        const yeniAyarlar = { ...uygulamaAyarlari, yaziBoyutu: nextSize };
        setUygulamaAyarlari(yeniAyarlar);
        await kaydetUygulamaAyarlari(yeniAyarlar);
    }, [uygulamaAyarlari]);

    /**
     * Sure listesi modal'ı
     */
    const renderSurahListModal = () => (
        <Modal
            visible={showSurahList}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowSurahList(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Sure Seç</Text>
                        <TouchableOpacity onPress={() => setShowSurahList(false)}>
                            <Text style={styles.modalClose}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={surahs}
                        keyExtractor={(item) => item.number.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.surahItem,
                                    item.number === currentSurahIndex + 1 && styles.surahItemActive
                                ]}
                                onPress={() => goToSurah(item.number)}
                            >
                                <View style={styles.surahItemLeft}>
                                    <View style={styles.surahNumberBadge}>
                                        <Text style={styles.surahNumberText}>{item.number}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.surahItemName}>{getSurahTurkishName(item.englishName)}</Text>
                                        <Text style={styles.surahItemInfo}>
                                            {item.numberOfAyahs} ayet • {item.revelationType === 'Meccan' ? 'Mekki' : 'Medeni'}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.surahItemArabic}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </Modal>
    );

    if (loading && !currentSurah) {
        return (
            <SafeAreaView style={styles.container}>
                <BackgroundDecor />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={KURAN_RENKLER.sureBaslik} />
                    <Text style={styles.loadingText}>Kur'an-ı Kerim yükleniyor...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <BackgroundDecor />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>❌ {error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => loadSurah(currentSurahIndex + 1)}>
                        <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <BackgroundDecor />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setShowSurahList(true)} style={styles.headerButton}>
                    <Text style={styles.headerButtonText}>📖 Sureler</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Kur'an-ı Kerim</Text>

                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={toggleFontSize} style={styles.fontSizeButton}>
                        <Text style={styles.fontSizeButtonText}>A+</Text>
                    </TouchableOpacity>
                    <Text style={styles.progressText}>
                        {currentSurahIndex + 1}/114
                    </Text>
                </View>
            </View>

            {/* Kur'an Reader */}
            {currentSurah && (
                <>
                    <QuranReader
                        arabicAyahs={currentSurah.arabic.ayahs}
                        turkishAyahs={currentSurah.turkish.ayahs}
                        currentSurahNumber={currentSurah.arabic.number}
                        currentSurahName={getSurahTurkishName(currentSurah.arabic.englishName)}
                        onBookmark={handleBookmark}
                        onFavorite={handleFavorite}
                        onShare={handleShare}
                        bookmarkedAyahs={bookmarks.map(b => b.ayahNumber)}
                        favoriteAyahs={favorites}
                        fontSize={uygulamaAyarlari?.yaziBoyutu}
                    />

                    {/* Loading Overlay - Sure değiştirirken */}
                    {loading && (
                        <View style={styles.loadingOverlay}>
                            <View style={styles.loadingBox}>
                                <ActivityIndicator size="large" color={KURAN_RENKLER.sureBaslik} />
                                <Text style={styles.loadingOverlayText}>Sure yükleniyor...</Text>
                            </View>
                        </View>
                    )}
                </>
            )}

            {/* Navigation Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.navButton, currentSurahIndex === 0 && styles.navButtonDisabled]}
                    onPress={goToPreviousSurah}
                    disabled={currentSurahIndex === 0}
                >
                    <Text style={styles.navButtonText}>⬅️ Önceki Sure</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navButton, currentSurahIndex === 113 && styles.navButtonDisabled]}
                    onPress={goToNextSurah}
                    disabled={currentSurahIndex === 113}
                >
                    <Text style={styles.navButtonText}>Sonraki Sure ➡️</Text>
                </TouchableOpacity>
            </View>

            {/* Sure Listesi Modal */}
            {renderSurahListModal()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: KURAN_RENKLER.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: KURAN_RENKLER.turkceMeal,
        fontFamily: TYPOGRAPHY.body,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: KURAN_RENKLER.turkceMeal,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: KURAN_RENKLER.sureBaslik,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: KURAN_RENKLER.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: KURAN_RENKLER.border,
    },
    headerButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: KURAN_RENKLER.sureBaslik,
        borderRadius: 6,
    },
    headerButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: KURAN_RENKLER.sureBaslik,
        fontFamily: TYPOGRAPHY.body,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    fontSizeButton: {
        padding: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    fontSizeButtonText: {
        color: KURAN_RENKLER.sureBaslik,
        fontSize: 12,
        fontWeight: 'bold',
    },
    progressText: {
        fontSize: 14,
        color: KURAN_RENKLER.ayetNumarasi,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: KURAN_RENKLER.cardBackground,
        borderTopWidth: 1,
        borderTopColor: KURAN_RENKLER.border,
    },
    navButton: {
        flex: 1,
        marginHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: KURAN_RENKLER.sureBaslik,
        borderRadius: 8,
        alignItems: 'center',
    },
    navButtonDisabled: {
        backgroundColor: KURAN_RENKLER.border,
        opacity: 0.5,
    },
    navButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: KURAN_RENKLER.cardBackground,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: KURAN_RENKLER.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: KURAN_RENKLER.sureBaslik,
    },
    modalClose: {
        fontSize: 24,
        color: KURAN_RENKLER.turkceMeal,
    },
    surahItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: KURAN_RENKLER.border,
    },
    surahItemActive: {
        backgroundColor: KURAN_RENKLER.highlight,
    },
    surahItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    surahNumberBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: KURAN_RENKLER.ayetNumarasi,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    surahNumberText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    surahItemName: {
        fontSize: 16,
        fontWeight: '600',
        color: KURAN_RENKLER.sureBaslik,
        marginBottom: 2,
    },
    surahItemInfo: {
        fontSize: 12,
        color: KURAN_RENKLER.turkceMealAcik,
    },
    surahItemArabic: {
        fontSize: 18,
        color: KURAN_RENKLER.arapcaMetin,
        fontWeight: '600',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingBox: {
        backgroundColor: KURAN_RENKLER.cardBackground,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    loadingOverlayText: {
        marginTop: 12,
        fontSize: 16,
        color: KURAN_RENKLER.turkceMeal,
        fontFamily: TYPOGRAPHY.body,
        fontWeight: '600',
    },
});
