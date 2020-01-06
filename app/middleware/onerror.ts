import { Context } from 'egg';

export default function onerror(): any {
    return async (ctx: Context, next: () => Promise<any>) => {
        // console.log(ctx.path)
        await next().catch(err => {
            console.log(err);
            ctx.logger.error(err);
            ctx.body = { code : 1, msg: '服务器错误' };
        });
    };
}
