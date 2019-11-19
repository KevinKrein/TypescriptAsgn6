"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var deepEqual = require("deep-equal");
// Parent class for the ExprC AST data definitions
var ExprC = /** @class */ (function () {
    function ExprC() {
    }
    return ExprC;
}());
exports.ExprC = ExprC;
// AST data definition for numbers
var NumC = /** @class */ (function (_super) {
    __extends(NumC, _super);
    function NumC(num) {
        var _this = _super.call(this) || this;
        _this.num = num;
        return _this;
    }
    return NumC;
}(ExprC));
exports.NumC = NumC;
// AST data definition for Strings
var StrC = /** @class */ (function (_super) {
    __extends(StrC, _super);
    function StrC(str) {
        var _this = _super.call(this) || this;
        _this.str = str;
        return _this;
    }
    return StrC;
}(ExprC));
exports.StrC = StrC;
// AST data definition for identifiers/variables
var IdC = /** @class */ (function (_super) {
    __extends(IdC, _super);
    function IdC(symbol) {
        var _this = _super.call(this) || this;
        _this.symbol = symbol;
        return _this;
    }
    return IdC;
}(ExprC));
exports.IdC = IdC;
// AST data definition for function calls
var AppC = /** @class */ (function (_super) {
    __extends(AppC, _super);
    function AppC(operation, args) {
        var _this = _super.call(this) || this;
        _this.operation = operation;
        _this.args = args;
        return _this;
    }
    return AppC;
}(ExprC));
exports.AppC = AppC;
// AST data definition for conditionals
var IfC = /** @class */ (function (_super) {
    __extends(IfC, _super);
    function IfC(test, then, inElse) {
        var _this = _super.call(this) || this;
        _this.test = test;
        _this.then = then;
        _this["else"] = inElse;
        return _this;
    }
    return IfC;
}(ExprC));
exports.IfC = IfC;
// AST data definition for functions
var LamC = /** @class */ (function (_super) {
    __extends(LamC, _super);
    function LamC(params, body) {
        var _this = _super.call(this) || this;
        _this.params = params;
        _this.body = body;
        return _this;
    }
    return LamC;
}(ExprC));
exports.LamC = LamC;
//Parent class for all Values that can be returned by the evaluator
var Value = /** @class */ (function () {
    function Value() {
    }
    return Value;
}());
exports.Value = Value;
// Data definition for representing Numbers as values
var NumV = /** @class */ (function (_super) {
    __extends(NumV, _super);
    function NumV(num) {
        var _this = _super.call(this) || this;
        _this.num = num;
        return _this;
    }
    return NumV;
}(Value));
exports.NumV = NumV;
// Data definition for representing Strings as values
var StrV = /** @class */ (function (_super) {
    __extends(StrV, _super);
    function StrV(str) {
        var _this = _super.call(this) || this;
        _this.str = str;
        return _this;
    }
    return StrV;
}(Value));
exports.StrV = StrV;
// Data definition for representing Booleans as values
var BoolV = /** @class */ (function (_super) {
    __extends(BoolV, _super);
    function BoolV(bool) {
        var _this = _super.call(this) || this;
        _this.bool = bool;
        return _this;
    }
    return BoolV;
}(Value));
exports.BoolV = BoolV;
// Data definition for representing Functions/Closures as values
var CloV = /** @class */ (function (_super) {
    __extends(CloV, _super);
    function CloV(params, body, env) {
        var _this = _super.call(this) || this;
        _this.params = params;
        _this.body = body;
        _this.env = env;
        return _this;
    }
    return CloV;
}(Value));
exports.CloV = CloV;
// Data definition for representing Primitive Operands as values
var PrimOpV = /** @class */ (function (_super) {
    __extends(PrimOpV, _super);
    function PrimOpV(operator) {
        var _this = _super.call(this) || this;
        _this.operator = operator;
        return _this;
    }
    return PrimOpV;
}(Value));
exports.PrimOpV = PrimOpV;
//Data definition for the Bindings in the Enironment
var Binding = /** @class */ (function () {
    function Binding(name, val) {
        this.name = name;
        this.val = val;
    }
    return Binding;
}());
exports.Binding = Binding;
// Data definition for the Environment, an Array of Bindings
var Env = /** @class */ (function () {
    function Env(bindings) {
        this.bindings = bindings;
    }
    ;
    Env.emptyEnv = function () {
        return new Env([]);
    };
    return Env;
}());
exports.Env = Env;
// Global definition of the top-environment
exports.topEnv = new Env([new Binding("+", new PrimOpV("+")),
    new Binding("-", new PrimOpV("-")),
    new Binding("/", new PrimOpV("/")),
    new Binding("*", new PrimOpV("*")),
    new Binding("<=", new PrimOpV("<=")),
    new Binding("equal?", new PrimOpV("equal?")),
    new Binding("true", new BoolV(true)),
    new Binding("false", new BoolV(false))
]);
// Return the serialized representation of the interpreted ExprC
function topInterp(expr) {
    return serialize(interp(expr, exports.topEnv));
}
exports.topInterp = topInterp;
// Given an ExprC and an Environment, evaluate the ExprC in the Environment a return the corresponding value
function interp(expr, env) {
    switch (true) {
        case (expr instanceof IdC): {
            return lookup(expr.symbol, env);
        }
        case (expr instanceof NumC): {
            return new NumV(expr.num);
        }
        case (expr instanceof StrC): {
            return new StrV(expr.str);
        }
        case (expr instanceof LamC): {
            var lam = expr;
            return new CloV(lam.params, lam.body, env);
        }
        case (expr instanceof IfC): {
            var ifc = expr;
            var testCond = interp(ifc.test, env);
            if (!(testCond instanceof BoolV))
                throw new Error("RGME: Test condition must produce a boolean value");
            else {
                if (testCond.bool)
                    return interp(ifc.then, env);
                return interp(ifc["else"], env);
            }
        }
        case (expr instanceof AppC): {
            var appc = expr;
            var funVal = interp(appc.operation, env);
            switch (true) {
                case (funVal instanceof CloV): {
                    var clov = funVal;
                    if (clov.params.length != appc.args.length)
                        throw new Error("RGME: Incorrect number of arguments to function");
                    else {
                        var interpretedArgs = new Array();
                        for (var i = 0; i < appc.args.length; i++)
                            interpretedArgs.push(interp(appc.args[i], env));
                        var newEnv_1 = bindAllParams(clov.params, interpretedArgs, clov.env);
                        return interp(clov.body, newEnv_1);
                    }
                }
                case (funVal instanceof PrimOpV): {
                    var interpretedArgs = new Array();
                    for (var i = 0; i < appc.args.length; i++)
                        interpretedArgs.push(interp(appc.args[i], env));
                    switch (interpretedArgs.length) {
                        case (2): {
                            return myBinaryOperator(funVal.operator, interpretedArgs[0], interpretedArgs[1]);
                        }
                        default: {
                            throw new Error('RGME: Wrong arity for primitive operator');
                        }
                    }
                }
                default: {
                    throw new Error("RGME: AppC must use a function or primitive");
                }
            }
        }
    }
}
exports.interp = interp;
// Given a list of paramters, arguments, and an environment, bind each parameter to its respective argument
// in the Environment and return the resulting Environment
function bindAllParams(params, args, env) {
    // Make a copy of the new environment
    var newEnv = new Env(new Array());
    for (var i = 0; i < env.bindings.length; i++)
        newEnv.bindings.push(env.bindings[i]);
    for (var i = 0; i < params.length; i++)
        newEnv.bindings.unshift(new Binding(params[i], args[i]));
    return newEnv;
}
exports.bindAllParams = bindAllParams;
// Given a key and an Environment, find the Value that corresponds to the key in the Environment
function lookup(key, env) {
    for (var _i = 0, _a = env.bindings; _i < _a.length; _i++) {
        var binding = _a[_i];
        if (binding.name == key)
            return binding.val;
    }
    throw new Error('RGME: Unbound variable reference');
}
exports.lookup = lookup;
// Given a Value, return a String representation of the Value
function serialize(val) {
    switch (true) {
        case (val instanceof NumV): {
            return val.num.toString();
        }
        case (val instanceof BoolV): {
            var b = val.bool;
            switch (b) {
                case (true): {
                    return "true";
                }
                case (false): {
                    return "false";
                }
            }
        }
        case (val instanceof CloV): {
            return "#<procedure>";
        }
        case (val instanceof PrimOpV): {
            return "#<primop>";
        }
        case (val instanceof StrV): {
            return val.str;
        }
    }
}
exports.serialize = serialize;
// Given an operator and a left and right operand Value, determine what binary primitive operator is present and
// apply it to the operands
function myBinaryOperator(op, left, right) {
    switch (op) {
        case ("equal"): {
            if ((left instanceof CloV) || (left instanceof PrimOpV) ||
                (right instanceof CloV) || (right instanceof PrimOpV))
                return new BoolV(false);
            else
                return new BoolV(deepEqual(left, right));
        }
        default: {
            if ((left instanceof NumV) && (right instanceof NumV)) {
                var l = left.num.valueOf();
                var r = right.num.valueOf();
                switch (op) {
                    case ("+"): {
                        return new NumV(l + r);
                    }
                    case ("-"): {
                        return new NumV(l - r);
                    }
                    case ("*"): {
                        return new NumV(l * r);
                    }
                    case ("/"): {
                        if (r != 0)
                            return new NumV(l / r);
                        else
                            throw new Error("RGME: Division by zero");
                    }
                    case ("<="): {
                        return new BoolV(l <= r);
                    }
                }
            }
            else
                throw new Error("RGME: Operands must be numbers");
        }
    }
}
exports.myBinaryOperator = myBinaryOperator;
// Pseudo tests to eyeball results
var ans = serialize(new NumV(3));
console.log("NumV: ", ans);
ans = serialize(new BoolV(true));
console.log("BoolV true: ", ans);
ans = serialize(new BoolV(false));
console.log("BoolV false: ", ans);
ans = serialize(new CloV(new Array(), new NumC(1), exports.topEnv));
console.log("CloV: ", ans);
ans = serialize(new PrimOpV("+"));
console.log("PrimOpV: ", ans);
var sym = lookup("+", exports.topEnv);
console.log("Value: ", sym);
try {
    sym = lookup("x", exports.topEnv);
    console.log("Sym: ", sym);
}
catch (e) {
    console.log("Lookup: ", e.message);
}
var v;
try {
    v = interp(new IdC("x"), exports.topEnv);
    console.log("v: ", v);
}
catch (e) {
    console.log("Interp: ", e.message);
}
var val = interp(new IdC("true"), exports.topEnv);
console.log("IdC:", val);
val = interp(new LamC(["x", "y", "z"], new NumC(5)), exports.topEnv);
console.log("LamC: ", val);
var binaryAns = myBinaryOperator("equal", new NumV(1), new NumV(1));
console.log("myBinaryOperator1: ", binaryAns);
binaryAns = myBinaryOperator("equal", new NumC(4), new NumC(5));
console.log("myBinaryOperator2: ", binaryAns);
binaryAns = myBinaryOperator("equal", new CloV(new Array(), new NumC(1), exports.topEnv), new CloV(new Array(), new NumC(1), exports.topEnv));
console.log("myBinaryOperator3: ", binaryAns);
binaryAns = myBinaryOperator("equal", new PrimOpV("+"), new PrimOpV("+"));
console.log("myBinaryOperator4: ", binaryAns);
binaryAns = myBinaryOperator("+", new NumV(3), new NumV(5));
console.log("myBinaryOperator5: ", binaryAns);
binaryAns = myBinaryOperator("-", new NumV(3), new NumV(5));
console.log("myBinaryOperator6: ", binaryAns);
binaryAns = myBinaryOperator("*", new NumV(3), new NumV(5));
console.log("myBinaryOperator7: ", binaryAns);
binaryAns = myBinaryOperator("/", new NumV(6), new NumV(3));
console.log("myBinaryOperator8: ", binaryAns);
try {
    binaryAns = myBinaryOperator("/", new NumV(6), new NumV(0));
}
catch (e) {
    console.log("myBinaryOperator9: ", e.message);
}
binaryAns = myBinaryOperator("<=", new NumV(6), new NumV(4));
console.log("myBinaryOperator9: ", binaryAns);
binaryAns = myBinaryOperator("<=", new NumV(1), new NumV(4));
console.log("myBinaryOperator10: ", binaryAns);
var interpretedExpr = interp(new AppC(new IdC("+"), [new NumC(1), new NumC(4)]), exports.topEnv);
console.log("interp1: ", interpretedExpr);
interpretedExpr = interp(new AppC(new IdC("+"), [new AppC(new IdC("*"), [new NumC(5), new NumC(3)]),
    new AppC(new IdC("/"), [new NumC(14), new NumC(2)])]), exports.topEnv);
console.log("interp2: ", interpretedExpr);
interpretedExpr = interp(new IfC(new AppC(new IdC("<="), [new NumC(1), new NumC(2)]), new IdC("true"), new IdC("false")), exports.topEnv);
console.log("interp3: ", interpretedExpr);
interpretedExpr = interp(new IfC(new AppC(new IdC("<="), [new NumC(5), new NumC(2)]), new IdC("true"), new IdC("false")), exports.topEnv);
console.log("interp4: ", interpretedExpr);
try {
    interp(new IfC(new AppC(new IdC("+"), [new NumC(5), new NumC(2)]), new IdC("true"), new IdC("false")), exports.topEnv);
}
catch (e) {
    console.log("interp5: ", e.message);
}
interpretedExpr = interp(new AppC(new AppC(new LamC(["x"], new LamC(["y"], new AppC(new IdC("*"), [new IdC("x"), new IdC("y")]))), [new NumC(5)]), [new NumC(7)]), exports.topEnv);
console.log("interp6: ", interpretedExpr);
// test that there is no dynamic scoping
try {
    interp(new AppC(new LamC(["x", "f"], new AppC(new IdC("f"), [new NumC(4)])), [new NumC(5), new LamC(["y"], new AppC(new IdC("+"), [new IdC("x"), new IdC("y")]))]), exports.topEnv);
}
catch (e) {
    console.log("interp6: ", e.message);
}
var newEnv = bindAllParams(["x"], [new NumV(4)], exports.topEnv);
console.log("newEnv=topEnv: ", deepEqual(newEnv, exports.topEnv));
console.log(newEnv.bindings);
newEnv = bindAllParams([], [], exports.topEnv);
console.log("newEnv=topEnv: ", deepEqual(newEnv, exports.topEnv));
console.log(newEnv.bindings);
try {
    console.log("TopInterp1: ", topInterp(new AppC(new LamC(["x", "f"], new AppC(new IdC("f"), [new NumC(4)])), [new NumC(5), new LamC(["y"], new AppC(new IdC("+"), [new IdC("x"), new IdC("y")]))])));
}
catch (e) {
    console.log(e.message);
}
console.log("TopInterp2: ", topInterp(new AppC(new AppC(new LamC(["x"], new LamC(["y"], new AppC(new IdC("*"), [new IdC("x"), new IdC("y")]))), [new NumC(5)]), [new NumC(7)])));
