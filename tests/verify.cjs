const assert=require('node:assert/strict');const {boot}=require('./harness.cjs');const routes=require('./solutions.json');
const {g,data}=boot();
assert.equal(g.levels.length,74);assert.equal(new Set(g.levels.map(L=>L.id)).size,74);
for(let i=0;i<74;i++){
 const L=g.levels[i],b=L.balance;if(i){const a=g.levels[i-1].balance;assert(b.referenceTurns>a.referenceTurns&&b.referenceSteps>=a.referenceSteps);assert(Object.keys(b).some(k=>b[k]>a[k]));}
 g.openLevel(i);g.startGame();
 for(const turns of routes[i].actions){const [r,c]=g.state.pos;for(let j=0;j<turns;j++)g.rotate(r,c);g.tick();assert(!g.state.dead,`Dead level ${i+1}`);}
 assert(g.state.won,`Unsolved level ${i+1}`);assert.equal(g.state.moves,L.par);assert.equal(g.recordFor(L).moves,L.par);
}
g.openLevel(0);const [r,c]=g.state.pos;for(let i=0;i<1000;i++)g.rotate(r,c);assert.equal(g.state.moves,1000);assert(!g.state.dead);g.undoRotation();assert.equal(g.state.moves,999);
const L=g.levels[0];g.storeRecord(L,2,30);g.storeRecord(L,3,1);assert.equal(g.recordFor(L).moves,2);g.storeRecord(L,2,20);assert.equal(g.recordFor(L).steps,20);g.storeRecord(L,2,40);assert.equal(g.recordFor(L).steps,20);
const persisted=boot(Object.fromEntries(data));assert.equal(persisted.g.recordFor(persisted.g.levels[0]).moves,2);
g.openLevel(0);g.startGame();g.state.loopSeen.add(g.runToken(g.state));g.tick();assert(g.state.paused);assert(!g.state.dead);
console.log('PASS: 74 solution replays; strictly increasing benchmark tuples; 1,000 rotations; undo; best-score ordering; persistent records; safe cycle pause.');
