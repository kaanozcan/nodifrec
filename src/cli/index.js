import cli from "commander";
import casper from "casper";

import packageJson from "./package.json";
import defaultConfig from "../constants/defaultConfig";
import server from "../server";

function getConfig(userConfigPath) {
  const userConfig = require(userConfigPath);

  return Object.assign({}, defaultConfig, userConfig);
}

function init() {
  const config = getConfig("./defaultConfig.json", "../../nodifrec.config");

  return startServer(config);
}

function startServer(config) {
  return new Promise((resolve, reject) => {
    const session = casper.start(`http://localhost:${defaultConfig.port}`, function (){
      if(this.status().currentHTTPStatus == 200){
        resolve(this);
      } else {
        server(config);
        startServer().then((casper) => {
          resolve(casper);
        });
      }
    });
  });
}

cli
  .version(packageJson.version);

cli
  .command("reference")
  .description("takes reference of each fixture to be differentiated later")
  .action(() => {
    init().then(() => {
      console.log("site is up");
    });
  });

cli
  .command("test")
  .description("differentiates reference images")
  .action(() => {
    init().then(() => {
      console.log("site is up");
    });
  });
