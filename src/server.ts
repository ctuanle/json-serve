import http from 'http';
import fs from 'fs';

import logger from './logger';

export default function startServer(port: number, jsonPath: string) {
  const dataFile = fs.readFileSync(jsonPath, 'utf-8');
  const dataJson = JSON.parse(dataFile);

  const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    const url = req.url ?? '';
    const method = req.method ?? '';
    logger(method, url);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (method === 'GET') {
      if (url === '/') {
        // use return to make sure no further code will be executed
        return res.end(JSON.stringify(dataJson, null, 2));
      }

      if (url.split('/')[1] in dataJson) {
        const key = url.split('/')[1];
        const data: { [key: string]: any } = {};
        data[key] = dataJson[key];
        return res.end(JSON.stringify(data, null, 2));
      }

      return res.end(
        JSON.stringify(
          {
            message: 'No matching data',
          },
          null,
          2
        )
      );
    }
  });

  server.listen(port, () => {
    console.log(`Serving ${jsonPath} on port ${port}`);
  });
}
