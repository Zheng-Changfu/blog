const { useCommand } = require("./hooks/useCommand");
const { useConfig } = require("./hooks/useConfig");
const { useNodeSSH } = require("./hooks/useNodeSSH");
const { useUpload } = require("./hooks/useUpload");
const { yellow, blue } = require('kolorist')

const { getSSHConfig, getDistPath, getNginxPath } = useConfig();
const { login, getSSH } = useNodeSSH({ getSSHConfig });

const { uploadDist, uploadNginxConf } = useUpload({
  getSSH,
  getDistPath,
  getNginxPath,
});

const { execNginxReload, execFileCompress, execDeleteDist, execDeleteNginx } =
  useCommand({
    getSSH,
    getDistPath,
    getNginxPath,
  });

// 流水线配置
const deployList = [
  login, // 登录服务器
  execDeleteDist, // 删除之前的dist
  execDeleteNginx, // 删除之前的nginx配置
  uploadDist, // 上传dist
  uploadNginxConf, // 上传nginx配置
  execFileCompress, // 文件压缩
  execNginxReload, // nginx刷新
];

// 开始流水线
const startDeploy = async (deployList, index = 0) => {
  const task = deployList[index];
  if (!task) return;
  await task();
  return startDeploy(deployList, index + 1);
};
startDeploy(deployList).then(() => {
  console.log()
  console.log(yellow(`部署成功: 链接 ${blue('http://chengxiaohui.com')}`))
  process.exit()
})
