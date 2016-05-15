import express from "express";

export default function (config){
  const server = express();

  server.use("/", function (req, res){
    req.status(200).send("<h3>I'm up!</h3>");
  });
}
