import { IncomingMessage, ServerResponse } from 'http';
import sender from '../utils/sender';

export default function getReqHandler(
  req: IncomingMessage,
  res: ServerResponse,
  dataSrc: { [key: string]: any }
) {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`);

  const paths = url.pathname.split('/').slice(1);
  if (paths.length > 0 && paths.at(-1) === '') {
    paths.pop();
  }
  let pointer = dataSrc;

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];

    if (Array.isArray(pointer)) {
      return sender(res, { error: 'Invalid path.' }, 400);
    } else if (typeof pointer === 'object') {
      if (path in pointer) {
        pointer = pointer[path];
      } else {
        return sender(res, { error: 'No resources matched given path.' }, 400);
      }
    } else {
      return sender(res, { error: 'Invalid path!' }, 400);
    }
  }

  const queryFields = Array.from(url.searchParams.keys());
  // process search query if there is
  if (queryFields.length > 0) {
    if (Array.isArray(pointer)) {
      // filtering
      pointer = pointer.filter((item) => {
        let answer = true;
        for (const field of queryFields) {
          if (String(item[field]) !== url.searchParams.get(field)) {
            answer = false;
            break;
          }
          return answer;
        }
      });
    } else {
      return sender(
        res,
        {
          message: 'Query is not supported for this type of resources.',
        },
        400
      );
    }
  }
  // send filtered data
  return sender(res, {
    path: url.pathname,
    data: pointer,
  });
}
