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
import bodyParser from "body-parser";
import chalk from "chalk";
import { exec } from "child_process";
import express from "express";
import { fileURLToPath } from "url";
import fs from "fs";
import globby from "globby";
import net from "net";
import path from "path";
var app = express();
var port = 3000;
// 设置默认目录为docs，如果命令行参数中有目录，则使用命令行参数中的目录
var currentDirectory = process.argv[2] || "docs";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "dist")));
app.use("".concat(process.cwd(), "/").concat(currentDirectory), express.static(currentDirectory));
app.use(bodyParser.json());
var server = net.createServer();
server.once("error", function (err) {
    if (err.code === "EADDRINUSE") {
        console.log("\u7AEF\u53E3 ".concat(port, " \u5DF2\u88AB\u5360\u7528"));
        port += 1;
        server.listen(port);
    }
});
server.once("listening", function () {
    server.close();
    app.listen(port, function () {
        console.log("LocalCMS \u7BA1\u7406\u754C\u9762\u6B63\u5728\u8FD0\u884C\u5728 ".concat(chalk.blue.bold("http://localhost:".concat(port))));
    });
});
server.listen(port);
// 获取目录下所有文件及文件夹
app.get("/api/directory/all", function (req, res) {
    var dirPath = path.join(currentDirectory, typeof req.query.path === "string" ? req.query.path : "");
    var ignore = typeof req.query.ignore === "string"
        ? req.query.ignore.split(",")
        : [".vitepress", "public", "index.md", ".DS_Store"];
    fs.readdir(dirPath, { withFileTypes: true }, function (err, dirents) {
        if (err) {
            res.status(500).send("读取目录失败:" + dirPath);
        }
        else {
            var result = dirents
                .filter(function (dirent) { return !ignore.includes(dirent.name); })
                .map(function (dirent) {
                var filePath = path.join(dirPath, dirent.name);
                if (dirent.isDirectory()) {
                    return {
                        name: dirent.name,
                        isDirectory: true,
                        isLeaf: false,
                        path: path.join(typeof req.query.path === "string" ? req.query.path : "", dirent.name),
                        children: getChildren(filePath, path.join(typeof req.query.path === "string" ? req.query.path : "", dirent.name)),
                        key: path.join(typeof req.query.path === "string" ? req.query.path : "", dirent.name),
                    };
                }
                else {
                    return {
                        name: dirent.name,
                        isDirectory: false,
                        isLeaf: true,
                        path: path.join(typeof req.query.path === "string" ? req.query.path : "", dirent.name),
                        key: path.join(typeof req.query.path === "string" ? req.query.path : "", dirent.name),
                    };
                }
            });
            res.status(200).send(result);
        }
    });
});
// 递归获取子目录下的所有文件和文件夹
function getChildren(dirPath, parentPath) {
    if (parentPath === void 0) { parentPath = ""; }
    var files = fs.readdirSync(dirPath);
    var result = files.map(function (file) {
        var filePath = path.join(dirPath, file);
        var stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            return {
                name: file,
                isDirectory: true,
                isLeaf: false,
                path: path.join(parentPath, file),
                parentPath: parentPath,
                children: getChildren(filePath, path.join(parentPath, file)),
                key: path.join(parentPath, file),
            };
        }
        else {
            return {
                name: file,
                isDirectory: false,
                isLeaf: true,
                path: path.join(parentPath, file),
                parentPath: parentPath,
                key: path.join(parentPath, file),
            };
        }
    });
    return result;
}
// 获取所有md文件
app.get("/api/files/all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paths;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, globby(["**.md"], {
                    ignore: [
                        "**/node_modules",
                        "**/*index*.md",
                        "**/*README*.md",
                        "**/*readme*.md",
                        "./packages",
                    ], // 忽略的文件夹和文件
                })];
            case 1:
                paths = _a.sent();
                res.json(paths.sort());
                return [2 /*return*/];
        }
    });
}); });
// 读取单个文件
app.get("/api/files", function (req, res) {
    var filePath = path.join(currentDirectory, decodeURIComponent(typeof req.query.path === "string" ? req.query.path : ""));
    fs.readFile(filePath, "utf-8", function (err, data) {
        if (err) {
            res.status(500).send("读取文件失败");
        }
        else {
            res.status(200).send(data);
        }
    });
});
// 新建文件
app.post("/api/files", function (req, res) {
    var _a = req.body, filename = _a.filename, directory = _a.directory;
    var filePath = path.join(currentDirectory, "".concat(directory, "/").concat(filename, ".md"));
    // 检查文件是否已存在
    if (fs.existsSync(filePath)) {
        res.status(400).send("文件已存在");
    }
    else {
        // 使用 fs 模块创建新文件
        fs.writeFile(filePath, "", function (err) {
            if (err) {
                res.status(500).send("创建文件失败");
            }
            else {
                res.status(200).send("文件创建成功");
            }
        });
    }
});
// 新建目录
app.post("/api/directories", function (req, res) {
    var directory = req.body.directory;
    var dirPath = path.join(currentDirectory, directory);
    // 检查目录是否已存在
    if (fs.existsSync(dirPath)) {
        res.status(400).send("目录已存在");
    }
    else {
        // 使用 fs 模块创建新目录
        fs.mkdir(dirPath, function (err) {
            if (err) {
                res.status(500).send("创建目录失败");
            }
            else {
                res.status(200).send("目录创建成功");
            }
        });
    }
});
// 修改文件
app.put("/api/files", function (req, res) {
    // 使用 fs 模块更新文件内容
    var content = req.body.content;
    var filePath = path.join(currentDirectory, req.body.path);
    fs.writeFile(filePath, content, function (err) {
        if (err) {
            res.status(500).send("更新文件失败");
        }
        else {
            res.status(200).send("文件更新成功");
        }
    });
});
// 删除文件
app.delete("/api/files", function (req, res) {
    var directory = req.body.directory;
    var filePath = path.join(currentDirectory, directory);
    fs.unlink(filePath, function (err) {
        if (err) {
            res.status(500).send("删除文件失败");
        }
        else {
            res.status(200).send("文件删除成功");
        }
    });
});
// 删除目录
app.delete("/api/directories", function (req, res) {
    var directory = req.body.directory;
    var dirPath = path.join(currentDirectory, directory);
    fs.rm(dirPath, { recursive: true }, function (err) {
        if (err) {
            res.status(500).send("删除目录失败");
        }
        else {
            res.status(200).send("目录删除成功");
        }
    });
});
// 重命名文件
app.put("/api/files/rename", function (req, res) {
    var _a = req.body, name = _a.name, directory = _a.directory;
    var dir = path.dirname(directory);
    var oldFilePath = path.join(currentDirectory, directory);
    var newFilePath = path.join(currentDirectory, dir, "".concat(name, ".md"));
    fs.rename(oldFilePath, newFilePath, function (err) {
        if (err) {
            res.status(500).send("重命名文件失败");
        }
        else {
            res.status(200).send("文件重命名成功");
        }
    });
});
// 重命名目录
app.put("/api/directories/rename", function (req, res) {
    var _a = req.body, name = _a.name, directory = _a.directory;
    var dir = path.dirname(directory);
    var oldDirPath = path.join(currentDirectory, directory);
    var newDirPath = path.join(currentDirectory, dir, "".concat(name));
    fs.rename(oldDirPath, newDirPath, function (err) {
        if (err) {
            if (err.code === "ENOTEMPTY") {
                // 目录不为空，需要递归重命名子目录和移动文件
                renameDir(oldDirPath, newDirPath)
                    .then(function () {
                    res.status(200).send("目录重命名成功");
                })
                    .catch(function () {
                    res.status(500).send("重命名目录失败");
                });
            }
            else {
                res.status(500).send("重命名目录失败");
            }
        }
        else {
            res.status(200).send("目录重命名成功");
        }
    });
});
// 递归重命名目录和移动文件
var renameDir = function (oldDirPath, newDirPath) { return __awaiter(void 0, void 0, void 0, function () {
    var files;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.promises.readdir(oldDirPath)];
            case 1:
                files = _a.sent();
                return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(void 0, void 0, void 0, function () {
                        var oldFilePath, newFilePath, stats;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    oldFilePath = path.join(oldDirPath, file);
                                    newFilePath = path.join(newDirPath, file);
                                    return [4 /*yield*/, fs.promises.stat(oldFilePath)];
                                case 1:
                                    stats = _a.sent();
                                    if (!stats.isDirectory()) return [3 /*break*/, 3];
                                    return [4 /*yield*/, renameDir(oldFilePath, newFilePath)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, fs.promises.rename(oldFilePath, newFilePath)];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 2:
                _a.sent();
                return [4 /*yield*/, fs.promises.rm(oldDirPath)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// 设置目录
app.post("/api/set-directory", function (req, res) {
    currentDirectory = req.body.directory;
    app.use(currentDirectory, express.static(currentDirectory));
    res.status(200).send("目录设置成功");
});
// 获取文件 git 版本信息
app.get("/api/files/git", function (req, res) {
    var filePath = path.join(currentDirectory, decodeURIComponent(typeof req.query.path === "string" ? req.query.path : ""));
    exec("git log --pretty=format:\"%h - %an, %ar : %s\" ".concat(filePath), function (err, stdout, _stderr) {
        if (err) {
            res.status(500).send("获取Git版本信息失败");
        }
        else {
            var fileData = {
                gitLog: stdout,
            };
            res.status(200).send(fileData);
        }
    });
});
// 添加通配符路由，重定向到 Vue 应用的入口文件
app.get("*", function (_req, res) {
    res.sendFile(path.join(__dirname, "dist/index.html"));
});
export default app;
