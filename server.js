const fs = require("fs");
const express = require("express");
const JSONStream = require("JSONStream");
const zlib = require("zlib");
const base64 = require("base64-js");
const expressStatusMonitor = require("express-status-monitor");

const app = express();
app.use(expressStatusMonitor());

app.get("/api/product-list/fetch", (req, res, next) => {
  const productList = [];
  const stream = fs.createReadStream("productList.json", "utf-8");
  const parser = JSONStream.parse("*");

  stream.pipe(parser).on("data", (data) => {
    productList.push(data);
  });

  stream.on("end", () => {
    console.log("Data stream ended");
    zlib.gzip(JSON.stringify(productList), (err, compressedData) => {
      if (err) {
        console.log("Error while compressing JSON data: ", err);
        res.status(500).json("Internal Server Error");
      }
      if (!err) {
        const base64EncodedData = base64.fromByteArray(compressedData);
        res.send(base64EncodedData);
      }
    });
    res.end();
  });
});

app.get("/api/product-list/download", (req, res, next) => {
  const readStream = fs.createReadStream("productList.json", "utf-8");

  readStream.on("data", (chunk) => {
    res.write(chunk);
  });

  readStream.on("end", () => {
    res.end();
  });
});

app.get("/api/product-list/download/compressed", (req, res, next) => {
  const readStream = fs.createReadStream("productList.json", "utf-8");
  const gzipStream = zlib.createGzip();

  //   //   res.setHeader("Content-Encoding", "gzip");
  //   res.setHeader("Content-Type", "application/octet-stream");
  readStream.pipe(gzipStream).pipe(res);
});

app.listen(8000, () => {
  console.log(`Server is running at port 8000 ...`);
});
