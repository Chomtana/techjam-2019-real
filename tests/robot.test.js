const {
  dist,
  setRobotPos,
  getRobotPos,
  find_nearest,
  newAlien,
  getAlienPos,
  closestPair,
  closestPairDist
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

  expect(dist("robot#1", a.second_pos)).toEqual({ distance: parseFloat( Math.sqrt(16+81).toFixed(5) ) })
  expect(dist("robot#1", "robot#2")).toEqual({ distance: parseFloat( Math.sqrt(9+16).toFixed(5) ) })
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

  let alienPos = getAlienPos("abc");

  expect(Math.round(alienPos.position.x)).toEqual(3);
  expect(Math.round(alienPos.position.y)).toEqual(-1);

  setRobotPos(3, { x: 3, y: -4 });

  expect(closestPairDist()).toEqual(1);
});

test("alien2", async () => {
  setRobotPos(1, { x: -1, y: 0 });
  newAlien("def", 1, 1);
  setRobotPos(1, { x: 1, y: 0 });
  newAlien("def", 1, 1);

  expect(getAlienPos("def")).toEqual({
    "position": {
      "x": 0,
      "y": 0
    }
  });

  setRobotPos(1, { x: -1, y: 0 });
  newAlien("defg", 1, 1);
  setRobotPos(1, { x: 5, y: 0 });
  newAlien("defg", 1, 1);

  expect(() => getAlienPos("defg")).toThrow("dont have enough information");
});

test("featureF", async () => {
  setRobotPos(1, { x: 1, y: 1 });
  setRobotPos(2, { x:0 , y:0});
  expect(find_nearest({x: 1,y :-1},1)).toEqual({robot_ids: [2]});
  expect(find_nearest({x: 1,y :-1})).toEqual({robot_ids: [2]});
  expect(find_nearest({x: 1,y :-1},2)).toEqual({robot_ids: [2,1]});
})

test("threeintersect", async () => {
    setRobotPos(1, {x: -3, y:-4});
    setRobotPos(2, {x: 5, y:12});
    setRobotPos(3, {x: -1, y:0});
    newAlien("defg",1,5);
    newAlien("defg",2,13);
    newAlien("defg",3,1);
    newAlien("defgh",1,5);
    newAlien("defgh",2,13);
    newAlien("defgh",3,1);
    expect(() => getAlienPos("defg")).toThrow("dont have enough information");
    expect(() => getAlienPos("defgh")).toThrow("reach end")
})

test("legacy", async () => {
  setRobotPos(1, {west: 3, north: 5});
  expect(getRobotPos(1).position).toEqual({ x: -3, y: 5 });
  setRobotPos(1, {west: 3, south: 5});
  expect(getRobotPos(1).position).toEqual({ x: -3, y: -5 });
  setRobotPos(1, {east: 3, south: 5});
  expect(getRobotPos(1).position).toEqual({ x: 3, y: -5 });
  setRobotPos(1, {east: 3, north: 5});
  expect(getRobotPos(1).position).toEqual({ x: 3, y: 5 });
});