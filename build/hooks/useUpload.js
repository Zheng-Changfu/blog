const path = require("path");
const { cyan, red } = require("kolorist");

const useUpload = ({ getSSH, getDistPath, getNginxPath }) => {
  const ssh = getSSH();

  const uploadDist = async () => {
    console.log();
    console.log(cyan("开始上传 dist 目录"));

    const { localPath, remotePath } = getDistPath();
    return ssh
      .putDirectory(localPath, remotePath)
      .then(() => {
        console.log();
        console.log(cyan("上传 dist 目录成功"));
      })
      .catch((err) => {
        console.log();
        console.log(red("上传 dist 目录失败"));
        return Promise.reject(err);
      });
  };

  const uploadNginxConf = async () => {
    console.log();
    console.log(cyan("开始上传 nginx 配置文件"));

    const { localPath, remotePath } = getNginxPath();
    return ssh
      .putFile(localPath, remotePath)
      .then(() => {
        console.log();
        console.log(cyan("上传 nginx 配置文件成功"));
      })
      .catch((err) => {
        console.log();
        console.log(red("上传 nginx 配置文件失败"));
        return Promise.reject(err);
      });
  };

  return {
    uploadDist,
    uploadNginxConf,
  };
};

module.exports = { useUpload };
