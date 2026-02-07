/**
 * Firebase Messaging manifest çakışmasını giderir.
 * default_notification_color meta-data'sına tools:replace ekleyerek
 * react-native-firebase_messaging ile birleştirme hatasını önler.
 *
 * withDangerousMod kullanılıyor çünkü withAndroidManifest
 * tools namespace'ini düzgün serialize edemiyor.
 */
const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withAndroidFirebaseManifest(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const manifestPath = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'AndroidManifest.xml'
      );

      if (!fs.existsSync(manifestPath)) {
        console.warn('[android-firebase-manifest] AndroidManifest.xml bulunamadı:', manifestPath);
        return config;
      }

      let manifest = fs.readFileSync(manifestPath, 'utf-8');

      // xmlns:tools yoksa ekle
      if (!manifest.includes('xmlns:tools')) {
        manifest = manifest.replace(
          '<manifest ',
          '<manifest xmlns:tools="http://schemas.android.com/tools" '
        );
      }

      // default_notification_color meta-data'sına tools:replace ekle (yoksa)
      const metaTag = 'com.google.firebase.messaging.default_notification_color';
      if (manifest.includes(metaTag) && !manifest.includes('tools:replace="android:resource"')) {
        manifest = manifest.replace(
          new RegExp(
            '(<meta-data\\s+[^>]*android:name="' + metaTag.replace(/\./g, '\\.') + '"[^>]*?)(\\s*/?>)'
          ),
          '$1 tools:replace="android:resource"$2'
        );
      }

      fs.writeFileSync(manifestPath, manifest, 'utf-8');
      console.log('[android-firebase-manifest] tools:replace eklendi');

      return config;
    },
  ]);
}

module.exports = withAndroidFirebaseManifest;
