import { ServerResponse } from 'http';

export default function sender(res: ServerResponse, data: any, code?: number) {
  res.writeHead(code ?? 200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(data, null, 2));
}
