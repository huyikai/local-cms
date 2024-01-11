import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
interface Answers {
  name: string;
  author: string;
  newDir: boolean;
  version: string;
}

// 获取当前工作目录
const cwd = process.cwd();

// 进度动画
const spinner = ora();

// 粗体文字
const blodText = (text: string) => chalk.blue.bold(text);

export default async (answers: Answers) => {
  const { name, author, version, newDir } = answers;
  const targetDir = path.join(cwd, newDir ? name : '');

  const copyTemplate = async () => {
    // 初始化package.json
    execSync('npm init -y');
    execSync(`npm install @huyikai/vitepress-helper@latest`, {
      stdio: 'inherit'
    });
    // execSync('npm link @huyikai/vitepress-helper');

    // 模板文件的路径
    const templatePath = path.join(
      cwd,
      'node_modules/@huyikai/vitepress-helper/template'
    );
    // 目标目录的路径
    const targetPath = path.join(cwd, '');
    // 将模板文件拷贝到目标目录
    fs.copySync(templatePath, targetPath);
    // 修改package.json
    const changeConfig = () => {
      const packagePath = path.join(cwd, 'package.json');
      let packageInfo = JSON.parse(fs.readFileSync(packagePath).toString());
      packageInfo.name = name;
      packageInfo.author = author;
      packageInfo.version = version;
      packageInfo.scripts['cms'] =
        'node node_modules/@huyikai/local-cms/cms.js docs';
      packageInfo.devDependencies['@huyikai/vitepress-helper'] = 'latest';
      packageInfo.devDependencies['@huyikai/local-cms'] = 'latest';
      fs.writeFileSync(packagePath, JSON.stringify(packageInfo, null, 2));
    };
    changeConfig();
    execSync('npm i', { stdio: 'inherit' });
    spinner.succeed('Install Complete!!!');
    console.log(
      `\r\nNow you can:\r\nrun ${blodText('npm run dev')} to preview`
    );
    console.log(`\r\nrun ${blodText('npm run cms')} to manage content`);
  };
  // 生成
  const generate = async () => {
    spinner.start('Downloading template...');
    copyTemplate();
  };

  // 新建目录&目录已存在
  if (newDir && fs.existsSync(targetDir)) {
    inquirer
      .prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite'
            },
            {
              name: 'Cancel',
              value: false
            }
          ]
        }
      ])
      .then((res) => {
        if (res.action === 'overwrite') {
          // 移除已存在目录
          fs.removeSync(targetDir);
          generate();
        }
        return;
      });
  } else {
    generate();
  }
};
