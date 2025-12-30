# 📿 Oruç Zinciri - Ramazan Rehberi

2026 Ramazan ayı için kapsamlı oruç takip ve dini rehber uygulaması.

30 gün boyunca tutulan oruçları takip eden, namaz vakitlerini gösteren ve dini içerikler sunan kapsamlı mobil uygulama.

## ✨ Tüm Özellikler

### 🏠 Ana Sayfa
- **🕐 Dini Duvar Saati** - Analog saat, Arapça "Allah" yazısı, oruç saatlerinde altın renk
- **⏱️ Oruç Sayacı** - Kalan süre gösterimi (Saat:Dakika:Saniye), büyük sayılar
- **🔗 Oruç Zinciri** - 30 günlük görsel zincir, günlük işaretleme
- **📖 Hadis-i Şerif** - Günlük hadis gösterimi
- **📿 Şükür Ayetleri** - Oruç tamamlandığında gösterilen ayetler
- **📱 Akordeon Menü** - Kategorize, mobil uyumlu menü

### 📊 İstatistikler
- Toplam oruç sayısı
- Haftalık oruç grafiği
- Rozetler ve başarılar
- Performans takibi

### 🤲 Dualar
- Sahur duaları
- İftar duaları
- Oruç duaları
- Arapça metin + Türkçe okunuş + Anlam
- Favori ekleme

### 📿 Tesbih Sayacı
- Tek dokunuşla artırma
- Geri alma ve sıfırlama
- Hızlı hedefler (33, 99, 100)
- Özel hedef belirleme
- Kalan sayı ve ilerleme takibi

### 📖 Kur'an Ayetleri
- Günlük ayet gösterimi
- 30 günlük ayet koleksiyonu
- Arapça metin + Türkçe meal
- Favori ekleme ve paylaşma

### 📝 Notlar
- Kişisel notlar ekleme
- Tarih bazlı notlar
- Arama özelliği

### ✨ Ekstra Özellikler
- **🧭 Kıble Yönü** - GPS ile kıble tespiti
- **🕌 Teravih Takibi** - Günlük teravih işaretleme
- **💝 Sadaka Takibi** - Sadaka ekleme ve toplam gösterimi
- **💧 Sahur Su İçme Hatırlatıcısı** - 2026 Ramazan için özel
- **💰 Zekat Hesaplayıcı** - Mal varlığına göre zekat hesaplama
- **🌾 Fitre Hesaplayıcı** - Kişi sayısına göre fitre hesaplama
- **🍽️ İftar Kalori Takibi** - İftar menüsü kalori takibi
- **💡 İftar Menüsü Önerileri** - Kategori bazlı, yenilenebilir öneriler

### 🧩 Ana Ekran Widget
- Widget önizleme kartı
- İmsak/iftar saatleri ve kalan süre
- iOS/Android ekleme adımları

### ⚙️ Ayarlar
- **📍 Şehir Seçimi** - 81 il, otomatik vakit güncelleme
- **🔔 Bildirim Ayarları:**
  - Sahur Hatırlatıcısı (saat seçici ile)
  - İftar Hatırlatıcısı (saat seçici ile)
  - Namaz Vakitleri Bildirimleri (şehre göre otomatik)
  - **🕌 Ezan Sesi** - Namaz vakitlerinde ezan sesi çalma
  - Günlük Oruç Hatırlatıcısı
- **🗑️ Veri Yönetimi** - Verileri sıfırlama

## 🛠️ Teknoloji Stack

- **React Native** (Expo SDK 54)
- **TypeScript**
- **React Navigation** (Stack Navigator)
- **AsyncStorage** - Yerel veri saklama
- **Expo Notifications** - Bildirimler
- **Expo AV** - Ses çalma (ezan sesi)
- **Expo Location** - Konum servisleri
- **Aladhan API** - Namaz vakitleri

## 🚀 Kurulum

### Gereksinimler
- Node.js (v18+)
- npm veya yarn
- Expo CLI
- iOS Simulator (Mac) veya Android Emulator

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Expo ile başlatın:**
```bash
npx expo start
```

3. **iOS için:**
```bash
npx expo start --ios
```

4. **Android için:**
```bash
npx expo start --android
```

## 📁 Proje Yapısı

```
oruc/
├── src/
│   ├── components/        # Bileşenler
│   │   ├── DiniDuvarSaati.tsx
│   │   ├── OrucSayaci.tsx
│   │   ├── OrucZinciri.tsx
│   │   ├── HadisGosterici.tsx
│   │   ├── OrucFaydalari.tsx (Şükür Ayetleri)
│   │   ├── AkordeonMenu.tsx
│   │   ├── SaatSecici.tsx
│   │   └── ...
│   ├── screens/           # Ekranlar
│   │   ├── HomeScreen.tsx
│   │   ├── IstatistiklerScreen.tsx
│   │   ├── DualarScreen.tsx
│   │   ├── TesbihScreen.tsx
│   │   ├── KuranAyetleriScreen.tsx
│   │   ├── NotlarScreen.tsx
│   │   ├── EkstraScreen.tsx
│   │   ├── WidgetScreen.tsx
│   │   └── AyarlarScreen.tsx
│   ├── hooks/             # Custom Hooks
│   │   ├── useNamazVakitleri.ts
│   │   ├── useBildirimler.ts
│   │   ├── useOrucZinciri.ts
│   │   └── useKibleYonu.ts
│   ├── utils/             # Yardımcı Fonksiyonlar
│   │   ├── namazVakitleri.ts
│   │   ├── storage.ts
│   │   ├── ezanSesi.ts
│   │   ├── sahurVakitleri.ts
│   │   └── ramazanTarihleri.ts
│   ├── constants/         # Sabitler
│   │   ├── renkler.ts
│   │   ├── sehirler.ts
│   │   ├── hadisler.ts
│   │   ├── kuranAyetleri.ts
│   │   ├── sukurAyetleri.ts
│   │   └── dualars.ts
│   ├── types/             # TypeScript Tipleri
│   └── navigation/        # Navigasyon
│       └── AppNavigator.tsx
├── assets/                # Görseller ve sesler
├── app.json               # Expo konfigürasyonu
├── package.json
└── README.md
```

## 🎯 Kullanım Kılavuzu

### İlk Kullanım
1. Uygulamayı açın
2. Ayarlar → Şehir Seçimi'nden şehrinizi seçin
3. Bildirim izinlerini verin
4. Ana sayfada namaz vakitlerini görüntüleyin

### Günlük Kullanım
1. Ana sayfada kalan süreyi takip edin
2. Oruç tamamlandığında günü işaretleyin
3. Şükür ayetini okuyun
4. Hadis-i şerifi okuyun
5. İstatistiklerinizi kontrol edin

### Bildirimler
1. Ayarlar → Bildirim Ayarları
2. İstediğiniz bildirimleri aktif edin
3. Saatleri özelleştirin (Sahur/İftar)
4. Ezan sesini açın
5. Namaz vakitleri otomatik ayarlanır

### Hesaplayıcılar
1. Ekstra Özellikler ekranına gidin
2. Zekat/Fitre/Kalori hesaplayıcılarını kullanın
3. Sonuçları görüntüleyin

## 📅 2026 Ramazan

- **Başlangıç:** 27 Şubat 2026
- **Bitiş:** 28 Mart 2026
- **Süre:** 30 gün
- Tüm özellikler 2026 tarihlerine göre optimize edilmiştir

## 🔔 Bildirim Özellikleri

### Bildirim Türleri
- ✅ Sahur Hatırlatıcısı (özelleştirilebilir saat)
- ✅ İftar Hatırlatıcısı (özelleştirilebilir saat)
- ✅ Namaz Vakitleri (5 vakit, şehre göre otomatik)
- ✅ Ezan Sesi (namaz vakitlerinde)
- ✅ Günlük Oruç Hatırlatıcısı
- ✅ Sahur Su İçme Hatırlatıcısı (2026 Ramazan için)

### Bildirim Özellikleri
- 30 günlük planlama
- Şehre göre otomatik vakitler
- Ezan sesi desteği
- Arka planda çalışma

## 🎨 Tasarım

- **Modern glassmorphism** efektleri
- **İslami yeşil tonları** ve altın vurgular
- **Büyük, okunabilir fontlar**
- **Yumuşak gölgeler** ve animasyonlar
- **Mobil uyumlu** akordeon menü

## 📱 Desteklenen Platformlar

- ✅ iOS
- ✅ Android
- ⚠️ Web (sınırlı özellikler)

## 🔒 Gizlilik

- Tüm veriler cihazda saklanır
- İnternet bağlantısı sadece namaz vakitleri ve kıble yönü için gerekir
- Hiçbir veri sunucuya gönderilmez

## 📝 Lisans

Bu proje özel bir projedir.

## 🙏 Teşekkürler

- Aladhan API - Namaz vakitleri
- Tüm açık kaynak kütüphaneler

---

**Versiyon:** 1.0.0  
**Son Güncelleme:** 2026  
**Ramazan:** 2026 (27 Şubat - 28 Mart)
