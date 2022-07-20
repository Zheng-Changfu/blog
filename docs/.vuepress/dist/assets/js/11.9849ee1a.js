(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{385:function(t,s,n){"use strict";n.r(s);var a=n(45),_=Object(a.a)({},(function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h1",{attrs:{id:"nginx"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#nginx"}},[t._v("#")]),t._v(" Nginx")]),t._v(" "),n("h2",{attrs:{id:"_1-nginx-特点"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-nginx-特点"}},[t._v("#")]),t._v(" 1. Nginx 特点")]),t._v(" "),n("ul",[n("li",[t._v("高并发高性能")]),t._v(" "),n("li",[t._v("可扩展性好")]),t._v(" "),n("li",[t._v("高可靠性")]),t._v(" "),n("li",[t._v("热部署")]),t._v(" "),n("li",[t._v("开源许可证")])]),t._v(" "),n("h2",{attrs:{id:"_2-nginx-应用场景"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-nginx-应用场景"}},[t._v("#")]),t._v(" 2. Nginx 应用场景")]),t._v(" "),n("ul",[n("li",[t._v("静态资源服务器")]),t._v(" "),n("li",[t._v("反向代理服务")]),t._v(" "),n("li",[t._v("API 接口服务")])]),t._v(" "),n("h2",{attrs:{id:"_3-nginx-架构"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_3-nginx-架构"}},[t._v("#")]),t._v(" 3. Nginx 架构")]),t._v(" "),n("h3",{attrs:{id:"_3-1-nginx-工作流程"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-nginx-工作流程"}},[t._v("#")]),t._v(" 3.1 Nginx 工作流程")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx%E6%9E%B6%E6%9E%84%E5%9B%BE.png",alt:""}})]),t._v(" "),n("ol",[n("li",[t._v("Nginx 在启动后，会有一个"),n("code",[t._v("master")]),t._v("进程和多个相互独立的"),n("code",[t._v("worker")]),t._v("进程")]),t._v(" "),n("li",[t._v("接收来自外界的信号后，会向各个"),n("code",[t._v("worker")]),t._v("进程发送信号，每个进程都有可能来处理这个连接")]),t._v(" "),n("li",[n("code",[t._v("master")]),t._v("进程能监控"),n("code",[t._v("worker")]),t._v("进程的运行状态,当"),n("code",[t._v("worker")]),t._v("进程退出后(异常情况下),会自动启动新的"),n("code",[t._v("worker")]),t._v("进程")])]),t._v(" "),n("blockquote",[n("p",[t._v("worker 进程数量：一般会设置成机器(服务器)"),n("code",[t._v("cpu")]),t._v("核数,因为更多的"),n("code",[t._v("worker")]),t._v("数量，只会导致"),n("code",[t._v("worker")]),t._v("之间相互竞争"),n("code",[t._v("cpu")]),t._v(",从而带来不必要的上下文切换")]),t._v(" "),n("p",[t._v("使用多进程模式,不仅能提供并发率，而且"),n("code",[t._v("worker")]),t._v("之间相互独立，一个"),n("code",[t._v("worker")]),t._v("进程挂了不会影响到其他的"),n("code",[t._v("worker")]),t._v("进程")])]),t._v(" "),n("h3",{attrs:{id:"_3-2-io-多路复用"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-io-多路复用"}},[t._v("#")]),t._v(" 3.2 IO 多路复用")]),t._v(" "),n("h3",{attrs:{id:"_3-3-cpu-亲和"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_3-3-cpu-亲和"}},[t._v("#")]),t._v(" 3.3 CPU 亲和")]),t._v(" "),n("blockquote",[n("p",[t._v("把 CPU 内核和 Nginx 的工作进程绑定在一起，让每个"),n("code",[t._v("worker")]),t._v("进程固定在一个 CPU 上执行，从而减少 CPU 的切换并提高缓存命中率，提供性能")])]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-cpu%E4%BA%B2%E5%92%8C.png",alt:""}})]),t._v(" "),n("h3",{attrs:{id:"_3-4-sendfile"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_3-4-sendfile"}},[t._v("#")]),t._v(" 3.4 sendfile")]),t._v(" "),n("blockquote",[n("p",[t._v("sendfile:零拷贝传输模式")])]),t._v(" "),n("ul",[n("li",[n("p",[t._v("非 sendfile 模式")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-no-sendfile.png",alt:""}})]),t._v(" "),n("ol",[n("li",[t._v("客户端发送请求，请求资源")]),t._v(" "),n("li",[t._v("网卡告诉 nginx 去处理资源")]),t._v(" "),n("li",[t._v("nginx 告诉内核，去读取资源")]),t._v(" "),n("li",[t._v("内核会去读取硬盘中的资源")]),t._v(" "),n("li",[t._v("读取到的资源会放到内核的缓冲区中")]),t._v(" "),n("li",[t._v("内核将缓冲区中的资源放到 nginx 的缓冲区中")]),t._v(" "),n("li",[t._v("nginx 将资源放到网卡的缓冲区中")]),t._v(" "),n("li",[t._v("网卡将资源返回给客户端")])])]),t._v(" "),n("li",[n("p",[t._v("sendfile 模式")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-sendfile.png",alt:""}})]),t._v(" "),n("ol",[n("li",[t._v("客户端发送请求，请求资源")]),t._v(" "),n("li",[t._v("网卡告诉 nginx 去处理资源")]),t._v(" "),n("li",[t._v("nginx 告诉内核，去读取资源")]),t._v(" "),n("li",[t._v("内核会去读取硬盘中的资源")]),t._v(" "),n("li",[t._v("读取到的资源会放到内核的缓冲区中")]),t._v(" "),n("li",[t._v("内核将缓冲区中的资源直接放到网卡的缓冲区中")]),t._v(" "),n("li",[t._v("网卡将资源返回给客户端")])])])]),t._v(" "),n("h2",{attrs:{id:"_4-nginx-配置文件"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-nginx-配置文件"}},[t._v("#")]),t._v(" 4. Nginx 配置文件")]),t._v(" "),n("table",[n("thead",[n("tr",[n("th",[t._v("路径")]),t._v(" "),n("th",[t._v("用途")])])]),t._v(" "),n("tbody",[n("tr",[n("td",[t._v("/etc/nginx/nginx.conf")]),t._v(" "),n("td",[t._v("核心配置文件")])]),t._v(" "),n("tr",[n("td",[t._v("/etc/nginx/conf.d/default.conf")]),t._v(" "),n("td",[t._v("默认 http 服务器配置文件")])])])]),t._v(" "),n("blockquote",[n("p",[t._v("一个 main 内部有一个 http\n一个 http 下可以配置多个 server\n一个 server 下可以配置多个 location")])]),t._v(" "),n("div",{staticClass:"language-bash extra-class"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# /etc/nginx/nginx.conf文件")]),t._v("\nuser nginx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 设置nginx服务的系统使用用户")]),t._v("\nworker_processes auto"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# nginx的工作进程数量，一般和服务器cpu核数相等")]),t._v("\nerror_log /var/log/nginx/error.log"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 错误日志的输出位置")]),t._v("\npid /run/nginx.pid"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# nginx启动后进程id的输出位置")]),t._v("\n\ninclude /usr/share/nginx/modules/*.conf"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 包含")]),t._v("\n\nevents "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    worker_connections "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("1024")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 每个进程允许的最大woker连接数")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\nhttp "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 在nginx访问日志中可查看详细信息")]),t._v("\n    log_format  main  "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'$remote_addr - $remote_user [$time_local] \"$request\" '")]),t._v("\n                      "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'$status $body_bytes_sent \"$http_referer\" '")]),t._v("\n                      "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('\'"$http_user_agent" "$http_x_forwarded_for"\'')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 日志记录的格式")]),t._v("\n\n    access_log  /var/log/nginx/access.log  main"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 默认访问的日志")]),t._v("\n\n    sendfile            on"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 是否开启零拷贝模式")]),t._v("\n    tcp_nopush          on"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 是否开启懒发送模式,攒够一波数据包之后在发送")]),t._v("\n    tcp_nodelay         on"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 小的数据包不等待直接传输，实时传输")]),t._v("\n    keepalive_timeout   "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("65")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 保持连接的超时时间，单位秒")]),t._v("\n    types_hash_max_size "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("4096")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 影响散列表的冲突率，值越大，就会消耗更多的内存，但散列key的冲突率会降低，检索速度就更快")]),t._v("\n\n    include             /etc/nginx/mime.types"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 文件类型和文件后缀的对应关系")]),t._v("\n    default_type        application/octet-stream"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 以上没有处理到的文件类型，默认为二进制类型")]),t._v("\n\n    include /etc/nginx/default.d/*.conf"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 包含/etc/nginx/default.d/目录下的所有子配置文件")]),t._v("\n\n\n\t"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 服务")]),t._v("\n\t"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 一个main内部有一个http")]),t._v("\n\t"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 一个http下可以配置多个server")]),t._v("\n\t"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 一个server下可以配置多个location")]),t._v("\n    server "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n       listen       "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# nginx默认监听的端口号")]),t._v("\n       server_name  chengxiaohui.com"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 根据server_name来匹配地址，可以是域名,ip地址")]),t._v("\n       root         /usr/share/nginx/html"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# nginx的静态文件根目录")]),t._v("\n       error_page "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("404")]),t._v(" /404.html"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 当状态码为404时，返回404文件,/404.html === /usr/share/nginx/html/404.html")]),t._v("\n\n       "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 匹配地址：完全匹配")]),t._v("\n       location "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" /404.html "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n       \t charset utf-8"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 配置字符集")]),t._v("\n       "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n       error_page "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("500")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("502")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("503")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("504")]),t._v(" /50x.html"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 当状态码为500/502/503/504时，返回的文件,/50x.html === /usr/share/nginx/html/50x.html")]),t._v("\n       "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 匹配地址: 完全匹配")]),t._v("\n       location "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" /50x.html "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n       "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("h2",{attrs:{id:"_5-nginx-请求-flow"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_5-nginx-请求-flow"}},[t._v("#")]),t._v(" 5. Nginx 请求-Flow")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-request-flow.png",alt:""}})]),t._v(" "),n("ol",[n("li",[t._v("客户端发送请求，请求资源")]),t._v(" "),n("li",[t._v("nginx 读取请求行、请求头、请求体")]),t._v(" "),n("li",[t._v("分析请求地址要使用哪个 server 配置块")]),t._v(" "),n("li",[t._v("分析请求地址命中某一个 location，重写或读取配置")]),t._v(" "),n("li",[t._v("进行访问控制，限制每个 IP 的并发数")]),t._v(" "),n("li",[t._v("进行权限认证判断")]),t._v(" "),n("li",[t._v("生成内容，内容生成方式\n"),n("ol",[n("li",[t._v("直接返回的内容")]),t._v(" "),n("li",[t._v("读取硬盘文件的内容")]),t._v(" "),n("li",[t._v("反向代理拿到的内容")])])]),t._v(" "),n("li",[t._v("进行响应过滤(gzip 压缩等)")]),t._v(" "),n("li",[t._v("生成访问、会话日志")]),t._v(" "),n("li",[t._v("返回内容给客户端")])]),t._v(" "),n("h2",{attrs:{id:"_6-nginx-的相关命令"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_6-nginx-的相关命令"}},[t._v("#")]),t._v(" 6. Nginx 的相关命令")]),t._v(" "),n("div",{staticClass:"language-bash extra-class"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 启动")]),t._v("\nsystemctl start nginx.service\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 停止")]),t._v("\nsystemctl stop nginx.service\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 重启,重新加载配置文件")]),t._v("\nsystemctl reload nginx.service\nnginx -s reload\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 重启，不重新加载配置文件")]),t._v("\nsystemctl restart nginx.service\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 检测配置是否通过测试")]),t._v("\nnginx -t\n")])])]),n("h2",{attrs:{id:"_7-三次握手四次挥手过程"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_7-三次握手四次挥手过程"}},[t._v("#")]),t._v(" 7. 三次握手四次挥手过程")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/http-ss.png",alt:""}})]),t._v(" "),n("h2",{attrs:{id:"_8-nginx-访问日志"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_8-nginx-访问日志"}},[t._v("#")]),t._v(" 8. Nginx 访问日志")]),t._v(" "),n("table",[n("thead",[n("tr",[n("th",[t._v("路径")]),t._v(" "),n("th",[t._v("描述")])])]),t._v(" "),n("tbody",[n("tr",[n("td",[t._v("/var/log/nginx/access.log")]),t._v(" "),n("td",[t._v("访问日志")])]),t._v(" "),n("tr",[n("td",[t._v("/var/log/nginx/error.log")]),t._v(" "),n("td",[t._v("错误日志")])])])]),t._v(" "),n("h3",{attrs:{id:"_8-1-log-format-解释"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_8-1-log-format-解释"}},[t._v("#")]),t._v(" 8.1 log_format 解释")]),t._v(" "),n("table",[n("thead",[n("tr",[n("th",[t._v("名称")]),t._v(" "),n("th",[t._v("描述")])])]),t._v(" "),n("tbody",[n("tr",[n("td",[t._v("$remote_addr")]),t._v(" "),n("td",[t._v("客户端地址")])]),t._v(" "),n("tr",[n("td",[t._v("$remote_user")]),t._v(" "),n("td",[t._v("客户端用户名称")])]),t._v(" "),n("tr",[n("td",[t._v("$time_local")]),t._v(" "),n("td",[t._v("访问时间和时区")])]),t._v(" "),n("tr",[n("td",[t._v("$request")]),t._v(" "),n("td",[t._v("请求行")])]),t._v(" "),n("tr",[n("td",[t._v("$status")]),t._v(" "),n("td",[t._v("http 请求状态")])]),t._v(" "),n("tr",[n("td",[t._v("$body_bytes_sent")]),t._v(" "),n("td",[t._v("发送给客户端文件内容大小")])]),t._v(" "),n("tr",[n("td",[t._v("$http_referer")]),t._v(" "),n("td",[t._v("从哪个地址（来源）过来的")])]),t._v(" "),n("tr",[n("td",[t._v("$http_user_agent")]),t._v(" "),n("td",[t._v("用户发送请求时用的浏览器")])]),t._v(" "),n("tr",[n("td",[t._v("$http_x_forwarded_for")]),t._v(" "),n("td",[t._v("记录代理过程")])])])]),t._v(" "),n("h2",{attrs:{id:"_9-实战-nginx"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_9-实战-nginx"}},[t._v("#")]),t._v(" 9. 实战 Nginx")]),t._v(" "),n("h3",{attrs:{id:"_9-1-压缩"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_9-1-压缩"}},[t._v("#")]),t._v(" 9.1 压缩")]),t._v(" "),n("table",[n("thead",[n("tr",[n("th",[t._v("名称")]),t._v(" "),n("th",[t._v("语法")]),t._v(" "),n("th",[t._v("上下文")]),t._v(" "),n("th",[t._v("描述")]),t._v(" "),n("th",[t._v("code")])])]),t._v(" "),n("tbody",[n("tr",[n("td",[t._v("gzip")]),t._v(" "),n("td",[t._v("gizp on / off")]),t._v(" "),n("td",[t._v("http,server,location")]),t._v(" "),n("td",[t._v("压缩文件")]),t._v(" "),n("td",[t._v("gzip on;")])]),t._v(" "),n("tr",[n("td",[t._v("gzip_static")]),t._v(" "),n("td",[t._v("gzip_static on / off")]),t._v(" "),n("td",[t._v("http,server,location")]),t._v(" "),n("td",[t._v("先查找.gz 文件,节省 cpu 计算")]),t._v(" "),n("td",[t._v("gzip_static on;")])]),t._v(" "),n("tr",[n("td",[t._v("gzip_min_length")]),t._v(" "),n("td",[t._v("gzip_min_length size")]),t._v(" "),n("td",[t._v("http,server,location")]),t._v(" "),n("td",[t._v("只压缩超过 size 大小的文件")]),t._v(" "),n("td",[t._v("gzip_min_length 3k;")])]),t._v(" "),n("tr",[n("td",[t._v("gzip_comp_level")]),t._v(" "),n("td",[t._v("gzip_comp_level [1-10]")]),t._v(" "),n("td",[t._v("http,server,location")]),t._v(" "),n("td",[t._v("压缩比例越高，文件被压缩的体积越小")]),t._v(" "),n("td",[t._v("gzip_min_length 7;")])]),t._v(" "),n("tr",[n("td",[t._v("gzip_types")]),t._v(" "),n("td",[t._v("gzip_types [content-type]")]),t._v(" "),n("td",[t._v("http,server,location")]),t._v(" "),n("td",[t._v("要压缩的文件类型")]),t._v(" "),n("td",[t._v("gzip_types applicaton/javascript;")])]),t._v(" "),n("tr",[n("td",[t._v("gzip_http_version")]),t._v(" "),n("td",[t._v("gzip_types [http-version]")]),t._v(" "),n("td",[t._v("http,server,location")]),t._v(" "),n("td",[t._v("启用 gzip 压缩所需的 HTTP 最低版本")]),t._v(" "),n("td",[t._v("gzip_http_version 1.1;")])])])]),t._v(" "),n("ul",[n("li",[n("p",[t._v("nginx 配置")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-gzip-code.png",alt:""}})])]),t._v(" "),n("li",[n("p",[t._v("包的体积 -> 压缩前")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-gzip-linux-off.png",alt:""}})])]),t._v(" "),n("li",[n("p",[t._v("包的体积 -> 压缩后")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-gzip-linux-on.png",alt:""}})])]),t._v(" "),n("li",[n("p",[t._v("网站资源包大小 -> 压缩前")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-gzip-off.png",alt:""}})])]),t._v(" "),n("li",[n("p",[t._v("网站资源包大小 -> 压缩后")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-gzip-on.png",alt:""}})])])]),t._v(" "),n("h3",{attrs:{id:"_9-2-内容替换"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_9-2-内容替换"}},[t._v("#")]),t._v(" 9.2 内容替换")]),t._v(" "),n("ul",[n("li",[n("p",[t._v("nginx 配置")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-sub-filter-code.png",alt:""}})])]),t._v(" "),n("li",[n("p",[t._v("配置后")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-sub-filter-result.png",alt:""}})])])]),t._v(" "),n("h3",{attrs:{id:"_9-3-连接限制-暂不填写"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_9-3-连接限制-暂不填写"}},[t._v("#")]),t._v(" 9.3 连接限制(暂不填写)")]),t._v(" "),n("h3",{attrs:{id:"_9-4-请求限制-暂不填写"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_9-4-请求限制-暂不填写"}},[t._v("#")]),t._v(" 9.4 请求限制(暂不填写)")]),t._v(" "),n("h3",{attrs:{id:"_9-5-访问控制-暂不填写"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_9-5-访问控制-暂不填写"}},[t._v("#")]),t._v(" 9.5 访问控制(暂不填写)")]),t._v(" "),n("h3",{attrs:{id:"_9-6-跨域"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_9-6-跨域"}},[t._v("#")]),t._v(" 9.6 跨域")]),t._v(" "),n("ul",[n("li",[n("p",[t._v("nginx 配置")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-request-cross-code.png",alt:""}})])]),t._v(" "),n("li",[n("p",[t._v("nginx 配置前")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-html-request-code.png",alt:""}})]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-html-request-cross.png",alt:""}})])]),t._v(" "),n("li",[n("p",[t._v("nginx 配置后")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-html-request-result.png",alt:""}})])])]),t._v(" "),n("h3",{attrs:{id:"_9-7-防盗链"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_9-7-防盗链"}},[t._v("#")]),t._v(" 9.7 防盗链")]),t._v(" "),n("ul",[n("li",[t._v("防止网站资源被盗用")]),t._v(" "),n("li",[t._v("保证信息安全")]),t._v(" "),n("li",[t._v("防止流量过量")]),t._v(" "),n("li",[t._v("需要区别哪些请求是非正常的用户请求")]),t._v(" "),n("li",[t._v("使用"),n("code",[t._v("http_refer")]),t._v("防盗链")])]),t._v(" "),n("table",[n("tr",[n("th",[t._v("变量名")]),t._v(" "),n("th",[t._v("参数")]),t._v(" "),n("th",[t._v("描述")])]),t._v(" "),n("tr",[n("td",{attrs:{rowspan:"5"}},[t._v("valid_referers")]),t._v(" "),n("td"),t._v(" "),n("td",[t._v("定义白名单列表")])]),t._v(" "),n("tr",[n("td",[t._v("none")]),t._v(" "),n("td",[t._v("没有refer来源")])]),t._v(" "),n("tr",[n("td",[t._v("blocked")]),t._v(" "),n("td",[t._v("被防火墙过滤标记过的请求,非正式HTTP请求")])]),t._v(" "),n("tr",[n("td",[t._v("IP")]),t._v(" "),n("td",[t._v("特定的IP地址")])]),t._v(" "),n("tr",[n("td",[t._v("server_names")]),t._v(" "),n("td",[t._v("指定的服务名称(域名)")])]),t._v(" "),n("tr",[n("td",[t._v("$invalid_referer")]),t._v(" "),n("td"),t._v(" "),n("td",[t._v("是否通过,0代表通过,1代表不通过")])])]),t._v(" "),n("ul",[n("li",[n("p",[t._v("nginx 配置")]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-referer-off.png",alt:""}})])]),t._v(" "),n("li",[n("p",[t._v('curl -v -e "1.15.51.4" tb-c.chengxiaohui.com/logo.jpg')])]),t._v(" "),n("li",[n("p",[t._v('curl -v -e "http://www.baidu.com" tb-c.chengxiaohui.com/logo.jpg')]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-referer-on.png",alt:""}})])])]),t._v(" "),n("h2",{attrs:{id:"_10-正向代理"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_10-正向代理"}},[t._v("#")]),t._v(" 10. 正向代理")]),t._v(" "),n("blockquote",[n("p",[t._v("代理客户端，服务端不知道实际发起请求的客户端")])]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-positive-proxy.png",alt:""}})]),t._v(" "),n("ul",[n("li",[t._v("小明想访问 google，直接访问访问不到")]),t._v(" "),n("li",[t._v("通过一个代理服务器，代理服务器去访问 google 可以访问到")]),t._v(" "),n("li",[t._v("访问到的资源在通过代理服务器转发给小明")]),t._v(" "),n("li",[t._v("小明就可以看到 google 的内容了")])]),t._v(" "),n("h2",{attrs:{id:"_11-反向代理"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_11-反向代理"}},[t._v("#")]),t._v(" 11. 反向代理")]),t._v(" "),n("blockquote",[n("p",[t._v("代理服务端，客户端不知道实际提供服务的服务端")])]),t._v(" "),n("p",[n("img",{attrs:{src:"/assets/nginx-reverse-proxy.png",alt:""}})]),t._v(" "),n("ul",[n("li",[t._v("小明在写代码的过程中写了很多接口")]),t._v(" "),n("li",[t._v("这些接口的前缀都是某一个域名或 IP 地址")]),t._v(" "),n("li",[t._v("实际上这些接口里面一部分接口来自 a 服务器，一部分接口来自 b 服务器的，还有一部分接口来自 c 服务器的")]),t._v(" "),n("li",[t._v("但是小明是不知道的，小明只需要把接口地址写成代理的服务器地址就可以访问到 a、b、c 三台服务器返回的接口内容了")]),t._v(" "),n("li",[t._v("实际上是通过代理服务器去转发到不同的 a、b、c 三台服务器上，响应到的内容通过代理服务器转发给小明的")])]),t._v(" "),n("h3",{attrs:{id:"_11-1-相关变量"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_11-1-相关变量"}},[t._v("#")]),t._v(" 11.1 相关变量")]),t._v(" "),n("table",[n("thead",[n("tr",[n("th",[t._v("变量名")]),t._v(" "),n("th",[t._v("变量值")]),t._v(" "),n("th",[t._v("描述")])])]),t._v(" "),n("tbody",[n("tr",[n("td",[t._v("proxy_pass")]),t._v(" "),n("td",[t._v("要被代理到的服务器地址")]),t._v(" "),n("td",[t._v("要被代理到的服务器地址")])]),t._v(" "),n("tr",[n("td",[t._v("proxy_redirect")]),t._v(" "),n("td",[t._v("重定向地址")]),t._v(" "),n("td",[t._v("重定向地址")])]),t._v(" "),n("tr",[n("td",[t._v("proxy_set_header")]),t._v(" "),n("td",[t._v("要传递的信息")]),t._v(" "),n("td",[t._v("会将信息传递给应用服务器(代理到的服务器)")])]),t._v(" "),n("tr",[n("td",[t._v("proxy_connect_timeout")]),t._v(" "),n("td",[t._v("时间(秒)")]),t._v(" "),n("td",[t._v("默认超时时间")])]),t._v(" "),n("tr",[n("td",[t._v("proxy_send_timeout")]),t._v(" "),n("td",[t._v("时间(秒)")]),t._v(" "),n("td",[t._v("发送超时时间")])]),t._v(" "),n("tr",[n("td",[t._v("proxy_read_timeout")]),t._v(" "),n("td",[t._v("时间(秒)")]),t._v(" "),n("td",[t._v("读取超时时间")])]),t._v(" "),n("tr",[n("td"),t._v(" "),n("td",[t._v("$http_host")]),t._v(" "),n("td",[t._v("请求头信息")])]),t._v(" "),n("tr",[n("td"),t._v(" "),n("td",[t._v("$remote_addr")]),t._v(" "),n("td",[t._v("真实 IP 信息")])])])]),t._v(" "),n("h3",{attrs:{id:"_11-2-proxy-pass-注意点"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_11-2-proxy-pass-注意点"}},[t._v("#")]),t._v(" 11.2 proxy_pass 注意点")]),t._v(" "),n("div",{staticClass:"language-bash extra-class"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 1.`proxy_pass`后的url最后加上/就是绝对根路径，location中匹配的路径部分不走代理,也就是说会被替换掉")]),t._v("\nlocation /a/ "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    proxy_pass http://127.0.0.1/b/"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n请求http://example.com/a/test.html 会被代理到http://127.0.0.1/b/test.html\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 2.`proxy_pass`后的url最后没有/就是相对路径，location中匹配的路径部分会走代理,也就是说会保留")]),t._v("\nlocation /a/ "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    proxy_pass http://127.0.0.1"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n请求http://example/a/test.html 会被代理到http://127.0.0.1/a/test.html\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 3.在proxy_pass前面用了rewrite，这种情况下，proxy_pass是无效的")]),t._v("\nlocation /getName/ "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  rewrite    /getName/"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("^/"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("+"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" /users?name"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),n("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$1")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("break")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  proxy_pass http://127.0.0.1"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("h3",{attrs:{id:"_11-3-反向代理实战"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_11-3-反向代理实战"}},[t._v("#")]),t._v(" 11.3 反向代理实战")]),t._v(" "),n("div",{staticClass:"language-bash extra-class"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 1.创建目录")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("mkdir")]),t._v(" /data/proxy-server\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 2.进入目录")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("cd")]),t._v(" /data/proxy-server\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 3.创建并编辑文件")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("vi")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("3000")]),t._v(".js\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 4.文件内代码")]),t._v("\nconst http "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" require"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'http'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nconst server "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" http.createServer"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("((")]),t._v("req, res"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n console.log"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("req.headers"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n res.end"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'3000'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nserver.listen"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("3000")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 5.下载node")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("wget")]),t._v(" https://nodejs.org/dist/v14.17.5/node-v14.17.5-linux-x64.tar.xz\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 6.解压")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("tar")]),t._v(" -xvf node-v14.17.5-linux-x64.tar.xz\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 7.设置环境变量")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("vi")]),t._v(" ~/.bashrc\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 8.环境变量文件内配置")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# /root/node-v14.17.5-linux-x64/bin为安装路径目录")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("export")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token assign-left variable"}},[n("span",{pre:!0,attrs:{class:"token environment constant"}},[t._v("PATH")])]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),n("span",{pre:!0,attrs:{class:"token environment constant"}},[t._v("$PATH")]),t._v(":/root/node-v14.17.5-linux-x64/bin\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 9.刷新环境变量")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("source")]),t._v(" ~/.bashrc\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 10.检测安装是否成功")]),t._v("\nnode -v\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 11.启动node服务")]),t._v("\nnode "),n("span",{pre:!0,attrs:{class:"token number"}},[t._v("3000")]),t._v(".js\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 12.nginx配置")]),t._v("\nserver_name  tb-c.chengxiaohui.com"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nlocation ~ ^/api "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  proxy_pass http://localhost:3000"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 代理到的目标服务器地址")]),t._v("\n  proxy_set_header HOST "),n("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$http_host")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 向后传递请求头信息")]),t._v("\n  proxy_set_header X-Real-IP "),n("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$remote_addr")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 想后传递真实ip")]),t._v("\n  proxy_set_header X-Forwarded-For "),n("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$proxy_add_x_forwarded_for")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 向后传递代理过程")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 13.发送请求")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("curl")]),t._v(" tb-c.chengxiaohui.com/api\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 14.结果")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'3000'")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 15.打印req.headers结果")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  host: "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'tb-c.chengxiaohui.com'")]),t._v(", "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# node服务中获取的域名地址")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'x-real-ip'")]),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'1.15.51.4'")]),t._v(", "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# node服务中获取到的真实ip地址")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'x-forwarded-for'")]),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'1.15.51.4'")]),t._v(", "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 记录代理过程的所有ip")]),t._v("\n  connection: "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'close'")]),t._v(",\n  "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'user-agent'")]),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'curl/7.29.0'")]),t._v(",\n  accept: "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'*/*'")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("h2",{attrs:{id:"_12-负载均衡"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_12-负载均衡"}},[t._v("#")]),t._v(" 12. 负载均衡")]),t._v(" "),n("h2",{attrs:{id:"_13-location"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_13-location"}},[t._v("#")]),t._v(" 13. location")]),t._v(" "),n("h2",{attrs:{id:"_14-rewrite"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_14-rewrite"}},[t._v("#")]),t._v(" 14. rewrite")])])}),[],!1,null,null,null);s.default=_.exports}}]);