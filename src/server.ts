import http from 'http';
import fs from 'fs';

import listener from './listener';

export default function startServer(port: number, jsonPath: string) {
  const dataFile = fs.readFileSync(jsonPath, 'utf-8');
  const dataJson = JSON.parse(dataFile);

  const server = http.createServer(listener(dataJson));

  server.listen(port, () => {
    console.log(`Serving ${jsonPath} on port ${port}`);
  });
}
