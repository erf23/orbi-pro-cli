#!/usr/bin/env node

const commandLine = require("./src/command-line.mjs");
const process = require("process");

commandLine().then((result) => {
  process.exit(result.code);
}).catch((result) => {
  process.exit(result.code);
});