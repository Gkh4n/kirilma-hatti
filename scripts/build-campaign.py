"""Deterministic, distinct route designs with replayable witnesses. Not an optimal solver."""
import random,json,re
from collections import deque
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
D=['U','R','D','L'];V=[(-1,0),(0,1),(1,0),(0,-1)]
names=['İlk Kıvılcım','Kıyı Yolu','İki Yakası','Çatal','Gizli Cep','Sabit Yıldız','Dar Açı','Tek Akış','Ters Kıyı','Keskin Köşe','İlk Röle','Anahtar Odası','Kapalı Devre','Çift Koridor','Dönüş Kilidi','Uzak Bağ','İkiz Adalar','Kırık Köprü','Ada Zinciri','Son Geçit','Eş Zaman','Bağlı Karar','İkili Düğüm','Dönen Çekirdek','Çapraz Etki','Buz Hattı','Kaygan Viraj','Soğuk Bağ','Kristal Akış','Donuk Geçit','İlk Faz','Mor Eşik','Altın Dönüş','Faz Değişimi','İki Gerçeklik','Röle ve Kristal','Ayna Koridor','Faz Köprüsü','Uzak Yankı','Çift Frekans','Üç Ada','Karşı Kutuplar','Çözüm Ağı','Kilit Zinciri','Kırılgan Devre','Derin Yörünge','Buz ve Ateş','Son Düğüm','Son Frekans','Kırılma Noktası']
def direction(a,b):return D[V.index((b[0]-a[0],b[1]-a[1]))]
def build(i,attempt):
 rng=random.Random(51000+i*8191+attempt*31);n=24+i//4+(1 if i>=15 else 0)+(1 if i>=40 else 0)
 if i<15 and (n-1)%2!=(16+i//5)%2:n+=1
 jumps=[]
 if i>=15:jumps=[n//2]
 if i>=40:jumps=[n//3,2*n//3]
 start=(rng.randrange(7),rng.randrange(6));path=[start];seen={start};budget=[20000]
 def walk():
  budget[0]-=1
  if budget[0]<=0:return False
  if len(path)==n:return True
  if len(path) in jumps:
   opts=[(r,c) for r in range(7) for c in range(6) if (r,c) not in seen and abs(r-path[-1][0])+abs(c-path[-1][1])>=4]
  else:opts=[(path[-1][0]+dr,path[-1][1]+dc) for dr,dc in V if 0<=path[-1][0]+dr<7 and 0<=path[-1][1]+dc<6 and (path[-1][0]+dr,path[-1][1]+dc) not in seen]
  rng.shuffle(opts)
  # Several long lanes, interspersed with turns; different seeds alter the whole geometry.
  if len(path)>1 and len(path)-1 not in jumps and rng.random()<.55:
   dr=path[-1][0]-path[-2][0];dc=path[-1][1]-path[-2][1];straight=(path[-1][0]+dr,path[-1][1]+dc)
   if straight in opts:opts.remove(straight);opts.insert(0,straight)
  for p in opts:
   seen.add(p);path.append(p)
   if walk():return True
   path.pop();seen.remove(p)
  return False
 if not walk():return
 ingress={j-1 for j in jumps};used={0,n-1,*ingress,*jumps}
 straight=[k for k in range(1,n-1) if k not in used and direction(path[k-1],path[k])==direction(path[k],path[k+1])]
 L=dict(id=f'kh32-{i+1:02d}',name=names[i],chapter=['İz','Geçit','Bağlantı','Faz','Sentez'][i//10],seed=51000+i,start=path[0],exit=path[-1],keys=[],walls=[],hazards=[],fixed=[],gates=[],switches=[],portals=[dict(a=path[j-1],b=path[j]) for j in jumps],fragile=[],oneWay=[],links=[],autoRotate=[],movers=[],decoys=[],limited=[],boosts=[],ice=[],phaseGates=[],phaseSwitches=[],ordered=True,moves=0)
 def take(candidates):
  opts=[k for k in candidates if k not in used]
  if not opts:raise ValueError()
  k=rng.choice(opts);used.add(k);return k
 try:
  if i>=30:
   # Two switches force two distinct phase decisions on the witness route.
   g1=take([k for k in straight if 4<=k<n*.56]);s1=take(range(1,g1))
   g2=take([k for k in straight if g1+3<=k<n-1]);s2=take(range(g1+1,g2))
   L['phaseSwitches']=[path[s1],path[s2]];L['phaseGates']=[(*path[g1],1),(*path[g2],0)]
  if i>=10 and (i<15 or 20<=i<30 or i>=35):
   k=take([k for k in straight if k>=3]);sw=take(range(1,k));L['gates']=[(*path[k],'A')];L['switches']=[(*path[sw],'A')]
  if i>=25:
   k=take(straight);L['ice']=[path[k]]
  if 5<=i<10 or i>=18:
   k=take(range(1,n-1));L['fixed']=[(*path[k],direction(path[k],path[k+1]))]
  if 8<=i<15:
   k=take(straight);L['oneWay']=[(*path[k],direction(path[k],path[k+1]))]
  if i>=17:
   k=take(range(1,n-1));L['fragile']=[path[k]]
  if i>=20:
   a=take(range(1,n-1));b=take(range(1,n-1));L['links']=[[path[a],path[b]]]
  if i>=23:
   k=take(range(1,n-1));L['autoRotate']=[path[k]]
  # Keys span the route, including branch tips; can share a rotating disk without changing its rules.
  key_opts=[k for k in range(1,n-1) if k not in ingress and k not in jumps and path[k] not in L['phaseSwitches'] and not any(path[k]==x[:2] for x in L['gates']+L['phaseGates']) and path[k] not in L['ice']]
  count=min(6,3+i//12)
  selected=[]
  for f in range(count):
   ideal=(f+1)*(n-1)/(count+1);k=min([x for x in key_opts if x not in selected],key=lambda x:abs(x-ideal));selected.append(k)
  L['keys']=[path[k] for k in sorted(selected)]
  # Every cell is playable or a clearly drawn special tile; there are no blank walls.
  L['walls']=[]
  extras=[(r,c) for r in range(7) for c in range(6) if (r,c) not in seen]
  rng.shuffle(extras)
  L['hazards']=extras[:min(len(extras),1+i//15)] if i>=4 else []
  L['requiredGates']=[g[2] for g in L['gates']]
  # Exact shortest distance in a RELAXED board: ignore disk direction, gate locks,
  # phase and ice constraints, but preserve portal transit and lethal cells.
  # This is a lower bound on actual movement, not a minimum-rotation claim.
  def distance(start,end):
   q=deque([(start,0)]);visited={start}
   while q:
    p,d=q.popleft()
    if p==end:return d
    for dr,dc in V:
     z=(p[0]+dr,p[1]+dc)
     if not(0<=z[0]<7 and 0<=z[1]<6) or z in L['hazards']:continue
     for portal in L['portals']:
      if z==portal['a']:z=portal['b'];break
      if z==portal['b']:z=portal['a'];break
     if z not in visited:visited.add(z);q.append((z,d+1))
   return 999
  stops=[L['start'],*L['keys'],L['exit']]
  relaxed=sum(distance(a,b) for a,b in zip(stops,stops[1:]))
  if relaxed!=16+i//5:return
  blocked={tuple(x[:2]) for x in L['fixed']+L['oneWay']+L['gates']+L['phaseGates']}|set(L['ice'])
  departures=[k for k in range(n-1) if k not in ingress]
  editable=[k for k in departures if path[k] not in blocked]
  target=18+i
  if target>3*len(editable):return
  turns={k:0 for k in departures}
  for _ in range(target):turns[rng.choice([k for k in editable if turns[k]<3])]+=1
  layout=[[rng.choice(D) for _ in range(6)] for _ in range(7)];influence={p:0 for p in path}
  for k in departures:
   p=path[k];out=direction(p,path[k+1]);auto=int(p in L['autoRotate'])
   layout[p[0]][p[1]]=D[(D.index(out)-turns[k]-auto-influence[p])%4]
   for group in L['links']:
    if p in group:
     for other in group:
      if other!=p:influence[other]+=turns[k]
  L['layout']=layout;L['par']=target
  types=[label for key,label in [('phaseGates','Faz'),('ice','Buz'),('links','Bağlı'),('portals','Portal'),('gates','Kapı'),('oneWay','Tek Yön'),('fixed','Sabit')] if L[key]]
  L['tag']=' · '.join(types[:2]) or 'Rota Seçimi'
  L['hint']=('Kristalleri hangi sırayla geçtiğine dikkat et; I ve II kapıları aynı anda açık olmaz.' if i>=30 else 'Buzda yön veremezsin; girişini bir önceki diskten ayarla.' if i>=25 else 'Bağlı disklerin ikisini de kontrol et. Birini çevirmek diğerini de değiştirir.' if i>=20 else 'Portaldan sonraki çıkış yönünü de hazırla.' if i>=15 else 'A rölesini etkinleştirmeden çıkış tamamlanmaz. Kontrol karesini anahtar rotana dahil et.' if i>=10 else 'Anahtarın bulunduğu yolu çıkışla birleştir. Sabit okların yönüne dikkat et.' if i>=5 else 'Numaralı anahtarların sırası rotayı belirler. Bir sonraki anahtar için hangi disklere geri döneceğini planla.')
  L['balance']={'referenceTurns':target,'referenceSteps':len(departures),'mechanicTypes':len(types),'design':i+1,'relaxedSteps':relaxed}
  return L,dict(level=i+1,id=L['id'],turns=target,steps=len(departures),actions=[turns[k] for k in departures],positions=[path[k] for k in departures],path=path)
 except (ValueError,IndexError):return
levels=[];routes=[]
for i in range(50):
 for attempt in range(3000):
  result=build(i,attempt)
  if result:break
 else:raise RuntimeError(f'No design {i+1}')
 L,r=result;levels.append(L);routes.append(r)
 print(f'{i+1:02d} {L["name"]}: {r["turns"]} turns / {r["steps"]} steps  / lower bound {L['balance']['relaxedSteps']} (design {attempt})')
p=ROOT/'index.html';s=p.read_text()
existing=json.loads(re.search(r'const levels=([\s\S]*?);\nconst startHints=',s)[1])
existing_routes=json.loads((ROOT/'tests'/'solutions.json').read_text())
levels += existing[50:]
routes += existing_routes[50:]
s=re.sub(r'const levels=[\s\S]*?const startHints=','const levels='+json.dumps(levels,ensure_ascii=False,separators=(',',':'))+';\nconst startHints=',s,count=1);p.write_text(s)
(ROOT/'tests'/'solutions.json').write_text(json.dumps(routes,ensure_ascii=False,separators=(',',':')))

# Keep visual start hints in sync with the regenerated solution witnesses.
all_routes=json.loads((ROOT/'tests'/'solutions.json').read_text())
s=p.read_text()
hints={r['id']:r['path'][:2] for r in all_routes}
s=re.sub(r'const startHints=[\s\S]*?;\nconst storage=', 'const startHints='+json.dumps(hints,separators=(',',':'))+';\nconst storage=',s,count=1)
p.write_text(s)
