function dist(first, second) {
  if (isNaN(parseFloat(first.x)) || isNaN(parseFloat(first.y)) || isNaN(parseFloat(second.x)) || isNaN(parseFloat(second.y))) throw "NaN";
  
  first.x = parseFloat(first.x);
  first.y = parseFloat(first.y);
  second.x = parseFloat(second.x);
  second.y = parseFloat(second.y);
  
  if (Math.abs(first.x) > 1e9 || Math.abs(first.y) > 1e9 || Math.abs(second.x) > 1e9 || Math.abs(second.y) > 1e9) throw "overbound";
  return {distance: parseFloat(Math.sqrt((second.x-first.x)*(second.x-first.x) + (second.y-first.y)*(second.y-first.y)).toFixed(4))};
}

function getRobotPos(x) {
  if(robots.find(x)==null) throw "No robotId exists"
  return {
    "x": robots[x].x,
    "y": robots[x],y
  };
}

function api_robot(app) {
  app.post("/distance", async (req, res) => {
    try {
      res.send(dist(req.body.first_pos, req.body.second_pos));
    } catch (err) {
      console.error(err);
      res.status(400).send();
    }
  });

  app.get("/robot/:robot_id/position", async (req, res) => {
    try {
      res.send(getRobotPos(robot_id));
    } catch (err) {
      console.error(err);
      res.status(400).send();
    }
  })
}

module.exports = {api_robot}