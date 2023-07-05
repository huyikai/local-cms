#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { exec } from "child_process";
import figlet from "figlet";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import inquirer from "inquirer";
import path from "path";

const program: Command = new Command();

program.name("local-cms").description("一个管理本地 markdown 文件的管理系统");

try {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const packagePath = path.join(__dirname, "./../package.json");
  const packageData = fs.readFileSync(packagePath, "utf8");
  const packageJson = JSON.parse(packageData);
  const version = packageJson.version;
  program.version(
    version,
    "-v,-V, --version",
    "Output current version information"
  );
} catch (error) {
  console.error("Failed to read package.json:", error);
}

const prompts = [
  {
    type: "list",
    name: "action",
    message:
      "Please select the action you want to perform:(请选择您要执行的操作：)",
    choices: [
      {
        name: "1.Add 'Local-CMS' to the current directory to manage the content.(在当前目录添加 'Local-CMS' 来管理内容)",
        value: "next",
      },
      {
        name: "2.Create a CMS project based on 'VitePress Custom' management.(新建一个基于 'VitePress' 管理的 CMS 的项目)",
        value: "new",
      },
    ],
  },
];

async function handleCmsScript() {
  const packageJson = JSON.parse(fs.readFileSync("./package.json"));
  if (packageJson.scripts.cms) {
    const answers = await inquirer.prompt({
      type: "confirm",
      name: "overwrite",
      message:
        "The cms command already exists in the script of the packages.json file, do you want to overwrite it? \r\npackages.json 文件的 scripts 中已存在 cms 命令，是否覆盖？\r\n",
    });
    if (answers.overwrite) {
      packageJson.scripts.cms = "node node_modules/local-cms/cms.js docs";
      fs.writeFileSync(
        path.join(process.cwd(), "./package.json"),
        JSON.stringify(packageJson, null, 2)
      );
    }
  } else {
    packageJson.scripts.cms = "node node_modules/local-cms/cms.js docs";
    fs.writeFileSync(
      path.join(process.cwd(), "./package.json"),
      JSON.stringify(packageJson, null, 2)
    );
  }
  const runcms = chalk.blue.bold(`npm run cms`);
  console.log(
    `Now you can execute ${runcms} to run cms management content.\r\n现在你可以执行 ${runcms} 来运行 cms 管理内容了。\r\n`
  );
}

program
  .command("init")
  .description("Guide to complete the initialization operation")
  .summary("initialization")
  .action(async (_name, _options) => {
    let results = await inquirer.prompt(prompts);
    if (results.action === "next") {
      exec("npm install @huyikai/local-cms", async (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        await handleCmsScript();
      });
    } else if (results.action === "new") {
      exec(
        "git clone https://github.com/vitepress-custom/vitepress-custom-template.git .",
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        }
      );
    }
  });

program.usage("<command> [option]");

program.on("--help", () => {
  console.log(
    `\r\nRun ${chalk.blue.bold(
      `cms <command> --help`
    )} for detailed usage of given command`
  );
  console.log(
    `\r\nLink:${chalk.blue.bold("https://github.com/huyikai/local-cms")} \r\n`
  );
  console.log(
    "\r\n" +
      chalk
        .hex("#41B883")
        .bgHex("#35495E")
        .bold(
          figlet.textSync("Local CMS", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
            width: 90,
            whitespaceBreak: false,
          })
        )
  );
});

program.parse(process.argv);
