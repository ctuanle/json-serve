import { IncomingMessage, ServerResponse } from 'http';
import sender from '../utils/sender';
import { HTTP_CODE } from '../utils/http_code';
import { fWriteFile } from '../utils/file';

export default async function deleteReqHandler(
  req: IncomingMessage,
  res: ServerResponse,
  dataSrc: { [key: string]: any },
  jsonPath: string
) {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`);

  const keys = url.pathname.split('/').slice(1);

  if (keys.length === 0) {
    return sender(
      res,
      {
        error:
          'You are try to delete all your data. If this is what you wanted, please do it manually.',
      },
      HTTP_CODE.BadRequest
    );
  }

  if (keys.length > 0 && keys.at(-1) === '') {
    keys.pop();
  }

  let pointer = dataSrc;
  const keyToDel = keys.at(-1) ?? '';

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (Array.isArray(pointer)) {
      const expectedIndex = Number(key);

      if (expectedIndex && pointer[expectedIndex]) {
        pointer = pointer[expectedIndex];
      } else {
        return sender(res, { error: 'Invalid path.' }, HTTP_CODE.NotFound);
      }
    } else if (typeof pointer === 'object') {
      if (key in pointer) {
        pointer = pointer[key];
      } else {
        return sender(res, { error: 'No resources matched given path.' }, HTTP_CODE.NotFound);
      }
    } else {
      return sender(res, { error: 'Invalid path!' }, HTTP_CODE.NotFound);
    }
  }

  if (!(keyToDel in pointer)) {
    return sender(res, { error: 'Invalid path.' }, HTTP_CODE.NotFound);
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
        HTTP_CODE.NotFound
      );
    }
  } else {
    delete pointer[keyToDel];
  }

  try {
    await fWriteFile(jsonPath, dataSrc);
  } catch (e) {
    return sender(
      res,
      {
        error: 'Could not persist. Something went wrong!',
      },
      HTTP_CODE.InternalServerError
    );
  }

  // send filtered data
  return sender(
    res,
    {
      path: url.pathname,
      message: 'Resources deleted.',
    },
    HTTP_CODE.NoContent
  );
}
