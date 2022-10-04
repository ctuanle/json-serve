#! /usr/bin/env node
import process from 'process';
import http from 'http';

import argsExtractor from './utils/args_extractor';
import { fReadFile, fWriteFile } from './utils/file';
import { USER_PLANET } from './utils/fake_data';
import listener from './listener';

async function main() {
  const [, , ...args] = process.argv;
  console.log(args);
  const { port, jsonPath, isNoStrict } = argsExtractor(args);

  const jsonData = await fReadFile(jsonPath);

  if (!jsonData) {
    console.log('Invalid path file or file does not exist!');
    // console.log('Do you want to create a sample data.json file ?');
    await fWriteFile('data.json', USER_PLANET);
  }
  const server = http.createServer(
    listener({
      dataSrc: jsonData ?? USER_PLANET,
      jsonPath,
      isNoStrict,
    })
  );

  server.listen(port, () => {
    console.log(`Serving ${jsonPath} on port ${port}`);
  });
}

main();
