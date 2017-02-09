/**
 * Created by tobias on 09.02.17.
 */

var distances = [0, 0, 0, 0 ,0 ,0];


console.log(distances);

distances.push(11);
distances.shift();


console.log(distances);
var max = Math.max.apply(Math, distances);
var min = Math.min.apply(Math, distances);
console.log(max);
console.log(min);