(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{383:function(a,s,t){"use strict";t.r(s);var e=t(45),r=Object(e.a)({},(function(){var a=this,s=a.$createElement,t=a._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h1",{attrs:{id:"webpack-5-个人笔记"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#webpack-5-个人笔记"}},[a._v("#")]),a._v(" Webpack-5 个人笔记")]),a._v(" "),t("h2",{attrs:{id:"_1-基础"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-基础"}},[a._v("#")]),a._v(" 1. 基础")]),a._v(" "),t("h3",{attrs:{id:"_1-核心概念"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-核心概念"}},[a._v("#")]),a._v(" 1. 核心概念")]),a._v(" "),t("ul",[t("li",[a._v("entry(入口) : 指示 webpack 应该使用哪个模块，来作为构建其内部 依赖图 的开始")]),a._v(" "),t("li",[a._v("output(出口) : 告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件")]),a._v(" "),t("li",[a._v("loader : webpack 只能理解 JavaScript 和 JSON 文件，loader 让 webpack 能够去处理其他类型的文件")]),a._v(" "),t("li",[a._v("plugin : loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量")]),a._v(" "),t("li",[a._v("mode : 通过选择 development, production 或 none 之中的一个，来设置 mode 参数，你可以启用 webpack 内置在相应环境下的优化。其默认值为 production")])]),a._v(" "),t("h3",{attrs:{id:"_2-环境变量"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-环境变量"}},[a._v("#")]),a._v(" 2. 环境变量")]),a._v(" "),t("ol",[t("li",[a._v("--mode 用来设置模块内的 "),t("code",[a._v("process.env.NODE_ENV")])]),a._v(" "),t("li",[a._v("--env 用来设置 webpack 配置文件的函数参数，配置文件要写成函数形式")]),a._v(" "),t("li",[a._v("DefinePlugin 用来设置模块内的全局变量,是 webpack 的一个插件")]),a._v(" "),t("li",[a._v("cross-env 用来设置 node 环境的 "),t("code",[a._v("process.env.NODE_ENV")]),a._v(",也是比较常用的")])]),a._v(" "),t("h3",{attrs:{id:"_3-开发服务器"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-开发服务器"}},[a._v("#")]),a._v(" 3. 开发服务器")]),a._v(" "),t("h4",{attrs:{id:"_3-1-理解以下-path-的作用及区别"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-理解以下-path-的作用及区别"}},[a._v("#")]),a._v(" 3.1 理解以下 path 的作用及区别")]),a._v(" "),t("table",[t("thead",[t("tr",[t("th",[a._v("类别")]),a._v(" "),t("th",[a._v("配置名称")]),a._v(" "),t("th",[a._v("描述")]),a._v(" "),t("th",[a._v("配置")]),a._v(" "),t("th",[a._v("打包后")])])]),a._v(" "),t("tbody",[t("tr",[t("td",[a._v("output")]),a._v(" "),t("td",[a._v("path")]),a._v(" "),t("td",[a._v("输出到硬盘上的目录路径")]),a._v(" "),t("td",[t("img",{attrs:{src:"/assets/output.png",alt:""}})]),a._v(" "),t("td",[t("img",{attrs:{src:"/assets/output-result.png",alt:""}})])]),a._v(" "),t("tr",[t("td",[a._v("output")]),a._v(" "),t("td",[a._v("publicPath")]),a._v(" "),t("td",[a._v("打包生成的 html 文件里面引用的资源路径前缀")]),a._v(" "),t("td",[t("img",{attrs:{src:"/assets/output-publicPath.png",alt:""}})]),a._v(" "),t("td",[t("img",{attrs:{src:"/assets/output-publicPath-result.png",alt:""}})])]),a._v(" "),t("tr",[t("td",[a._v("devServer")]),a._v(" "),t("td",[a._v("publicPath")]),a._v(" "),t("td",[a._v("同 output.publicPath 一样，只不过优先级比它高")]),a._v(" "),t("td",[a._v("同 output.publicPath")]),a._v(" "),t("td",[a._v("同 output.publicPath")])]),a._v(" "),t("tr",[t("td",[a._v("devServer")]),a._v(" "),t("td",[a._v("contentBase")]),a._v(" "),t("td",[a._v("用于配置额外静态文件内容目录的路径")]),a._v(" "),t("td",[t("img",{staticStyle:{zoom:"200%"},attrs:{src:"/assets/content-base.png"}})]),a._v(" "),t("td",[t("img",{staticStyle:{zoom:"200%"},attrs:{src:"/assets/content-base-result.png"}})])])])]),a._v(" "),t("h3",{attrs:{id:"_4-use-的三种格式"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-use-的三种格式"}},[a._v("#")]),a._v(" 4. use 的三种格式")]),a._v(" "),t("ol",[t("li",[a._v("字符串格式: 一个 loader 的时候可以")]),a._v(" "),t("li",[a._v("数组格式: 多个 loader 的时候可以, (从下往上|从右往左)依次执行")]),a._v(" "),t("li",[a._v("对象格式: 给 loader 传参的时候可以用，一般写 options，options 里面的配置会传递给 loader")])]),a._v(" "),t("h3",{attrs:{id:"_5-loader"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_5-loader"}},[a._v("#")]),a._v(" 5. loader")]),a._v(" "),t("table",[t("thead",[t("tr",[t("th",[a._v("loader")]),a._v(" "),t("th",[a._v("意义")]),a._v(" "),t("th",[a._v("js-code")]),a._v(" "),t("th",[a._v("配置")]),a._v(" "),t("th",[a._v("打包后")])])]),a._v(" "),t("tbody",[t("tr",[t("td",[a._v("raw-loader")]),a._v(" "),t("td",[a._v("解析原始文件")]),a._v(" "),t("td",[t("img",{attrs:{src:"/assets/raw-loader-code.png",alt:""}})]),a._v(" "),t("td",[t("img",{attrs:{src:"/assets/raw-loader.png",alt:""}})]),a._v(" "),t("td",[t("img",{attrs:{src:"/assets/raw-loader-result.png",alt:""}})])]),a._v(" "),t("tr",[t("td",[a._v("css-loader")]),a._v(" "),t("td",[a._v("解析@import 和 url")]),a._v(" "),t("td",[t("img",{attrs:{src:"/assets/css-loader-result.png",alt:""}})]),a._v(" "),t("td",[t("img",{attrs:{src:"/assets/css-loader.png",alt:""}})]),a._v(" "),t("td")]),a._v(" "),t("tr",[t("td",[a._v("style-loader")]),a._v(" "),t("td",[a._v("将 css 插入到 DOM 中")]),a._v(" "),t("td"),a._v(" "),t("td",[t("img",{attrs:{src:"/assets/css-loader.png",alt:""}})]),a._v(" "),t("td",[t("img",{staticStyle:{zoom:"200%"},attrs:{src:"/assets/style-loader-result.png"}})])]),a._v(" "),t("tr",[t("td",[a._v("file-loader")]),a._v(" "),t("td",[a._v("拷贝图片至打包目录下")]),a._v(" "),t("td"),a._v(" "),t("td",[t("img",{attrs:{src:"/assets/file-loader.png",alt:""}})]),a._v(" "),t("td",[t("img",{attrs:{src:"/assets/file-loader-result.png",alt:""}})])]),a._v(" "),t("tr",[t("td",[a._v("url-loader")]),a._v(" "),t("td",[a._v("当图片小于"),t("code",[a._v("limit")]),a._v("的时候会把图片"),t("code",[a._v("BASE64")]),a._v("编码，大于"),t("code",[a._v("limit")]),a._v("参数的时候还是使用"),t("code",[a._v("file-loader")]),a._v("进行拷贝")]),a._v(" "),t("td"),a._v(" "),t("td",[t("img",{attrs:{src:"/assets/url-loader.png",alt:""}})]),a._v(" "),t("td")])])]),a._v(" "),t("h3",{attrs:{id:"_6-css-兼容性处理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_6-css-兼容性处理"}},[a._v("#")]),a._v(" 6. css 兼容性处理")]),a._v(" "),t("h4",{attrs:{id:"_6-1-安装"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_6-1-安装"}},[a._v("#")]),a._v(" 6.1 安装")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[a._v("npm")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("install")]),a._v(" postcss-loader autoprefixer -D\n")])])]),t("h4",{attrs:{id:"_6-2-配置"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_6-2-配置"}},[a._v("#")]),a._v(" 6.2 配置")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/postcss-loader.png",alt:""}})]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/postcss.config.js.png",alt:""}})]),a._v(" "),t("h4",{attrs:{id:"_6-3-结果"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_6-3-结果"}},[a._v("#")]),a._v(" 6.3 结果")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/postcss-loader-result.png",alt:""}})]),a._v(" "),t("h3",{attrs:{id:"_7-js-兼容性处理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_7-js-兼容性处理"}},[a._v("#")]),a._v(" 7. js 兼容性处理")]),a._v(" "),t("h4",{attrs:{id:"_7-1-安装"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_7-1-安装"}},[a._v("#")]),a._v(" 7.1 安装")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[a._v("npm")]),a._v(" i babel-loader @babel/core @babel/preset-env -D\n")])])]),t("h4",{attrs:{id:"_7-2-包说明"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_7-2-包说明"}},[a._v("#")]),a._v(" 7.2 包说明")]),a._v(" "),t("blockquote",[t("p",[a._v("babel-loader : 不知道如何处理和转换 js 代码，内部会调用 @babel/core")]),a._v(" "),t("p",[a._v("@babel/core : 认识 js 代码，但是不知道怎么转换，内部会调用 @babel/preset-env")]),a._v(" "),t("p",[a._v("@babel/preset-env : 插件的集合被打成了一个包，这个包就叫预设，可以将高级语法转换成低级语法")])]),a._v(" "),t("h3",{attrs:{id:"_8-sourcemap-源映射"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-sourcemap-源映射"}},[a._v("#")]),a._v(" 8. sourcemap(源映射)")]),a._v(" "),t("h4",{attrs:{id:"_8-1-基本认识"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-1-基本认识"}},[a._v("#")]),a._v(" 8.1 基本认识")]),a._v(" "),t("table",[t("thead",[t("tr",[t("th",[a._v("关键字")]),a._v(" "),t("th",[a._v("含义")])])]),a._v(" "),t("tbody",[t("tr",[t("td",[a._v("source-map")]),a._v(" "),t("td",[a._v("产生.map 的映射文件")])]),a._v(" "),t("tr",[t("td",[a._v("eval")]),a._v(" "),t("td",[a._v("使用 eval 函数包裹模块代码")])]),a._v(" "),t("tr",[t("td",[a._v("cheap")]),a._v(" "),t("td",[a._v("不包含列信息，也不包含 loader 的 sourcemap")])]),a._v(" "),t("tr",[t("td",[a._v("module")]),a._v(" "),t("td",[a._v("包含 loader 的 sourcemap，否则无法映射到源文件")])]),a._v(" "),t("tr",[t("td",[a._v("inline")]),a._v(" "),t("td",[a._v("将.map 作为 DataURL 嵌入，不单独生成.map 文件")])])])]),a._v(" "),t("ul",[t("li",[a._v("以上模式可以进行任意组合")])]),a._v(" "),t("h4",{attrs:{id:"_8-2-开启-source-map-模式"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-2-开启-source-map-模式"}},[a._v("#")]),a._v(" 8.2 开启 source-map 模式")]),a._v(" "),t("h5",{attrs:{id:"_8-2-1-源代码"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-2-1-源代码"}},[a._v("#")]),a._v(" 8.2.1 源代码")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/source-map.png",alt:""}})]),a._v(" "),t("h5",{attrs:{id:"_8-2-2-编译后目录"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-2-2-编译后目录"}},[a._v("#")]),a._v(" 8.2.2 编译后目录")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/source-map-dist.png",alt:""}})]),a._v(" "),t("h5",{attrs:{id:"_8-2-3-bundle-js"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-2-3-bundle-js"}},[a._v("#")]),a._v(" 8.2.3 bundle.js")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/source-map-bundle-code.png",alt:""}})]),a._v(" "),t("h5",{attrs:{id:"_8-2-4-bundle-js-map"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-2-4-bundle-js-map"}},[a._v("#")]),a._v(" 8.2.4 bundle.js.map")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/source-map-bundle-map-code.png",alt:""}})]),a._v(" "),t("h5",{attrs:{id:"_8-2-5-增加错误代码"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-2-5-增加错误代码"}},[a._v("#")]),a._v(" 8.2.5 增加错误代码")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/source-map-error-code.png",alt:""}})]),a._v(" "),t("h5",{attrs:{id:"_8-2-6-浏览器控制台定位到的错误信息"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-2-6-浏览器控制台定位到的错误信息"}},[a._v("#")]),a._v(" 8.2.6 浏览器控制台定位到的错误信息")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/source-map-error-code-result1.png",alt:""}})]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/source-map-error-code-result2.png",alt:""}})]),a._v(" "),t("h4",{attrs:{id:"_8-3-开启-eval-模式"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-3-开启-eval-模式"}},[a._v("#")]),a._v(" 8.3 开启 eval 模式")]),a._v(" "),t("ul",[t("li",[a._v("eval 模式 和 source-map 差不多，eval 可以用来做缓存，后续构建速度更快，生成的.map 映射文件内容都是一样的")])]),a._v(" "),t("h5",{attrs:{id:"_8-3-1-bundle-js"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-3-1-bundle-js"}},[a._v("#")]),a._v(" 8.3.1 bundle.js")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/eval.png",alt:""}})]),a._v(" "),t("h4",{attrs:{id:"_8-4-开启-cheap-source-map-模式"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-4-开启-cheap-source-map-模式"}},[a._v("#")]),a._v(" 8.4 开启 cheap-source-map 模式")]),a._v(" "),t("h5",{attrs:{id:"_8-4-1-bundle-js"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-4-1-bundle-js"}},[a._v("#")]),a._v(" 8.4.1 bundle.js")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/source-map-bundle-code.png",alt:""}})]),a._v(" "),t("h5",{attrs:{id:"_8-4-2-bundle-js-map"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-4-2-bundle-js-map"}},[a._v("#")]),a._v(" 8.4.2 bundle.js.map")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/cheap-bundle-map-code.png",alt:""}})]),a._v(" "),t("h5",{attrs:{id:"_8-4-3-浏览器控制台定位到的错误信息"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-4-3-浏览器控制台定位到的错误信息"}},[a._v("#")]),a._v(" 8.4.3 浏览器控制台定位到的错误信息")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/cheap-error-code-result.png",alt:""}})]),a._v(" "),t("h4",{attrs:{id:"_8-5-开启-inline-source-map-模式"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-5-开启-inline-source-map-模式"}},[a._v("#")]),a._v(" 8.5 开启 inline-source-map 模式")]),a._v(" "),t("h5",{attrs:{id:"_8-5-1-bundle-js-无-map-文件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-5-1-bundle-js-无-map-文件"}},[a._v("#")]),a._v(" 8.5.1 bundle.js(无.map 文件)")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/inline.png",alt:""}})]),a._v(" "),t("h4",{attrs:{id:"_8-6-source-map-图解"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-6-source-map-图解"}},[a._v("#")]),a._v(" 8.6 source-map 图解")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/source-map-process.png",alt:""}})]),a._v(" "),t("h4",{attrs:{id:"_8-7-cheap-source-map-图解"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-7-cheap-source-map-图解"}},[a._v("#")]),a._v(" 8.7 cheap-source-map 图解")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/cheap-source-map-process.png",alt:""}})]),a._v(" "),t("h4",{attrs:{id:"_8-8-cheap-module-source-map-图解"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-8-cheap-module-source-map-图解"}},[a._v("#")]),a._v(" 8.8 cheap-module-source-map 图解")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/cheap-module-source-map-process.png",alt:""}})]),a._v(" "),t("h4",{attrs:{id:"_8-9-sourcemap-最佳实践"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-9-sourcemap-最佳实践"}},[a._v("#")]),a._v(" 8.9 sourcemap 最佳实践")]),a._v(" "),t("h5",{attrs:{id:"_8-9-1-组合规则"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-9-1-组合规则"}},[a._v("#")]),a._v(" 8.9.1 组合规则")]),a._v(" "),t("table",[t("thead",[t("tr",[t("th",[a._v("组合(规则)")]),a._v(" "),t("th",[a._v("解释")])])]),a._v(" "),t("tbody",[t("tr",[t("td",[a._v("[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map")]),a._v(" "),t("td",[a._v("组合规则强制要求顺序")])]),a._v(" "),t("tr",[t("td",[a._v("source-map")]),a._v(" "),t("td",[a._v("会在外部生成单独的 sourcemap 文件，会与源代码文件进行关联，能提示代码的准确原始位置")])]),a._v(" "),t("tr",[t("td",[a._v("inline-source-map")]),a._v(" "),t("td",[a._v("以 base64 格式内联在打包后的文件中，内联构建速度快、也能提示错误代码的准确原始位置")])]),a._v(" "),t("tr",[t("td",[a._v("hidden-source-map")]),a._v(" "),t("td",[a._v("会在外部生成单独的 sourcemap 文件，但是不和源代码文件进行关联，不能提示错误代码的准确原始位置")])]),a._v(" "),t("tr",[t("td",[a._v("eval-source-map")]),a._v(" "),t("td",[a._v("会给每一个模块生成单独的 sourcemap 文件进行内联，并使用 eval 执行")])]),a._v(" "),t("tr",[t("td",[a._v("nosources-source-map")]),a._v(" "),t("td",[a._v("会在外部生成 sourcemap 文件，能找到源代码位置，但是源代码内容为空")])]),a._v(" "),t("tr",[t("td",[a._v("cheap-source-map")]),a._v(" "),t("td",[a._v("会在外部生成 sourcemap 文件，不包含列和 loader 的 map 信息")])]),a._v(" "),t("tr",[t("td",[a._v("cheap-module-source-map")]),a._v(" "),t("td",[a._v("会在外部生成 sourcemap 文件，不包含列的信息")])])])]),a._v(" "),t("h5",{attrs:{id:"_8-9-2-开发环境"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-9-2-开发环境"}},[a._v("#")]),a._v(" 8.9.2 开发环境")]),a._v(" "),t("ol",[t("li",[a._v("速度快："),t("code",[a._v("eval-cheap-source-map")])]),a._v(" "),t("li",[a._v("调试友好："),t("code",[a._v("eval-cheap-module-source-map")])]),a._v(" "),t("li",[a._v("推荐："),t("code",[a._v("eval-source-map")])])]),a._v(" "),t("h5",{attrs:{id:"_8-9-3-生产环境"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-9-3-生产环境"}},[a._v("#")]),a._v(" 8.9.3 生产环境")]),a._v(" "),t("ol",[t("li",[a._v("速度快："),t("code",[a._v("cheap")])]),a._v(" "),t("li",[a._v("调试友好："),t("code",[a._v("[source-map]>[cheap-source-map | cheap-module-source-map]>[hideen-source-map | nosources-source-map]")])]),a._v(" "),t("li",[a._v("推荐："),t("code",[a._v("hidden-source-map")]),a._v(",会生成"),t("code",[a._v("sourcemap")]),a._v("文件，但是不进行关联、不会上传关联信息")])]),a._v(" "),t("h5",{attrs:{id:"_8-9-4-开发环境调试"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-9-4-开发环境调试"}},[a._v("#")]),a._v(" 8.9.4 开发环境调试")]),a._v(" "),t("ol",[t("li",[t("p",[a._v("本地代码编辑器内调试")])]),a._v(" "),t("li",[t("p",[a._v("通过 source 控制器调试")]),a._v(" "),t("ul",[t("li",[a._v("右键打开控制台")])])])]),a._v(" "),t("ul",[t("li",[t("p",[a._v("选择 sources\n"),t("img",{attrs:{src:"/assets/debugger-source-map-dev.png",alt:""}})]),a._v(" "),t("ul",[t("li",[t("p",[a._v("右键"),t("code",[a._v("top")]),a._v("，选择"),t("code",[a._v("Search in all files")])]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/debugger-source-map-dev-search-files.png",alt:""}})])]),a._v(" "),t("li",[t("p",[a._v("搜索你想搜的代码")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/debugger-source-map-search-code.png",alt:""}})]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/debugger-source-map-search-result.png",alt:""}})])])])])]),a._v(" "),t("h5",{attrs:{id:"_8-9-5-测试环境调试"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-9-5-测试环境调试"}},[a._v("#")]),a._v(" 8.9.5 测试环境调试")]),a._v(" "),t("blockquote",[t("p",[a._v("通过"),t("code",[a._v("source-map-dev-tool-plugin")]),a._v("进行细粒度的控制")])]),a._v(" "),t("ul",[t("li",[t("p",[a._v("步骤一：设置"),t("code",[a._v("devtool:false")]),a._v("关闭")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/set-devtool-false.png",alt:""}})])]),a._v(" "),t("li",[t("p",[a._v("步骤二：通过"),t("code",[a._v("webpack.source-map-dev-tool-plugin")]),a._v("来生成 sourcemap 文件，并进行相关设置")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/source-map-dev-tool-plugin.png",alt:""}})])]),a._v(" "),t("li",[t("p",[a._v("步骤三：通过"),t("code",[a._v("filemanager-plugin插件")]),a._v("来拷贝源映射文件到其他目录，并删除原来的源映射文件，因为测试时我们的代码需要打包，打包生成的目录发给测试，其他的不需要发给测试，打包目录中没有源映射文件等敏感信息的")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/file-manager-plugin.png",alt:""}})])]),a._v(" "),t("li",[t("p",[a._v("步骤四：本地启动一个服务，如: "),t("code",[a._v("http-server")]),a._v("，保证通过端口号能访问到拷贝后的源映射文件即可，这样就可以进行调试了")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/http-server.png",alt:""}})])]),a._v(" "),t("li",[t("p",[a._v("步骤五：查看源代码")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/source-mapping-url.png",alt:""}})])]),a._v(" "),t("li",[t("p",[a._v("步骤六：增加断点调试，大功告成")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/debugger-source-map.png",alt:""}})])])]),a._v(" "),t("blockquote",[t("p",[a._v("总结：")]),a._v(" "),t("p",[a._v("​ 优点：安全，只能你一个人调试，别人是调试不了的，除非你共享了拷贝后的源映射文件")]),a._v(" "),t("p",[a._v("​ 缺点：有点点小麻烦")])]),a._v(" "),t("h5",{attrs:{id:"_8-9-6-生产环境调试"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_8-9-6-生产环境调试"}},[a._v("#")]),a._v(" 8.9.6 生产环境调试")]),a._v(" "),t("p",[t("code",[a._v("说明: 生产环境是没有map文件的，为了隐私安全")])]),a._v(" "),t("ul",[t("li",[t("p",[a._v("步骤一：修改环境为生产环境,真实项目可通过环境变量来区分")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/set-mode-production.png",alt:""}})])]),a._v(" "),t("li",[t("p",[a._v("步骤二：修改"),t("code",[a._v("devtool:hidden-source-map")]),a._v("，会生成 sourcemap 文件，我们"),t("code",[a._v("步骤三")]),a._v("会进行删除")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/set-devtool-hidden-source-map.png",alt:""}})])]),a._v(" "),t("li",[t("p",[a._v("步骤三：拷贝 sourcemap 文件至另外目录，删除打包目录中的 sourcemap 文件")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/copy-source-map-delete-dist-source-map.png",alt:""}})])]),a._v(" "),t("li",[t("p",[a._v("步骤四：开启本地服务，如：http-server，只要保证能访问到 sourcemap 文件即可")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/http-server.png",alt:""}})])]),a._v(" "),t("li",[t("p",[a._v("步骤五：sources 开启调试")]),a._v(" "),t("ul",[t("li",[a._v("打开 sources")])]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/debugger-source-map-dev.png",alt:""}})]),a._v(" "),t("ul",[t("li",[t("p",[a._v("设置-勾选"),t("code",[a._v("Enabled Javascript source maps")]),a._v("选项")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/debugger-source-map-prod-settings.png",alt:""}})]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/debugger-source-map-settings-enabled.png",alt:""}})])]),a._v(" "),t("li",[t("p",[a._v("手动添加"),t("code",[a._v("source-map")]),a._v("文件地址进行关联")]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/choose-source-map-address.png",alt:""}})]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/add-source-map-address.png",alt:""}})]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/add-source-map-address-result.png",alt:""}})]),a._v(" "),t("p",[t("img",{attrs:{src:"/assets/add-source-map-address-result-code.png",alt:""}})])])])])]),a._v(" "),t("blockquote",[t("p",[a._v("总结：")]),a._v(" "),t("p",[a._v("​ 优点：安全性高、可以把 sourcemap 文件放在本地或者安全的服务器上，保证不会泄露就行，调试方便")]),a._v(" "),t("p",[a._v("​ 缺点：调试前的准备工作稍多")])]),a._v(" "),t("h3",{attrs:{id:"_9-打包第三方类库"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_9-打包第三方类库"}},[a._v("#")]),a._v(" 9. 打包第三方类库")]),a._v(" "),t("h3",{attrs:{id:"_10-webpack-dev-server"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_10-webpack-dev-server"}},[a._v("#")]),a._v(" 10. webpack-dev-server")]),a._v(" "),t("h3",{attrs:{id:"_11-提取-css"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_11-提取-css"}},[a._v("#")]),a._v(" 11. 提取 css")]),a._v(" "),t("h3",{attrs:{id:"_12-三种-hash-值的区别"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_12-三种-hash-值的区别"}},[a._v("#")]),a._v(" 12. 三种 hash 值的区别")]),a._v(" "),t("h3",{attrs:{id:"_13-px2rem-loader"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_13-px2rem-loader"}},[a._v("#")]),a._v(" 13. px2rem-loader")]),a._v(" "),t("h2",{attrs:{id:"_2-深入"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-深入"}},[a._v("#")]),a._v(" 2. 深入")])])}),[],!1,null,null,null);s.default=r.exports}}]);