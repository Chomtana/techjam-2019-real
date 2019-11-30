let robots = {};

function dist(first, second, metric) {
  if (typeof first === "string") {
    first = getRobotPos(/^robot#([1-9][0-9]*)$/.exec(first)[1]).position
  }
  if (typeof second === "string") {
    second = getRobotPos(/^robot#([1-9][0-9]*)$/.exec(second)[1]).position
  }

  if (isNaN(parseFloat(first.x)) || isNaN(parseFloat(first.y)) || isNaN(parseFloat(second.x)) || isNaN(parseFloat(second.y))) throw "NaN";
  
  first.x = parseFloat(first.x);
  first.y = parseFloat(first.y);
  second.x = parseFloat(second.x);
  second.y = parseFloat(second.y);
  
  if (Math.abs(first.x) > 1e9 || Math.abs(first.y) > 1e9 || Math.abs(second.x) > 1e9 || Math.abs(second.y) > 1e9) throw "overbound";
  
  if (metric != "manhattan") {
    return {distance: parseFloat(Math.sqrt((second.x-first.x)*(second.x-first.x) + (second.y-first.y)*(second.y-first.y)).toFixed(4))};
  } else {
    return {distance: parseFloat( (Math.abs(second.x-first.x)+Math.abs(second.y-first.y)).toFixed(4) )}
  }
}

function getRobotPos(x) {
  console.log(robots, x);
  if(!(x in robots)) throw "No robotId exists"
  return {
    "x": robots[x].x,
    "y": robots[x].y
  };
}

function setRobotPos(id, pos) {
  robots[id] = pos;
}

function api_robot(app) {
  app.post("/distance", async (req, res) => {
    try {
      res.send(dist(req.body.first_pos, req.body.second_pos, req.body.metric));
    } catch (err) {
      console.error(err);
      if (err == "No robotId exists") {
        res.status(404).send("Unrecognized robot ID");
      } else {
        res.status(400).send();
      }
    }
  });

  app.get("/robot/:robot_id/position", async (req, res) => {
    try {
      res.send(getRobotPos(req.params.robot_id));
    } catch (err) {
      console.error(err);
      if (err == "No robotId exists") {
        res.status(404).send("Unrecognized robot ID");
      } else {
        res.status(400).send();
      }
    }
  })

  app.put("/robot/:id/position", async (req, res) => {
    try {
      setRobotPos(req.params.id, req.body.position)
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(400).send();
    }
  });
}

module.exports = {api_robot, dist, setRobotPos}