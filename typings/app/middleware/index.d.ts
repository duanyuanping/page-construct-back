// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportOnerror from '../../../app/middleware/onerror';
import ExportValidate from '../../../app/middleware/validate';

declare module 'egg' {
  interface IMiddleware {
    onerror: typeof ExportOnerror;
    validate: typeof ExportValidate;
  }
}
