import { IncomingMessage, ServerResponse } from 'http';
import { writeFile } from '../utils/_fs';
import sender from '../utils/sender';

export default function deleteReqHandler(
  req: IncomingMessage,
  res: ServerResponse,
  dataSrc: { [key: string]: any },
  jsonPath: string
) {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`);

  const paths = url.pathname.split('/').slice(1);

  if (paths.length === 0) {
    return sender(
      res,
      {
        error:
          'You are try to delete all your data. If this is what you wanted, please do it manually.',
      },
      404
    );
  }

  if (paths.length > 0 && paths.at(-1) === '') {
    paths.pop();
  }

  let pointer = dataSrc;
  const keyToDel = paths.at(-1) ?? '';

  for (let i = 0; i < paths.length - 1; i++) {
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

  if (!(keyToDel in pointer)) {
    return sender(res, { error: 'Invalid path.' }, 400);
  }

  const queryFields = Array.from(url.searchParams.keys());
  // process search query if there is
  if (queryFields.length > 0) {
    if (Array.isArray(pointer[keyToDel])) {
      // filtering
      pointer[keyToDel] = pointer[keyToDel].filter((item: any) => {
        let toDelete = true;
        for (const field of queryFields) {
          if (String(item[field]) === url.searchParams.get(field)) {
            toDelete &&= false;
          } else {
            toDelete &&= true;
            break;
          }
        }
        return toDelete;
      });
    } else {
      return sender(
        res,
        {
          message: 'Delete with query is only supported with array data.',
        },
        400
      );
    }
  } else {
    delete pointer[keyToDel];
  }

  const hasError = writeFile(jsonPath, dataSrc as JSON);
  if (hasError) {
    return sender(
      res,
      {
        error: 'Could not persist. Something went wrong!',
      },
      400
    );
  }

  // send filtered data
  return sender(res, {
    path: url.pathname,
    message: 'Resources deleted.',
  });
}
