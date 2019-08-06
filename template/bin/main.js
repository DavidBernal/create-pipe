#!/usr/bin/env node
const through2 = require('through2');
const pipe = require('../pipe');

const transform = through2((chunk, enc, callback) =>
  pipe(
    chunk,
    enc
  )
    .then(result => callback(null, result))
    .catch(err => callback(err))
);

process.stdin.pipe(transform).pipe(process.stdout);
