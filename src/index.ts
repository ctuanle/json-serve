#! /usr/bin/env node
import startServer from './server';

/* global process */

const [, , ...args] = process.argv;

const jsonPath = args[0] || 'data.json';
const port = Number(args[1]) || 3000;
console.log(args);

function main() {
  startServer(port, jsonPath);
}

main();
