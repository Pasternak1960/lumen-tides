const step = [[1,0],[0,1],[-1,0],[0,-1]];
const reflect = [[3,2,1,0],[1,0,3,2]];
const cellKey = (x,y) => x+','+y;

function traceLight(chart, rotation) {
  const queue = [chart.source];
  const visited = new Set(), lit = new Set(), rays = [];
  const relayAt = new Map(chart.relays.map(([x,y],i)=>[cellKey(x,y),i]));
  const stations = new Set(chart.stations.map(([x,y])=>cellKey(x,y)));
  const rocks = new Set(chart.rocks.map(([x,y])=>cellKey(x,y)));
  while (queue.length) {
    let [x,y,d] = queue.pop();
    const key = [x,y,d].join(',');
    if (visited.has(key)) continue;
    visited.add(key);
    const [dx,dy] = step[d], a=x+dx, b=y+dy;
    if (a<0||a>7||b<0||b>5) continue;
    rays.push([x,y,a,b]);
    const next=cellKey(a,b);
    if (rocks.has(next)) continue;
    if (stations.has(next)) { lit.add(next); continue; }
    const i=relayAt.get(next);
    if (i===undefined || chart.relays[i][3]==='split') queue.push([a,b,d]);
    if (i!==undefined) queue.push([a,b,reflect[rotation[i]][d]]);
  }
  return {rays,lit};
}
