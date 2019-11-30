const {circle_intersection, three_circles_intersection} = require("./util")
const closestPairUtil = require("./closetpair")
const _ = require("lodash")

let robots = {};
let robots_sqrt = {};
let alien_robots = {};

function dist(first, second, metric) {
  if (typeof first === "string") {
    if (!first.match(/^robot#([1-9][0-9]*)$/)) throw "malform robot";
    first = getRobotPos(/^robot#([1-9][0-9]*)$/.exec(first)[1]).position
  }
  if (typeof second === "string") {
    if (!second.match(/^robot#([1-9][0-9]*)$/)) throw "malform robot";
    second = getRobotPos(/^robot#([1-9][0-9]*)$/.exec(second)[1]).position
  }

  if (typeof first.x === "undefined" && typeof first.y === "undefined") {
    if (typeof first.north !== "undefined") {
      first.y = first.north;
    } else {
      first.y = -first.south;
    }

    if (typeof first.east !== "undefined") {
      first.x = first.east;
    } else {
      first.x = -first.west;
    }
  }

  if (typeof second.x === "undefined" && typeof second.y === "undefined") {
    if (typeof second.north !== "undefined") {
      second.y = second.north;
    } else {
      second.y = -second.south;
    }

    if (typeof second.east !== "undefined") {
      second.x = second.east;
    } else {
      second.x = -second.west;
    }
  }

  if (isNaN(parseFloat(first.x)) || isNaN(parseFloat(first.y)) || isNaN(parseFloat(second.x)) || isNaN(parseFloat(second.y))) throw "NaN";
  
  first.x = parseFloat(first.x);
  first.y = parseFloat(first.y);
  second.x = parseFloat(second.x);
  second.y = parseFloat(second.y);
  
  if (Math.abs(first.x) > 1e9 || Math.abs(first.y) > 1e9 || Math.abs(second.x) > 1e9 || Math.abs(second.y) > 1e9) throw "overbound";
  
  if (metric != "manhattan") {
    return {distance: parseFloat( Math.sqrt((second.x-first.x)*(second.x-first.x) + (second.y-first.y)*(second.y-first.y)).toFixed(5) )};
  } else {
    return {distance: parseFloat( (Math.abs(second.x-first.x)+Math.abs(second.y-first.y)).toFixed(5) )}
  }
}

function getRobotPos(x) {
  // console.log(robots, x);
  if(!(x in robots)) throw "No robotId exists"
  return {
    "position" : {
      "x": robots[x].x,
      "y": robots[x].y
    }
  };
}

function setRobotPos(id, pos) {
  //if(id in robots)throw "Have this robot already";
  if(id < 1 || id > 99999)throw "Id is not in range [1..999999]"

  if (typeof pos.x === "undefined" && typeof pos.y === "undefined") {
    if (typeof pos.north !== "undefined") {
      pos.y = pos.north;
    } else {
      pos.y = -pos.south;
    }

    if (typeof pos.east !== "undefined") {
      pos.x = pos.east;
    } else {
      pos.x = -pos.west;
    }
  }

  robots[id] = pos;

  let sqrti = Math.floor(parseFloat(pos.x)/1000);

  if (!(sqrti in robots_sqrt)) {
    robots_sqrt[sqrti] = [] 
  } else {
    robots_sqrt[sqrti].push(parseInt(id));
  }
}

function find_nearest(pos,k) {
  // let currmin = 1e16;
  // let nearest_id = -1;

  // for(let id in robots) {
  //   let d = dist(pos, getRobotPos(id).position).distance;
  //   //console.log("D",d)
  //   if (d<currmin) {
  //     currmin = d;
  //     nearest_id = parseInt(id);
  //     //nearest_id.push(parseInt(id));
  //   } else if (d == currmin && parseInt(id) < nearest_id) {
  //     nearest_id = parseInt(id);
  //     //nearest_id.push(parseInt(id));
  //   }
  // }

  // return {
  //   robot_ids: nearest_id == -1 ? [] : [nearest_id]
  // }
  if(pos==undefined)throw "Request was ill-formed";
  if(robots.length==0)throw "No robotId exists";
  let t = [];
  for(let id in robots) {
    // console.log(id);
    let d = dist(pos,getRobotPos(id).position).distance;
    t.push({d,id});
  }
  t.sort((a,b) => {
    if (a.d != b.d) {
      return a.d - b.d;
    } else {
      return a.id - b.id;
    }
  });
  let tk = k==undefined ?1:k;
  let ans = [];
  console.log(t);
  for(let i in t){
    // console.log(i);
    ans.push(parseInt(t[i].id));
    tk--;
    if(tk == 0)break;
  }
  return { robot_ids: ans};
}

function newAlien(alien_id, robot_id, distance) {
  if (!(alien_id in alien_robots))
    alien_robots[alien_id] = [];
  alien_robots[alien_id].push({...getRobotPos(robot_id).position, distance: distance});
}

function getAlienPos(alien_id) {
  if(!(alien_id in alien_robots)) throw "dont have enough information";
  if (alien_robots[alien_id].length==2) {
    let x0 = alien_robots[alien_id][0].x;
    let y0 = alien_robots[alien_id][0].y;
    let r0 = alien_robots[alien_id][0].distance;
    
    let x1 = alien_robots[alien_id][1].x;
    let y1 = alien_robots[alien_id][1].y;
    let r1 = alien_robots[alien_id][1].distance;

    let res = circle_intersection(x0,y0,r0,x1,y1,r1);

    //console.log(res);

    if (Array.isArray(res)) {
      //console.log(res);
      //console.log(dist({x: res[0][0], y: res[0][1]}, {x: res[1][0], y: res[1][1]}));
      if (dist({x: res[0][0], y: res[0][1]}, {x: res[1][0], y: res[1][1]}).distance < 1e-1) {
        return {
          position: {
            x: res[0][0],
            y: res[0][1]
          }
        }
      } else {
        throw "dont have enough information";
      }
    } else {
      throw "dont have enough information";
    }

    
  }
  if(!(alien_id in alien_robots) || alien_robots[alien_id].length<3)throw "dont have enough information";
  
  let currres = [];

  {
    let x0 = alien_robots[alien_id][0].x;
    let y0 = alien_robots[alien_id][0].y;
    let r0 = alien_robots[alien_id][0].distance;
    
    let x1 = alien_robots[alien_id][1].x;
    let y1 = alien_robots[alien_id][1].y;
    let r1 = alien_robots[alien_id][1].distance;

    let res = circle_intersection(x0,y0,r0,x1,y1,r1);
    if (Array.isArray(res)) {
      currres = [{x: res[0][0], y: res[0][1]}, {x: res[1][0], y: res[1][1]}];
      currres = _.uniqWith(currres, (a,b) => dist(a,b).distance < 1e-3);
    } else {
      throw "dont have enough information";
    }
  }

  for(let i = 0;i<alien_robots[alien_id].length;i++) {
    for(let j = i+1;j<alien_robots[alien_id].length;j++) {
      let x0 = alien_robots[alien_id][i].x;
      let y0 = alien_robots[alien_id][i].y;
      let r0 = alien_robots[alien_id][i].distance;
      
      let x1 = alien_robots[alien_id][j].x;
      let y1 = alien_robots[alien_id][j].y;
      let r1 = alien_robots[alien_id][j].distance;

      let res = circle_intersection(x0,y0,r0,x1,y1,r1);

      let newres = [];

      if (Array.isArray(res)) {
        console.log(res,currres);
        //console.log(dist({x: res[0][0], y: res[0][1]}, {x: res[1][0], y: res[1][1]}));
        if (dist({x: res[0][0], y: res[0][1]}, {x: currres[0].x, y: currres[0].y}).distance < 1e-1) {
          newres.push({x: res[0][0], y: res[0][1]});
        }
        if (currres[1] && dist({x: res[0][0], y: res[0][1]}, {x: currres[1].x, y: currres[1].y}).distance < 1e-1) {
          newres.push({x: res[0][0], y: res[0][1]});
        }
        if (dist({x: res[1][0], y: res[1][1]}, {x: currres[0].x, y: currres[0].y}).distance < 1e-1) {
          newres.push({x: res[1][0], y: res[1][1]});
        }
        if (currres[1] && dist({x: res[1][0], y: res[1][1]}, {x: currres[1].x, y: currres[1].y}).distance < 1e-1) {
          newres.push({x: res[1][0], y: res[1][1]});
        }

        newres = _.uniqWith(newres, (a,b) => dist(a,b).distance < 1e-1);

        console.log(newres);

        if (newres.length == 0) {
          throw "dont have enough information";
        } else if (newres.length == 1) {
          return {position: newres[0]};
        } else {
          currres = newres;
        }
        
      } else {
        throw "dont have enough information";
      }
    }
  }

  console.log("End res", currres);

  throw "reach end";

  
  /*let x2 = alien_robots[alien_id][2].x;
  let y2 = alien_robots[alien_id][2].y;
  let r2 = alien_robots[alien_id][2].distance;

  console.log(x0,y0,r0,x1,y1,r1,x2,y2,r2);
  console.log(three_circles_intersection(x0,y0,r0,x1,y1,r1,x2,y2,r2));
  return { position: three_circles_intersection(x0,y0,r0,x1,y1,r1,x2,y2,r2) };*/
}

function closestPair() {
  let points = [];
  for(let id in robots) {
    points.push(robots[id]);
  }

  return closestPairUtil(points);
}

function closestPairDist() {
  let p = closestPair();

  return dist(p[0], p[1]).distance;
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
      } else {
        res.status(400).send("Request was ill-formed");
      }
    }
  });

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
  });

  app.put("/robot/:id/position", async (req, res) => {
    try {
      setRobotPos(req.params.id, req.body.position)
      res.status(204).send("Current position of the robot is updated");
    } catch (err) {
      console.error(err);
      if(err == "Id is not in range [1..999999]")res.status(400).send("Request was ill-formed");
      else res.status(400).send("Request was ill-formed");
    }
  });

  app.post("/nearest", async (req, res) => {
    try {
      res.send(find_nearest(req.body.ref_position,req.body.k));
      //res.state(200).send("Distance is computed");
    } catch (err) {
      console.error(err);
      if (err == "No robotId exists") {
        res.status(424).send("Insufficient data to compute the result");
      } else {
        res.status(400).send("Request was ill-formed");
      }
    }
  });

  app.post("/alien/:id/report", async (req, res) => {
    try {
      newAlien(req.params.id, req.body.robot_id, req.body.distance);
      console.log(alien_robots);
      res.status(204).send("");
    } catch (err) {
      console.error(err);
      res.status(400).send("Request was ill-formed");
    }
  });

  app.get("/alien/:id/position", async (req, res) => {
    try {
      res.send(getAlienPos(req.params.id));
      //res.status(200).send("Position of the robot is retrieved");
    } catch (err) {
      console.error(err);
      res.status(424).send("Failed Dependency");
    }
  });

  app.get("/closestpair", async (req, res) => {
    try {
      res.send({distance: closestPairDist()});
      //res.state(200).send("Distance is computed");
    } catch (err) {
      console.error(err);
      res.status(400).send("Request was ill-formed");
    }
  });
}

module.exports = {api_robot, dist, setRobotPos, getRobotPos, find_nearest, newAlien, closestPair, closestPairDist, getAlienPos}
