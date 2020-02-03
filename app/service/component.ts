import { Service } from 'egg';

interface CreateProps {
  nameCh: string;
  nameEn: string;
  image: string;
  description?: string;
}

export default class ComponentService extends Service {
  public async getList() {
    const result = await this.app.mysql.get('components');

    return result;
  }

  public async editor(params: CreateProps, props, id?: string) {
    const propString = props.map(item => `${item.key},${item.type},${item.desc}`).join(';');
    let result = { affectedRows: 1 };

    if (id) {
      result = await this.app.mysql.update('components', { id, ...params, props: propString });
    } else {
      result = await this.app.mysql.insert('components', { ...params, props: propString });
    }

    return result;
  }
}
