import * as deepEqual from "deep-equal";

// Parent class for the ExprC AST data definitions
class ExprC {
    constructor() {
    }
}

// AST data definition for numbers
class NumC extends ExprC {
    num: Number;
    constructor(num: Number) {
        super();
        this.num = num;
    }
}

// AST data definition for Strings
class StrC extends ExprC {
    str: String;
    constructor(str: String) {
        super();
        this.str = str;
    }
}

// AST data definition for identifiers/variables
class IdC extends ExprC {
    symbol: String;
    constructor(symbol: String) {
        super();
        this.symbol = symbol;
    }
}

// AST data definition for function calls
class AppC extends ExprC {
    operation: ExprC;
    args: Array<ExprC>;
    constructor(operation: ExprC, args: Array<ExprC>) {
        super();
        this.operation = operation;
        this.args = args;
    }
}

// AST data definition for conditionals
class IfC extends ExprC {
    test: ExprC;
    then: ExprC;
    else: ExprC;
    constructor(test: ExprC, then: ExprC, inElse: ExprC) {
        super();
        this.test = test;
        this.then = then;
        this.else = inElse;
    }
}

// AST data definition for functions
class LamC extends ExprC {
    params: Array<String>;
    body: ExprC;
    constructor(params: Array<String>, body: ExprC) {
        super();
        this.params = params;
        this.body = body;
    }
}

//Parent class for all Values that can be returned by the evaluator
class Value {
    constructor() {
    }
}

// Data definition for representing Numbers as values
class NumV extends Value {
    num: Number;
    constructor(num: Number) {
        super();
        this.num = num;
    }
}

// Data definition for representing Strings as values
class StrV extends Value {
    str: String;
    constructor(str: String) {
        super();
        this.str = str;
    }
}

// Data definition for representing Booleans as values
class BoolV extends Value {
    bool: Boolean;
    constructor(bool: Boolean) {
        super();
        this.bool = bool;
    }
}

// Data definition for representing Functions/Closures as values
class CloV extends Value {
    params: Array<String>;
    body: ExprC;
    env: Env;
    constructor(params: Array<String>, body: ExprC, env: Env) {
        super();
        this.params = params;
        this.body = body;
        this.env = env;
    }
}

// Data definition for representing Primitive Operands as values
class PrimOpV extends Value {
    operator: String;
    constructor(operator: String) {
        super();
        this.operator = operator;
    }
}

//Data definition for the Bindings in the Enironment
class Binding {
    name: String;
    val: Value;
    constructor(name: String, val: Value) {
        this.name = name;
        this.val = val;
    }
}

// Data definition for the Environment, an Array of Bindings
class Env {;
    bindings: Array<Binding>;
    constructor(bindings: Binding[]) {
        this.bindings = bindings;
    }
    static emptyEnv(): Env {
        return new Env([]);
    }
}

// Global definition of the top-environment
export var topEnv = new Env(
    [new Binding("+", new PrimOpV("+")),
    new Binding("-", new PrimOpV("-")),
    new Binding("/", new PrimOpV("/")),
    new Binding("*", new PrimOpV("*")),
    new Binding("<=", new PrimOpV("<=")),
    new Binding("equal?", new PrimOpV("equal?")),
    new Binding("true", new BoolV(true)),
    new Binding("false", new BoolV(false))
    ]);

// Return the serialized representation of the interpreted ExprC
export function topInterp(expr: ExprC): String {
    return serialize(interp(expr, topEnv));
}

// Given an ExprC and an Environment, evaluate the ExprC in the Environment a return the corresponding value
export function interp(expr: ExprC, env: Env): Value {
    switch (true) {
        case (expr instanceof IdC): {
            return lookup((<IdC>expr).symbol, env);
        }
        case (expr instanceof NumC): {
            return new NumV((<NumC>expr).num);
        }
        case (expr instanceof StrC): {
            return new StrV((<StrC>expr).str);
        }
        case (expr instanceof LamC): {
            let lam = <LamC>expr;
            return new CloV(lam.params, lam.body, env);
        }
        case (expr instanceof IfC): {
            let ifc = <IfC>expr;
            let testCond = interp(ifc.test, env);
            if (!(testCond instanceof BoolV))
                throw new Error("RGME: Test condition must produce a boolean value");
            else {
                if (testCond.bool)
                    return interp(ifc.then, env);
                return interp(ifc.else, env);
            }
        }
        case (expr instanceof AppC): {
            let appc = <AppC>expr;
            let funVal = interp(appc.operation, env);
            switch (true) {
                case (funVal instanceof CloV): {
                    let clov = <CloV>funVal;
                    if (clov.params.length != appc.args.length)
                        throw new Error("RGME: Incorrect number of arguments to function");
                    else {
                        let interpretedArgs: Value[] = new Array();

                        for (let i = 0; i < appc.args.length; i++)
                            interpretedArgs.push(interp(appc.args[i], env));

                        let newEnv = bindAllParams(clov.params, interpretedArgs, clov.env);
                        return interp(clov.body, newEnv);
                    }
                }
                case (funVal instanceof PrimOpV): {
                    let interpretedArgs: Value[] = new Array();

                    for (let i = 0; i < appc.args.length; i++)
                        interpretedArgs.push(interp(appc.args[i], env));

                    switch (interpretedArgs.length) {
                        case (2): {
                            return myBinaryOperator((<PrimOpV>funVal).operator, interpretedArgs[0], interpretedArgs[1]);
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

// Given a list of paramters, arguments, and an environment, bind each parameter to its respective argument
// in the Environment and return the resulting Environment
export function bindAllParams(params: Array<String>, args: Array<Value>, env: Env): Env {
    // Make a copy of the new environment
    let newEnv = new Env(new Array<Binding>());
    for (let i = 0; i < env.bindings.length; i++)
        newEnv.bindings.push(env.bindings[i]);

    for (let i = 0; i < params.length; i++)
        newEnv.bindings.unshift(new Binding(params[i], args[i]));
    return newEnv;
}

// Given a key and an Environment, find the Value that corresponds to the key in the Environment
export function lookup(key: String, env: Env): Value {
    for (let binding of (<Env>env).bindings)
        if ((<Binding>binding).name == key)
            return (<Binding>binding).val;

    throw new Error('RGME: Unbound variable reference');
}

// Given a Value, return a String representation of the Value
export function serialize(val: Value): String {
    switch (true) {
        case (val instanceof NumV): {
            return (<NumC>val).num.toString();
        }
        case (val instanceof BoolV): {
            let b = (<BoolV>val).bool;
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
            return (<StrV>val).str;
        }
    }
}

// Given an operator and a left and right operand Value, determine what binary primitive operator is present and
// apply it to the operands
export function myBinaryOperator(op: String, left: Value, right: Value): Value {
    switch (op) {
        case ("equal"): {
            if ((left instanceof CloV) || (left instanceof PrimOpV) ||
                (right instanceof CloV) || (right instanceof PrimOpV))
                return new BoolV(false);
            else
                return new BoolV(deepEqual(left, right))
        }
        default: {
            if ((left instanceof NumV) && (right instanceof NumV)) {
                let l = (<NumV>left).num.valueOf();
                let r = (<NumV>right).num.valueOf();
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

// Pseudo tests to eyeball results
let ans = serialize(new NumV(3));
console.log("NumV: ", ans);

ans = serialize(new BoolV(true));
console.log("BoolV true: ", ans);

ans = serialize(new BoolV(false));
console.log("BoolV false: ", ans);

ans = serialize(new CloV(new Array<String>(), new NumC(1), topEnv));
console.log("CloV: ", ans);

ans = serialize(new PrimOpV("+"));
console.log("PrimOpV: ", ans);

let sym = lookup("+", topEnv);
console.log("Value: ", sym);

try {
    sym = lookup("x", topEnv);
    console.log("Sym: ", sym);
}
catch (e) {
    console.log("Lookup: ", e.message);
}

let v: Value
try {
    v = interp(new IdC("x"), topEnv);
    console.log("v: ", v);
}
catch (e) {
    console.log("Interp: ", e.message);
}

let val = interp(new IdC("true"), topEnv);
console.log("IdC:", val);

val = interp(new LamC(["x", "y", "z"], new NumC(5)), topEnv);
console.log("LamC: ", val);

let binaryAns = myBinaryOperator("equal", new NumV(1), new NumV(1));
console.log("myBinaryOperator1: ", binaryAns);

binaryAns = myBinaryOperator("equal", new NumC(4), new NumC(5));
console.log("myBinaryOperator2: ", binaryAns);

binaryAns = myBinaryOperator("equal", new CloV(new Array<String>(), new NumC(1), topEnv),
                                      new CloV(new Array<String>(), new NumC(1), topEnv));
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


let interpretedExpr = interp(new AppC(new IdC("+"), [new NumC(1), new NumC(4)]), topEnv);
console.log("interp1: ", interpretedExpr);

interpretedExpr = interp(new AppC(new IdC("+"), [new AppC(new IdC("*"), [new NumC(5), new NumC(3)]),
                                  new AppC(new IdC("/"), [new NumC(14), new NumC(2)])]),
                         topEnv);
console.log("interp2: ", interpretedExpr);

interpretedExpr = interp(new IfC(new AppC(new IdC("<="), [new NumC(1), new NumC(2)]),
    new IdC("true"),
    new IdC("false")),
    topEnv);
console.log("interp3: ", interpretedExpr);

interpretedExpr = interp(new IfC(new AppC(new IdC("<="), [new NumC(5), new NumC(2)]),
    new IdC("true"),
    new IdC("false")),
    topEnv);
console.log("interp4: ", interpretedExpr);

try {
    interp(new IfC(new AppC(new IdC("+"), [new NumC(5), new NumC(2)]),
        new IdC("true"),
        new IdC("false")),
        topEnv);
}
catch (e) {
    console.log("interp5: ", e.message);
}

interpretedExpr = interp(new AppC(new AppC(new LamC(["x"], new LamC(["y"], new AppC(new IdC("*"),
    [new IdC("x"), new IdC("y")]))),
    [new NumC(5)]),
    [new NumC(7)]),
    topEnv);
console.log("interp6: ", interpretedExpr);

// test that there is no dynamic scoping
try {
    interp(new AppC(new LamC(["x", "f"], new AppC(new IdC("f"), [new NumC(4)])),
        [new NumC(5), new LamC(["y"], new AppC(new IdC("+"), [new IdC("x"), new IdC("y")]))]),
        topEnv);
}
catch (e) {
    console.log("interp6: ", e.message);
}

let newEnv = bindAllParams(["x"], [new NumV(4)], topEnv);
console.log("newEnv=topEnv: ", deepEqual(newEnv, topEnv));
console.log(newEnv.bindings);

newEnv = bindAllParams([], [], topEnv);
console.log("newEnv=topEnv: ", deepEqual(newEnv, topEnv));
console.log(newEnv.bindings);

try {
    console.log("TopInterp1: ", topInterp(new AppC(new LamC(["x", "f"], new AppC(new IdC("f"), [new NumC(4)])),
        [new NumC(5), new LamC(["y"], new AppC(new IdC("+"), [new IdC("x"), new IdC("y")]))])));
}
catch (e) {
    console.log(e.message);
}

console.log("TopInterp2: ", topInterp(new AppC(new AppC(new LamC(["x"], new LamC(["y"], new AppC(new IdC("*"),
    [new IdC("x"), new IdC("y")]))),
    [new NumC(5)]),
    [new NumC(7)])));

export default interp;
