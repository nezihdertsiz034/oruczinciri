import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ISLAMI_RENKLER } from '../constants/renkler';

interface MenuItem {
  id: string;
  ikon: string;
  baslik: string;
  aciklama?: string;
  onPress: () => void;
  renk?: string;
}

interface MenuKategori {
  id: string;
  baslik: string;
  ikon: string;
  items: MenuItem[];
}

interface AkordeonMenuProps {
  kategoriler: MenuKategori[];
}

/**
 * Mobil için akordeon menü bileşeni
 */
export const AkordeonMenu: React.FC<AkordeonMenuProps> = ({ kategoriler }) => {
  const [acikKategoriler, setAcikKategoriler] = useState<Set<string>>(new Set());

  const toggleKategori = (kategoriId: string) => {
    const yeniAcikKategoriler = new Set(acikKategoriler);
    if (yeniAcikKategoriler.has(kategoriId)) {
      yeniAcikKategoriler.delete(kategoriId);
    } else {
      yeniAcikKategoriler.add(kategoriId);
    }
    setAcikKategoriler(yeniAcikKategoriler);
  };

  return (
    <View style={styles.container}>
      {kategoriler.map((kategori) => {
        const acik = acikKategoriler.has(kategori.id);
        
        return (
          <View key={kategori.id} style={styles.kategoriContainer}>
            {/* Kategori Başlığı */}
            <TouchableOpacity
              style={styles.kategoriBaslik}
              onPress={() => toggleKategori(kategori.id)}
              activeOpacity={0.7}
            >
              <View style={styles.kategoriBaslikContent}>
                <View style={styles.kategoriBaslikSol}>
                  <Text style={styles.kategoriIkon}>{kategori.ikon}</Text>
                  <Text style={styles.kategoriBaslikText}>{kategori.baslik}</Text>
                </View>
                <Text style={[styles.acilmaIkon, acik && styles.acilmaIkonAcik]}>
                  {acik ? '▼' : '▶'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Kategori İçeriği */}
            {acik && (
              <View style={styles.kategoriIcerik}>
                {kategori.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.menuItem, item.renk && { borderLeftColor: item.renk, borderLeftWidth: 3 }]}
                    onPress={item.onPress}
                    activeOpacity={0.8}
                  >
                    <View style={styles.menuItemContent}>
                      <View style={[styles.menuItemIkon, item.renk && { backgroundColor: `${item.renk}20` }]}>
                        <Text style={[styles.menuItemIkonText, item.renk && { color: item.renk }]}>
                          {item.ikon}
                        </Text>
                      </View>
                      <View style={styles.menuItemTextContainer}>
                        <Text style={styles.menuItemBaslik}>{item.baslik}</Text>
                        {item.aciklama && (
                          <Text style={styles.menuItemAciklama}>{item.aciklama}</Text>
                        )}
                      </View>
                      <Text style={styles.menuItemOk}>›</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  kategoriContainer: {
    marginBottom: 12,
    backgroundColor: ISLAMI_RENKLER.glassBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ISLAMI_RENKLER.glassBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  kategoriBaslik: {
    padding: 18,
  },
  kategoriBaslikContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kategoriBaslikSol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  kategoriIkon: {
    fontSize: 24,
    marginRight: 12,
  },
  kategoriBaslikText: {
    fontSize: 18,
    fontWeight: '800',
    color: ISLAMI_RENKLER.yaziBeyaz,
    letterSpacing: 0.3,
  },
  acilmaIkon: {
    fontSize: 16,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontWeight: '600',
  },
  acilmaIkonAcik: {
    color: ISLAMI_RENKLER.altinAcik,
  },
  kategoriIcerik: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  menuItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginBottom: 8,
    overflow: 'hidden',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  menuItemIkon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemIkonText: {
    fontSize: 22,
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemBaslik: {
    fontSize: 16,
    fontWeight: '700',
    color: ISLAMI_RENKLER.yaziBeyaz,
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  menuItemAciklama: {
    fontSize: 12,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontWeight: '500',
    lineHeight: 16,
  },
  menuItemOk: {
    fontSize: 20,
    color: ISLAMI_RENKLER.yaziBeyazYumusak,
    fontWeight: '300',
    marginLeft: 8,
  },
});

