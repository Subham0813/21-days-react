console.time()
let i=0;
const obj = []
while(i<10000000){
    obj.push({key: i, task: `new Task ${i}` , completed: false});
    i++;
}
console.timeEnd()
// console.log(obj)
