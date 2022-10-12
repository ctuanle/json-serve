import { IncomingMessage, ServerResponse } from 'http';
import logger from './logger';

export default function sender(
  res: ServerResponse,
  req: IncomingMessage,
  data: any,
  code?: number
) {
  res.writeHead(code ?? 200, { 'Content-Type': 'application/json' });

  const method = req.method ?? '';
  logger(method, code ?? 200, req.url ?? '');

  return res.end(JSON.stringify(data, null, 2));
}
