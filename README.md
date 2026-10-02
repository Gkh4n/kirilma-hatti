# Kırılma Hattı · 4.6.2

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
4.6 kalibrasyonu gerçek oyun motorunda 72 aday genişliğinde sınırlı arama kullanır.
Üç yıldız hedefi doğrulanmış rota maliyetine ilk 10 bölümde %15, diğerlerinde
%8 tolerans (en az 1 hamle) ekler. Bu değerler kanıtlanmış minimum değildir;
oyuncu daha iyi bir yol bulabilir. Zorluk yalnızca hamle sayısıyla ölçülmez.
`tests/calibration.json` değişen bölümleri ve hedefleri; `tests/solutions.json`
74 oynatılabilir çözümü içerir. `node tests/verify.cjs` hepsini gerçek motorla doğrular.

24 haritada anahtar sapakları ve yeniden kullanılan kavşaklar tasarlandı;
ileri haritalarda buz girişi, tek yön, bağlı disk ve kırılgan çıkış vurguları değişir.
Değişen haritalar yeni skor sürümü kullanır; eski kayıtlar ve bölüm açılışları
korunur, eski rota rekorları yeni rota skoruyla karşılaştırılmaz.
Mekanikler ilk görüldüğünde ilgili kare 9 saniye vurgulanır; anlatım kapatılabilir
ve başlatıldığında kapanır. Görülmüş anlatımlar cihazda kaydedilir.
AUREN/NOXIS son bölümleri tamamlanınca kayıtlı toplam yıldız, en iyi hamle
ve tamamlanan bölüm özeti gösterilir.

4.6.1: NOXIS oyun başlıkları yalnızca bölüm adını gösterir; kategori önekleri kaldırıldı.

4.6.2: Portal legend uses the board ring/P1 identity. Multi-pass bounded cost search and replay-verified cycle shortening improve reference routes; global optimality is not proven.


### 4.6.3
Dünya/bölüm başlıkları iki dünyada aynı düzende. Sonuç ekranından haritaya dönüş eklendi. Üç yıldız toleransı kaldırıldı; hedef doğrulanmış en iyi rota ile daha iyi kayıtlı rekorun küçüğüdür. Bu hedef, bütün bölümler için mutlak minimum iddiası değildir. Dijkstra kontrolünde minimumu kanıtlanan bölümler: 1, 2, 5, 7, 8, 9, 10, 11, 19, 20. Diğerlerinde kaynak sınırına ulaşıldı; tests/minimum-certificates.json durumu açıkça kaydeder. Bölümler ve kilit sistemi değişmedi.
