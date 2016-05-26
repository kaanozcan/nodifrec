#!/usr/bin/env node
import phantom from "phantom";
import cmd from "commander";
import glob from "glob";
import packageJson from "../../package.json";
import defaultConfig from "../constants/defaultConfig";
import createServer from "../server";
import { fixtures } from "../nodifrec";

const userConfig = require("../../../../nodifrec.config.js"),
      config = Object.assign({}, defaultConfig, userConfig),
      server = createServer(config);

function executeFixtures(){
  return new Promise(function (resolve) {
    glob(process.cwd() + config.src, function (err, paths) {
      if (!err) {
        paths.forEach(function (path) {
          require("../../../../" + config.requireHook);
          require(path);
        });

        resolve();
      }
    });
  });
}

function createPhantom() {
  return phantom.create().then(function (instance) {
    return instance.createPage().then((page) => Promise.resolve({instance, page}));
  });
}

function openFixturePages(){
  return executeFixtures()
    .then(() => createPhantom())
    .then(({instance, page}) => {
      const pages = Array.from(fixtures.values()).map(fixture => {
        const url = `http://localhost:${config.port}/fixtures/${fixture.name}`;
        return page.open(url).then((status) => Promise.resolve({page, instance, status, fixture}));
      });

      return Promise.all(pages);
    });
}

cmd
  .version(packageJson.version);

cmd
  .command("reference")
  .description("takes reference of each fixture to be differentiated later")
  .action(function () {
    console.log("Saving reference images.");

    openFixturePages()
      .then(function (values) {
        values.forEach(({instance, page, status, fixture}) => {
          const path = `${process.cwd()}/nodifrec-data/reference/${fixture.name}.png`;
          page.render(path);
          console.log(`${path}: ${status}`);
        });
      });
});

cmd
  .command("test")
  .description("differentiates reference images")
  .action(function () {
    console.log("Saving test images.");

    openFixturePages()
      .then(function (values) {
        values.forEach(({instance, page, status, fixture}) => {
          const path = `${process.cwd()}/nodifrec-data/test/${fixture.name}.png`;
          page.render(path);
          console.log(`${path}: ${status}`);
        });
      });
});

cmd.parse(process.argv);
