#! /usr/bin/env node
import process from 'process';
import { checkFileExistence } from './utils/_fs';
import startServer from './server';
import argsExtractor from './utils/args_extractor';

function main() {
  const [, , ...args] = process.argv;
  console.log(args);
  const { port, jsonPath, isNoStrict } = argsExtractor(args);

  if (!checkFileExistence(jsonPath)) {
    console.log('Invalid path file or file doest not exist!');
    process.exit();
  }
  startServer({ port, jsonPath, isNoStrict });
}

main();
