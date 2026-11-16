/* Each station has a fixed coordinate. A relay's second coordinate pair is its orientation and type. */
const charts = [
 {name:'First Light', location:'Cape Ansel', source:[0,3,0], stations:[[4,0]], relays:[[4,3,1]], rocks:[[1,1],[5,5],[6,5]], solution:[0], note:'Turn the mirror to send the beam north.'},
 {name:'The Narrows', location:'Vesper Channel', source:[0,4,0], stations:[[7,1]], relays:[[2,4,1],[2,1,1],[5,4,0]], rocks:[[4,2],[4,3],[6,5]], solution:[0,0,0], note:'Two turns in the channel take the signal around the headland.'},
 {name:'Twin Lanterns', location:'Isle of Sable', source:[0,3,0], stations:[[7,3],[4,0]], relays:[[4,3,1,'split'],[2,1,0],[5,4,1]], rocks:[[1,0],[6,5],[3,5]], solution:[0,0,1], note:'A splitter sends half the beam onward and turns the other half.'},
 {name:'A Broken Current', location:'Meridian Reach', source:[0,5,0], stations:[[7,2],[3,0],[6,5]], relays:[[3,5,1,'split'],[3,2,1,'split'],[1,3,1],[5,1,0]], rocks:[[2,4],[6,3],[6,4]], solution:[0,0,1,0], note:'Route one beam through two splitters to feed all three stations.'},
 {name:'The Last Watch', location:'North Cape', source:[0,5,0], stations:[[7,1],[6,0],[1,0]], relays:[[2,5,1],[2,2,1,'split'],[6,2,1],[6,1,1,'split'],[2,0,0],[5,3,1],[4,5,0]], rocks:[[1,4],[3,3],[7,4]], solution:[0,0,0,0,1,1,0], note:'A station absorbs the beam. Find a route that lights all three.'}
];


