import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
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

const Stack = createNativeStackNavigator();

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
        <Stack.Navigator
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
          }}
        >
          <Stack.Screen 
            name="Ana Sayfa" 
            component={HomeScreen}
            options={{ 
              title: '📿 Oruç Zinciri - Ramazan Rehberi',
            }}
          />
        <Stack.Screen 
          name="İstatistikler" 
          component={IstatistiklerScreen}
          options={{ title: '📊 İstatistikler' }}
        />
        <Stack.Screen 
          name="Dualar" 
          component={DualarScreen}
          options={{ title: '🤲 Dualar' }}
        />
        <Stack.Screen 
          name="Tesbih Sayacı" 
          component={TesbihScreen}
          options={{ title: '📿 Tesbih Sayacı' }}
        />
        <Stack.Screen 
          name="Kur'an Ayetleri" 
          component={KuranAyetleriScreen}
          options={{ title: '📖 Kur\'an Ayetleri' }}
        />
        <Stack.Screen 
          name="Notlar" 
          component={NotlarScreen}
          options={{ title: '📝 Notlar' }}
        />
        <Stack.Screen 
          name="Ekstra Özellikler" 
          component={EkstraScreen}
          options={{ title: '✨ Ekstra Özellikler' }}
        />
        <Stack.Screen 
          name="Ana Ekran Widget" 
          component={WidgetScreen}
          options={{ title: '🧩 Ana Ekran Widget' }}
        />
          <Stack.Screen 
            name="Ayarlar" 
            component={AyarlarScreen}
            options={{ title: '⚙️ Ayarlar' }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  yukleniyorContainer: {
    flex: 1,
    backgroundColor: ISLAMI_RENKLER.arkaPlanYesil,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
