'use strict';

const expectedMajor = 26;
const actualMajor = Number.parseInt(process.versions.node.split('.')[0], 10);

if (actualMajor !== expectedMajor) {
  console.error(
    `Mu requires Node ${expectedMajor}.x; found ${process.versions.node}. ` +
    'Select the repository runtime before installing or running scripts.'
  );
  process.exit(1);
}
