import { IncomingMessage, ServerResponse } from 'http';
import sender from '../utils/sender';

export default function getReqHandler(
  req: IncomingMessage,
  res: ServerResponse,
  dataSrc: { [key: string]: any }
) {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`);

  if (url.pathname === '/') {
    // use return to make sure no further code will be executed
    return sender(res, dataSrc);
  }

  const resourcesKeys = url.pathname.split('/').slice(1);

  if (resourcesKeys[0] in dataSrc) {
    let resData = dataSrc[resourcesKeys[0]];

    const finalKey = resourcesKeys.at(-1) ?? '';

    // get data based on given pathname
    for (let i = 1; i < resourcesKeys.length; i++) {
      const key = resourcesKeys[i];
      if (key in resData) {
        resData = resData[key];
      } else {
        return sender(res, {
          message: 'No matching data for this path',
        });
      }
    }

    const queryFields = Array.from(url.searchParams.keys());
    // process search query if there is
    if (queryFields.length > 0) {
      if (Array.isArray(resData)) {
        // filtering
        resData = resData.filter((item) => {
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
        return sender(res, {
          message: 'Query is not supported for this type of resources.',
        });
      }
    }
    const toSend: { [key: string]: any } = {};
    toSend[finalKey] = resData;
    // send filtered data
    return sender(res, toSend);
  }

  return sender(res, {
    message: 'No matching data',
  });
}
