#! /usr/bin/env node
import process from 'process';
import { checkFileExistence } from './utils/_fs';
import startServer from './server';

const [, , ...args] = process.argv;

const jsonPath = args[0] || 'data.json';
const port = Number(args[1]) || 3000;
const isNoStrict = args.includes('--no-strict');

console.log(args);

function main() {
  if (!checkFileExistence(jsonPath)) {
    console.log('Invalid path file!');
    process.exit();
  }
  startServer({ port, jsonPath, isNoStrict });
}

main();
