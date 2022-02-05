#!/usr/bin/env node

// @ts-nocheck

const { Readable } = require('stream');
const getopts = require('getopts');
const pipe = require('../pipe');

const options = getopts(process.argv.slice(2), {
  alias: pipe?.alias || {},
});

let stream = process.stdin;
if (process.stdin.isTTY) {
  // if isTTY, then create a infinite stream. It emits a chunk every 100ms.
  let i = 0;
  stream = new Readable({
    read() {
      setTimeout(() => {
        this.push((++i).toString());
      }, 100);
    },
  });
}

const p = pipe(stream, process.stdin.isTTY, options);

(async () => {
  for await (const chunk of p) {
    process.stdout.write(chunk);
  }
})();
