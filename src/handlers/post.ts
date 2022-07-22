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
      if (chunks.length === 0) {
        return sender(res, { error: 'No body provided!' });
      }
      // eslint-disable-next-line no-undef
      const bodyData = JSON.parse(Buffer.concat(chunks).toString());

      const key = url.pathname.split('/')[1];

      if (!(key in dataSrc)) {
        return sender(res, {
          error: 'No matching resources with provided path.',
        });
      }

      if (Array.isArray(dataSrc[key])) {
        dataSrc[key].push(bodyData);
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
      });
    });
}
