"use strict";
var Arithmatic;
(function (Arithmatic) {
    Arithmatic[Arithmatic["sum"] = 0] = "sum";
    Arithmatic[Arithmatic["sub"] = 1] = "sub";
    Arithmatic[Arithmatic["mul"] = 2] = "mul";
    Arithmatic[Arithmatic["div"] = 3] = "div";
})(Arithmatic || (Arithmatic = {}));
function calculate(a, b, op) {
    console.log(op);
    return "done";
}
console.log(calculate(4, 5, Arithmatic.mul));
