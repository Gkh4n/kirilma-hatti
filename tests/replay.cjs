const assert=require('node:assert/strict');const {boot}=require('./harness.cjs');const solutions=require('./solutions.json');
const {g}=boot();
const {replay}=require('./trace.cjs');
for(const solution of solutions){g.openLevel(solution.level-1);g.startGame();
 replay(g,solution,()=>assert.equal(g.state.dead,false,`Level ${solution.level} failed`));
 assert.equal(g.state.won,true,`Level ${solution.level} did not finish`);assert.ok(g.state.moves>=0);assert.equal(g.save.stars[solution.level-1],3,`Level ${solution.level} cannot reach 3 stars on saved route`);
 console.log(`Level ${solution.level}: won, ${g.state.rotations} rotations, ${g.state.steps} steps, 3 stars`);
}
