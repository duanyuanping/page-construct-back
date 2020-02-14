// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportComponent from '../../../app/service/component';
import ExportPage from '../../../app/service/page';
import ExportTemp from '../../../app/service/temp';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    component: ExportComponent;
    page: ExportPage;
    temp: ExportTemp;
  }
}
