
/*
  (define-type ExprC (U NumC StrC BoolC IdC AppC IfC LamC))
  (struct NumC ([n : Real]) #:transparent)
  (struct StrC ([s : String]) #:transparent)
  (struct BoolC ([b : Boolean]) #:transparent)
  (struct IdC ([s : Symbol]) #:transparent)
  (struct AppC ([op : ExprC] [params : (Listof ExprC)]) #:transparent)
  (struct IfC ([val : ExprC] [trueRet : ExprC] [falseRet : ExprC]) #:transparent)
  (struct LamC ([params : (Listof Symbol)] [body : ExprC]) #:transparent)

  (define-type Value (U NumV BoolV CloV StrV PrimOpV))
  (struct NumV ([n : Real]) #:transparent)
  (struct BoolV ([b : Boolean]) #:transparent)
  (struct StrV ([s : String]) #:transparent)
  (struct CloV ([params : (Listof Symbol)] [body : ExprC] [env : Env]) #:transparent)
  (struct PrimOpV ([primOp : Symbol]) #:transparent)

  (struct Binding ((name : Symbol) (val : Value)) #:transparent)
  (define-type Env (Listof Binding))

  (define top-env (list
                 (Binding '+ (PrimOpV '+))
                 (Binding '- (PrimOpV '-))
                 (Binding '/ (PrimOpV '/))
                 (Binding '* (PrimOpV '*))
                 (Binding '<= (PrimOpV '<=))
                 (Binding 'equal? (PrimOpV 'equal?))
                 (Binding 'true (BoolV #t))
                 (Binding 'false (BoolV #f))))
              
 */

class ExprC {
  constructor() {
  }
}

class NumC extends ExprC {
  num: Number
  constructor(num: Number) {
    super();
    this.num = num;
  }
}

class StrC extends ExprC {
  str: String
  constructor(str: String) {
    super();
    this.str = str;
  }
}

class BoolC extends ExprC {
  bool: Boolean
  constructor(bool: Boolean) {
    super();
    this.bool = bool;
  }
}

class IdC extends ExprC {
  symbol: String
  constructor(symbol: String) {
    super();
    this.symbol = symbol;
  }
}

class AppC extends ExprC {
  operation: ExprC
  params: Array<ExprC>
  constructor(operation: ExprC, params: Array<ExprC>) {
    super();
    this.operation = operation;
    this.params = params;
  }
}

class IfC extends ExprC {
  test: ExprC
  then: ExprC
  else: ExprC
  constructor(test: ExprC, then: ExprC, inElse: ExprC) {
    super();
    this.test = test;
    this.then = then;
    this.else = inElse;
  }
}

class LamC extends ExprC {
  params: Array<String>
  body: ExprC
  constructor(params: Array<String>, body: ExprC) {
    super();
    this.params = params;
    this.body = body;
  }
}

//Values
class Value {
  constructor() {
  }
}

class NumV extends Value {
  num: Number
  constructor(num: Number) {
    super();
    this.num = num;
  }
}

class StrV extends Value {
  str: String
  constructor(str: String) {
    super();
    this.str = str;
  }
}

class BoolV extends Value {
  bool: Boolean
  constructor(bool: Boolean) {
    super();
    this.bool = bool;
  }
}

class CloV extends Value {
  params: Array<String>
  body: ExprC
  env: Env
  constructor(params: Array<String>, body: ExprC, env: Env) {
    super();
    this.params = params;
    this.body = body;
    this.env = env;
  }
}

class PrimOpV extends Value {
  operator: String
  constructor(operator: String) {
    super();
    this.operator = operator;
  }
}

//Environment
class Binding {
  name: String
  val: Value
  constructor(name: String, val: Value) {
    this.name = name;
    this.val = val;
  }
}

class Env {
  bindings: Array<Binding>
  constructor(bindings: Binding[]) {
    this.bindings = bindings;
  }
  static emptyEnv():Env {
    return new Env([])
  }
}

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


export function interp(expr: ExprC, env: Env) {
  switch(expr) {
    case (expr instanceof NumC) : {
      return new NumV((<NumC> expr).num)
    }
    case (expr instanceof BoolC) : {
      return new BoolV((<BoolC> expr).bool)
    }
    case (expr instanceof StrC) : {
      return new StrV((<StrC> expr).str)
    }

  }

}

export default interp;
