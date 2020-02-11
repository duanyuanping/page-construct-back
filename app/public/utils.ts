import * as fs from 'fs';

export async function deleteFolder(path) {
  let files: any = [];
  if (fs.existsSync(path)) {
      files = fs.readdirSync(path);
      files.forEach(file => {
          const curPath = path + '/' + file;
          if (fs.statSync(curPath).isDirectory()) {
              deleteFolder(curPath);
          } else {
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(path);
  }
};