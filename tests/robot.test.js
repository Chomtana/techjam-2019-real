const {
  dist,
  setRobotPos,
  getRobotPos,
  find_nearest,
<<<<<<< HEAD
  newAlien,
  getAlienPos
||||||| merged common ancestors
  newAlien
=======
  newAlien,
  closestPair,
  closestPairDist
>>>>>>> e299266336b07ced3ab8ab8e104b9893162bb7ff
} = require("../src/api/robot");

test("dist", async () => {
  var a = {
    first_pos: {
      x: 3,
      y: -2
    },
    second_pos: {
      x: -4,
      y: 9
    }
  };
  expect(dist(a.first_pos, a.second_pos).distance.toFixed(4)).toEqual("13.0384");

  expect(dist(a.first_pos, a.second_pos, "manhattan")).toEqual({
    distance: 18
  });

  setRobotPos(1, { x: 0, y: 0 });
  setRobotPos(2, { x: -3, y: 4 });

  expect(dist("robot#1", a.second_pos)).toEqual({ distance: Math.sqrt(16+81) })
  expect(dist("robot#1", "robot#2")).toEqual({ distance: Math.sqrt(9+16) })
});

test("alien1", async () => {
  setRobotPos(1, { x: 0, y: 0 });
  expect(getRobotPos(1).position).toEqual({ x: 0, y: 0 });
  newAlien("abc", 1, 3.162);
  setRobotPos(1, { x: 5, y: -2 });
  expect(getRobotPos(1).position).toEqual({ x: 5, y: -2 });
  newAlien("abc", 1, 2.236);
  setRobotPos(2, { x: 3, y: -3 });
  expect(getRobotPos(1).position).toEqual({ x: 5, y: -2 });
  expect(getRobotPos(2).position).toEqual({ x: 3, y: -3 });
  newAlien("abc", 2, 2.0);
<<<<<<< HEAD
  expect(getAlienPos("abc")).toEqual({
    "position": {
      "x": 7,
      "y": -1
    }
  });
||||||| merged common ancestors
=======

  setRobotPos(3, { x: 3, y: -4 });

  expect(closestPairDist()).toEqual(1);
>>>>>>> e299266336b07ced3ab8ab8e104b9893162bb7ff
});
