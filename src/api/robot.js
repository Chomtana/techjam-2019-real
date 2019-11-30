let robots = {};
let robots_sqrt = {

};

function dist(first, second, metric) {
  if (typeof first === "string") {
    if (!first.match(/^robot#([1-9][0-9]*)$/)) throw "malform robot";
    first = getRobotPos(/^robot#([1-9][0-9]*)$/.exec(first)[1]).position
  }
  if (typeof second === "string") {
    if (!second.match(/^robot#([1-9][0-9]*)$/)) throw "malform robot";
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
    "position" : {
      "x": robots[x].x,
      "y": robots[x].y
    }
  };
}

function setRobotPos(id, pos) {
  if(id in robots)throw "Have this robot already";
  if(id < 1 || id > 99999)throw "Id is not in range [1..999999]"
  robots[id] = pos;

  let sqrti = Math.floor(parseFloat(pos.x)/1000);

  if (!(sqrti in robots_sqrt)) {
    robots_sqrt[sqrti] = [] 
  } else {
    robots_sqrt[sqrti].push(parseInt(id));
  }
}

function find_nearest(pos) {
  let currmin = 1e16;
  let nearest_id = -1;

  for(let id in robots) {
    let d = dist(pos, getRobotPos(id).position).distance;
    //console.log("D",d)
    if (d<currmin) {
      currmin = d;
      nearest_id = id;
      //nearest_id.push(parseInt(id));
    } else if (d == currmin && id < nearest_id) {
      nearest_id = id;
      //nearest_id.push(parseInt(id));
    }
  }

  return {
    robot_ids: nearest_id == -1 ? [] : [nearest_id]
  }
}

function api_robot(app) {
  app.post("/distance", async (req, res) => {
    try {
      res.send(dist(req.body.first_pos, req.body.second_pos, req.body.metric));
      //res.state(200).send("Distance is computed");
    } catch (err) {
      console.error(err);
      if (err == "No robotId exists") {
        res.status(424).send("Insufficient data to compute the result");
      } else 
        res.status(400).send("Request was ill-formed");
      }
    }
  );

  app.get("/robot/:robot_id/position", async (req, res) => {
    try {
      res.send(getRobotPos(req.params.robot_id));
      //res.status(200).send("Position of the robot is retrieved");
    } catch (err) {
      console.error(err);
      if (err == "No robotId exists") {
        res.status(404).send("Unrecognized robot ID");
      } else {
        console.error(err);
        res.status(400).send("Request was ill-formed");
      }
    }
  })

  app.put("/robot/:id/position", async (req, res) => {
    try {
      setRobotPos(req.params.id, req.body.position)
      res.status(204).send("Current position of the robot is updated");
    } catch (err) {
      console.error(err);
      if(err == "Have this robot already" || err == "Id is not in range [1..999999]")res.status(400).send("Request was ill-formed");
    }
  });

  app.post("/nearest", async (req, res) => {
    try {
      res.send(find_nearest(req.body.ref_position));
      //res.state(200).send("Distance is computed");
    } catch (err) {
      console.error(err);
      if (err == "No robotId exists") {
        res.status(424).send("Insufficient data to compute the result");
      } else 
        res.status(400).send("Request was ill-formed");
      }
    }
  );
}

module.exports = {api_robot, dist, setRobotPos}