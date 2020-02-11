import { Service } from 'egg';

interface CreateProps {
  nameCh: string;
  nameEn: string;
  image: string;
  description?: string;
}

export default class ComponentService extends Service {
  public async getList(params: any) {
    Object.entries(params).forEach(([key, val]) => {
      if (typeof val !== 'number' && !val) {
        Reflect.deleteProperty(params, key);
      }
    });

    const result = await this.app.mysql.select('components', {
      where: params,
    });
    const data = result.map(item => ({
      ...item,
      props: !item.props ? [] : item.props.split(';').map(prop => {
        const arr = prop.split(',');
        return {
          key: arr[0],
          type: arr[1],
          desc: arr[2],
        };
      }),
    }));

    return data;
  }

  public async editor(params: CreateProps, props, defaultProps, id?: string) {
    const propString = props.map(item => `${item.key},${item.type},${item.desc}`).join(';');
    const defaultPropsString = JSON.stringify(defaultProps);
    const commonParams = { ...params, props: propString, defaultProps: defaultPropsString }
    let result = { affectedRows: 1 };

    if (id) {
      result = await this.app.mysql.update('components', { id, ...commonParams });
    } else {
      result = await this.app.mysql.insert('components', commonParams);
    }

    return result;
  }
}
