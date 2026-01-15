import React from 'react';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';

interface IconProps {
    color: string;
    size?: number;
}

/**
 * Premium Kabe İkonu (Ana Sayfa için)
 */
export const KaabaIcon = ({ color, size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Kabe Gövdesi */}
        <Path
            d="M4 7L12 11L20 7L12 3L4 7Z"
            fill={color}
            opacity={0.9}
        />
        <Path
            d="M4 7V17L12 21V11L4 7Z"
            fill={color}
            opacity={0.8}
        />
        <Path
            d="M12 11V21L20 17V7L12 11Z"
            fill={color}
        />
        {/* Altın Kuşak (Kiswa detayı) */}
        <Path
            d="M4 10L12 14L20 10"
            stroke="#FFD700"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity={0.8}
        />
    </Svg>
);

/**
 * Modern Takip İkonu (İstatistikler/Zincir için)
 */
export const TrackingIcon = ({ color, size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12M4 12H7M20 12H17M12 4V7M12 20V17"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <Circle cx="12" cy="12" r="3" fill={color} />
        <Path
            d="M12 9V12L14 14"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </Svg>
);

/**
 * Cami Silüeti İkonu (İbadet için)
 */
export const WorshipIcon = ({ color, size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Ana Kubbe */}
        <Path
            d="M6 15C6 11.6863 8.68629 9 12 9C15.3137 9 18 11.6863 18 15V19H6V15Z"
            fill={color}
        />
        {/* Yan Minareler */}
        <Rect x="4" y="10" width="2" height="9" rx="1" fill={color} opacity={0.7} />
        <Rect x="18" y="10" width="2" height="9" rx="1" fill={color} opacity={0.7} />
        {/* Hilal */}
        <Path
            d="M12 5C13.1046 5 14 5.89543 14 7C14 8.10457 13.1046 9 12 9C10.8954 9 10 8.10457 10 7C10 5.89543 10.8954 5 12 5Z"
            fill="#FFD700"
        />
    </Svg>
);

/**
 * İslami Desenli Araçlar İkonu (Kutu/Grid Tasarımı)
 */
export const ToolsIcon = ({ color, size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <G opacity={0.9}>
            <Rect x="4" y="4" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
            <Rect x="13" y="4" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
            <Rect x="4" y="13" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
            <Rect x="13" y="13" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
        </G>
        <Path
            d="M12 9V12M12 12V15M12 12H9M12 12H15"
            stroke="#FFD700"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={0.8}
        />
    </Svg>
);

/**
 * Premium Kur'an-ı Kerim İkonu (Rahle üzerinde açık Kur'an)
 */
export const QuranIcon = ({ color, size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Rahle (Stand) */}
        <Path
            d="M4 19L12 15L20 19M12 15V21"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M6 17L12 14L18 17"
            stroke={color}
            strokeWidth="1.2"
            opacity={0.6}
        />
        {/* Açık Kitap Sayfaları */}
        <Path
            d="M12 6C12 6 8 5 4 7V16C8 14 12 15 12 15C12 15 16 14 20 16V7C16 5 12 6 12 6Z"
            fill={color}
            opacity={0.9}
        />
        <Path
            d="M12 6V15"
            stroke="white"
            strokeWidth="1"
            opacity={0.5}
        />
        {/* Sayfa Detayları (Arapça hat sembolizesi) */}
        <Path
            d="M6 9H9M6 11H8M15 9H18M16 11H18"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            opacity={0.8}
        />
        {/* Altın Hilal Noktası */}
        <Circle cx="12" cy="4" r="1.5" fill="#FFD700" />
    </Svg>
);

/**
 * Modern Ayarlar/Daha İkonu
 */
export const MoreIcon = ({ color, size = 24 }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="6" r="2.5" fill={color} opacity={0.8} />
        <Circle cx="12" cy="12" r="2.5" fill={color} />
        <Circle cx="12" cy="18" r="2.5" fill={color} opacity={0.8} />
    </Svg>
);
