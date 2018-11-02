/** @format */

import path from 'path';
import fs from 'fs';
import gzipSize from 'gzip-size';
import chalk from 'chalk';
import { config } from 'dotenv';

config();

const BUILD_TARGET = process.env.BUILD_TARGET.trim();
const outputDir = path.join(__dirname, '../builds/' + BUILD_TARGET);
let filesizes;
let directories;

console.log('-----------------------'); // eslint-disable-line
console.log(BUILD_TARGET, ': File sizes after GZIP'); // eslint-disable-line
console.log('-----------------------'); // eslint-disable-line

filesizes = [];

directories = [
  {
    name: 'css',
    path: path.join(outputDir, 'css')
  },
  {
    name: 'js',
    path: path.join(outputDir, 'js')
  }
];

Promise.all(
  directories
    .map(dir =>
      new Promise(resolve => {
        fs.readdir(dir.path, (err, files) => {
          resolve({
            err,
            files
          });
        });
      }).then(response => {
        if (!response.err) {
          return Promise.all(
            response.files.map(file =>
              gzipSize.file(path.join(dir.path, file)).then(fsize => {
                filesizes.push({
                  file: `${BUILD_TARGET}/${dir.name}/${file}`,
                  size: (fsize / 1024).toFixed(2),
                  unit: 'KB'
                });
              })
            )
          );
        }

        return Promise.resolve();
      })
    )
    .concat(
      gzipSize.file(path.join(outputDir, 'index.html')).then(fsize => {
        filesizes.push({
          file: BUILD_TARGET + '/index.html',
          size: (fsize / 1024).toFixed(2)
        });
      })
    )
).then(() => {
  filesizes.forEach(filesize => {
    // eslint-disable-next-line
    console.log(`${chalk.yellow(filesize.file)}: ${chalk.magenta(`${filesize.size} KB`)}`);
  });
});
