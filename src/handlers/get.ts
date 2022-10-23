import { IncomingMessage, ServerResponse } from 'http';

import sender from '../utils/sender';
import { HTTP_CODE } from '../utils/http_code';

export default function getReqHandler(
  req: IncomingMessage,
  res: ServerResponse,
  dataSrc: { [key: string]: any }
) {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`);

  // /abc/data/ => keys ["abc", "data"]
  const keys = url.pathname.split('/').slice(1);
  if (keys.length > 0 && keys.at(-1) === '') {
    keys.pop();
  }
  let pointer = dataSrc;

  // pointer to target key
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (Array.isArray(pointer)) {
      const expectedIndex = Number(key);

      if ((expectedIndex || expectedIndex === 0) && pointer[expectedIndex]) {
        pointer = pointer[expectedIndex];
      } else {
        return sender(res, req, { error: 'Invalid path.' }, HTTP_CODE.NotFound);
      }
    } else if (typeof pointer === 'object') {
      if (key in pointer) {
        pointer = pointer[key];
      } else {
        return sender(res, req, { error: 'No resources matched given path.' }, HTTP_CODE.NotFound);
      }
    } else {
      return sender(res, req, { error: 'Invalid path!' }, HTTP_CODE.NotFound);
    }
  }

  const queryFields = Array.from(url.searchParams.keys());
  // process search query if there is
  if (queryFields.length > 0) {
    if (Array.isArray(pointer)) {
      // filtering
      pointer = pointer.filter((item) => {
        if (!item) return false;
        return queryFields.every((field) => {
          return (
            item[field] === url.searchParams.get(field) ||
            item[field] === Number(url.searchParams.get(field))
          );
        });
      });
    } else if (typeof pointer === 'object') {
      const filtered: { [key: string]: any } = {};

      Object.keys(pointer).forEach((k) => {
        const good = queryFields.every((field) => {
          if (
            !pointer[k] ||
            !pointer[k][field] ||
            (pointer[k][field] !== url.searchParams.get(field) &&
              Number(pointer[k][field]) !== Number(url.searchParams.get(field)))
          )
            return false;
          return true;
        });
        if (good) filtered[k] = pointer[k];
      });

      pointer = filtered;
    } else {
      return sender(
        res,
        req,
        {
          message: 'Query is not supported for this type of resources.',
        },
        HTTP_CODE.NotFound
      );
    }
  }
  // send filtered data
  return sender(res, req, {
    path: url.pathname,
    data: pointer,
  });
}
