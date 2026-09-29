# Kırılma Hattı · 1.1.0

24 bölümlü, telefonda ve bilgisayarda oynanabilen stratejik rota oyunu.
Hesap veya sunucu gerekmez. İlerleme tarayıcıda saklanır.

## GitHub Pages

1. GitHub hesabında `kirilma-hatti` adlı boş bir **Public** depo oluştur.
2. Bu klasörün içeriğini `main` dalının köküne yükle. `index.html` kökte olmalı.
3. **Settings → Pages → Build and deployment** bölümünde **Deploy from a branch** seç.
4. **main / (root)** seçip **Save** düğmesine bas.
5. Yayın tamamlandığında Pages ekranındaki bağlantıyı aç.

Sonraki `main` güncellemeleri aynı oyun bağlantısına yayımlanır.
Yeni sürüm için sayfayı yeniden açmak/yenilemek yeterlidir; ilerleme aynı tarayıcıda korunur.
İlk çevrimiçi açılışta dosyalar önbelleğe alındıktan sonra çevrimdışı oynanabilir.
Özel gezinme, tarayıcı verilerini temizleme veya cihaz değiştirme kayıtları taşımaz.
Eski yerel HTML dosyası ile Pages adresi farklı kayıt alanlarıdır.

## Geliştirme ve test

`index.html` tüm oyun kodunu ve tasarımı içerir. `sw.js` çevrimdışı önbelleği yönetir.
Yerel HTTP sunucusu: `python3 -m http.server 8000`
Mantık kontrolleri: `node --test tests/game.test.cjs`
24 bölümün kayıtlı çözümünü tekrar oynatma: `node tests/replay.cjs`

## 1.1.0 değişiklikleri

- Son oynanan bölüm ayrı kaydedilir; yeni oyuncu ilk bölümden başlar. 24 bölüm açık kalır.
- Kapılar açıldığında görünümü değişir ve çekirdeği geldiği yönde düz geçirir.
- Rota önizlemesi ve gerçek hareket tek motor kullanır; önizleme başlangıçtan önce görünür.
- Devriye, portal, anahtar sırası, kırılgan zemin ve eksik anahtarlı çıkış kontrolleri tutarlıdır.
- Hazırlıkta ve duraklatmada son dönüş geri alınabilir.
- Gecikmeli sonuç pencereleri yeniden başlatma/ekran değiştirmede iptal edilir.
- Arka plana geçildiğinde otomatik duraklama; devamda tam hareket aralığı.
- Yıldız hedefi görünür; bağlı diskler numaralı; çöken zemin ayırt edilir.
- Mobil açıklamalar büyütüldü, yardım kaydırılabilir, mekanik detayları klavyeyle de açılır.
- Yinelenen tasarım yamaları temizlendi; rota ve çekirdek konumu gerçek tahta boyutunu izler.

## Doğrulama sınırı

Oyun mantığı testleri ve 24 çözüm tekrarı çalıştırılmıştır. Bu ortamda gerçek tarayıcı
çalıştırılamadığından mobil görsel ve dokunma doğrulaması yayın öncesi ayrıca yapılmalıdır.
