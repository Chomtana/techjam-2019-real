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
    expect(await dist(a.first_pos, a.second_pos)).toEqual({distance: 13.0384});
});