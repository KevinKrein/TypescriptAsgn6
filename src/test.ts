import interp from './asgn6';
import topEnv from './asgn6';
import { expect } from 'chai';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('Hello function', () => {
  it('should return hello world', () => {
    const result = interp(new NumC(5), topEnv);
    expect(result).to.equal('Hello World!');
  });
});