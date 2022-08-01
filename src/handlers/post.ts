import { IncomingMessage, ServerResponse } from 'http';
import { writeFile } from '../utils/_fs';
import sender from '../utils/sender';

export default function postReqHandler(
  req: IncomingMessage,
  res: ServerResponse,
  dataSrc: { [key: string]: any },
  jsonPath: string
) {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`);
  const chunks: any = [];

  req
    .on('error', (err) => console.log(err))
    .on('data', (chunk) => {
      chunks.push(chunk);
    })
    .on('end', () => {
      // path check
      const paths = url.pathname.split('/').slice(1);
      if (paths.length > 0 && paths.at(-1) === '') {
        paths.pop();
      }
      let pointer = dataSrc;
      let newEndPath = '';

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];

        if (Array.isArray(pointer)) {
          return sender(res, { error: 'Invalid path.' }, 404);
        } else if (typeof pointer === 'object') {
          if (path in pointer) {
            pointer = pointer[path];
          } else if (!(path in pointer) && i === paths.length - 1) {
            newEndPath = path;
            break;
          } else {
            return sender(res, { error: 'Invalid path!' }, 404);
          }
        } else {
          return sender(res, { error: 'Invalid path!' }, 404);
        }
      }

      if (typeof pointer !== 'object') {
        return sender(res, { error: 'Cannot post to this resources (given path).' }, 400);
      }

      if (chunks.length === 0) {
        return sender(res, { error: 'No body provided!' });
      }
      // eslint-disable-next-line no-undef
      const bodyData = JSON.parse(Buffer.concat(chunks).toString());

      if (newEndPath) {
        pointer[newEndPath] = [bodyData];
      } else if (Array.isArray(pointer)) {
        pointer.push(bodyData);
      } else {
        for (let key of Object.keys(bodyData)) {
          pointer[key] = bodyData[key];
        }
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

      return sender(res, {
        message: 'Persist data successfully.',
        path: url.pathname,
      });
    });
}
