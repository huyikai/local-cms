#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Command } from "commander";
import chalk from "chalk";
import { exec } from "child_process";
import figlet from "figlet";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import inquirer from "inquirer";
import path from "path";
var program = new Command();
program.name("local-cms").description("一个管理本地 markdown 文件的管理系统");
try {
    var __dirname_1 = path.dirname(fileURLToPath(import.meta.url));
    var packagePath = path.join(__dirname_1, "./../package.json");
    var packageData = fs.readFileSync(packagePath, "utf8");
    var packageJson = JSON.parse(packageData);
    var version = packageJson.version;
    program.version(version, "-v,-V, --version", "Output current version information");
}
catch (error) {
    console.error("Failed to read package.json:", error);
}
var prompts = [
    {
        type: "list",
        name: "action",
        message: "Please select the action you want to perform:(请选择您要执行的操作：)",
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
function handleCmsScript() {
    return __awaiter(this, void 0, void 0, function () {
        var packageJson, answers, runcms;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    packageJson = JSON.parse(fs.readFileSync("./package.json"));
                    if (!packageJson.scripts.cms) return [3 /*break*/, 2];
                    return [4 /*yield*/, inquirer.prompt({
                            type: "confirm",
                            name: "overwrite",
                            message: "The cms command already exists in the script of the packages.json file, do you want to overwrite it? \r\npackages.json 文件的 scripts 中已存在 cms 命令，是否覆盖？\r\n",
                        })];
                case 1:
                    answers = _a.sent();
                    if (answers.overwrite) {
                        packageJson.scripts.cms = "node node_modules/local-cms/cms.js docs";
                        fs.writeFileSync(path.join(process.cwd(), "./package.json"), JSON.stringify(packageJson, null, 2));
                    }
                    return [3 /*break*/, 3];
                case 2:
                    packageJson.scripts.cms = "node node_modules/local-cms/cms.js docs";
                    fs.writeFileSync(path.join(process.cwd(), "./package.json"), JSON.stringify(packageJson, null, 2));
                    _a.label = 3;
                case 3:
                    runcms = chalk.blue.bold("npm run cms");
                    console.log("Now you can execute ".concat(runcms, " to run cms management content.\r\n\u73B0\u5728\u4F60\u53EF\u4EE5\u6267\u884C ").concat(runcms, " \u6765\u8FD0\u884C cms \u7BA1\u7406\u5185\u5BB9\u4E86\u3002\r\n"));
                    return [2 /*return*/];
            }
        });
    });
}
program
    .command("init")
    .description("Guide to complete the initialization operation")
    .summary("initialization")
    .action(function (_name, _options) { return __awaiter(void 0, void 0, void 0, function () {
    var results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, inquirer.prompt(prompts)];
            case 1:
                results = _a.sent();
                if (results.action === "next") {
                    exec("npm install @huyikai/local-cms", function (error, stdout, stderr) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (error) {
                                        console.error("exec error: ".concat(error));
                                        return [2 /*return*/];
                                    }
                                    console.log("stdout: ".concat(stdout));
                                    console.error("stderr: ".concat(stderr));
                                    return [4 /*yield*/, handleCmsScript()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                else if (results.action === "new") {
                    exec("git clone https://github.com/vitepress-custom/vitepress-custom-template.git .", function (error, stdout, stderr) {
                        if (error) {
                            console.error("exec error: ".concat(error));
                            return;
                        }
                        console.log("stdout: ".concat(stdout));
                        console.error("stderr: ".concat(stderr));
                    });
                }
                return [2 /*return*/];
        }
    });
}); });
program.usage("<command> [option]");
program.on("--help", function () {
    console.log("\r\nRun ".concat(chalk.blue.bold("cms <command> --help"), " for detailed usage of given command"));
    console.log("\r\nLink:".concat(chalk.blue.bold("https://github.com/huyikai/local-cms"), " \r\n"));
    console.log("\r\n" +
        chalk
            .hex("#41B883")
            .bgHex("#35495E")
            .bold(figlet.textSync("Local CMS", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
            width: 90,
            whitespaceBreak: false,
        })));
});
program.parse(process.argv);
