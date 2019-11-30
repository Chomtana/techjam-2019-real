const {dist} = require("../src/api/robot");

test("dist", async () => {
    var a = {
        "first_pos":{
            "x":3,
            "y":-2
        },
        "second_pos":{
            "x":-4,
            "y":9
        }
    };
    expect(await dist(a).toEqual({distance: "13.038"}));
});