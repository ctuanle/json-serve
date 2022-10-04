import fs from 'fs';
import process from 'process';
import { writeFile as fsWriteFile } from 'fs/promises';

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

export async function createFile() {
  const sampleData = {
    users: {
      1: {
        username: 'bob',
        age: 8,
        from: 'Earth',
      },
      2: {
        username: 'alice',
        age: 999,
        from: 'Moon',
      },
      3: {
        username: 'lucy',
        age: 101,
        from: 'Mars',
      },
    },
    planets: {
      1: 'Mercury',
      2: 'Venus',
      3: 'Earth',
      4: 'Mars',
      5: 'Jupiter',
      6: 'Saturn',
      7: 'Uranus',
      8: 'Neptune',
      9: 'Pluto',
      10: 'Centaurs',
    },
  };

  try {
    await fsWriteFile('data.json', JSON.stringify(sampleData, null, 2));
  } catch (e: any) {
    console.error(e.message);
    process.exit();
  }
}
