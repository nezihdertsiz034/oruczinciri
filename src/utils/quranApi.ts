/**
 * Kur'an-ı Kerim API Utility
 * 
 * Al-Quran Cloud API kullanarak Kur'an verilerini çeker
 * https://alquran.cloud/api
 */

import { QuranSurah, QuranAyah, QuranApiResponse, QuranSurahResponse } from '../types/quran';
import { logger } from './logger';
import { handleError } from './errorHandler';

const API_BASE_URL = 'https://api.alquran.cloud/v1';
const ARABIC_EDITION = 'quran-uthmani'; // Osmanlı hattı
const TURKISH_EDITION = 'tr.diyanet';   // Diyanet İşleri meali

/**
 * Tüm surelerin listesini getirir
 */
export async function getAllSurahs(): Promise<QuranSurah[]> {
    try {
        logger.info('Tüm sureler getiriliyor...', undefined, 'quranApi');

        const response = await fetch(`${API_BASE_URL}/surah`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: QuranApiResponse<QuranSurah[]> = await response.json();

        logger.info('Sureler başarıyla getirildi', { count: data.data.length }, 'quranApi');

        return data.data;
    } catch (error) {
        const appError = handleError(error, 'quranApi.getAllSurahs');
        throw new Error(appError.userMessage);
    }
}

/**
 * Belirli bir sureyi Arapça ve Türkçe olarak getirir
 */
export async function getSurah(surahNumber: number): Promise<{
    arabic: QuranSurahResponse;
    turkish: QuranSurahResponse;
}> {
    try {
        logger.info(`Sure getiriliyor: ${surahNumber}`, undefined, 'quranApi');

        // Arapça ve Türkçe'yi paralel olarak çek
        const [arabicResponse, turkishResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/surah/${surahNumber}/${ARABIC_EDITION}`),
            fetch(`${API_BASE_URL}/surah/${surahNumber}/${TURKISH_EDITION}`)
        ]);

        if (!arabicResponse.ok || !turkishResponse.ok) {
            throw new Error('Sure getirilemedi');
        }

        const arabicData: QuranApiResponse<QuranSurahResponse> = await arabicResponse.json();
        const turkishData: QuranApiResponse<QuranSurahResponse> = await turkishResponse.json();

        logger.info(`Sure başarıyla getirildi: ${surahNumber}`, {
            name: arabicData.data.englishName,
            ayahs: arabicData.data.numberOfAyahs
        }, 'quranApi');

        return {
            arabic: arabicData.data,
            turkish: turkishData.data
        };
    } catch (error) {
        const appError = handleError(error, 'quranApi.getSurah');
        throw new Error(appError.userMessage);
    }
}

/**
 * Belirli bir ayeti getirir
 */
export async function getAyah(ayahNumber: number): Promise<{
    arabic: QuranAyah;
    turkish: QuranAyah;
}> {
    try {
        logger.debug(`Ayet getiriliyor: ${ayahNumber}`, undefined, 'quranApi');

        const [arabicResponse, turkishResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/ayah/${ayahNumber}/${ARABIC_EDITION}`),
            fetch(`${API_BASE_URL}/ayah/${ayahNumber}/${TURKISH_EDITION}`)
        ]);

        if (!arabicResponse.ok || !turkishResponse.ok) {
            throw new Error('Ayet getirilemedi');
        }

        const arabicData: QuranApiResponse<QuranAyah> = await arabicResponse.json();
        const turkishData: QuranApiResponse<QuranAyah> = await turkishResponse.json();

        return {
            arabic: arabicData.data,
            turkish: turkishData.data
        };
    } catch (error) {
        const appError = handleError(error, 'quranApi.getAyah');
        throw new Error(appError.userMessage);
    }
}

/**
 * Tüm Kur'an'ı getirir (cache için)
 */
export async function getFullQuran(): Promise<{
    arabic: QuranSurahResponse[];
    turkish: QuranSurahResponse[];
}> {
    try {
        logger.info('Tüm Kur\'an getiriliyor...', undefined, 'quranApi');

        const [arabicResponse, turkishResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/quran/${ARABIC_EDITION}`),
            fetch(`${API_BASE_URL}/quran/${TURKISH_EDITION}`)
        ]);

        if (!arabicResponse.ok || !turkishResponse.ok) {
            throw new Error('Kur\'an getirilemedi');
        }

        const arabicData: QuranApiResponse<{ surahs: QuranSurahResponse[] }> = await arabicResponse.json();
        const turkishData: QuranApiResponse<{ surahs: QuranSurahResponse[] }> = await turkishResponse.json();

        logger.info('Tüm Kur\'an başarıyla getirildi', {
            surahs: arabicData.data.surahs.length
        }, 'quranApi');

        return {
            arabic: arabicData.data.surahs,
            turkish: turkishData.data.surahs
        };
    } catch (error) {
        const appError = handleError(error, 'quranApi.getFullQuran');
        throw new Error(appError.userMessage);
    }
}

/**
 * Kur'an'da arama yapar (Türkçe meal içinde)
 */
export async function searchQuran(query: string): Promise<QuranAyah[]> {
    try {
        logger.info(`Kur'an'da arama yapılıyor: "${query}"`, undefined, 'quranApi');

        const response = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(query)}/all/${TURKISH_EDITION}`);

        if (!response.ok) {
            throw new Error('Arama yapılamadı');
        }

        const data: QuranApiResponse<{ matches: QuranAyah[] }> = await response.json();

        logger.info('Arama tamamlandı', { results: data.data.matches.length }, 'quranApi');

        return data.data.matches;
    } catch (error) {
        const appError = handleError(error, 'quranApi.searchQuran');
        throw new Error(appError.userMessage);
    }
}

/**
 * Sure isimlerini Türkçe'ye çevirir
 */
export function getSurahTurkishName(englishName: string): string {
    const surahNames: Record<string, string> = {
        'Al-Faatiha': 'Fatiha',
        'Al-Baqara': 'Bakara',
        'Aal-i-Imraan': 'Âl-i İmran',
        'An-Nisaa': 'Nisa',
        'Al-Maaida': 'Maide',
        'Al-An\'aam': 'En\'am',
        'Al-A\'raaf': 'A\'raf',
        'Al-Anfaal': 'Enfal',
        'At-Tawba': 'Tevbe',
        'Yunus': 'Yunus',
        'Hud': 'Hud',
        'Yusuf': 'Yusuf',
        'Ar-Ra\'d': 'Ra\'d',
        'Ibrahim': 'İbrahim',
        'Al-Hijr': 'Hicr',
        'An-Nahl': 'Nahl',
        'Al-Israa': 'İsra',
        'Al-Kahf': 'Kehf',
        'Maryam': 'Meryem',
        'Taa-Haa': 'Taha',
        // ... diğer sureler (tamamı eklenecek)
    };

    return surahNames[englishName] || englishName;
}
