const COLOR = {
  reset: '\x1b[0m',
  green: '\x1b[32m', // GET
  cyan: '\x1b[36m', // POST
  blue: '\x1b[34m', // PUT
  red: '\x1b[31m', // DELETE
  yellow: '\x1b[33m', // OPTIONS (default)
};

const statusCodeColor = (code: number) => {
  switch (code) {
    case 200:
    case 201:
    case 202:
    case 204:
      return COLOR.green;

    default:
      return COLOR.red;
  }
};

export default function logger(method: string, code: number, url: string) {
  switch (method) {
    case 'GET':
      console.info(`${COLOR.green}%s ${statusCodeColor(code)}%s${COLOR.reset}`, method, code, url);
      break;
    case 'POST':
      console.info(`${COLOR.cyan}%s ${statusCodeColor(code)}%s${COLOR.reset}`, method, code, url);
      break;
    case 'PUT':
      console.info(`${COLOR.blue}%s ${statusCodeColor(code)}%s${COLOR.reset}`, method, code, url);
      break;
    case 'DELETE':
      console.info(`${COLOR.red}%s ${statusCodeColor(code)}%s${COLOR.reset}`, method, code, url);
      break;
    default:
      console.info(`${COLOR.yellow}%s ${statusCodeColor(code)}%s${COLOR.reset}`, method, code, url);
      break;
  }
}
