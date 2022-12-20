#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const PackageJson = require('@npmcli/package-json')

const nameArg = process.argv[2] || 'my-design-system';
const templateSrc = path.join(__dirname, 'template');
const destination = path.join(process.cwd(), nameArg);

fs.cp(templateSrc, destination, { recursive: true }, async (error) => {
  if (error) {
    console.log(error);
    return;
  }

  const pkgJson = await PackageJson.load(destination);

  pkgJson.update({
    name: nameArg,
  })

  await pkgJson.save();

  console.log('Installing dependencies');
  exec('npm install', { cwd: destination }, (error) => {
    if (error) {
      console.log(error);
      return;
    }

    console.log('Done!, Time to create your awesome Design System!')
  });
});
