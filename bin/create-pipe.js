#!/usr/bin/env node
const args = process.argv.slice(2);

if (args.length !== 1) {
  throw new Error('Only 1 argument, the pipe name');
}

const fs = require('fs');
const path = require('path');

const templateDir = path.join(__dirname, '../template');

const pipeName = args[0];
const CURR_DIR = path.join(process.cwd(), pipeName);

fs.mkdirSync(CURR_DIR);
createDirectoryContents(templateDir, CURR_DIR);

console.log('Done!');

function createDirectoryContents(templatePath, newProjectPath) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
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
