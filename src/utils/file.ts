// file on disk related tasks
import { readFile, writeFile } from 'fs/promises';
import { exit } from 'process';

/**
 * Read a file
 * @param path (string): file path to read
 * @returns json object on fulfilled
 */
export async function fReadFile(path: string): Promise<JSON | undefined> {
  try {
    const dataString = await readFile(path, 'utf-8');
    return JSON.parse(dataString);
  } catch (e: any) {
    const message = e.message as string;
    if (message.includes('no such file or directory')) return undefined;
    console.error(e);
    exit();
  }
}

/**
 * Write data to a file, replace all its content if exists
 * @param path file path to write
 * @param data json data to write
 */
export async function fWriteFile(path: string, data: any) {
  await writeFile(path, JSON.stringify(data, null, 2));
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export async function fWatchFile(path: string) {
  throw new Error('Not Implementation');
}
