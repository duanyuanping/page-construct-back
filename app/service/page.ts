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
      const result = await this.service.page.construct('development', name, []);
      return result;
    }
  }

  public async construct(env: string, page: string, components: ConstructParams[]) {
    const pageFilePath = path.resolve(pagesFolderPath, page);
    const names = [ ...new Set(components.map((item: ConstructParams) => item.name)) ];

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
    const tempFileName = env === 'development' ? 'demo.temp.dev.js' : 'demo.temp.pro.js';
    const demoTempFilePath = path.resolve(pageFilePath, `./src/${tempFileName}`);
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
      if (env === 'development') {
        const importName = changeName(item.name);
        return `{componentClass: ${importName},\ncomponentName: '${item.name}',\nprops: ${JSON.stringify(item.props)},\nkey: Math.floor(Math.random() * 100000)},`;
      } else {
        const importName = changeName(item.name);
        const propString = Object.entries(item.props).map(([ key, val ]) => `${key}={${JSON.stringify(val)}}`).join(' ');
        return `<div className="component-wrapper"><${importName} ${propString}/></div>`;
      }
    }).join('\n');
    content = content.replace(`{/** replaceholder: use ${env === 'development' ? 'development' : 'production'} */}`, componentUse);
    fs.writeFileSync(demoFilePath, content, 'utf-8');
    code = shell.exec(`cd ${pageFilePath} && npm run build`).code;
    if (code !== 0) {
      return {
        code: 1,
        msg: '页面构建失败',
      };
    }

    if (code !== 0) {
      return {
        code: 1,
        msg: '页面构建失败',
      };
    } else {
      // todo：将打包过后的html内容作为响应体返回，或者返回一个线上可以访问的地址
      const libFilePath = path.resolve(pageFilePath, './lib/index.html');
      const htmlData = fs.readFileSync(libFilePath, 'utf-8');
      return {
        code: 0,
        data: htmlData,
        msg: 'success',
      };
    }
  }
}
