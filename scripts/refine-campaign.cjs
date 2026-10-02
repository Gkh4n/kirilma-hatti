/* Curated branch insertion + bounded engine search. Witnesses are upper bounds, not proofs of optimality. */
const fs=require('fs'),path=require('path');const root=path.join(__dirname,'..');const {boot}=require('../tests/harness.cjs');
const base=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/campaign-4.5.json'),'utf8'));
const oldRoutes=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/routes-4.5.json'),'utf8'));
const {g}=boot();const dirs='URDL',vectors=[[-1,0],[0,1],[1,0],[0,-1]],eq=(a,b)=>a[0]===b[0]&&a[1]===b[1],has=(a,p)=>a.some(x=>eq(x,p));
const selected=[1,3,6,9,11,13,16,18,21,24,27,29,32,34,37,39,42,44,47,49,51,53,56,58,61,63,66,68,71,73];
const changed=[];
for(const i of selected){const L=base[i],route=oldRoutes[i],special=[L.start,L.exit,...L.keys,...L.fixed,...L.oneWay,...L.gates,...L.phaseGates,...L.ice,...L.phaseSwitches,...L.switches,...L.fragile,...L.autoRotate,...L.portals.flatMap(x=>[x.a,x.b])];let count=0;
 for(let key=1;key<L.keys.length&&count<(i%3===0?2:1);key++){
  const p=route.path;const before=p.findIndex(x=>eq(x,L.keys[key-1])),end=p.findIndex(x=>eq(x,L.keys[key]));let candidate=null;
  for(let k=before+1;k<end-1&&!candidate;k++){
   if(has(special,p[k]))continue;
   for(let j=end+1;j<p.length-1;j++){
    if(has(special,p[j])||p.filter(x=>eq(x,p[j])).length!==1)continue;
    if(Math.abs(p[k][0]-p[j][0])+Math.abs(p[k][1]-p[j][1])===1){candidate=[k,j];break;}
   }
  }
  if(!candidate)continue;
  const [k,j]=candidate,branch=[...p[j]],hub=[...p[k]];L.keys[key]=branch;special.push(branch,hub);p.splice(k+1,0,branch,hub);count++;
 }
 if(count){L.scoreVersion='46';L.tag=count===2?'Çift Sapak':'Ortak Kavşak';L.hint='Anahtar sırasını izle; ortak kavşağa döndüğünde çıkış yönünü yeniden ayarla.';L.designFocus=count===2?'two-branches':'return-junction';changed.push(i+1);}
}
// Give later designs a specific constraint emphasis instead of the same inventory.
for(const num of changed){const i=num-1,L=base[i],p=oldRoutes[i].path;if(i<25)continue;
 const special=[L.start,L.exit,...L.keys,...L.fixed,...L.oneWay,...L.gates,...L.phaseGates,...L.ice,...L.phaseSwitches,...L.switches,...L.fragile,...L.autoRotate,...L.portals.flatMap(x=>[x.a,x.b]),...L.links.flat()];
 const plain=p.map((z,k)=>({z,k})).filter(({z,k})=>k>0&&k<p.length-1&&!has(special,z)&&p.filter(a=>eq(a,z)).length===1);
 const straight=plain.filter(({z,k})=>vectors.some(([r,c])=>eq([p[k-1][0]+r,p[k-1][1]+c],z)&&eq([z[0]+r,z[1]+c],p[k+1])));
 if(i%4===0&&straight.length){for(const {z}of straight.slice(0,2))L.ice.push(z);L.tag='Buz Yaklaşımı';L.designFocus='ice-entry';}
 else if(i%4===1&&plain.length>=2){L.links.push(plain.slice(0,2).map(x=>x.z));L.tag='Çapraz Bağ';L.designFocus='coupled-junction';}
 else if(i%4===2&&straight.length){const {z,k}=straight[0];const d=vectors.findIndex(([r,c])=>eq([z[0]+r,z[1]+c],p[k+1]));L.oneWay.push([...z,dirs[d]]);L.layout[z[0]][z[1]]=dirs[d];L.tag='Tek Yönlü Dönüş';L.designFocus='oneway-return';}
 else if(plain.length){L.fragile.push(plain[plain.length-1].z);L.tag='Son Geçiş';L.designFocus='fragile-exit';}
}
// Place levels into the actual engine (never replace mechanics with a simplified simulator).
g.levels.splice(0,g.levels.length,...base);base.forEach(L=>g.save.records[L.id]={moves:9999,steps:9999});
function start(i){g.openLevel(i);const S=g.cloneRun(g.state);g.collectAt(S,[]);return S}
function editable(L,p){return ![L.exit,...L.fixed,...L.oneWay,...L.gates,...L.phaseGates,...L.ice,...L.hazards].some(x=>eq(x,p))}
function turn(S,n){const p=S.pos;for(let t=0;t<n;t++){const group=S.L.links.find(a=>has(a,p))||[p];for(const [r,c]of group)S.grid[r][c]=dirs[(dirs.indexOf(S.grid[r][c])+1)%4];}S.moves+=n;S.rotations+=n;}
function replayPath(i,route){let S=start(i),actions=[],positions=[],full=[[...S.pos]];for(let k=0;k<route.path.length-1;k++){
 const from=S.pos,to=route.path[k+1];if(!eq(from,route.path[k]))throw Error('path mismatch '+i+' '+k);
 const d=vectors.findIndex(([r,c])=>from[0]+r===to[0]&&from[1]+c===to[1]);if(d<0)throw Error('bad step');
 const n=(d-dirs.indexOf(S.grid[from[0]][from[1]])+4)%4;if(n&&!editable(S.L,from))throw Error('fixed turn');turn(S,n);positions.push([...from]);actions.push(n);const r=g.advance(S);if(r.reason)throw Error('level '+(i+1)+': '+r.reason);full.push([...r.next]);if(r.portaled){full.push([...S.pos]);k++;}if(r.won)return {level:i+1,id:S.L.id,turns:S.moves,steps:S.steps,actions,positions,path:full};
 }throw Error('no win '+i)}
function lower(L){function dist(a,b){let q=[[a,0]],seen=new Set([a.join(',')]);for(let h=0;h<q.length;h++){const[p,d]=q[h];if(eq(p,b))return d;for(const [dr,dc]of vectors){let z=[p[0]+dr,p[1]+dc];if(z[0]<0||z[0]>=7||z[1]<0||z[1]>=6||has(L.hazards,z))continue;for(const t of L.portals){if(eq(z,t.a)){z=t.b;break}if(eq(z,t.b)){z=t.a;break}}if(!seen.has(z.join(','))){seen.add(z.join(','));q.push([z,d+1]);}}}return Infinity;}let stops=[L.start,...L.keys,L.exit];return stops.slice(1).reduce((n,p,j)=>n+dist(stops[j],p),0)}
function search(i,best){const initial=start(i);let beam=[{S:initial,actions:[],positions:[],path:[[...initial.pos]]}],visited=new Map();
 const estimate=S=>{const next=S.L.keys[S.nextOrdered]||S.L.exit;return S.moves+(S.L.keys.length-S.collected.size)*3+Math.min(5,Math.abs(S.pos[0]-next[0])+Math.abs(S.pos[1]-next[1]))*.35+(S.L.requiredGates||[]).filter(x=>!S.openGates.has(x)).length*2};
 for(let depth=0;depth<Math.max(70,best.steps+12)&&beam.length;depth++){const candidates=[];
  for(const node of beam){for(let n=0;n<(editable(node.S.L,node.S.pos)?4:1);n++){
   if(node.S.moves+n>best.turns)continue;const S=g.cloneRun(node.S);turn(S,n);const from=[...S.pos],r=g.advance(S);if(r.reason)continue;
   const next={S,actions:[...node.actions,n],positions:[...node.positions,from],path:[...node.path,[...r.next],...(r.portaled?[[...S.pos]]:[])]};
   if(r.won){if(S.moves<best.turns||(S.moves===best.turns&&S.steps<best.steps))best={level:i+1,id:S.L.id,turns:S.moves,steps:S.steps,actions:next.actions,positions:next.positions,path:next.path};continue;}
   const token=g.runToken(S),old=visited.get(token);if(old!==undefined&&old<=S.moves)continue;visited.set(token,S.moves);next.rank=estimate(S);candidates.push(next);
  }}candidates.sort((a,b)=>a.rank-b.rank||b.S.collected.size-a.S.collected.size);beam=candidates.slice(0,72);
 }
 return best;
}
let routes=[],report=[];
for(let i=0;i<74;i++){const L=base[i],w=replayPath(i,oldRoutes[i]),best=search(i,w);routes.push(best);L.par=best.turns+Math.max(1,Math.ceil(best.turns*(i<10?.15:.08)));best.target=L.par;L.balance={...L.balance,referenceTurns:best.turns,referenceSteps:best.steps,relaxedSteps:lower(L),calibration:'bounded-engine-search'};report.push({level:i+1,changed:changed.includes(i+1),oldTarget:JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/campaign-4.5.json'),'utf8'))[i].par,target:L.par,steps:best.steps,focus:L.designFocus||'original'});console.log(i+1,L.par,best.steps,changed.includes(i+1)?'redesigned':'');}
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');html=html.replace(/const levels=[\s\S]*?;\nconst startHints=/,'const levels='+JSON.stringify(base)+';\nconst startHints=');html=html.replace(/const startHints=[\s\S]*?;\nconst storage=/,'const startHints='+JSON.stringify(Object.fromEntries(routes.map(r=>[r.id,r.path.slice(0,2)])))+';\nconst storage=');fs.writeFileSync(path.join(root,'index.html'),html);fs.writeFileSync(path.join(root,'tests/solutions.json'),JSON.stringify(routes));fs.writeFileSync(path.join(root,'tests/calibration.json'),JSON.stringify({method:'72-wide bounded search using actual advance rules; upper bounds, not proven minima',changed,levels:report},null,2));console.log('Changed:',changed);
