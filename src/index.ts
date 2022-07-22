#! /usr/bin/env node
import { checkFileExistence } from './utils/_fs';
import startServer from './server';

/* global process */

const [, , ...args] = process.argv;

const jsonPath = args[0] || 'data.json';

const port = Number(args[1]) || 3000;
console.log(args);

function main() {
  if (!checkFileExistence(jsonPath)) {
    console.log('Invalid path file!');
    process.exit();
  }
  startServer(port, jsonPath);
}

main();
