const commandLine = require("../src/command-line.mjs");
const chai = require("chai");
const expect = chai.expect;
const express = require("express");
const basicAuth = require("express-basic-auth");

/////////////
// helpers //
/////////////

describe("CommandLine", () => {
  let fakeServer;
  let thisPackageDir = `${__dirname}/..`;
  let fakeStdErr;
  let fakeStdOut;
  
  class FakeServer {
    constructor() {
      this.status = "unstarted";
      this.password = "thePassword";
      this.devices = FakeServer.defaultDevices;
      this.basicHomeResult = FakeServer.defaultBasicHomeResult;
    }
    
    start() {
      return new Promise((resolve, reject) => {
        if(this.status != "unstarted") {
          return reject({});
        }
        this.status = "starting";
        this.app = express();
        this.app.use(basicAuth({
          users: {"admin": this.password}
        }));
        
        this.server = this.app.listen(0, (error) => {
          if(error) {
            return reject(error);
          }
          this.port = this.server.address().port;
          this.url = `http://127.0.0.1:${this.port}`;
          
          this.status = "running";
          resolve();
        });
        
        this.app.get("/change_user.html", (request, response) => this.httpGetChangeUser(request, response));
        this.app.get("/LOG_logout.htm", (request, response) => this.httpGetLogout(request, response));
        this.app.get("/DEV_device_info.htm", (request, response) => this.httpGetDeviceInfo(request, response));
        this.app.get("/basic_home_result.txt", (request, response) => this.httpGetBasicHomeResult(request, response));
      });
    }
    
    stop() {
      return new Promise((resolve, reject) => {
        if(this.status != "running") {
          return reject({});
        }
        this.status = "stopping";
        this.server.close((error) => {
          if(error) {
            return reject(error);
          }
          
          this.status = "stopped";
          resolve();
        });
      });
    }
    
    httpGetDeviceInfo(request, response) {
      response.send(`
device_changed=1
device=${JSON.stringify(this.devices)}
      `.trim());
    }
    
    httpGetBasicHomeResult(request, response) {
      response.send(`${this.basicHomeResult.status};${this.basicHomeResult.connectedSatellites};${this.basicHomeResult.connectedDevices};0;0;0;0;`);
    }
    
    httpGetLogout(request, response) {
      response.send("");
    }
    
    httpGetChangeUser(request, response) {
      response.send("");
    }
    
    static get defaultDevices() {
      return [{
        "ip": "10.0.0.34",
        "mac": "00:01:2E:2F:7C:01",
        "contype": "wired",
        "attachtype": "1",
        "devtype": "24",
        "model": "PC Partner Ltd.",
        "name": "marble",
        "accsta": "0",
        "conn_orbi_name": "io",
        "conn_orbi_mac": "8C:3B:AD:C8:96:2A",
        "backhaul_sta": "Good",
        "ledstate": "0",
        "led_func": "0",
        "sync_btn": "0",
        "uprate": "0.00",
        "downrate": "0.00",
        "voice_orbi": "0",
        "voice_lwauserid": "",
        "ceiling_power": "not support",
        "module_name": ""
      }, {
        "ip": "10.0.0.70",
        "mac": "6C:56:97:E4:15:DB",
        "contype": "5G Wireless1",
        "attachtype": "0",
        "devtype": "25",
        "model": "Echo",
        "name": "living-room-echo",
        "accsta": "0",
        "conn_orbi_name": "Orbi Pro Router",
        "conn_orbi_mac": "8C:3B:AD:0E:8D:A0",
        "backhaul_sta": "Good",
        "ledstate": "0",
        "led_func": "0",
        "sync_btn": "0",
        "uprate": "0.00",
        "downrate": "0.00",
        "voice_orbi": "0",
        "voice_lwauserid": "",
        "ceiling_power": "not support",
        "module_name": ""
      }];
    }
    
    static get defaultBasicHomeResult() {
      return {
        status: "success",
        connectedSatellites: 3,
        connectedDevices: 16
      };
    }
  }
  
  ///////////
  // setup //
  ///////////
  
  beforeEach(() => {
    fakeStdErr = [];
    fakeStdOut = [];
    fakeServer = new FakeServer();
    return fakeServer.start();
  });
  
  //////////////
  // teardown //
  //////////////
  
  afterEach(() => {
    return fakeServer.stop();
  });
  
  ////////////
  // status //
  ////////////
  
  function orbiProCli(args) {
    return commandLine({
      argv: args,
      console: {
        log: (s) => {
          console.log(s);
          fakeStdOut.push(s);
        },
        error: (s) => {
          console.error(s);
          fakeStdErr.push(s);
        }
      }
    });
  }
  
  describe("status", () => {
    
    it("happy path", () => {
      return orbiProCli(`--url="${fakeServer.url}" --password="${fakeServer.password}" status`
      ).then((result) => {
        expect(fakeStdOut.join("\n").trim()).to.equal(fakeServer.basicHomeResult.status);
        expect(result.code).to.equal(0);
      }).catch((error) => {
        expect.fail();
      });
    });
    
    it("failure", () => {
      return orbiProCli(`--url="${fakeServer.url}" --password="badPassword" status`
      ).then((result) => {
        expect.fail();
      }).catch((error) => {
        expect(error.code).to.not.equal(0);
      });
    });
    
  });
  
  /////////////
  // devices //
  /////////////
  
  describe("devices", () => {
    
    it("happy path", () => {
      return orbiProCli(`--url="${fakeServer.url}" --password="${fakeServer.password}" devices`
      ).then((result) => {
        const json = JSON.parse(fakeStdOut.join("\n"));
        expect(json).to.deep.equal(fakeServer.devices);
        expect(result.code).to.equal(0);
      }).catch((error) => {
        expect.fail();
      });
    });
    
    it("failure", () => {
      return orbiProCli(`--url="${fakeServer.url}" --password="badPassword" devices`
      ).then((result) => {
        expect.fail();
      }).catch((error) => {
        expect(error.code).to.not.equal(0);
      });
    });
    
  });
  
});
