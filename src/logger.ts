const COLOR = {
  reset: '\x1b[0m',
  green: '\x1b[32m', // GET
  cyan: '\x1b[36m', // POST
  blue: '\x1b[34m', // PUT
  red: '\x1b[31m', // DELETE
  yellow: '\x1b[33m', // OPTIONS (default)
};

export default function logger(method: string, url: string) {
  switch (method) {
    case 'GET':
      console.log(`${COLOR.green}%s${COLOR.reset}`, method, url);
      break;
    case 'POST':
      console.log(`${COLOR.cyan}%s${COLOR.reset}`, method, url);
      break;
    case 'PUT':
      console.log(`${COLOR.blue}%s${COLOR.reset}`, method, url);
      break;
    case 'DELETE':
      console.log(`${COLOR.red}%s${COLOR.reset}`, method, url);
      break;
    default:
      console.log(`${COLOR.yellow}%s${COLOR.reset}`, method, url);
      break;
  }
}
