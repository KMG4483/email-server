const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析JSON请求体
app.use(express.static(path.join(__dirname, '.'))); // 提供静态文件服务（前端页面）

// QQ邮箱SMTP配置（关键配置）
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com', // QQ邮箱SMTP服务器地址
  port: 465, // 端口（SSL加密）
  secure: true, // 启用SSL加密
  auth: {
    user: '2664044927@qq.com', // 发送邮件的QQ邮箱（例如：123456@qq.com）
    pass: 'arxquoveigzsebja' // SMTP授权码（非QQ密码，需单独获取）
  }
});

// 发送邮件的API接口
app.post('/send-email', async (req, res) => {
  try {
    const { name, phone, email, service, date, message } = req.body;
    
    // 验证请求数据
    if (!name || !phone || !email || !service || !message) {
      return res.status(400).json({
        success: false,
        message: '缺少必要的表单数据'
      });
    }

    // 服务类型中文转换
    const serviceNames = {
      'commercial': '商业摄影',
      'portrait': '人像摄影',
      'event': '活动摄影',
      'other': '其他服务'
    };
    const serviceName = serviceNames[service] || service;

    // 邮件内容配置
    const mailOptions = {
      from: `"无限传媒工作室" <${transporter.options.auth.user}>`, // 发件人信息
      to: transporter.options.auth.user, // 收件人邮箱（这里发送到自己的QQ邮箱）
      subject: `新的摄影预约 - ${name} - ${serviceName}`, // 邮件主题
      html: `
        <h2 style="color: #165DFF;">新的摄影预约信息</h2>
        <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">
          <tr>
            <th style="background-color: #f5f5f5; text-align: left; width: 30%;">客户姓名</th>
            <td>${name}</td>
          </tr>
          <tr>
            <th style="background-color: #f5f5f5; text-align: left;">联系电话</th>
            <td>${phone}</td>
          </tr>
          <tr>
            <th style="background-color: #f5f5f5; text-align: left;">客户邮箱</th>
            <td>${email}</td>
          </tr>
          <tr>
            <th style="background-color: #f5f5f5; text-align: left;">服务类型</th>
            <td>${serviceName}</td>
          </tr>
          <tr>
            <th style="background-color: #f5f5f5; text-align: left;">预约日期</th>
            <td>${date || '未指定'}</td>
          </tr>
          <tr>
            <th style="background-color: #f5f5f5; text-align: left;">拍摄需求</th>
            <td>${message.replace(/\n/g, '<br>')}</td>
          </tr>
          <tr>
            <th style="background-color: #f5f5f5; text-align: left;">提交时间</th>
            <td>${new Date().toLocaleString()}</td>
          </tr>
        </table>
      ` // 邮件内容（HTML格式）
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: '邮件发送成功'
    });
  } catch (error) {
    console.error('邮件发送失败:', error);
    res.status(500).json({
      success: false,
      message: '邮件发送失败，请检查SMTP配置或稍后重试'
    });
  }
});

// 启动服务器
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`服务器已启动，访问地址：https://zhanghu.page.gd/`);
  console.log(`请在浏览器中打开 https://zhanghu.page.gd/ 查看网站`);
});
