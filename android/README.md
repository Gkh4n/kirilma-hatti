# Android 4.4.0

Offline WebView application, package tr.kirilmahatti.game, Android 6.0+.
The bundled index.html is copied from the repository root for each build.
No INTERNET permission or JavaScript native bridge is used. HTML is served
from APK assets at the private https://game.local/index.html origin; other
requests are denied. Progress lives in the application's WebView storage.
Website updates require a new APK build; website and app records are separate.

Build toolchain: Android build-tools 35, android-35/android.jar, Eclipse ECJ
3.38.0, Java 17. Compile Java with ECJ -1.8 against android.jar, package
manifest/resources/assets using aapt, generate classes.dex with d8 (min-api 23),
add classes.dex to the APK, zipalign, then sign with apksigner.
The release keystore is kept separately from this public repository. Reuse
that key to install later builds as updates without removing player records.

Validation: game unit tests and all 74 witness replays, APK signature,
manifest/package/minSdk/targetSdk and asset-byte comparison. A physical-device
installation test has not been performed in this environment.

4.3.1: Native root container applies system-bar and cutout insets before
laying out WebView. Consumed dimensions are zeroed for web content to avoid
double padding. All screens and system bars share the #080c16 background.

4.3.2 removes the startup WindowInsetsController dereference before decor
installation. Bar appearance is applied after setContentView. onPause tolerates
a partially initialized activity. Native inset layout from 4.3.1 is retained.

4.4.0: Android geri tuşu önce açık yardım/çıkış penceresini kapatır, ardından
ziyaret edilen önceki ekrana döner. Yalnızca ana ekranda, oyunun koyu lacivert
ve altın tasarımına uygun çıkış onayı gösterilir. APK içindeki üst geri
okları kaldırılmıştır; tarayıcı sürümünde korunur. İlerleme kayıtları korunur.
