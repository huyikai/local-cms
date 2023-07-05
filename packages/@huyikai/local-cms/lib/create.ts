import chalk from "chalk";
import download from "download-git-repo";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";

// 获取当前工作目录
const cwd = process.cwd();
const spinner = ora();
export default async (answers: any) => {
  // 解构输入信息：项目名、作者、是否新建目录
  const { name, author, version, newDir } = answers;
  // 要创建的目录地址
  const targetDir = path.join(cwd, newDir ? name : "");
  // 新建目录&目录已存在
  if (newDir && fs.existsSync(targetDir)) {
    inquirer
      .prompt([
        {
          name: "action",
          type: "list",
          message: "Target directory already exists Pick an action:",
          choices: [
            {
              name: "Overwrite",
              value: "overwrite",
            },
            {
              name: "Cancel",
              value: false,
            },
          ],
        },
      ])
      .then((res) => {
        if (res.action === "overwrite") {
          // 移除已存在目录
          fs.removeSync(targetDir);
          generate();
        }
        return;
      });
  } else {
    generate();
  }

  // 生成
  async function generate() {
    spinner.start("Downloading template...");
    const repositoryUrl = "vitepress-custom/vitepress-custom-template";
    const branch = "master";
    downloadRepository(repositoryUrl, branch);
  }
  // 下载储存库代码
  function downloadRepository(repositoryUrl: any, branch: any) {
    download(`${repositoryUrl}#${branch}`, targetDir, (error: any) => {
      if (error) {
        console.log("error", error);
        // 5 秒后重新下载
        setTimeout(() => {
          downloadRepository(repositoryUrl, branch);
        }, 5000);
      } else {
        changeConfig();
        // 下载成功
        spinner.succeed("Complete");
        const blodText = (text: string) => chalk.blue.bold(text);
        const installCmd = "npm i";
        console.log(
          `\r\nexecute ${blodText(
            installCmd
          )}\r\nInstall dependencies.\r\n执行 ${blodText(
            installCmd
          )} 安装依赖。`
        );
        const cmsCmd = "npm run cms";
        console.log(
          `\r\nExecute ${blodText(
            cmsCmd
          )}run cms to management content.\r\n执行 ${blodText(
            cmsCmd
          )} 运行 cms 来管理内容。`
        );
        const devCmd = "npm run dev";
        console.log(
          `\r\nExecute ${blodText(devCmd)} to run vitepress.\r\n执行 ${blodText(
            devCmd
          )} 来运行 vitepress。\r\n`
        );
      }
    });
  }
  // 修改package.json
  function changeConfig() {
    const projectRoot = `${process.cwd()}${newDir ? `/${name}` : ""}`;
    const packagePath = path.join(projectRoot, "package.json");
    let packageInfo = JSON.parse(fs.readFileSync(packagePath).toString());
    packageInfo.name = name;
    packageInfo.author = author;
    packageInfo.version = version;
    fs.writeFileSync(packagePath, JSON.stringify(packageInfo, null, 2));
  }
};
