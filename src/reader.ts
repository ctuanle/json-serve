import fs from 'fs';

export const checkFileExistence = (path: string) => {
  try {
    if (fs.existsSync(path)) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

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
