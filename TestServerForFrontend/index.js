const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const port = 3002;

app.use(bodyParser.json()); 

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/link", (req, res) => {
  console.log("body", req.body)
  res.header("Content-Type",'application/json');
  const data = require(`./scriptFiles/${req.body.videoID}.json`);
  res.send(JSON.stringify(data));
});

app.listen(port, () => {
  console.log(`Server on ${port} Port`);
});