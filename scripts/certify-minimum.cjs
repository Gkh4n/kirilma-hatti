// Dijkstra on the real engine; a resource stop is explicitly NOT a proof.
const fs=require('fs'),{boot}=require('../tests/harness.cjs'),{g}=boot(),routes=require('../tests/solutions.json'),dirs='URDL',eq=(a,b)=>a[0]===b[0]&&a[1]===b[1];
g.levels.forEach(L=>g.save.records[L.id]={moves:9999,steps:9999});
class Heap{constructor(){this.a=[]}less(a,b){return a.S.moves<b.S.moves||a.S.moves===b.S.moves&&a.S.steps<b.S.steps}push(x){let a=this.a,i=a.length;a.push(x);while(i){let p=(i-1)>>1;if(!this.less(x,a[p]))break;a[i]=a[p];i=p}a[i]=x}pop(){let a=this.a,out=a[0],x=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let c=i*2+1;if(c+1<a.length&&this.less(a[c+1],a[c]))c++;if(!this.less(a[c],x))break;a[i]=a[c];i=c}a[i]=x}return out}}
function token(S){return JSON.stringify([S.pos,S.grid,S.nextOrdered,[...S.collected].sort(),[...S.openGates].sort(),[...S.fragileUsed].sort(),S.phase,[...S.visitedCrystals].sort()])}
function editable(S,p){return ![S.L.exit,...S.L.walls,...S.L.hazards,...S.L.decoys,...S.L.fixed,...S.L.oneWay,...S.L.gates,...S.L.phaseGates,...S.L.ice].some(q=>eq(p,q))&&!S.fragileUsed.has(p.join(','))}
function search(i){g.openLevel(i);let S=g.cloneRun(g.state);g.collectAt(S,[]);let heap=new Heap(),seen=new Map(),expanded=0,start=Date.now(),bound=routes[i].turns;heap.push({S,prev:null});
// Independent turns commute with transitions and can be deferred until that
// disk is occupied. Linked groups remain available at every state. No beam,
// depth cutoff or heuristic pruning. Unsupported mechanics fail closed.
const L=S.L;let witness=g.cloneRun(S),won=false;for(let j=0;j<routes[i].actions.length;j++){const p=routes[i].positions[j];if(!eq(witness.pos,p))throw Error('Stale witness position');for(let n=0;n<routes[i].actions[j];n++){if(!editable(witness,p))throw Error('Illegal witness rotation');for(const [r,c]of L.links.find(a=>a.some(z=>eq(z,p)))||[p])witness.grid[r][c]=dirs[(dirs.indexOf(witness.grid[r][c])+1)%4];witness.moves++;}const result=g.advance(witness);if(result.reason||won)throw Error('Invalid witness');won=result.won;}if(!won||witness.moves!==bound)throw Error('Invalid upper bound');
if(L.movers.length||L.limited.length||L.boosts.length)throw Error('Unsupported normalization');
function enqueue(n){const k=token(n.S),old=seen.get(k);if(old&&(old[0]<n.S.moves||old[0]===n.S.moves&&old[1]<=n.S.steps))return;seen.set(k,[n.S.moves,n.S.steps]);heap.push(n)}
while(heap.a.length){const node=heap.pop(),S=node.S,k=token(S),old=seen.get(k);if(old&&(old[0]<S.moves||old[0]===S.moves&&old[1]<S.steps))continue;
if(S.moves>=bound)return {level:i+1,status:'proven',minimum:bound,steps:routes[i].steps,expanded,source:'validated-witness',elapsedMs:Date.now()-start};
if(node.won){let trace=[];for(let n=node;n.prev;n=n.prev)trace.push(n.action);trace.reverse();return {level:i+1,status:'proven',minimum:S.moves,steps:S.steps,expanded,trace,elapsedMs:Date.now()-start};}
if(++expanded>Number(process.env.CERTIFY_NODES||25000)||Date.now()-start>Number(process.env.CERTIFY_MS||10000))return {level:i+1,status:'budget-exhausted',lowerBound:S.moves,upperBound:bound,expanded,elapsedMs:Date.now()-start};
let moved=g.cloneRun(S),r=g.advance(moved);if(!r.reason)enqueue({S:moved,prev:node,action:{kind:'move'},won:r.won});
if(S.moves>=bound)continue;
const positions=[S.pos,...L.links.map(group=>group.find(p=>editable(S,p))).filter(Boolean)],groups=new Set();
for(const p of positions){if(!editable(S,p))continue;const group=L.links.find(a=>a.some(z=>eq(z,p)))||[p],key=JSON.stringify(group);if(groups.has(key))continue;groups.add(key);let T=g.cloneRun(S);for(const [r,c]of group)T.grid[r][c]=dirs[(dirs.indexOf(T.grid[r][c])+1)%4];T.moves++;T.rotations++;enqueue({S:T,prev:node,action:{kind:'turn',r:p[0],c:p[1]}});}}
throw Error('No witness');}
const out=[];for(let i=Number(process.env.CERTIFY_START||0);i<Number(process.env.CERTIFY_LEVELS||g.levels.length);i++){let r=search(i);out.push(r);console.log(i+1,r.status,r.minimum??`${r.lowerBound}..${r.upperBound}`,r.expanded);fs.writeFileSync(process.env.CERTIFY_OUTPUT||'tests/minimum-certificates.json',JSON.stringify(out,null,2));}
