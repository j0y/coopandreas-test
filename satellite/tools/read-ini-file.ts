import { promises as fs } from 'fs';
import { parse, type IParseConfig } from 'js-ini';

export async function readIniFile(path: string, config: IParseConfig) {
  const data = await fs.readFile(path, 'utf-8');
  return parse(data, config);
}
