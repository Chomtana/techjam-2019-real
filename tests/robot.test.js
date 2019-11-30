const {dist, setRobotPos, getRobotPos, find_nearest, newAlien} = require("../src/api/robot");

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
    expect(dist(a.first_pos, a.second_pos)).toEqual({distance: 13.0384});

    expect(dist(a.first_pos, a.second_pos, "manhattan")).toEqual({distance: 18});
});

test("alien1", async () => {
    setRobotPos(1, {x:0, y:0});
    expect(getRobotPos(1).position).toEqual({x:0, y:0});
    newAlien("abc", 1, 3.162);
    setRobotPos(1, {x:5, y:-2});
    expect(getRobotPos(1).position).toEqual({x:5, y:-2});
    newAlien("abc", 1, 2.236);
    setRobotPos(2, {x:3, y:-3});
    expect(getRobotPos(1).position).toEqual({x:5, y:-2});
    expect(getRobotPos(2).position).toEqual({x:3, y:-3});
    newAlien("abc", 2, 2.000);
})