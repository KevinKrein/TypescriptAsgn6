"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var Test = /** @class */ (function () {
    function Test() {
    }
    Test.sayHi = function () {
        return "HI";
    };
    return Test;
}());
describe('hi', function () {
    it('hi', function () {
        var result = Test.sayHi();
        chai_1.expect(result).equal("HI");
    });
});
