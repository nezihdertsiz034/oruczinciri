import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ISLAMI_RENKLER } from '../constants/renkler';
import HomeScreen from '../screens/HomeScreen';
import IstatistiklerScreen from '../screens/IstatistiklerScreen';
import DualarScreen from '../screens/DualarScreen';
import KuranAyetleriScreen from '../screens/KuranAyetleriScreen';
import NotlarScreen from '../screens/NotlarScreen';
import EkstraScreen from '../screens/EkstraScreen';
import AyarlarScreen from '../screens/AyarlarScreen';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const Stack = createNativeStackNavigator();


/**
 * Ana navigasyon yapısı
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
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
            title: '📿 Oruç Zinciri',
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
          name="Ayarlar" 
          component={AyarlarScreen}
          options={{ title: '⚙️ Ayarlar' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

