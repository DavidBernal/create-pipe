#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sade = require('sade');
const pkg = require('../package.json');

const templateDir = path.join(__dirname, '../template');

sade('create-pipe [pipeName]', true)
  .version(pkg.version)
  .describe('Create a new pipe')
  .example('create-pipe my-new-pipe')
  .action((pipeName, opts) => {
    function createDirectoryContents(templatePath, newProjectPath) {
      const filesToCreate = fs.readdirSync(templatePath);

      filesToCreate.forEach((file) => {
        const origFilePath = `${templatePath}/${file}`;

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        if (stats.isFile()) {
          const contents = fs.readFileSync(origFilePath, 'utf8');

          // Rename
          if (file === '.npmignore') file = '.gitignore';

          const writePath = `${newProjectPath}/${file}`;
          fs.writeFileSync(
            writePath,
            contents.replace(/\{\{pipeName\}\}/gim, pipeName),
            'utf8'
          );
        } else if (stats.isDirectory()) {
          fs.mkdirSync(`${newProjectPath}/${file}`);

          // recursive call
          createDirectoryContents(
            `${templatePath}/${file}`,
            `${newProjectPath}/${file}`
          );
        }
      });
    }

    const CURR_DIR = path.join(process.cwd(), pipeName);
    fs.mkdirSync(CURR_DIR);
    createDirectoryContents(templateDir, CURR_DIR);
    console.log('Done!');
    console.log(`Do "cd ${pipeName}" and start coding!`);
  })
  .parse(process.argv);
