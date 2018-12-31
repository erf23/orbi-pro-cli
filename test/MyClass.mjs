const MyClass = require("../src/MyClass.mjs");
const chai = require("chai");
const expect = chai.expect;

describe("MyClass", () => {
  ///////////
  // setup //
  ///////////
  
  beforeEach(() => {
    // ...
  });
  
  //////////////
  // teardown //
  //////////////
  
  afterEach(() => {
    // ...
  });
  
  ///////////////////
  // constructor() //
  ///////////////////
  
  describe("#constructor()", () => {
    it("happy path", () => {
      let myClass = new MyClass();
      expect(myClass.foo).to.equal("bar");
    });
  });
  
});
