#! /usr/bin/env node
import process from 'process';
import http from 'http';
import { createInterface } from 'readline';
import { stdin as input, stdout as output } from 'process';

import argsExtractor from './utils/args_extractor';
import { fReadFile, fWriteFile } from './utils/file';
import { SAMPLE_STORE } from './utils/fake_data';
import listener from './listener';

const rl = createInterface({ input, output });

// should use global objects to store options ?
async function main() {
  const [, , ...args] = process.argv;
  const { port, jsonPath, isStrict, readonly, persist } = argsExtractor(args);

  const jsonData = await fReadFile(jsonPath);
  const server = http.createServer(
    listener({
      dataSrc: jsonData ?? SAMPLE_STORE,
      jsonPath,
      isStrict,
      readonly,
      persist,
    })
  );

  if (!jsonData) {
    console.info('Invalid path file or file does not exist!');
    // cant use promise-based api because node16, readline promise is in node17
    rl.question('Do you want to create a sample data.json file (y/n) ?', async (answer: string) => {
      if (answer.trim().toLowerCase() === 'y') {
        rl.close();
        await fWriteFile('data.json', SAMPLE_STORE);

        server.listen(port, () => {
          console.info(`Serving ${jsonPath} on port ${port}`);
        });
      } else {
        console.info(
          '\x1b[33mPlease specify a valid path to your json file and start again. \x1b[0m'
        );
        process.exit();
      }
    });
  } else {
    server.listen(port, () => {
      console.info(`Serving ${jsonPath} on port ${port}`);
    });
  }
}

main();
