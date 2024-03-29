const path = require("path");

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const express = require('express')
const app = express()
const port = process.env.PORT

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

// Register Paths
require('./api/robot').api_robot(app);

app.listen(port, '0.0.0.0', () => console.log(`Example app listening on port ${port}!`))