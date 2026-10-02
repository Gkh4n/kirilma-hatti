# Kırılma Hattı · 4.5.1

74 bölümlük stratejik rota oyunu. Bölümler sırayla açılır; yeni oyuncuda yalnızca ilk bölüm açıktır.
Bu 50 bölüm tamamlandığında 24 bölümlük NOXIS açılır; yıldız eşiği yoktur.
NOXIS sekizer bölümlük Obsidyen, Paradoks ve Son Mühür yörüngelerinden oluşur.
4.0 güncellemesi mevcut 50 bölümün verilerini ve `kh32_` kayıtlarını korur.

Her manuel 90° dönüş bir hamledir; sayaç sıfırdan artar. Daha az hamle daha iyi
sonuçtur, eşit hamlede daha az adım üstün gelir. Kişisel en iyi sonuç bu tarayıcıda
saklanır. Yeni haritalar eski haritaların puanlarıyla karşılaştırılmaz;
eski kayıtlar silinmez, yeni kampanya `kh32_` kayıt alanını kullanır.

## Mekanikler

- Tüm 74 bölümde 42 dolu kare; boş duvar hücresi yok.
- AUREN’de 3–6, NOXIS’te 8–10 sıralı anahtar; tek yönlü/sabit diskler.
- Usta çıkışları iki açık röle, iki kristalin ziyareti ve Faz I gerektirir.
- Harfli röleler ve kapılar; aynı röleye tekrar girmek kapıyı kapatır.
  Röleli bölümlerde çıkış için rölenin açık olması da gerekir.
- Bir veya iki portal çifti, kırılgan zemin ve bağlı diskler.
- Girişte 90° dönen diskler.
- **Buz:** düzenlenemez; giriş yönünü koruyarak düz geçiş sağlar.
- **Faz:** kristaller I/II durumunu değiştirir. Yalnızca etkin fazın kapıları
  açılır; açık faz kapıları giriş yönünü korur.

İlk 24 bölüm de yalnızca ok yönleri değiştirilerek değil, yeni başlangıç/çıkış,
anahtar ve bağlantı yerleşimleriyle yeniden tasarlandı. Bir bölüme ait
mekanikler tahtanın altındaki simgelere dokunularak açıklanır.

## Oynanış ve arayüz

Tek adım düğmesi hareketi bir hücre ilerletip duraklatır; bu sırada diskler
düzenlenebilir. Devam düğmesi otomatik hareketi sürdürür. Hareket adımları
manuel disk çevirme hamlelerinden ayrı sayılır. Sade diskler, altın çıkış,
anahtar toplama ve kapı animasyonları kullanılır; azaltılmış hareket tercihi
korunur. Sonuç ekranı hamleyi, önceki rekora farkı ve izlenen rotayı gösterir.

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

Testler: 74 çözümün gerçek hareket motorunda tekrar oynatılması; farklı harita
imzaları; hamle/rekor sıralaması ve saklama; 1.000 dönüş; bağlı disk geri alma;
kapı, portal, anahtar sırası, kırılgan zemin, buz ve faz kuralları;
önizlemenin durumu değiştirmemesi; döngüde duraklama; arka plana geçiş;
gecikmiş sonuç pencerelerinin iptali; 50 tamamlanma koşuluyla dünya kilidi;
tek adım/geri alma; kristal ve çıkış fazı koşulları.

`scripts/build-campaign.py` AUREN’i (var olan usta bölümlerini koruyarak),
`scripts/build-master.py` NOXIS’i deterministik olarak yeniden üretir.
İkisi de kök dizinden Python 3.12+ ile çalıştırılır. Üretimden sonra testler
yeniden çalıştırılmalıdır.
Test rotalarının dönüş sayısı 18'den 67'ye yükselir; uzunlukları 24'ten 35 adıma
çıkar ve gerilemez. Bunlar çözülebilirlik ve denge referanslarıdır; matematiksel
en kısa çözüm veya öznel zorluğun kusursuz sıralandığı iddiası değildir.
Oyuncular daha iyi yollar bulabilir.

4.4.0 için ayrıca tüm hücrelerin doluluğu ve röleli çıkışlar test edilir. Disk
yönü, kapı ve buz kısıtları gevşetilse bile anahtarları sırayla gezmenin en kısa
mesafesi 16–25 adımdır ve kampanya boyunca gerilemez. Bu alt sınır bağımsız
genişlik öncelikli arama ile doğrulanır; hamle minimumu değildir.

Usta bölümlerinin çözüm tanıkları 68–91 dönüş ve 37–39 hareket adımı kullanır.
Gevşetilmiş en kısa hareket mesafesi 28–35 adımdır: normal dünyanın en yüksek
25 adımlık alt sınırının üzerindedir. Bu ölçüt düşünsel zorluğu tek başına
kanıtlamaz; hamle açısından en iyi çözümler oyuncular tarafından geliştirilebilir.

4.1: Ana menü sadeleştirildi; başlangıç ipucu, doğrulanmış çözümün ilk iki
karesini ve yönünü tahtada işaretler. Diskleri kendiliğinden çevirmez, hamle
eklemez. Çalışan oyunda ipucu açmak hareketi duraklatır. Bu ipucu tam çözüm
veya en az hamle garantisi değildir.

4.2: Nasıl oynanır penceresi, başlangıç/çıkış işaretlerini ve kampanyada
kullanılan tüm mekanikleri simgeli kartlarla açıklar. Usta çıkış koşulları
aynı rehberde yer alır.

4.3: Sıralı bölüm kilidi hem AUREN hem NOXIS’e uygulanır. Önceki
rekorlar korunur; arada tamamlanmamış bölüm varsa sonraki bölümler kilitlidir.
Android sürümü tüm oyun dosyalarını içerir ve çevrimdışı çalışır.

4.3.1: Native root container applies system-bar and cutout insets before
laying out WebView. Consumed dimensions are zeroed for web content to avoid
double padding. All screens and system bars share the #080c16 background.

4.4.0: Android geri tuşu önce açık yardım/çıkış penceresini kapatır, ardından
ziyaret edilen önceki ekrana döner. Yalnızca ana ekranda, oyunun koyu lacivert
ve altın tasarımına uygun çıkış onayı gösterilir. APK içindeki üst geri
okları kaldırılmıştır; tarayıcı sürümünde korunur. İlerleme kayıtları korunur.

4.5.0: Açılış rehberi kaldırıldı. Oyna bölüm haritasını açar; ilk oynayışta
yalnızca temel kontroller anlatılır. İkonlu Nasıl Oynanır düğmesi tüm
mekanikleri içerir. Ortak logo/isim başlığı tüm ekranlarda yer alır.

4.5.1: Dünya adları AUREN ve NOXIS olarak güncellendi; bölüm, kayıt ve kilit mantığı korunur.
