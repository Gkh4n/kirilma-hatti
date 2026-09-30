const assert=require('node:assert/strict');const {boot}=require('./harness.cjs');const solutions=require('./solutions.json');
for(const solution of solutions){
 const {g}=boot();g.openLevel(solution.level-1);g.startGame();
 for(const turns of solution.actions){const [r,c]=g.state.pos;for(let t=0;t<turns;t++)g.rotate(r,c);g.tick();assert.equal(g.state.dead,false,`Level ${solution.level} failed`)}
 assert.equal(g.state.won,true,`Level ${solution.level} did not finish`);assert.ok(g.state.moves>=0);assert.equal(g.save.stars[solution.level-1],3,`Level ${solution.level} cannot reach 3 stars on saved route`);
 console.log(`Level ${solution.level}: won, ${g.state.rotations} rotations, ${g.state.steps} steps, 3 stars`);
}
