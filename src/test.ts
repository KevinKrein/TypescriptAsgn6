import { interp } from './asgn6';
import { expect } from 'chai';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('Hello function', () => {
  it('should return a number', () => {
    const result = topInterp(new AppC(new LamC(["x", "y"], new AppC(new IdC("+"), 
    [new IdC("x"), new IdC("y") ))) (list (NumC 6) (NumC 4))));

    expect(result).to.equal("3");
  })
});