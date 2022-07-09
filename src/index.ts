import express, { Application, Request, Response } from 'express';
import fs from 'fs';

// import * as reader from './reader';

const app: Application = express();
const datafile = fs.readFileSync('./data.json', 'utf-8');
const dataJson = JSON.parse(datafile);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome',
    data: dataJson,
  });
});

function main() {
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
}

main();
