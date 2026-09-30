# Kırılma Hattı · 3.1.0

50 farklı haritalı stratejik rota oyunu. Beş sarmal yörünge: İz, Geçit,
Bağlantı, Faz ve Sentez. Bölümlerin tamamı seçilebilir.

Her manuel 90° dönüş bir hamledir; sayaç sıfırdan artar. Daha az hamle daha iyi
sonuçtur, eşit hamlede daha az adım üstün gelir. Kişisel en iyi sonuç bu tarayıcıda
saklanır. Yeni haritalar eski haritaların puanlarıyla karşılaştırılmaz;
eski kayıtlar silinmez, yeni kampanya `kh31_` kayıt alanını kullanır.

## Mekanikler

- Anahtarlar, sıralı anahtarlar ve tek yönlü/sabit diskler.
- Harfli röleler ve kapılar; aynı röleye tekrar girmek kapıyı kapatır.
- Bir veya iki portal çifti, kırılgan zemin ve bağlı diskler.
- Girişte 90° dönen diskler.
- **Buz:** düzenlenemez; giriş yönünü koruyarak düz geçiş sağlar.
- **Faz:** kristaller I/II durumunu değiştirir. Yalnızca etkin fazın kapıları
  açılır; açık faz kapıları giriş yönünü korur.

İlk 24 bölüm de yalnızca ok yönleri değiştirilerek değil, yeni başlangıç/çıkış,
duvar, anahtar ve bağlantı yerleşimleriyle yeniden tasarlandı. Bir bölüme ait
mekanikler tahtanın altındaki simgelere dokunularak açıklanır.

## Yayın ve çevrimdışı kullanım

https://gkh4n.github.io/kirilma-hatti/

GitHub Pages `main` kökünden yayınlanır. `index.html` tüm arayüzü ve motoru
barındırır. `sw.js` çevrimiçi açılışta güncel sürümü getirir, bağlantı yokken
son kaydedilmiş sürümü kullanır. Harici yazı tipi, hesap veya sunucu gerekmez.
Tarayıcı verilerini temizlemek yerel ilerlemeyi siler; cihazlar arasında otomatik
kayıt taşıma yapılmaz.

## Kontroller

```sh
node --test tests/game.test.cjs
node tests/verify.cjs
node tests/replay.cjs
```

Testler: 50 çözümün gerçek hareket motorunda tekrar oynatılması; farklı harita
imzaları; hamle/rekor sıralaması ve saklama; 1.000 dönüş; bağlı disk geri alma;
kapı, portal, anahtar sırası, kırılgan zemin, buz ve faz kuralları;
önizlemenin durumu değiştirmemesi; döngüde duraklama; arka plana geçiş;
gecikmiş sonuç pencerelerinin iptali.

`scripts/build-campaign.py` tasarımları ve çözüm tanıklarını deterministik olarak
yeniden üretir. Üretimden sonra testler yeniden çalıştırılmalıdır.
Test rotalarının dönüş sayısı 7'den 56'ya yükselir; uzunlukları 11'den 35 adıma
çıkar ve gerilemez. Bunlar çözülebilirlik ve denge referanslarıdır; matematiksel
en kısa çözüm veya öznel zorluğun kusursuz sıralandığı iddiası değildir.
Oyuncular daha iyi yollar bulabilir.
