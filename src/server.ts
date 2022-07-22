import http from 'http';
// import fs from 'fs';

import { readFile } from './utils/_fs';
import listener from './listener';

export default function startServer(port: number, jsonPath: string) {
  const dataJson = readFile(jsonPath);
  const server = http.createServer(listener(dataJson, jsonPath));

  server.listen(port, () => {
    console.log(`Serving ${jsonPath} on port ${port}`);
  });
}
