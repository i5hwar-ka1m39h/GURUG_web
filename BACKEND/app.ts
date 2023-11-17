enum Arithmatic{
  sum,
  sub,
  mul,
  div
}

function calculate(a:number, b:number, op:Arithmatic){
  console.log(op);
  return "done";
  
}

console.log(calculate(4,5, Arithmatic.mul));
