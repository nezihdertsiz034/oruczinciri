# ➕ Müslüman+

Modern Müslüman yaşamı için kapsamlı mobil uygulama.

Namaz vakitleri, Kur'an-ı Kerim, oruç takibi, dualar, tesbih sayacı ve daha fazlasını içeren modern İslami mobil uygulama.

## ✨ Tüm Özellikler

### 🏠 Ana Sayfa
- **⏱️ Oruç Sayacı** - İftara/Sahura kalan süre (Saat:Dakika:Saniye), dairesel ilerleme göstergesi
- **🕌 Sonraki Namaz Sayacı** - 6 vakit gösterimi, sonraki namaza geri sayım
- **📅 Ramazan Takvimi** - 30 günlük kompakt grid, oruç tutulan günleri işaretleme
- **🔗 Oruç Zinciri** - 30 günlük görsel zincir, günlük işaretleme
- **📖 Günün Ayeti** - Günlük ayet gösterimi
- **📿 Günün Hadisi** - Günlük hadis gösterimi
- **⚡ Hızlı Erişim** - Tesbih, Kıble, Dualar, Notlar ve daha fazlası

### 🔔 Bildirim Sistemi (Yeni Güncellenmiş)
- **6 Vakit Namaz Bildirimi** - İmsak, Güneş, Öğle, İkindi, Akşam, Yatsı
- **150 Hadis-i Şerif** - Her namaz vaktinde farklı hadis
- **7 Günlük Planlama** - Önümüzdeki 7 gün önceden planlanır
- **Timezone Güvenli** - Doğru saat hesaplaması
- **Android 12+ Uyumlu** - Exact Alarm desteği
- **Sahur/İftar Hatırlatıcısı** - Özelleştirilebilir saatler
- **Ezan Sesi** - Namaz vakitlerinde ses çalma

### 📍 Otomatik Konum (YENİ)
- **GPS ile Şehir Belirleme** - Konumdan en yakın şehri otomatik bul
- **81 İl Koordinatları** - Haversine formülü ile mesafe hesaplama
- **Büyük Şehirler Öncelikli** - İstanbul, Ankara, İzmir listenin başında

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

### ⚙️ Ayarlar
- **📍 Şehir Seçimi:**
  - 81 il desteği
  - "🌐 Konumumu Bul" butonu (GPS ile otomatik)
  - Büyük şehirler listenin başında
- **🔔 Bildirim Ayarları:**
  - Sahur Hatırlatıcısı (saat seçici ile)
  - İftar Hatırlatıcısı (saat seçici ile)
  - Namaz Vakitleri Bildirimleri (6 vakit)
  - Ezan Sesi (namaz vakitlerinde)
  - Günlük Oruç Hatırlatıcısı
- **🛠️ Hata Ayıklama:**
  - Bildirimleri Test Et
  - Zamanlananları Kontrol Et
- **🗑️ Veri Yönetimi** - Verileri sıfırlama

## 🛠️ Teknoloji Stack

- **React Native** (Expo SDK 54)
- **TypeScript**
- **React Navigation** (Bottom Tabs + Native Stack)
- **AsyncStorage** - Yerel veri saklama
- **Expo Notifications** - Bildirimler (timestamp tabanlı)
- **Expo AV** - Ses çalma (ezan sesi)
- **Expo Location** - GPS konum servisleri
- **React Native SVG** - Dairesel ilerleme göstergeleri
- **Aladhan API** - Namaz vakitleri (Diyanet uyumlu metot)

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

### APK Oluşturma (Yerel)
```bash
cd android && ./gradlew assembleRelease
```
APK konumu: `android/app/build/outputs/apk/release/app-release.apk`

## 📁 Proje Yapısı

```
musluman-plus/
├── src/
│   ├── components/        # Bileşenler
│   │   ├── OrucSayaci.tsx
│   │   ├── SonrakiNamazSayaci.tsx  # YENİ
│   │   ├── RamazanTakvimi.tsx      # YENİ
│   │   ├── OrucZinciri.tsx
│   │   ├── BackgroundDecor.tsx
│   │   ├── SaatSecici.tsx
│   │   └── ...
│   ├── screens/           # Ekranlar
│   │   ├── HomeScreen.tsx
│   │   ├── IstatistiklerScreen.tsx
│   │   ├── DualarScreen.tsx
│   │   ├── TesbihScreen.tsx
│   │   ├── KuranAyetleriScreen.tsx
│   │   ├── NotlarScreen.tsx
│   │   ├── AyarlarScreen.tsx
│   │   └── ekstra/         # Ekstra sayfalar
│   ├── hooks/             # Custom Hooks
│   │   ├── useNamazVakitleri.ts
│   │   ├── useBildirimler.ts
│   │   ├── useOrucZinciri.ts
│   │   └── useKibleYonu.ts
│   ├── utils/             # Yardımcı Fonksiyonlar
│   │   ├── namazVakitleri.ts
│   │   ├── storage.ts
│   │   ├── ezanSesi.ts
│   │   ├── konumServisi.ts  # YENİ - GPS şehir belirleme
│   │   └── ramazanTarihleri.ts
│   ├── constants/         # Sabitler
│   │   ├── renkler.ts
│   │   ├── sehirler.ts
│   │   ├── hadisler.ts
│   │   ├── namazVaktiHadisleri.ts  # YENİ - 150 hadis
│   │   ├── kuranAyetleri.ts
│   │   ├── sukurAyetleri.ts
│   │   └── dualars.ts
│   ├── types/             # TypeScript Tipleri
│   └── navigation/        # Navigasyon
│       └── AppNavigator.tsx
├── assets/                # Görseller ve sesler
│   ├── ney.mp3           # Bildirim sesi
│   └── ezan.mp3          # Ezan sesi
├── android/               # Android native kodu
├── app.json               # Expo konfigürasyonu
├── package.json
└── README.md
```

## 🎯 Kullanım Kılavuzu

### İlk Kullanım
1. Uygulamayı açın
2. Ayarlar → "🌐 Konumumu Bul" ile şehrinizi otomatik belirleyin
   - veya listeden manuel seçin
3. Bildirim izinlerini verin (Android 12+ için "Tam Alarm" izni)
4. Ana sayfada namaz vakitlerini ve sayaçları görüntüleyin

### Günlük Kullanım
1. Ana sayfada sonraki namaza kalan süreyi takip edin
2. Oruç tamamlandığında günü işaretleyin
3. Ramazan takviminde ilerlemenizi görün
4. Hadis-i şerifi okuyun
5. İstatistiklerinizi kontrol edin

### Bildirimler
1. Ayarlar → Bildirim Ayarları
2. İstediğiniz bildirimleri aktif edin
3. Saatleri özelleştirin (Sahur/İftar)
4. **Test için:** "Bildirimleri Test Et" butonuna tıklayın
5. Namaz vakitleri otomatik olarak 7 gün önceden planlanır

## 📅 2026 Ramazan

- **Başlangıç:** 19 Şubat 2026
- **Bitiş:** 19 Mart 2026
- **Süre:** 30 gün
- **İlk Oruç:** 19 Şubat
- **Son Oruç (Arefe):** 19 Mart
- Tüm özellikler 2026 tarihlerine göre optimize edilmiştir


## 🔔 Bildirim Sistemi Detayları

### Bildirim Türleri
| Tür | Açıklama | Varsayılan |
|-----|----------|------------|
| İmsak | Sabah namazı bildirimi + hadis | Aktif |
| Güneş | Güneş doğuşu bildirimi + hadis | Aktif |
| Öğle | Öğle namazı bildirimi + hadis | Aktif |
| İkindi | İkindi namazı bildirimi + hadis | Aktif |
| Akşam | Akşam namazı (iftar) bildirimi + hadis | Aktif |
| Yatsı | Yatsı namazı bildirimi + hadis | Aktif |
| Sahur | İmsak'tan önce hatırlatma | Aktif |
| İftar | Akşam'dan önce hatırlatma | Aktif |

### Teknik Özellikler
- **Planlama:** 7 gün önceden
- **Tetikleyici:** Timestamp tabanlı (milisaniye)
- **Timezone:** Yerel saat dilimine göre hesaplama
- **Geçmiş Kontrol:** 30 saniye buffer ile
- **Android Kanal:** MAX öncelik, titreşim, ses

## 🎨 Tasarım

- **Modern glassmorphism** efektleri
- **İslami yeşil tonları** ve altın vurgular
- **Büyük, okunabilir fontlar**
- **Dairesel ilerleme göstergeleri**
- **Mobil uyumlu** bottom tab navigasyon

## 📱 Desteklenen Platformlar

- ✅ iOS
- ✅ Android (API 24+)
- ⚠️ Web (sınırlı özellikler)

## 🔒 Gizlilik

- Tüm veriler cihazda saklanır
- İnternet bağlantısı sadece namaz vakitleri ve kıble yönü için gerekir
- Konum izni sadece şehir belirleme için kullanılır
- Hiçbir veri sunucuya gönderilmez

## 📝 Lisans

Bu proje özel bir projedir.

## 🙏 Teşekkürler

- Aladhan API - Namaz vakitleri
- Expo - React Native framework
- Tüm açık kaynak kütüphaneler

---

**Versiyon:** 1.1.0  
**Son Güncelleme:** Ocak 2026  
**Ramazan:** 2026 (19 Şubat - 19 Mart)
