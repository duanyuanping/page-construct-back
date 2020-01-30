import { Service } from 'egg';
import * as shell from 'shelljs';
import * as path from 'path';
import * as fs from 'fs';

interface ConstructParams {
  name: string;
  props: any;
}

const pagesFolderPath = path.resolve(__dirname, '../../../pages');

const changeName = (name: string) => name.toLowerCase().replace(/(-|_)/g, ' ').replace(/( |^)[a-z]/g, (L: string) => L.toUpperCase()).replace(/ /g, '');

export default class PageService extends Service {
  public async create(name: string) {
    if (!shell.which('construct')) {
      this.app.logger.error('construct命令缺失');
      return {
        code: 1,
        msg: '服务construct命令缺失',
      };
    }

    const pages = fs.readdirSync(pagesFolderPath);
    if (pages.includes(name)) {
      return {
        code: 1,
        msg: '页面名重复',
      };
    }

    const code = shell.exec(`cd ${pagesFolderPath} && construct -c page -n ${name}`).code;
    if (code !== 0) {
      return {
        code: 1,
        msg: '新建页面失败',
      };
    } else {
      return {
        code: 0,
        msg: 'success',
      };
    }
  }

  public async construct(page: string, components: ConstructParams[]) {
    const pageFilePath = path.resolve(pagesFolderPath, page);
    const names = components.map((item: ConstructParams) => item.name);

    let npm = 'npm';
    if (shell.which('cnpm')) {
      npm = 'cnpm';
    }

    // 依赖安装
    let code = shell.exec(`cd ${pageFilePath} && ${npm} i ${names.join(' ')}`).code;
    if (code !== 0) {
      return {
        code: 1,
        msg: '页面构建失败',
      };
    }

    // 调用组件
    const demoTempFilePath = path.resolve(pageFilePath, './src/demo.temp.js');
    const demoFilePath = path.resolve(pageFilePath, './src/demo.js');
    let content = fs.readFileSync(demoTempFilePath, 'utf-8');
    // import组件
    const componentImport = names.map((name: string) => {
      const importName = changeName(name);
      return `import ${importName} from '${name}';`;
    }).join('\n');
    content = content.replace('/** replaceholder: import */', componentImport);
    // 组件调用
    const componentUse = components.map((item: ConstructParams) => {
      const importName = changeName(item.name);
      const propString = Object.entries(item.props).map(([ key, val ]) => `${key}={${JSON.stringify(val)}}`).join(' ');
      return `<${importName} ${propString}/>`;
    }).join('\n');
    content = content.replace('/** replaceholder: use */', componentUse);
    fs.writeFileSync(demoFilePath, content, 'utf-8');
    code = shell.exec(`cd ${pageFilePath} && npm run build`);
    if (code !== 0) {
      return {
        code: 1,
        msg: '页面构建失败',
      };
    }

    // 将打包过后的html内容作为响应体返回

    if (code !== 0) {
      return {
        code: 1,
        msg: '页面构建失败',
      };
    } else {
      return {
        code: 0,
        msg: 'success',
      };
    }
  }
}
