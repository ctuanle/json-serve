import { IncomingMessage, ServerResponse } from 'http';
import sender from '../utils/sender';
import { HTTP_CODE } from '../utils/http_code';
import { fWriteFile } from '../utils/file';

export default function putReqHandler(
  req: IncomingMessage,
  res: ServerResponse,
  dataSrc: { [key: string]: any },
  jsonPath: string
) {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`);
  const chunks: any = [];

  // path check
  const keys = url.pathname.split('/').slice(1);
  if (keys.length > 0 && keys.at(-1) === '') {
    keys.pop();
  }
  let pointer = dataSrc;
  const keyToUpdate = keys.at(-1) ?? '';

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (Array.isArray(pointer)) {
      const expectedIndex = Number(key);

      if ((expectedIndex || expectedIndex === 0) && pointer[expectedIndex]) {
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

  if (typeof pointer !== 'object') {
    return sender(
      res,
      { error: 'Cannot post to this resources (given path).' },
      HTTP_CODE.NotFound
    );
  }

  req
    .on('error', (err) => console.log(err))
    .on('data', (chunk) => {
      chunks.push(chunk);
    })
    .on('end', async () => {
      if (chunks.length === 0) {
        return sender(res, { error: 'No body provided!' }, HTTP_CODE.BadRequest);
      }
      // eslint-disable-next-line no-undef
      const bodyData = JSON.parse(Buffer.concat(chunks).toString());
      pointer[keyToUpdate] = bodyData;

      // for (let key of Object.keys(pointer)) delete pointer[key];
      // for (let key of Object.keys(bodyData)) {
      //   pointer[key] = bodyData[key];
      // }

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

      return sender(
        res,
        {
          message: 'Persist data successfully.',
          path: url.pathname,
        },
        HTTP_CODE.NoContent
      );
    });
}
