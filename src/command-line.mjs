const OrbiProClient = require("orbi-pro");
const process = require("process");

let theConsole = console;

function commandLine(opt) {
  opt = opt || {};
  let argv = opt.argv;
  let console = opt.console || theConsole;
  
  return new Promise((resolve, reject) => {
    require("yargs").option("url", {
      alias: "baseUrl",
      description: "Orbi Pro host and optional port.",
      type: "string",
      default: "https://routerlogin.net",
      requiresArg: true,
      global: true
    }).option("password", {
      type: "string",
      demandOption: true,
      requiresArg: true,
      global: true
    }).command("status", "show internet connection status", (yargs) => {
    }, (argv) => {
      const client = new OrbiProClient(argv);
      client.refresh().then(() => {
        console.log(client.status);
        resolve({
          code: 0
        });
      }).catch((error) => {
        console.error(JSON.stringify(error, null, 2));
        reject({
          code: 1,
          inner: error
        });
      });
    }).command("devices", "show connected devices", (yargs) => {
    }, (argv) => {
      const client = new OrbiProClient(argv);
      client.refresh().then(() => {
        console.log(JSON.stringify(client.devices, null, 2));
        resolve({
          code: 0
        });
      }).catch((error) => {
        console.error(JSON.stringify(error, null, 2));
        reject({
          code: 2,
          inner: error
        });
      });
    }).parse(argv).argv;
  });
}

module.exports = commandLine;