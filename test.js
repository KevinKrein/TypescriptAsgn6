var Test = /** @class */ (function () {
    function Test() {
    }
    Test.prototype.greet = function () {
        console.log("Hello World!!!");
    };
    return Test;
}());
var obj = new Test();
obj.greet();
