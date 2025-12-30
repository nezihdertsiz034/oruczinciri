import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerToggleButton,
} from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import { TYPOGRAPHY } from '../constants/typography';
import SplashWelcomeScreen from '../screens/SplashWelcomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import IstatistiklerScreen from '../screens/IstatistiklerScreen';
import DualarScreen from '../screens/DualarScreen';
import TesbihScreen from '../screens/TesbihScreen';
import KuranAyetleriScreen from '../screens/KuranAyetleriScreen';
import NotlarScreen from '../screens/NotlarScreen';
import ZekatScreen from '../screens/ekstra/ZekatScreen';
import FitreScreen from '../screens/ekstra/FitreScreen';
import IftarKaloriScreen from '../screens/ekstra/IftarKaloriScreen';
import KibleScreen from '../screens/ekstra/KibleScreen';
import TeravihScreen from '../screens/ekstra/TeravihScreen';
import SadakaScreen from '../screens/ekstra/SadakaScreen';
import SuHatirlaticiScreen from '../screens/ekstra/SuHatirlaticiScreen';
import IftarMenuOnerileriScreen from '../screens/ekstra/IftarMenuOnerileriScreen';
import WidgetScreen from '../screens/WidgetScreen';
import AyarlarScreen from '../screens/AyarlarScreen';
import PeygamberHayatiScreen from '../screens/PeygamberHayatiScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackgroundDecor } from '../components/BackgroundDecor';

const Drawer = createDrawerNavigator();

const STORAGE_KEYS = {
  SEHIR: '@sehir',
} as const;

/**
 * Ana navigasyon yapısı
 */
export default function AppNavigator() {
  const [yukleniyor, setYukleniyor] = useState(true);
  const [splashGosterildi, setSplashGosterildi] = useState(false);
  const [onboardingTamamlandi, setOnboardingTamamlandi] = useState(false);

  useEffect(() => {
    kontrolEtOnboarding();
  }, []);

  const kontrolEtOnboarding = async () => {
    try {
      // Şehir seçilip seçilmediğini kontrol et
      const sehirVeri = await AsyncStorage.getItem(STORAGE_KEYS.SEHIR);
      setOnboardingTamamlandi(!!sehirVeri);
    } catch (error) {
      console.error('Onboarding kontrolü hatası:', error);
      setOnboardingTamamlandi(false);
    } finally {
      setYukleniyor(false);
    }
  };

  const handleSplashComplete = () => {
    setSplashGosterildi(true);
  };

  const handleOnboardingComplete = () => {
    setOnboardingTamamlandi(true);
  };

  if (yukleniyor) {
    return (
      <View style={styles.yukleniyorContainer}>
        <ActivityIndicator size="large" color={ISLAMI_RENKLER.altinAcik} />
      </View>
    );
  }

  // Önce Splash Welcome ekranı göster (şehir seçilmemişse)
  if (!onboardingTamamlandi && !splashGosterildi) {
    return <SplashWelcomeScreen onContinue={handleSplashComplete} />;
  }

  return (
    <NavigationContainer>
      {!onboardingTamamlandi ? (
        <WelcomeScreen onComplete={handleOnboardingComplete} />
      ) : (
        <Drawer.Navigator
          drawerContent={(props) => <AppDrawerContent {...props} />}
          screenOptions={{
            headerStyle: {
              backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: ISLAMI_RENKLER.yaziBeyaz,
            headerTitleStyle: {
              fontFamily: TYPOGRAPHY.display,
              fontWeight: '800',
              fontSize: 20,
              letterSpacing: 0.5,
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <DrawerToggleButton tintColor={ISLAMI_RENKLER.yaziBeyaz} />
            ),
            drawerType: 'front',
            drawerStyle: {
              backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
              width: 300,
            },
          }}
        >
          <Drawer.Screen
            name="Ana Sayfa"
            component={HomeScreen}
            options={{
              title: '📿 Oruç Zinciri - Ramazan Rehberi',
            }}
          />
          <Drawer.Screen
            name="İstatistikler"
            component={IstatistiklerScreen}
            options={{ title: '📊 İstatistikler' }}
          />
          <Drawer.Screen
            name="Dualar"
            component={DualarScreen}
            options={{ title: '🤲 Dualar' }}
          />
          <Drawer.Screen
            name="Tesbih Sayacı"
            component={TesbihScreen}
            options={{ title: '📿 Tesbih Sayacı' }}
          />
          <Drawer.Screen
            name="Kur'an Ayetleri"
            component={KuranAyetleriScreen}
            options={{ title: '📖 Kur\'an Ayetleri' }}
          />
          <Drawer.Screen
            name="Notlar"
            component={NotlarScreen}
            options={{ title: '📝 Notlar' }}
          />
          <Drawer.Screen
            name="Zekat"
            component={ZekatScreen}
            options={{ title: '💰 Zekat' }}
          />
          <Drawer.Screen
            name="Fitre"
            component={FitreScreen}
            options={{ title: '🌾 Fitre' }}
          />
          <Drawer.Screen
            name="İftar Kalori"
            component={IftarKaloriScreen}
            options={{ title: '🍽️ İftar Kalori' }}
          />
          <Drawer.Screen
            name="Kıble"
            component={KibleScreen}
            options={{ title: '🧭 Kıble' }}
          />
          <Drawer.Screen
            name="Teravih"
            component={TeravihScreen}
            options={{ title: '🕌 Teravih' }}
          />
          <Drawer.Screen
            name="Sadaka"
            component={SadakaScreen}
            options={{ title: '💝 Sadaka' }}
          />
          <Drawer.Screen
            name="Su Hatırlatıcı"
            component={SuHatirlaticiScreen}
            options={{ title: '💧 Su Hatırlatıcı' }}
          />
          <Drawer.Screen
            name="İftar Menü Önerileri"
            component={IftarMenuOnerileriScreen}
            options={{ title: '💡 İftar Menü Önerileri' }}
          />
          <Drawer.Screen
            name="Ana Ekran Widget"
            component={WidgetScreen}
            options={{ title: '🧩 Ana Ekran Widget' }}
          />
          <Drawer.Screen
            name="Ayarlar"
            component={AyarlarScreen}
            options={{ title: '⚙️ Ayarlar' }}
          />
          <Drawer.Screen
            name="Peygamber Hayatı"
            component={PeygamberHayatiScreen}
            options={{ title: '☪️ Hz. Muhammed (S.A.V.)' }}
          />
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
}

const DRAWER_ITEMS = [
  { name: 'Ana Sayfa', etiket: 'Ana Sayfa', ikon: '🏠' },
  { name: 'İstatistikler', etiket: 'İstatistikler', ikon: '📊' },
  { name: 'Tesbih Sayacı', etiket: 'Tesbih Sayacı', ikon: '📿' },
  { name: 'Dualar', etiket: 'Dualar', ikon: '🤲' },
  { name: 'Kur\'an Ayetleri', etiket: 'Kur\'an Ayetleri', ikon: '📖' },
  { name: 'Notlar', etiket: 'Notlar', ikon: '📝' },
  { name: 'Zekat', etiket: 'Zekat', ikon: '💰' },
  { name: 'Fitre', etiket: 'Fitre', ikon: '🌾' },
  { name: 'İftar Kalori', etiket: 'İftar Kalori', ikon: '🍽️' },
  { name: 'Kıble', etiket: 'Kıble', ikon: '🧭' },
  { name: 'Teravih', etiket: 'Teravih', ikon: '🕌' },
  { name: 'Sadaka', etiket: 'Sadaka', ikon: '💝' },
  { name: 'Su Hatırlatıcı', etiket: 'Su Hatırlatıcı', ikon: '💧' },
  { name: 'İftar Menü Önerileri', etiket: 'İftar Menü Önerileri', ikon: '💡' },
  { name: 'Ana Ekran Widget', etiket: 'Ana Ekran Widget', ikon: '🧩' },
  { name: 'Peygamber Hayatı', etiket: 'Hz. Muhammed (S.A.V.)', ikon: '☪️' },
  { name: 'Ayarlar', etiket: 'Ayarlar', ikon: '⚙️' },
] as const;

const AppDrawerContent = (props: DrawerContentComponentProps) => {
  const aktifRoute = props.state.routeNames[props.state.index];

  return (
    <View style={styles.drawerContainer}>
      <BackgroundDecor />

      {/* Dekoratif üst çizgiler */}
      <View style={styles.decorTopContainer}>
        <View style={styles.decorLine1} />
        <View style={styles.decorLine2} />
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Header */}
        <View style={styles.drawerHeader}>
          <View style={styles.headerGlow} />
          <View style={styles.drawerBadge}>
            <View style={styles.badgeInner}>
              <Text style={styles.drawerBadgeText}>📿</Text>
            </View>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.drawerTitle}>Oruç Zinciri</Text>
            <View style={styles.subtitleRow}>
              <View style={styles.subtitleDot} />
              <Text style={styles.drawerSubtitle}>Ramazan Rehberi 2026</Text>
              <View style={styles.subtitleDot} />
            </View>
          </View>
        </View>

        {/* Dekoratif ayraç */}
        <View style={styles.headerDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerIcon}>☪</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Menü Öğeleri */}
        <View style={styles.menuItemsContainer}>
          {DRAWER_ITEMS.map((item) => {
            const aktif = aktifRoute === item.name;
            return (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.drawerItem,
                  aktif && styles.drawerItemActive,
                ]}
                onPress={() => props.navigation.navigate(item.name)}
                activeOpacity={0.7}
              >
                {/* Aktif gösterge çizgisi */}
                {aktif && <View style={styles.activeIndicator} />}

                <View style={[styles.iconContainer, aktif && styles.iconContainerActive]}>
                  <Text style={styles.drawerItemIcon}>{item.ikon}</Text>
                </View>

                <Text style={[styles.drawerItemText, aktif && styles.drawerItemTextActive]}>
                  {item.etiket}
                </Text>

                {aktif && (
                  <View style={styles.activeArrow}>
                    <Text style={styles.arrowText}>›</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Alt boşluk */}
        <View style={styles.bottomSpacer} />
      </DrawerContentScrollView>

      {/* Premium Footer */}
      <View style={styles.drawerFooter}>
        <View style={styles.footerDivider} />
        <View style={styles.footerContent}>
          <Text style={styles.footerIcon}>🌙</Text>
          <Text style={styles.drawerFooterText}>Bereketli bir Ramazan dileriz</Text>
        </View>
        <Text style={styles.footerVersion}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  yukleniyorContainer: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
  },
  decorTopContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    overflow: 'hidden',
  },
  decorLine1: {
    position: 'absolute',
    top: 20,
    right: -50,
    width: 150,
    height: 1,
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    transform: [{ rotate: '-45deg' }],
  },
  decorLine2: {
    position: 'absolute',
    top: 40,
    right: -30,
    width: 100,
    height: 1,
    backgroundColor: 'rgba(218, 165, 32, 0.15)',
    transform: [{ rotate: '-45deg' }],
  },
  drawerScroll: {
    paddingBottom: 16,
  },
  drawerHeader: {
    padding: 24,
    paddingTop: 16,
    marginBottom: 8,
    alignItems: 'center',
    position: 'relative',
  },
  headerGlow: {
    position: 'absolute',
    top: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(218, 165, 32, 0.08)',
  },
  drawerBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(218, 165, 32, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(218, 165, 32, 0.3)',
    marginBottom: 16,
    shadowColor: ISLAMI_RENKLER.altinAcik,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  badgeInner: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  drawerBadgeText: {
    fontSize: 28,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: ISLAMI_RENKLER.altinAcik,
    fontFamily: TYPOGRAPHY.display,
    letterSpacing: 1,
    textShadowColor: 'rgba(218, 165, 32, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  subtitleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ISLAMI_RENKLER.altinOrta,
    marginHorizontal: 8,
  },
  drawerSubtitle: {
    fontSize: 13,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontFamily: TYPOGRAPHY.body,
    letterSpacing: 0.5,
  },
  headerDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(218, 165, 32, 0.3)',
  },
  dividerIcon: {
    fontSize: 14,
    color: ISLAMI_RENKLER.altinOrta,
    marginHorizontal: 12,
  },
  menuItemsContainer: {
    paddingHorizontal: 12,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    position: 'relative',
    overflow: 'hidden',
  },
  drawerItemActive: {
    backgroundColor: 'rgba(218, 165, 32, 0.12)',
    borderColor: 'rgba(218, 165, 32, 0.25)',
    shadowColor: ISLAMI_RENKLER.altinAcik,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: ISLAMI_RENKLER.altinAcik,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
  },
  drawerItemIcon: {
    fontSize: 18,
  },
  drawerItemText: {
    flex: 1,
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.body,
    letterSpacing: 0.2,
  },
  drawerItemTextActive: {
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.display,
    color: ISLAMI_RENKLER.altinAcik,
  },
  activeArrow: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: ISLAMI_RENKLER.altinAcik,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 20,
  },
  drawerFooter: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    marginBottom: 16,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  drawerFooterText: {
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.body,
    fontStyle: 'italic',
  },
  footerVersion: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 10,
    fontFamily: TYPOGRAPHY.body,
    textAlign: 'center',
    marginTop: 8,
  },
});
