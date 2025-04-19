import express from 'express';
import cors from 'cors'; // 新增CORS支持
import { queryRequestTable } from './requestTable.js';

const app = express();
const PORT = 3000;

// 新增中间件
app.use(cors());
app.use(express.json());

// 保持现有路由不变
app.get('/api/requests', async (req, res) => {
  try {
    const data = await queryRequestTable(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      message: error.message || '服务器错误' 
    });
  }
});

// 静态文件服务路径修正
app.use(express.static('../frontend'));

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
