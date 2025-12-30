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
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import IstatistiklerScreen from '../screens/IstatistiklerScreen';
import DualarScreen from '../screens/DualarScreen';
import TesbihScreen from '../screens/TesbihScreen';
import KuranAyetleriScreen from '../screens/KuranAyetleriScreen';
import NotlarScreen from '../screens/NotlarScreen';
import EkstraScreen from '../screens/EkstraScreen';
import WidgetScreen from '../screens/WidgetScreen';
import AyarlarScreen from '../screens/AyarlarScreen';
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
            headerBackTitleVisible: false,
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
          name="Ekstra Özellikler" 
          component={EkstraScreen}
          options={{ title: '✨ Ekstra Özellikler' }}
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
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
}

const DRAWER_SECTIONS = [
  {
    baslik: 'Ana Ekran',
    items: [
      { name: 'Ana Sayfa', etiket: 'Ana Sayfa', ikon: '🏠' },
    ],
  },
  {
    baslik: 'Takip',
    items: [
      { name: 'İstatistikler', etiket: 'İstatistikler', ikon: '📊' },
      { name: 'Tesbih Sayacı', etiket: 'Tesbih Sayacı', ikon: '📿' },
    ],
  },
  {
    baslik: 'Dini İçerikler',
    items: [
      { name: 'Dualar', etiket: 'Dualar', ikon: '🤲' },
      { name: 'Kur\'an Ayetleri', etiket: 'Kur\'an Ayetleri', ikon: '📖' },
    ],
  },
  {
    baslik: 'Ekstra',
    items: [
      { name: 'Notlar', etiket: 'Notlar', ikon: '📝' },
      { name: 'Ekstra Özellikler', etiket: 'Ekstra Özellikler', ikon: '✨' },
      { name: 'Ana Ekran Widget', etiket: 'Ana Ekran Widget', ikon: '🧩' },
    ],
  },
  {
    baslik: 'Ayarlar',
    items: [
      { name: 'Ayarlar', etiket: 'Ayarlar', ikon: '⚙️' },
    ],
  },
] as const;

const AppDrawerContent = (props: DrawerContentComponentProps) => {
  const aktifRoute = props.state.routeNames[props.state.index];

  return (
    <View style={styles.drawerContainer}>
      <BackgroundDecor />
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScroll}
      >
        <View style={styles.drawerHeader}>
          <View style={styles.drawerBadge}>
            <Text style={styles.drawerBadgeText}>📿</Text>
          </View>
          <View>
            <Text style={styles.drawerTitle}>Oruç Zinciri</Text>
            <Text style={styles.drawerSubtitle}>Ramazan Rehberi 2026</Text>
          </View>
        </View>

        {DRAWER_SECTIONS.map((bolum) => (
          <View key={bolum.baslik} style={styles.drawerSection}>
            <Text style={styles.drawerSectionTitle}>{bolum.baslik}</Text>
            {bolum.items.map((item) => {
              const aktif = aktifRoute === item.name;
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.drawerItem, aktif && styles.drawerItemActive]}
                  onPress={() => props.navigation.navigate(item.name)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.drawerItemIcon}>{item.ikon}</Text>
                  <Text style={[styles.drawerItemText, aktif && styles.drawerItemTextActive]}>
                    {item.etiket}
                  </Text>
                  {aktif && <View style={styles.drawerItemDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </DrawerContentScrollView>
      <View style={styles.drawerFooter}>
        <Text style={styles.drawerFooterText}>Bereketli bir Ramazan dileriz.</Text>
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
  drawerScroll: {
    paddingBottom: 16,
  },
  drawerHeader: {
    padding: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  drawerBadge: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  drawerBadgeText: {
    fontSize: 24,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.display,
  },
  drawerSubtitle: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    marginTop: 4,
    fontFamily: TYPOGRAPHY.body,
  },
  drawerSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  drawerSectionTitle: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 10,
    fontFamily: TYPOGRAPHY.body,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  drawerItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  drawerItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  drawerItemText: {
    fontSize: 15,
    color: ISLAMI_RENKLER.yaziBeyaz,
    fontFamily: TYPOGRAPHY.body,
  },
  drawerItemTextActive: {
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.display,
  },
  drawerItemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ISLAMI_RENKLER.altinAcik,
    marginLeft: 'auto',
  },
  drawerFooter: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  drawerFooterText: {
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontSize: 12,
    fontFamily: TYPOGRAPHY.body,
  },
});
