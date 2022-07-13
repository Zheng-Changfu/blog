const { cyan, red } = require("kolorist");
const { NodeSSH } = require("node-ssh");

const useNodeSSH = ({ getSSHConfig }) => {
  const ssh = new NodeSSH();

  const login = () => {
    console.log();
    console.log(cyan("开始登录服务器"));

    const sshConfig = getSSHConfig();

    return ssh
      .connect(sshConfig)
      .then(() => {
        console.log();
        console.log(cyan("登录服务器成功"));
      })
      .catch((err) => {
        console.log(err, "err");
        console.log(red("登录服务器失败"));
        return Promise.reject(err);
      });
  };

  const getSSH = () => ssh;

  return {
    login,
    getSSH,
  };
};

module.exports = { useNodeSSH };
