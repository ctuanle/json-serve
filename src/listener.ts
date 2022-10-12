import { IncomingMessage, ServerResponse } from 'http';

import getReqHandler from './handlers/get';
import postReqHandler from './handlers/post';
import deleteReqHandler from './handlers/delete';
import putReqHandler from './handlers/put';

export interface IListenerParams {
  dataSrc: { [key: string]: any };
  jsonPath: string;
  isNoStrict: boolean;
}

// function that return a request listener function
export default function ({ dataSrc, jsonPath, isNoStrict }: IListenerParams) {
  console.info(isNoStrict);
  return function (req: IncomingMessage, res: ServerResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400'); // one-day

    const method = req.method ?? '';

    if (method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    } else if (method === 'GET') {
      return getReqHandler(req, res, dataSrc);
    } else if (method === 'POST') {
      return postReqHandler(req, res, dataSrc, jsonPath);
    } else if (method === 'DELETE') {
      return deleteReqHandler(req, res, dataSrc, jsonPath);
    } else if (method === 'PUT') {
      return putReqHandler(req, res, dataSrc, jsonPath);
    }
  };
}
