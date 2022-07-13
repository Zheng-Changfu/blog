const path = require("path");

const useConfig = () => {
  const getSSHConfig = () => {
    return {
      host: "root",
      port: 22,
      username: "root",
      password: "root",
    };
  };

  const getDistPath = () => {
    const localPath = path.resolve(__dirname, "../../docs/.vuepress/dist");
    const remotePath = "/data/blog";
    return {
      localPath,
      remotePath,
    };
  };

  const getNginxPath = () => {
    const localPath = path.resolve(__dirname, "../../nginx.conf");
    const remotePath = "/etc/nginx/default.d/blog.conf";
    const targetPath = "/etc/nginx/default.d";
    return {
      localPath,
      remotePath,
      targetPath,
    };
  };

  return {
    getSSHConfig,
    getDistPath,
    getNginxPath,
  };
};

module.exports = { useConfig };
