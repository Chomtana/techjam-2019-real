let store = {};

function verify_name(name) {
  if (name.length == 0) throw "Name must be length 1";
  if (
    !((name[0] >= "a" && name[0] <= "z") || (name[0] >= "A" && name[0] <= "Z"))
  )
    throw "First unit";
  
  return true;
}

async function put_variable(name, value) {
  value = parseFloat(value);

  if (isNaN(value)) throw "Value not available";

  verify_name(name);
  
  for (var i = 0; i < name.length; i++)
    if (
      !(
        (name[i] >= "a" && name[i] <= "z") ||
        (name[i] >= "A" && name[i] <= "Z") ||
        (name[i] >= "0" && name[i] <= "9") ||
        name[i] == "_"
      )
    )
      throw "Char fail";

  store[name] = value;

  return 201;
}

async function get_variable(name) {
  if (!(name in store)) {
    throw "name not in store";
  }

  return {
    value: store[name].toFixed(process.env.DECIMAL_PLACES)
  };
}

async function calc(expr, saveto) {
  //Load variables into local variable
  for (let key in store) {
    //Use var to declear variable in function scope
    eval("var " + key + " = " + JSON.stringify(store[key]));
  }

  let result = eval(expr).toFixed(process.env.DECIMAL_PLACES);

  if (isNaN(result)) throw "NaN calc"

  if (saveto) {
    verify_name(saveto)

    store[saveto] = parseFloat(result);
  }

  return {
    result
  };
}

function get_variables() {
  return store;
}

function merge_variables(newstore, overwrite) {
  if (overwrite) {
    store = {
      ...store,
      ...newstore
    };
  } else {
    for (let key in newstore) {
      if (!(key in store)) {
        store[key] = newstore[key];
      }
    }
  }

  return 204;
}

module.exports = function api_calculator(app) {
  app.post("/calc", async (req, res) => {
    try {
      res.send(await calc(req.body.expression, req.body.save_to));
    } catch (err) {
      console.error(err);
      res.status(400).send();
    }
  });

  app.put("/variable/:name", async (req, res) => {
    try {
      res.sendStatus(await put_variable(req.params.name, req.body.value));
    } catch (err) {
      console.error(err);
      res.status(400).send();
    }
  });

  app.get("/variable/:name", async (req, res) => {
    try {
      res.send(await get_variable(req.params.name));
    } catch (err) {
      console.error(err);
      res.status(400).send();
    }
  });

  app.get("/variables", async (req, res) => {
    try {
      res.send({
        data: JSON.stringify(get_variables())
      });
    } catch (err) {
      console.error(err);
      res.status(400).send();
    }
  });

  app.post("/variables", async (req, res) => {
    try {
      res.sendStatus(merge_variables(JSON.parse(req.body.data), req.body.overwrite));
    } catch (err) {
      console.error(err);
      res.status(400).send();
    }
  });
};