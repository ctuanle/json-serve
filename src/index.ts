#! /usr/bin/env node
import process from 'process';
import { checkFileExistence, createFile } from './utils/_fs';
import startServer from './server';
import argsExtractor from './utils/args_extractor';

async function main() {
  const [, , ...args] = process.argv;
  console.log(args);
  const { port, jsonPath, isNoStrict } = argsExtractor(args);

  if (!checkFileExistence(jsonPath)) {
    console.log('Invalid path file or file doest not exist!');
    // console.log('Do you want to create a sample data.json file ?');
    await createFile();
    // process.exit();
    console.info('after write');
  }
  startServer({ port, jsonPath, isNoStrict });
}

main();
