#! /usr/bin/env node
import process from 'process';
import http from 'http';

import argsExtractor from './utils/args_extractor';
import { fReadFile, fWriteFile } from './utils/file';
import { SAMPLE_STORE } from './utils/fake_data';
import listener from './listener';

// should use global objects to store options ?
async function main() {
  const [, , ...args] = process.argv;
  console.log(args);
  const { port, jsonPath, isStrict, readonly, persist } = argsExtractor(args);

  const jsonData = await fReadFile(jsonPath);

  if (!jsonData) {
    console.log('Invalid path file or file does not exist!');
    // console.log('Do you want to create a sample data.json file ?');
    await fWriteFile('data.json', SAMPLE_STORE);
  }
  const server = http.createServer(
    listener({
      dataSrc: jsonData ?? SAMPLE_STORE,
      jsonPath,
      isStrict,
      readonly,
      persist,
    })
  );

  server.listen(port, () => {
    console.info(`Serving ${jsonPath} on port ${port}`);
  });
}

main();
