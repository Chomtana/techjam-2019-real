function dist(first, second) {
  return Math.sqrt((second.x-first.x)*(second.x-first.x) + (second.y-first.y)*(second.y-first.y));
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
}

module.exports = {api_robot}