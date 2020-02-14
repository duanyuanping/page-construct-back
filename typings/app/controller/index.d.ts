// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportComponent from '../../../app/controller/component';
import ExportHome from '../../../app/controller/home';
import ExportPage from '../../../app/controller/page';
import ExportTemp from '../../../app/controller/temp';

declare module 'egg' {
  interface IController {
    component: ExportComponent;
    home: ExportHome;
    page: ExportPage;
    temp: ExportTemp;
  }
}
