import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { fixtures } from "../nodifrec";

export default function (config){
  const server =  express();

  server.use("/fixtures/:name", function (req, res) {
    var fixture = fixtures.get(req.params.name),
        markup = renderToString(fixture.render());

    res.status(200).send(`
      <html>
        <head>

        </head>
          ${markup}
        </body>
      </html>`
    );
  });

  server.listen(config.port);

}
