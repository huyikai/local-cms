#!/usr/bin/env node

import { exec, execSync } from 'child_process';

import { Command } from 'commander';
import chalk from 'chalk';
import create from '../lib/create';
import figlet from 'figlet';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';

const spinner = ora();
const program: Command = new Command();

program
  .name('local-cms')
  .description(
    'A Management System for Managing Local markdown Files\r\n一个管理本地 markdown 文件的管理系统'
  );

// 工作目录
const cwd = process.cwd();
// 粗体文字
const blodText = (text: string) => chalk.blue.bold(text);
// 依赖存放目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagePath = path.join(__dirname, './../package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// 设置程序的版本信息，用户可以通过 -v,-V, --version 参数查看当前版本信息
program.version(
  packageJson.version,
  '-v,-V, --version',
  'Output current version information'
);

const prompts = [
  {
    type: 'list',
    name: 'action',
    message:
      'Please select the action you want to perform:(请选择您要执行的操作：)',
    choices: [
      {
        name: "1.Add 'Local-CMS' to the current directory to manage the content.(在当前目录添加 'Local-CMS' 来管理内容)",
        value: 'next'
      },
      {
        name: "2.Create a CMS project based on 'VitePress Custom' management.(新建一个基于 'VitePress' 管理的 CMS 的项目)",
        value: 'new'
      }
    ]
  }
];

const handleCmsScript = async (options: any) => {
  const _packagePath = path.join(cwd, './package.json');
  const _packageJson = JSON.parse(fs.readFileSync(_packagePath).toString());

  const modifyPackageJson = () => {
    const cmsCMD = `node node_modules/@huyikai/local-cms/cms.js ${options.directory}`;
    _packageJson.scripts.cms = cmsCMD;
    fs.writeFileSync(_packagePath, JSON.stringify(_packageJson, null, 2));
  };

  if (_packageJson.scripts.cms) {
    const answers = await inquirer.prompt({
      type: 'confirm',
      name: 'overwrite',
      message:
        'The cms command already exists in the script of the packages.json file, do you want to overwrite it? \r\npackages.json 文件的 scripts 中已存在 cms 命令，是否覆盖？\r\n'
    });
    if (answers.overwrite) {
      modifyPackageJson();
    }
  } else {
    modifyPackageJson();
  }
  spinner.start('Installing...');
  exec('npm i @huyikai/local-cms -D', async (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    // 检查目录是否存在
    if (!fs.existsSync(options.directory)) {
      // 如果目录不存在，创建目录
      fs.mkdirSync(options.directory);
    }
    spinner.succeed('install Complete!!!');
    const runcms = blodText('npm run cms');
    console.log(
      `\r\nNow you can execute ${runcms} to run cms management content.\r\n现在你可以执行 ${runcms} 来运行 cms 来管理内容了。\r\n`
    );
  });
};

program
  .command('init')
  .description('Guide to complete the initialization operation')
  .summary('initialization')
  .action(async () => {
    let results = await inquirer.prompt(prompts);

    if (results.action === 'next') {
      let directory = await inquirer.prompt([
        {
          name: 'directory',
          message:
            'Set up a directory to store content.\r\n设置一个用来存放内容的目录',
          type: 'input',
          default: 'docs'
        }
      ]);
      if (!fs.existsSync('./package.json')) {
        try {
          execSync('npm init -y');
        } catch (error) {
          console.error(`exec error: ${error}`);
          return;
        }
      }
      await handleCmsScript({ directory: directory.directory });
    } else if (results.action === 'new') {
      const question = [
        {
          name: 'name',
          message: 'Project Name',
          type: 'input',
          default: 'my-docs'
        },
        {
          name: 'author',
          description: 'Input Author Name',
          message: 'Author',
          default: 'huyikai'
        },
        {
          name: 'version',
          description: 'Version',
          message: 'Version',
          default: '1.0.0'
        },
        {
          name: 'newDir',
          message: 'Create A New Directory?',
          type: 'list',
          choices: [
            { name: 'yes', value: true },
            { name: 'no', value: false }
          ]
        }
      ];
      let answers = await inquirer.prompt(question);
      create(answers);
    }
  });

// 设置程序的使用方法
program.usage('<command> [option]');

// 使用帮助指令时触发的事件
program.on('--help', () => {
  console.log(
    `\r\nRun ${blodText(
      'cms <command> --help'
    )} for detailed usage of given command`
  );
  console.log(
    `\r\nGitHub: ${blodText('https://github.com/huyikai/local-cms')}`
  );
  console.log(
    `\r\nHomePage: ${blodText('https://huyikai.github.io/local-cms')}`
  );
  console.log(
    '\r\n' +
      chalk
        .hex('#41B883')
        .bgHex('#35495E')
        .bold(
          figlet.textSync('Local CMS', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 90,
            whitespaceBreak: false
          })
        )
  );
});

// 解析命令行参数(必须)
program.parse(process.argv);
