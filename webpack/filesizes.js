/** @format */

const path = require('path');
const fs = require('fs');
const gzipSize = require('gzip-size');
const chalk = require('chalk');

require('dotenv').config();

const BUILD_TARGETS = process.env.BUILD_TARGETS.split(',').map(str => str.trim());

for (let a = 0; a < BUILD_TARGETS.length; a++) {
  const outputDir = path.join(__dirname, '../builds/' + BUILD_TARGETS[a]);
  let filesizes;
  let directories;

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
                    file: `${BUILD_TARGETS[a]}/${dir.name}/${file}`,
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
            file: BUILD_TARGETS[a] + '/index.html',
            size: (fsize / 1024).toFixed(2)
          });
        })
      )
  ).then(() => {
    console.log('-----------------------'); // eslint-disable-line
    console.log(BUILD_TARGETS[a], ': File sizes after GZIP'); // eslint-disable-line
    console.log('-----------------------'); // eslint-disable-line

    filesizes.forEach(filesize => {
      // eslint-disable-next-line
      console.log(`${chalk.yellow(filesize.file)}: ${chalk.magenta(`${filesize.size} KB`)}`);
    });
  });
}
