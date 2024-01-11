const express = require("express");

const app = express();

app.get("/api/material-list/fetch", (req, res, next) => {});

app.listen(8080, () => {
  console.log(`Server is running at port 8080 ...`);
});
