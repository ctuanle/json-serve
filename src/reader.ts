import fs from 'fs';

export function readFile(path: string) {
  const dataFile = fs.readFileSync(path, 'utf-8');
  return JSON.parse(dataFile);
}

export function writeFile(path: string, jsonData: JSON) {
  const jsonStringToWrite = JSON.stringify(jsonData, null, 2);
  let hasError = false;
  fs.writeFile(path, jsonStringToWrite, (err) => {
    if (err) {
      hasError = true;
      console.log(err);
    }
  });

  return hasError;
}
