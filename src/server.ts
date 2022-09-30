import http from 'http';

import { readFile } from './utils/_fs';
import listener from './listener';

export interface IServerParams {
  port: number;
  jsonPath: string;
  isNoStrict: boolean;
}

export default function startServer({ port, jsonPath, isNoStrict }: IServerParams) {
  const dataJson = readFile(jsonPath);
  const server = http.createServer(listener({ dataSrc: dataJson, jsonPath, isNoStrict }));

  server.listen(port, () => {
    console.log(`Serving ${jsonPath} on port ${port}`);
  });
}
