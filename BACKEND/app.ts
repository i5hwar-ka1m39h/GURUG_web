function calculator(a:number, b:number, tyPe: "sum" | "sub" | "mul" | "div"): number | string {
  if(tyPe === "sum"){
    return a+b;
  }else if(tyPe === "sub"){
    return a-b;
  }else if(tyPe ==="mul"){
    return a*b;
  }else if(tyPe === "div"){
    return a/b;
  }else{
    return "invalid operator";
  }
}


console.log(calculator(4,69, "div"));
