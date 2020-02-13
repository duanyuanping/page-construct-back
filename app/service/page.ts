import { Service } from 'egg';
import * as shell from 'shelljs';
import * as path from 'path';
import * as fs from 'fs';
import * as uuidv3 from 'uuid/v3';
import * as uuidv4 from 'uuid/v4';
import { deleteFolder } from '../public/utils';

interface ConstructParams {
  name: string;
  props: any;
}

interface ListParamsType {
  current: string;
  pageSize: string;
}

const pageFolderPath = path.resolve(__dirname, '../../../pages');
const pageDevelopmentPath = path.resolve(pageFolderPath, './development');
const pagePreviewPath = path.resolve(pageFolderPath, './preview');
const pageOnlinePath = path.resolve(pageFolderPath, './online');

const changeName = (name: string) => name.toLowerCase().replace(/(-|_)/g, ' ').replace(/( |^)[a-z]/g, (L: string) => L.toUpperCase()).replace(/ /g, '');

export default class PageService extends Service {
  public async getDetail(uid: string) {
    const data = await this.app.mysql.get('pages', { uid });

    return {
      code: 0,
      msg: 'success',
      data,
    };
  }

  public async update(id: string, params: { name: string; onlineTime: Date | null; offlineTime: Date | null; }) {
    await this.app.mysql.update('pages', { id, ...params, updateTime: this.app.mysql.literals.now });

    return {
      code: 0,
      msg: 'success',
    };
  }

  public async getList(params: ListParamsType) {
    const { current, pageSize, ...otherParams } = params;

    const [ list, total ] = await Promise.all([
      this.app.mysql.select('pages', {
        where: otherParams,
        orders: [[ 'updateTime', 'desc' ]],
        limit: Number(pageSize),
        offset: Number(pageSize) * (Number(current) - 1),
      }),
      this.app.mysql.count('pages', otherParams),
    ]);
    return {
      code: 0,
      msg: 'success',
      data: {
        total,
        current,
        pageSize,
        data: list,
      },
    };
  }

  public async create(name: string) {
    const uid = uuidv3(`${name}${Math.random()}`, uuidv4());
    const insertRes = await this.app.mysql.insert('pages', {
      name,
      url: '',
      status: 0,
      updateTime: this.app.mysql.literals.now,
      createTime: this.app.mysql.literals.now,
      content: JSON.stringify([]),
      uid,
    });
    if (insertRes.affectedRows === 0) {
      return {
        code: 1,
        msg: '新建页面失败',
      };
    }

    let code = 1;
    const tempFilePath = path.resolve(pageDevelopmentPath, './temp');
    if (fs.existsSync(tempFilePath)) {
      shell.cd(pageDevelopmentPath);
      code = shell.cp('-R', 'temp', uid).code;
    } else {
      if (!shell.which('construct')) {
        this.app.logger.error('construct命令缺失');
        return {
          code: 1,
          msg: '服务construct命令缺失',
        };
      }
      code = shell.exec(`cd ${pageDevelopmentPath} && construct -c page -n ${uid}`).code;
    }

    return {
      code,
      msg: code ? '构建失败' : 'success',
    };
  }

  public async delete(id: string) {
    await this.app.mysql.delete('pages', { id });

    return {
      code: 0,
      msg: 'success',
    };
  }

  public async construct(env: string, uid: string, components: ConstructParams[]) {
    const pageFilePath = path.resolve(pageDevelopmentPath, uid);
    const names = [ ...new Set(components.map((item: ConstructParams) => item.name)) ];

    let npm = 'npm';
    if (shell.which('cnpm')) {
      npm = 'cnpm';
    }

    // 依赖安装
    let code = 1;
    if (names.length && names.length > 0) {
      code = shell.exec(`cd ${pageFilePath} && ${npm} i ${names.join(' ')} --save`).code;

      if (code !== 0) {
        return {
          code: 1,
          msg: '页面构建失败',
        };
      }
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
    // 组件调用默认属性拼接
    await Promise.all(components.map(async (item: ConstructParams) => {
      const componentConfig = await this.app.mysql.get('components', { nameEn: item.name });
      let props = item.props;
      if (!Object.keys(item.props).length) {
        props = JSON.parse(componentConfig.defaultProps || '{}');
      }
      item.props = props;
    }));
    // 组件调用
    const componentUse = components.map((item: ConstructParams) => {
      if (env === 'development') {
        const importName = changeName(item.name);
        return `{componentClass: ${importName},\ncomponentName: '${item.name}',\nprops: ${JSON.stringify(item.props)},\nkey: Math.random()},`;
      } else {
        const importName = changeName(item.name);
        const propString = Object.entries(item.props).map(([ key, val ]) => `${key}={${JSON.stringify(val)}}`).join(' ');
        return `<div className="component-wrapper"><${importName} ${propString}/></div>`;
      }
    }).join('\n');
    content = content.replace(`{/** replaceholder: use ${env === 'development' ? 'development' : 'production'} */}`, componentUse);
    fs.writeFileSync(demoFilePath, content, 'utf-8');
    if (env === 'development') {
      code = shell.exec(`cd ${pageFilePath} && npm run build:dev`).code;
    } else {
      code = shell.exec(`cd ${pageFilePath} && npm run build:pro`).code;
    }
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
      const devFilePath = path.resolve(pageFilePath, './dev/index.html');
      const htmlData = fs.readFileSync(devFilePath, 'utf-8');
      // 构建成功以后将页面内容写入数据库
      const data = await this.app.mysql.get('pages', { uid });
      if (data && data.id) {
        await this.app.mysql.update('pages', { id: data.id, content: JSON.stringify(components) });
      }
      // 将构建后的内容添加到预览文件夹
      return {
        code: 0,
        data: htmlData,
        msg: 'success',
      };
    }
  }

  public async getCode(uid: string) {
    const pageFilePath = path.resolve(pageDevelopmentPath, uid);
    const htmlFilePath = path.resolve(pageFilePath, './dev/index.html');

    // 存在打包好的文件
    const isHtmlExists = fs.existsSync(htmlFilePath);
    if (isHtmlExists) {
      const data = fs.readFileSync(htmlFilePath, 'utf-8');

      return {
        code: 0,
        msg: 'success',
        data,
      };
    }

    // 不存在打包好的文件
    const data = await this.app.mysql.get('pages', { uid });
    if (!data || !data.id) {
      return {
        code: 1,
        msg: 'fail',
      };
    }

    let npm = 'npm';
    if (shell.which('cnpm')) {
      npm = 'cnpm';
    }
    shell.exec(`cd ${pageFilePath} && ${npm} i`);

    const result = await this.service.page.construct('development', uid, JSON.parse(data.content || '[]'));
    return result;
  }

  public async online({ uid, onlineTime, offlineTime }: { uid: string; onlineTime: null | Date; offlineTime: null | Date; }) {
    const result: any = await this.service.page.transferPage('online', uid);

    if (result.code !== 0) return result;

    const data = await this.app.mysql.get('pages', { uid });
    if (data && data.id) {
      await this.app.mysql.update('pages', { id: data.id, url: result.data, onlineTime, offlineTime, updateTime: this.app.mysql.literals.now });
      return result;
    } else {
      return {
        code: 1,
        msg: 'fail',
      };
    }
  }

  public async transferPage(category: string, uid: string) {
    const data = await this.app.mysql.get('pages', { uid });
    if (!data || !data.id) {
      return {
        code: 1,
        msg: 'fail',
      };
    }

    const reuslt = await this.service.page.construct('production', uid, JSON.parse(data.content || '[]'));
    if (reuslt.code !== 0) return reuslt;

    const pageDevHtmlPath = path.resolve(pageDevelopmentPath, `./${uid}/pro`);
    const pageResultPath = path.resolve(category === 'online' ? pageOnlinePath : pagePreviewPath, `./${uid}`);
    if (fs.existsSync(pagePreviewPath)) await deleteFolder(pageResultPath);

    const code = shell.cp('-R', pageDevHtmlPath, pageResultPath).code;
    if (code) {
      return {
        code,
        msg: 'fail',
      };
    } else {
      const previewUrl = `${this.app.config.domain}/preview/${uid}/index.html`;
      const onlineUrl = `${this.app.config.domain}/online/api/page/check?uid=${uid}`;
      return {
        code: 0,
        msg: 'success',
        data: category === 'online' ? onlineUrl : previewUrl,
      };
    }
  }

  public async check(uid: string) {
    const data = await this.app.mysql.get('pages', { uid });
    if (!data || !data.id) return;

    const { url, onlineTime, offlineTime } = data;
    const onlineTimeNum = +new Date(onlineTime);
    const offlineTimeNum = offlineTime ? +new Date(offlineTime) : Infinity;
    const now = +new Date();
    if (!url || (onlineTimeNum <= offlineTimeNum && (now > offlineTimeNum || now < onlineTimeNum))) return;

    const pageUrl = `${this.app.config.domain}/online/${uid}/index.html`;
    return pageUrl;
  }
}

