let start = new Date()
var arr= new Uint16Array(4000000)
for (var i=0;i<arr.length;i++){
	arr[i] = i*i/i/3;
}
let end = new Date()
console.log('done', end-start, arr.length)
