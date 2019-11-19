import * as a6 from './asgn6';
import { expect } from 'chai';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('Hello function', () => {
  it('should return a number', () => {
    const result = a6.topInterp(new a6.NumC(7));
    expect(result).to.equal("7");
  })

  it('should return boolean', () => {
    const result = a6.topInterp(new a6.AppC(new a6.IdC("<="), [new a6.NumC(2), new a6.NumC(5)]));
    expect(result).to.equal("true");
  })

  it('should return number', () => {
    const result = a6.topInterp(new a6.AppC(
      new a6.LamC(["x", "y"],
      new a6.AppC(new a6.IdC("+"), [new a6.IdC("x"), new a6.IdC("y")])),
      [new a6.NumC(6), new a6.NumC(4)]));
    expect(result).to.equal("10");
  })

  it('should return number', () => {
    const result = a6.topInterp(new a6.IfC(
      new a6.AppC(new a6.IdC("<="), [new a6.NumC(2), new a6.NumC(5)]), 
      new a6.AppC(new a6.IdC("*"), [new a6.NumC(7), new a6.NumC(8)]), 
      new a6.AppC(new a6.IdC("-"), [new a6.NumC(6), new a6.NumC(5)])));
    expect(result).to.equal("56");
  })
});