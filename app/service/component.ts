import { Service } from 'egg';

interface CreateProps {
  nameCh: string;
  nameEn: string;
  img: string;
}

export default class ComponentService extends Service {
  public async getList() {
    const result = await this.app.mysql.get('components');

    return result;
  }

  public async create(params: CreateProps) {
    const result = await this.app.mysql.insert('components', { ...params });

    return result;
  }
}
