import { promises as fs } from 'fs';
import { parse, type IParseConfig } from 'js-ini';

export async function readIniFile(path: string, config: IParseConfig) {
  const data = await fs.readFile(path, 'utf-8');
  return parse(data, config);
}

export async function readIniFileWithAccessCheck(path: string, config: IParseConfig) {
  while (true) {
    try {
      await fs.access(path);
      const data = await fs.readFile(path, 'utf-8');
      return parse(data, config);
    } catch (error) {
      console.log(`File is blocked, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

}
