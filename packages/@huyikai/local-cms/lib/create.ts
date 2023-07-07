import chalk from 'chalk';
import download from 'download-git-repo';
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

  // 修改package.json
  const changeConfig = () => {
    const packagePath = path.join(targetDir, 'package.json');
    let packageInfo = JSON.parse(fs.readFileSync(packagePath).toString());
    packageInfo.name = name;
    packageInfo.author = author;
    packageInfo.version = version;
    fs.writeFileSync(packagePath, JSON.stringify(packageInfo, null, 2));
  };

  // 下载储存库代码
  const downloadRepository = () => {
    const repositoryUrl = 'vitepress-custom/vitepress-custom-template';
    const branch = 'master';
    download(`${repositoryUrl}#${branch}`, targetDir, (error: any) => {
      if (error) {
        console.log('error', error);
        // 5 秒后重新下载
        setTimeout(() => {
          downloadRepository();
        }, 5000);
      } else {
        changeConfig();
        // 下载成功
        spinner.succeed('Complete');

        const installCmd = 'npm i';
        console.log(
          `\r\nexecute ${blodText(
            installCmd
          )}\r\nInstall dependencies.\r\n执行 ${blodText(
            installCmd
          )} 安装依赖。`
        );
        const cmsCmd = 'npm run cms';
        console.log(
          `\r\nExecute ${blodText(
            cmsCmd
          )}run cms to management content.\r\n执行 ${blodText(
            cmsCmd
          )} 运行 cms 来管理内容。`
        );
        const devCmd = 'npm run dev';
        console.log(
          `\r\nExecute ${blodText(devCmd)} to run vitepress.\r\n执行 ${blodText(
            devCmd
          )} 来运行 vitepress。\r\n`
        );
      }
    });
  };

  // 生成
  const generate = async () => {
    spinner.start('Downloading template...');
    downloadRepository();
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
