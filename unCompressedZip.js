const fs = require("node:fs");
const zlib = require("zlib");
const base64 = require("base64-js");

const base64EncodedData = fs.readFileSync("./chunkData.txt", "utf-8");
const base64DecodedData = base64.toByteArray(base64EncodedData);

zlib.gunzip(base64DecodedData, (err, buffer) => {
  if (!err) {
    console.log(JSON.parse(buffer.toString()));
  }
});
