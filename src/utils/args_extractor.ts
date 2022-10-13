import process from 'process';

interface IEntryArgs {
  port: number;
  jsonPath: string;
  isNoStrict: boolean;
  readonly: boolean;
}

export default function (args: string[]): IEntryArgs {
  // [ path, port, other...]
  const jsonPath = args[0] ?? 'data.json';
  const port = args[1] ?? '3000';

  try {
    // path validation
    // const pathValidator = /(\\+[a-z_\-\s0-9]+)+\.json$/i;
    if (!jsonPath.endsWith('.json')) throw new Error('Invalid file path!');

    if (!Number(port)) throw new Error('Invalid port!');

    const isNoStrict = args.includes('--no-strict');

    const readonly = args.includes('--readonly');

    return { port: Number(port), jsonPath, isNoStrict, readonly };
  } catch (e: any) {
    console.error(e.message);
    process.exit(e.message);
  }
}
