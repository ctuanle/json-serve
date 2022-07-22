import { IncomingMessage, ServerResponse } from 'http';
import logger from './utils/logger';
import getReqHandler from './handlers/get';
import postReqHandler from './handlers/post';

// function that return a request listener function
export default function (dataSrc: { [key: string]: any }, jsonPath: string) {
  return function (req: IncomingMessage, res: ServerResponse) {
    const method = req.method ?? '';
    logger(method, req.url ?? '');

    if (method === 'GET') {
      return getReqHandler(req, res, dataSrc);
    } else if (method === 'POST') {
      return postReqHandler(req, res, dataSrc, jsonPath);
    }
  };
}
