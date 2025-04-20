const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // 可以根据需要修改端口号

// 使用 body-parser 中间件处理 JSON 和 URL 编码数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 配置数据库连接
const connection = mysql.createConnection({
  host: 'YOUR_DB_HOST', // 腾讯云数据库的主机地址，可在腾讯云控制台获取
  user: 'YOUR_DB_USER', // 数据库用户名
  password: 'YOUR_DB_PASSWORD', // 数据库密码
  database: 'YOUR_DB_NAME', // 数据库名称
  port: 3306, // 数据库端口，默认为 3306
});

// 连接数据库
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }
  console.log('Connected to the database!');
});

// API 端点示例：获取所有项目数据
app.get('/api/projects', (req, res) => {
  const query = 'SELECT * FROM your_table_name'; // 替换为实际的表名
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// API 端点示例：添加新项目数据
app.post('/api/projects', (req, res) => {
  const { 
    currentMonth, 
    project, 
    contractNumber, 
    projectName, 
    paymentPerson, 
    taskProcess, 
    completionProgress, 
    paymentProgress, 
    totalContractAmount, 
    subcontractAmount 
  } = req.body;

  const query = `
    INSERT INTO your_table_name (
      currentMonth, 
      project, 
      contractNumber, 
      projectName, 
      paymentPerson, 
      taskProcess, 
      completionProgress, 
      paymentProgress, 
      totalContractAmount, 
      subcontractAmount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    currentMonth, 
    project, 
    contractNumber, 
    projectName, 
    paymentPerson, 
    taskProcess, 
    completionProgress, 
    paymentProgress, 
    totalContractAmount, 
    subcontractAmount
  ];

  connection.query(query, values, (error, results) => {
    if (error) throw error;
    res.json({ message: '项目数据已成功添加', id: results.insertId });
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
