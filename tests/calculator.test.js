const {calc} = require("../src/api/calculator");

test("calc", async () => {
  expect(await calc("3*2")).toEqual({result: "6"});
});