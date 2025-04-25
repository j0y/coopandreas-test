import { promises as fs } from 'fs';
import { stringify, type IIniObject, type IStringifyConfig } from 'js-ini';

export function writeIniFile(path: string, ini: IIniObject, config: IStringifyConfig) {
  const data = stringify(ini, config);
  return fs.writeFile(path, data, 'utf-8');
}
