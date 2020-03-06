import { Service } from 'egg';

interface CreateProps {
  nameCh: string;
  nameEn: string;
  image: string;
  description?: string;
}

export default class ComponentService extends Service {
  public async getList(params: any) {
    Object.entries(params).forEach(([ key, val ]) => {
      if (typeof val !== 'number' && !val) {
        Reflect.deleteProperty(params, key);
      }
    });

    const result = await this.app.mysql.select('components', {
      where: params,
    });

    return result;
  }

  public async editor(params: CreateProps, props, defaultProps, id?: number) {
    const defaultPropsString = JSON.stringify(defaultProps);
    const commonParams = { ...params, defaultProps: defaultPropsString };
    let result: Partial<{ affectedRows: number; insertId: number; }> = { affectedRows: 1 };

    if (id) {
      result = await this.app.mysql.update('components', { id, ...commonParams });

      // 为了代码的可读性，更新组件的情况下，这里将该组件所有属性删除，后面再统一添加
      const prevProps = await this.app.mysql.select('props', { componentId: id });
      await Promise.all([
        ...prevProps.map(item => this.app.mysql.delete('props', { propId: item.id })),
        this.app.mysql.delete('props', { componentId: id }),
      ]);
    } else {
      result = await this.app.mysql.insert('components', commonParams);
    }

    // 属性更新
    const componentId = id || result.insertId;
    await Promise.all(props.map(async prop => await this.service.component.insertProp({ prop, componentId })));

    return result;
  }

  public async insertProp({ componentId, prop, propId }: Partial<{
    componentId: number;
    prop: any;
    propId: number;
  }>) {
    if (!componentId && !propId) return;
    const idParam = componentId ? { componentId } : { propId };
    if (prop.type === 'array') {
      const child = prop.child || 'string';

      if (typeof child === 'string') {
        await this.app.mysql.insert('props', { ...prop, ...idParam, child });

      } else {
        Reflect.deleteProperty(prop, child);
        const { insertId } = await this.app.mysql.insert('props', { ...prop, child: 'map', ...idParam });

        await Promise.all(child.map(async item => await this.service.component.insertProp({ propId: insertId, prop: item })));
      }
    } else {
      await this.app.mysql.insert('props', { ...prop, ...idParam });
    }
  }

  public async getDetail(name) {
    const selectStr = `SELECT props.* FROM components, props WHERE components.id=props.componentId AND components.nameEn='${name}'`;
    const [ firProps, detail ] = await Promise.all([
      this.app.mysql.query(selectStr),
      this.app.mysql.get('components', { nameEn: name }),
    ]);

    const completeProps = await Promise.all(firProps.map(async item => {
      if (item.type === 'array' && item.child === 'map') {
        const childProps = await this.app.mysql.select('props', {
          where: { propId: item.id },
        });
        item.child = childProps;
      }

      return item;
    }));

    return {
      ...detail,
      props: completeProps,
    };
  }
}
