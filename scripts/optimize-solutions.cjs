// Offline cost-first candidate search. Every result is replayed with the real engine.
const fs=require('fs'),{boot}=require('../tests/harness.cjs');const {g}=boot(),routes=require('../tests/solutions.json');const dirs='URDL',v=[[-1,0],[0,1],[1,0],[0,-1]],eq=(a,b)=>a[0]===b[0]&&a[1]===b[1];g.levels.forEach(L=>g.save.records[L.id]={moves:9999,steps:9999});
function token(S){return JSON.stringify([S.pos,S.grid,S.nextOrdered,[...S.openGates].sort(),[...S.fragileUsed].sort(),S.phase,[...S.visitedCrystals].sort()])}
function turn(S,n){let p=S.pos;for(let t=0;t<n;t++)for(const [r,c]of S.L.links.find(a=>a.some(z=>eq(z,p)))||[p])S.grid[r][c]=dirs[(dirs.indexOf(S.grid[r][c])+1)%4];S.moves+=n;S.rotations+=n;}
function initial(i){g.openLevel(i);let S=g.cloneRun(g.state);g.collectAt(S,[]);return S}
function editable(S){return ![S.L.exit,...S.L.fixed,...S.L.oneWay,...S.L.gates,...S.L.phaseGates,...S.L.ice,...S.L.hazards].some(p=>eq(p,S.pos))}
function routeOf(i,node){let nodes=[];for(let n=node;n.prev;n=n.prev)nodes.push(n);nodes.reverse();let path=[g.levels[i].start];for(const n of nodes){path.push(n.enter);if(!eq(n.enter,n.S.pos))path.push(n.S.pos)}return {level:i+1,id:g.levels[i].id,turns:node.S.moves,steps:node.S.steps,actions:nodes.map(n=>n.turns),positions:nodes.map(n=>n.prev.S.pos),path};}
function search(i,best){const L=g.levels[i];let dists=L.keys.concat([L.exit]).map(target=>{const d=Array(42).fill(999);d[target[0]*6+target[1]]=0;for(let it=0;it<42;it++)for(let a=0;a<42;a++)for(const [dr,dc]of v){let p=[Math.floor(a/6)+dr,a%6+dc];if(p[0]<0||p[0]>6||p[1]<0||p[1]>5||L.hazards.some(z=>eq(z,p)))continue;for(const x of L.portals){if(eq(p,x.a)){p=x.b;break}if(eq(p,x.b)){p=x.a;break}}d[a]=Math.min(d[a],1+d[p[0]*6+p[1]])}return d;});let tail=Array(L.keys.length+1).fill(0);for(let k=L.keys.length-1;k>=0;k--)tail[k]=tail[k+1]+dists[k+1][L.keys[k][0]*6+L.keys[k][1]];
let beam=[{S:initial(i),prev:null}],seen=new Map();const maxDepth=Math.max(65,Math.min(130,best.steps+20));
for(let depth=0;depth<maxDepth&&beam.length;depth++){let groups=new Map();for(const node of beam)for(let n=0;n<(editable(node.S)?4:1);n++){
if(node.S.moves+n>best.turns)continue;let S=g.cloneRun(node.S);turn(S,n);const r=g.advance(S);if(r.reason)continue;const next={S,prev:node,turns:n,enter:r.next};if(r.won){if(S.moves<best.turns||S.moves===best.turns&&S.steps<best.steps)best=routeOf(i,next);continue;}
let t=token(S),cost=S.moves*1000+S.steps;if(seen.has(t)&&seen.get(t)<=cost)continue;seen.set(t,cost);
let k=S.nextOrdered,dist=dists[k][S.pos[0]*6+S.pos[1]]+tail[k];next.rank=S.moves+dist*Number(process.env.SOLVE_DISTANCE||.7)+S.steps*.10+L.requiredGates.filter(x=>!S.openGates.has(x)).length*1.5;
let group=k+':'+S.phase+':'+S.openGates.size;let a=groups.get(group)||[];a.push(next);groups.set(group,a);
}beam=[];for(const a of groups.values()){a.sort((x,y)=>x.rank-y.rank);beam.push(...a.slice(0,64))}beam.sort((a,b)=>a.rank-b.rank);beam=beam.slice(0,900);if(seen.size>200000)seen.clear();}
return best;}
let out=[];for(let i=0;i<74;i++){let best=search(i,routes[i]);out.push(best);console.log(i+1,routes[i].turns+'→'+best.turns,routes[i].steps+'→'+best.steps);fs.writeFileSync('/tmp/kh-better-routes.json',JSON.stringify(out));}
fs.writeFileSync('tests/solutions.json',JSON.stringify(out));
