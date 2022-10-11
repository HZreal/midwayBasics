console.log('enter bootstrap.js ==================================================');


const WebFramework = require('@midwayjs/web').Framework;
const SocketFramework = require('@midwayjs/ws').Framework;
const { Bootstrap } = require('@midwayjs/bootstrap');


const web = new WebFramework().configure({
  port: 7001,
});

// 加载副 ws 框架，自动适配主框架，这里不需要配置 port
const socketFramework = new SocketFramework().configure({});


Bootstrap.load(web).load(socketFramework).run();





