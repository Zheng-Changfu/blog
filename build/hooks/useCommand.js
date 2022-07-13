const fs = require("fs");
const path = require("path");
const { cyan, red } = require("kolorist");

const useCommand = ({ getSSH, getDistPath, getNginxPath }) => {
  const ssh = getSSH();

  const isFile = (name) => name.endsWith(".html");

  const execFileCompress = async () => {
    console.log();
    console.log(cyan("开始压缩文件"));

    const { localPath, remotePath } = getDistPath();
    const ignoreFileList = ["index.html"]; // 不压缩
    const distDirectory = path.resolve(__dirname, localPath);
    const dirList = fs.readdirSync(distDirectory);

    for (let i = 0; i < dirList.length; i++) {
      const fileOrDirName = dirList[i];
      if (!ignoreFileList.includes(fileOrDirName)) {
        const isFileRel = isFile(fileOrDirName);
        const fileOrDirText = isFileRel ? "文件" : "目录";
        const command = isFileRel
          ? `gzip ${fileOrDirName}`
          : `gzip -r ${fileOrDirName}`;
        try {
          await ssh.execCommand(command, { cwd: remotePath });
          console.log();
          console.log(cyan(`压缩 ${fileOrDirName} ${fileOrDirText}成功`));
        } catch (error) {
          console.log();
          console.log(red(`压缩 ${fileOrDirName} ${fileOrDirText}失败`));
        }
      }
    }
  };

  const execNginxReload = () => {
    console.log();
    console.log(cyan("nginx 重启中"));

    const { targetPath } = getNginxPath();
    return ssh
      .execCommand("nginx -s reload", { cwd: targetPath })
      .then(() => {
        console.log();
        console.log(cyan("nginx 重启成功"));
      })
      .catch((err) => {
        console.log();
        console.log(red("nginx 重启失败"));
        return Promise.reject(err);
      });
  };

  const execDeleteDist = () => {
    console.log();
    console.log(cyan("开始删除之前的 dist 目录"));

    const { remotePath } = getDistPath();
    const command = `rm -rf ${remotePath}`;
    return ssh
      .execCommand(command, { cwd: remotePath })
      .then(() => {
        console.log();
        console.log(cyan("删除之前的 dist 目录成功"));
      })
      .catch((err) => {
        console.log();
        console.log(red("删除之前的 dist 目录失败"));
        return Promise.reject(err);
      });
  };

  const execDeleteNginx = () => {
    console.log();
    console.log(cyan("开始删除之前的 nginx 配置"));

    const { remotePath, targetPath } = getNginxPath();
    const command = `rm -rf ${remotePath}`;
    return ssh
      .execCommand(command, { cwd: targetPath })
      .then(() => {
        console.log();
        console.log(cyan("删除之前的 nginx 配置成功"));
      })
      .catch((err) => {
        console.log();
        console.log(red("删除之前的 nginx 配置失败"));
        return Promise.reject(err);
      });
  };

  return {
    execNginxReload,
    execFileCompress,
    execDeleteDist,
    execDeleteNginx,
  };
};

module.exports = { useCommand };
