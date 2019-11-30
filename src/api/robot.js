function dist(first, second) {
  if (isNaN(parseFloat(first.x)) || isNaN(parseFloat(first.y)) || isNaN(parseFloat(second.x)) || isNaN(parseFloat(second.y))) throw "NaN";
  if (Math.abs(first.x) > 10e9 || Math.abs(first.y) > 10e9 || Math.abs(second.x) > 10e9 || Math.abs(second.y) > 10e9) throw "overbound";
  return {distance: Math.sqrt((second.x-first.x)*(second.x-first.x) + (second.y-first.y)*(second.y-first.y))};
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