import { IncomingMessage, ServerResponse } from 'http';
import logger from './utils/logger';
import getReqHandler from './handlers/get';
import postReqHandler from './handlers/post';

// function that return a request listener function
export default function (dataSrc: { [key: string]: any }, jsonPath: string) {
  return function (req: IncomingMessage, res: ServerResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');

    const method = req.method ?? '';
    logger(method, req.url ?? '');

    if (method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    } else if (method === 'GET') {
      return getReqHandler(req, res, dataSrc);
    } else if (method === 'POST') {
      return postReqHandler(req, res, dataSrc, jsonPath);
    }
  };
}
