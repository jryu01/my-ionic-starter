# my-ionic-starter
A starting project for Ionic.

Notes: 

- Files and directories are organized by feature not by file type ( controller, directive, service)
- Cordova plugins can be easliy installed by just putting plugin url or id in plugins.json file and simply running `gulp install`
- It uses sass to build css style sheet: `gulp sass` 
- Any scripts in www/app and sub folders (`www/app/**/*.js`) are added to index.html file easily running `gulp index` 
- It uses jshint to check code quality: `gulp lint`
- 'gulp config --option' where option is one of 'production' or 'test' (default to development) build environment specific angular config module in www/app/components/config using www/app/config.json

## How to Install

This is an starter project for ionic project. So, it requires ionic and cordova. If ionic and cordova is not already installed, run:

```bash
$ sudo npm install -g ionic cordova
$ ionic start myApp tabs
```
Then, to install, simply run: 

```bash
$ npm install
```
Then, to start app using ios simulator, run:

```bash
$ ionic platform add ios
$ ionic build ios
$ ionic emulate ios
```

For development using browser, run:

```bash
$ ionic serve
```