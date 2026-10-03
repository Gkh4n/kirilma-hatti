// Explicit tile coordinates also support remote linked-disc rotations.
function traceOf(route){
 return route.trace||route.actions.flatMap((turns,i)=>[
  ...Array.from({length:turns},()=>({kind:'turn',r:route.positions[i][0],c:route.positions[i][1]})),
  {kind:'move'}
 ]);
}
function replay(g,route,onAction=()=>{}){
 for(const action of traceOf(route)){
  if(action.kind==='turn')g.rotate(action.r,action.c);
  else if(action.kind==='move')g.tick(true);
  else throw new Error('Unknown solution action');
  onAction(action);
 }
}
module.exports={traceOf,replay};
