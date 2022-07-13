import { IncomingMessage, ServerResponse } from 'http';
import logger from './logger';

function sender(res: ServerResponse, data: any) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(data, null, 2));
}

// function that return a request listener function
export default function (dataSrc: { [key: string]: any }) {
  return function (req: IncomingMessage, res: ServerResponse) {
    const url = new URL(req.url ?? '', `http://${req.headers.host}`);
    const method = req.method ?? '';
    logger(method, req.url ?? '');

    if (method === 'GET') {
      if (url.pathname === '/') {
        // use return to make sure no further code will be executed
        return sender(res, dataSrc);
      }

      if (url.pathname.split('/')[1] in dataSrc) {
        const key = url.pathname.split('/')[1];
        const data: { [key: string]: any } = {};

        const queryFields = Array.from(url.searchParams.keys());
        if (queryFields.length > 0) {
          if (Array.isArray(dataSrc[key])) {
            const array: [{ [key: string]: any }] = dataSrc[key];

            // filtering
            data[key] = array.filter((item) => {
              let answer = true;
              for (const field of queryFields) {
                if (String(item[field]) !== url.searchParams.get(field)) {
                  answer = false;
                  break;
                }
                return answer;
              }
            });

            // send filtered data
            return sender(res, data);
          } else {
            return sender(res, {
              message: 'Query is not supported for this type of resources.',
            });
          }
        }

        data[key] = dataSrc[key];

        return sender(res, data);
      }

      return sender(res, {
        message: 'No matching data',
      });
    }
  };
}
