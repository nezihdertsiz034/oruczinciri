import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';

// Ekranlar
import HomeScreen from '../screens/HomeScreen';
import IstatistiklerScreen from '../screens/IstatistiklerScreen';
import TesbihScreen from '../screens/TesbihScreen';
import DualarScreen from '../screens/DualarScreen';
import KuranAyetleriScreen from '../screens/KuranAyetleriScreen';
import PeygamberHayatiScreen from '../screens/PeygamberHayatiScreen';
import EsmaulHusnaScreen from '../screens/EsmaulHusnaScreen';
import AraclarScreen from '../screens/AraclarScreen';
import AyarlarScreen from '../screens/AyarlarScreen';
import NotlarScreen from '../screens/NotlarScreen';
import WidgetScreen from '../screens/WidgetScreen';
import QuranScreen from '../screens/QuranScreen';
import { KaabaIcon, TrackingIcon, ToolsIcon, MoreIcon, QuranIcon } from '../components/IslamicIcons';

// Ekstra ekranlar
import ZekatScreen from '../screens/ekstra/ZekatScreen';
import FitreScreen from '../screens/ekstra/FitreScreen';
import IftarKaloriScreen from '../screens/ekstra/IftarKaloriScreen';
import KibleScreen from '../screens/ekstra/KibleScreen';
import TeravihScreen from '../screens/ekstra/TeravihScreen';
import SadakaScreen from '../screens/ekstra/SadakaScreen';
import SuHatirlaticiScreen from '../screens/ekstra/SuHatirlaticiScreen';
import IftarMenuOnerileriScreen from '../screens/ekstra/IftarMenuOnerileriScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab ikonu component
interface TabIconProps {
    IconComponent: React.ElementType;
    focused: boolean;
    color: string;
}

const TabIcon = ({ IconComponent, focused, color }: TabIconProps) => (
    <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
        <IconComponent color={color} size={24} />
    </View>
);

// Ana Sayfa Stack
function AnaSayfaStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: ISLAMI_RENKLER.arkaPlanYesil },
                headerTintColor: ISLAMI_RENKLER.yaziBeyaz,
                headerTitleStyle: { fontFamily: TYPOGRAPHY.display, fontWeight: '700' },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="AnaSayfaMain"
                component={HomeScreen}
                options={{ title: '📿 Şükür365' }}
            />
        </Stack.Navigator>
    );
}

// Takip Stack
function TakipStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: ISLAMI_RENKLER.arkaPlanYesil },
                headerTintColor: ISLAMI_RENKLER.yaziBeyaz,
                headerTitleStyle: { fontFamily: TYPOGRAPHY.display, fontWeight: '700' },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="IstatistiklerMain"
                component={IstatistiklerScreen}
                options={{ title: '📊 İstatistikler' }}
            />
            <Stack.Screen
                name="TesbihSayaci"
                component={TesbihScreen}
                options={{ title: '📿 Tesbih Sayacı' }}
            />
        </Stack.Navigator>
    );
}

// Kur'an Stack
function KuranStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: ISLAMI_RENKLER.arkaPlanYesil },
                headerTintColor: ISLAMI_RENKLER.yaziBeyaz,
                headerTitleStyle: { fontFamily: TYPOGRAPHY.display, fontWeight: '700' },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="KuranMain"
                component={QuranScreen}
                options={{ title: '📖 Kur\'an-ı Kerim', headerShown: false }}
            />
            <Stack.Screen
                name="Dualar"
                component={DualarScreen}
                options={{ title: '🤲 Dualar' }}
            />
            <Stack.Screen
                name="KuranAyetleri"
                component={KuranAyetleriScreen}
                options={{ title: '📖 Kur\'an Ayetleri' }}
            />
            <Stack.Screen
                name="PeygamberHayati"
                component={PeygamberHayatiScreen}
                options={{ title: '☪️ Hz. Muhammed (S.A.V.)' }}
            />
            <Stack.Screen
                name="EsmaulHusna"
                component={EsmaulHusnaScreen}
                options={{ title: '☪️ Esmaül Hüsna' }}
            />
            <Stack.Screen
                name="TesbihSayaciIbadet"
                component={TesbihScreen}
                options={{ title: '📿 Tesbih Sayacı' }}
            />
        </Stack.Navigator>
    );
}

// Araçlar Stack
function AraclarStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: ISLAMI_RENKLER.arkaPlanYesil },
                headerTintColor: ISLAMI_RENKLER.yaziBeyaz,
                headerTitleStyle: { fontFamily: TYPOGRAPHY.display, fontWeight: '700' },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="AraclarMain"
                component={AraclarScreen}
                options={{ title: '🛠️ Araçlar' }}
            />
            <Stack.Screen name="Zekat" component={ZekatScreen} options={{ title: '💰 Zekat' }} />
            <Stack.Screen name="Fitre" component={FitreScreen} options={{ title: '🌾 Fitre' }} />
            <Stack.Screen name="İftar Kalori" component={IftarKaloriScreen} options={{ title: '🍽️ İftar Kalori' }} />
            <Stack.Screen name="Kıble" component={KibleScreen} options={{ title: '🧭 Kıble' }} />
            <Stack.Screen name="Teravih" component={TeravihScreen} options={{ title: '🕌 Teravih' }} />
            <Stack.Screen name="Sadaka" component={SadakaScreen} options={{ title: '💝 Sadaka' }} />
            <Stack.Screen name="Su Hatırlatıcı" component={SuHatirlaticiScreen} options={{ title: '💧 Su Hatırlatıcı' }} />
            <Stack.Screen name="İftar Menü Önerileri" component={IftarMenuOnerileriScreen} options={{ title: '💡 Menü Önerileri' }} />
            <Stack.Screen name="Notlar" component={NotlarScreen} options={{ title: '📝 Notlar' }} />
            <Stack.Screen name="Ana Ekran Widget" component={WidgetScreen} options={{ title: '🧩 Widget' }} />
        </Stack.Navigator>
    );
}

// Daha Fazla Stack
function DahaFazlaStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: ISLAMI_RENKLER.arkaPlanYesil },
                headerTintColor: ISLAMI_RENKLER.yaziBeyaz,
                headerTitleStyle: { fontFamily: TYPOGRAPHY.display, fontWeight: '700' },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="AyarlarMain"
                component={AyarlarScreen}
                options={{ title: '⚙️ Ayarlar' }}
            />
        </Stack.Navigator>
    );
}

// Ana Tab Navigator
export default function TabNavigator() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        height: Platform.OS === 'ios' ? 88 : 65 + insets.bottom,
                        paddingBottom: Platform.OS === 'ios' ? 28 : insets.bottom + 8,
                    }
                ],
                tabBarActiveTintColor: ISLAMI_RENKLER.altinAcik,
                tabBarInactiveTintColor: ISLAMI_RENKLER.yaziBeyazYumusak,
                tabBarLabelStyle: styles.tabLabel,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tab.Screen
                name="Ana"
                component={AnaSayfaStack}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon IconComponent={KaabaIcon} focused={focused} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Takip"
                component={TakipStack}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon IconComponent={TrackingIcon} focused={focused} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Kur'an"
                component={KuranStack}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon IconComponent={QuranIcon} focused={focused} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Araçlar"
                component={AraclarStack}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon IconComponent={ToolsIcon} focused={focused} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Ayarlar"
                component={DahaFazlaStack}
                options={{
                    tabBarLabel: 'Ayarlar',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon IconComponent={MoreIcon} focused={focused} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
        borderTopWidth: 1,
        borderTopColor: 'rgba(218, 165, 32, 0.2)',
        paddingTop: 8,
        elevation: 0,
        shadowOpacity: 0,
    },
    tabLabel: {
        fontSize: 11,
        fontFamily: TYPOGRAPHY.body,
        fontWeight: '600',
        marginTop: 4,
    },
    tabIconContainer: {
        width: 40,
        height: 32,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    tabIconContainerActive: {
        backgroundColor: 'rgba(218, 165, 32, 0.15)',
    },
});
