# CollectAPI Namaz Vakitleri API Kurulumu

Bu uygulama, namaz vakitlerini CollectAPI'den çeker. CollectAPI ücretsiz plan sunmaktadır.

## API Key Alma

1. **Hesap Oluşturun:**
   - https://collectapi.com adresine gidin
   - Ücretsiz hesap oluşturun

2. **API Key Alın:**
   - Namaz Vakitleri API'sine gidin: https://collectapi.com/tr/api/pray/namaz-vakitleri-api
   - API key'inizi kopyalayın

3. **Yapılandırma:**
   - `app.json` dosyasındaki `extra` bölümüne API key'inizi ekleyin:

```json
{
  "expo": {
    "extra": {
      "collectApiKey": "your_api_key_here"
    }
  }
}
```

## API Özellikleri

- ✅ Ücretsiz plan mevcut
- ✅ Şehir adı ile direkt kullanım
- ✅ Güncel Diyanet verileri
- ✅ Otomatik fallback (Vakit.vercel.app)

## Fallback Mekanizması

Eğer CollectAPI key ayarlanmamışsa veya API başarısız olursa, uygulama otomatik olarak **Vakit.vercel.app** API'sini kullanır (ücretsiz, açık kaynak).

## Sorun Giderme

### "API key ayarlanmamış" hatası

- `app.json` dosyasındaki `extra.collectApiKey` değerini kontrol edin
- API key'in doğru olduğundan emin olun
- Uygulamayı yeniden başlatın

### API Limit Aşımı

- CollectAPI ücretsiz planında limit olabilir
- Limit aşıldığında otomatik olarak Vakit.vercel.app API'si kullanılır

## Güvenlik

⚠️ **ÖNEMLİ:** API key'inizi asla public repository'lere commit etmeyin!

- `app.json`'daki bilgileri production build'de environment variable olarak kullanın
- API key'i `.gitignore`'a ekleyin (eğer ayrı dosya kullanıyorsanız)



