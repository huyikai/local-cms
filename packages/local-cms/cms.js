import express from "express";
import fs from "fs";
import path from "path";
import globby from "globby";
import net from "net";
import bodyParser from "body-parser";
import { exec } from "child_process";
import { fileURLToPath } from "url";
const app = express();
let port = 3000;

// 设置默认目录为docs，如果命令行参数中有目录，则使用命令行参数中的目录
let currentDirectory = process.argv[2] || "docs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log("__dirname", __dirname);
console.log("currentDirectory", currentDirectory);
app.use(express.static(path.join(__dirname, "cms/dist")));
app.use(`/${currentDirectory}`, express.static(currentDirectory));
app.use(bodyParser.json());

const server = net.createServer();

server.once("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`端口 ${port} 已被占用`);
    port += 1;
    server.listen(port);
  }
});

server.once("listening", () => {
  server.close();
  app.listen(port, () => {
    console.log(`LocalCMS 管理界面正在运行在 http://localhost:${port}`);
  });
});

server.listen(port);

// 获取目录下所有文件及文件夹
app.get("/api/directory/all", (req, res) => {
  const dirPath = path.join(currentDirectory, req.query.path || "");
  const ignore = req.query.ignore
    ? req.query.ignore.split(",")
    : [".vitepress", "public", "index.md",'.DS_Store'];
  fs.readdir(dirPath, { withFileTypes: true }, (err, dirents) => {
    if (err) {
      res.status(500).send("读取目录失败");
    } else {
      const result = dirents
        .filter((dirent) => !ignore.includes(dirent.name))
        .map((dirent) => {
          const filePath = path.join(dirPath, dirent.name);
          if (dirent.isDirectory()) {
            return {
              name: dirent.name,
              isDirectory: true,
              isLeaf: false,
              path: path.join(req.query.path || "", dirent.name),
              children: getChildren(
                filePath,
                path.join(req.query.path || "", dirent.name)
              ),
              key: path.join(req.query.path || "", dirent.name),
            };
          } else {
            return {
              name: dirent.name,
              isDirectory: false,
              isLeaf: true,
              path: path.join(req.query.path || "", dirent.name),
              key: path.join(req.query.path || "", dirent.name),
            };
          }
        });
      res.status(200).send(result);
    }
  });
});
// 递归获取子目录下的所有文件和文件夹
function getChildren(dirPath, parentPath = "") {
  const files = fs.readdirSync(dirPath);
  const result = files.map((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
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
    } else {
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
app.get("/api/files/all", async (req, res) => {
  const paths = await globby(["**.md"], {
    ignore: [
      "**/node_modules",
      "**/*index*.md",
      "**/*README*.md",
      "**/*readme*.md",
      "./packages",
    ], // 忽略的文件夹和文件
  });
  res.json(paths.sort());
});

// 读取单个文件
app.get("/api/files", (req, res) => {
  const filePath = path.join(
    currentDirectory,
    decodeURIComponent(req.query.path)
  );
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("读取文件失败");
    } else {
      res.status(200).send(data);
    }
  });
});

// 新建文件
app.post("/api/files", (req, res) => {
  const { filename, directory } = req.body;
  const filePath = path.join(currentDirectory, `${directory}/${filename}.md`);
  // 检查文件是否已存在
  if (fs.existsSync(filePath)) {
    res.status(400).send("文件已存在");
  } else {
    // 使用 fs 模块创建新文件
    fs.writeFile(filePath, "", (err) => {
      if (err) {
        res.status(500).send("创建文件失败");
      } else {
        res.status(200).send("文件创建成功");
      }
    });
  }
});

// 新建目录
app.post("/api/directories", (req, res) => {
  const { directory } = req.body;
  const dirPath = path.join(currentDirectory, directory);
  // 检查目录是否已存在
  if (fs.existsSync(dirPath)) {
    res.status(400).send("目录已存在");
  } else {
    // 使用 fs 模块创建新目录
    fs.mkdir(dirPath, (err) => {
      if (err) {
        res.status(500).send("创建目录失败");
      } else {
        res.status(200).send("目录创建成功");
      }
    });
  }
});

// 修改文件
app.put("/api/files", (req, res) => {
  // 使用 fs 模块更新文件内容
  const { content } = req.body;
  const filePath = path.join(currentDirectory, req.body.path);
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      res.status(500).send("更新文件失败");
    } else {
      res.status(200).send("文件更新成功");
    }
  });
});

// 删除文件
app.delete("/api/files", (req, res) => {
  const { directory } = req.body;
  const filePath = path.join(currentDirectory, directory);
  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(500).send("删除文件失败");
    } else {
      res.status(200).send("文件删除成功");
    }
  });
});

// 删除目录
app.delete("/api/directories", (req, res) => {
  const { directory } = req.body;
  const dirPath = path.join(currentDirectory, directory);
  fs.rm(dirPath, { recursive: true }, (err) => {
    if (err) {
      res.status(500).send("删除目录失败");
    } else {
      res.status(200).send("目录删除成功");
    }
  });
});

// 重命名文件
app.put("/api/files/rename", (req, res) => {
  const { name, directory } = req.body;
  const dir = path.dirname(directory);
  const oldFilePath = path.join(currentDirectory, directory);
  const newFilePath = path.join(currentDirectory, dir, `${name}.md`);
  fs.rename(oldFilePath, newFilePath, (err) => {
    if (err) {
      res.status(500).send("重命名文件失败");
    } else {
      res.status(200).send("文件重命名成功");
    }
  });
});

// 重命名目录
app.put("/api/directories/rename", (req, res) => {
  const { name, directory } = req.body;
  const dir = path.dirname(directory);
  const oldDirPath = path.join(currentDirectory, directory);
  const newDirPath = path.join(currentDirectory, dir, `${name}`);
  fs.rename(oldDirPath, newDirPath, (err) => {
    if (err) {
      if (err.code === "ENOTEMPTY") {
        // 目录不为空，需要递归重命名子目录和移动文件
        renameDir(oldDirPath, newDirPath)
          .then(() => {
            res.status(200).send("目录重命名成功");
          })
          .catch(() => {
            res.status(500).send("重命名目录失败");
          });
      } else {
        res.status(500).send("重命名目录失败");
      }
    } else {
      res.status(200).send("目录重命名成功");
    }
  });
});

// 递归重命名目录和移动文件
const renameDir = async (oldDirPath, newDirPath) => {
  const files = await fs.promises.readdir(oldDirPath);
  await Promise.all(
    files.map(async (file) => {
      const oldFilePath = path.join(oldDirPath, file);
      const newFilePath = path.join(newDirPath, file);
      const stats = await fs.promises.stat(oldFilePath);
      if (stats.isDirectory()) {
        await renameDir(oldFilePath, newFilePath);
      } else {
        await fs.promises.rename(oldFilePath, newFilePath);
      }
    })
  );
  await fs.promises.rm(oldDirPath);
};

// 设置目录
app.post("/api/set-directory", (req, res) => {
  currentDirectory = req.body.directory;
  app.use(currentDirectory, express.static(currentDirectory));
  res.status(200).send("目录设置成功");
});

// 获取文件 git 版本信息
app.get("/api/files/git", (req, res) => {
  const filePath = path.join(
    currentDirectory,
    decodeURIComponent(req.query.path)
  );
  exec(
    `git log --pretty=format:"%h - %an, %ar : %s" ${filePath}`,
    (err, stdout, _stderr) => {
      if (err) {
        res.status(500).send("获取Git版本信息失败");
      } else {
        const fileData = {
          gitLog: stdout,
        };
        res.status(200).send(fileData);
      }
    }
  );
});

// 添加通配符路由，重定向到 Vue 应用的入口文件
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "cms/dist/index.html"));
});

export default app;
