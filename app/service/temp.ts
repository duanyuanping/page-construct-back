import { Service } from 'egg';
import * as path from 'path';
import * as shell from 'shelljs';

const pageFolderPath = path.resolve(__dirname, '../../../pages');
const pageDevelopmentPath = path.resolve(pageFolderPath, './development');
const tempCacheName = 'temp_cache';

export default class extends Service {
  public async update(hook: any) {
    if (!hook.events.includes('push')) return { code: 1 };

    let npm = 'npm';
    if (shell.which('cnpm')) {
      npm = 'cnpm';
    }

    // construct命令缺失
    if (!shell.which('construct')) {
      const code = shell.exec(`${npm} i -g page-construct-template`).code;

      if (code) {
        this.app.logger.error('construct命令缺失');
        return {
          code: 1,
          msg: '服务construct命令缺失',
        };
      }
    }

    const code = shell.exec(`cd ${pageDevelopmentPath} && construct -c page -n ${tempCacheName}`).code;
    if (code) return { code: 1 };

    const tempFolderPath = path.resolve(pageDevelopmentPath, './temp');
    const tempCacheFolderPath = path.resolve(pageDevelopmentPath, tempCacheName);
    shell.rm('-rf', tempFolderPath);
    shell.mv('-n', tempCacheFolderPath, tempFolderPath);

    return { code: 0, msg: 'success' };
  }
}
