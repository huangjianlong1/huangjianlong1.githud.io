const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const xlsx = require('xlsx');
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接 (本地 MongoDB)
mongoose.connect('mongodb://localhost:27017/project_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB 连接成功'))
  .catch(err => console.error('数据库连接错误:', err));

// 数据模型
const projectSchema = new mongoose.Schema({
  currentMonth: String,
  project: String,
  contractNumber: { type: String, unique: true, required: true }, // 合同编号唯一
  projectName: String,
  paymentPerson: String,
  taskProcess: String,
  completionProgress: { type: Number, min: 0, max: 100 }, // 百分比数值
  paymentProgress: { type: Number, min: 0, max: 100 }, // 百分比数值
  totalContractAmount: Number,
  subcontractAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);

// ========== API 端点 ==========

// 获取所有数据
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: 1 }); // 按创建时间排序
    res.json(projects);
  } catch (err) {
    res.status(500).send('服务器错误');
  }
});

// 创建新记录
app.post('/api/projects', async (req, res) => {
  const newProject = new Project({
    ...req.body,
    completionProgress: parseFloat(req.body.completionProgress),
    paymentProgress: parseFloat(req.body.paymentProgress),
    totalContractAmount: parseFloat(req.body.totalContractAmount),
    subcontractAmount: parseFloat(req.body.subcontractAmount)
  });

  try {
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    if (err.code === 11000) { // 处理唯一索引冲突（合同编号重复）
      res.status(400).send('合同编号已存在');
    } else {
      res.status(400).send('数据验证失败');
    }
  }
});

// 更新记录
app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // 返回更新后的数据并验证
    );
    if (!project) return res.status(404).send('记录未找到');
    res.json(project);
  } catch (err) {
    res.status(400).send('更新失败');
  }
});

// 删除记录
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).send('记录未找到');
    res.json(project);
  } catch (err) {
    res.status(500).send('删除失败');
  }
});

// 导入 XLSX 文件
app.post('/api/import', async (req, res) => {
  try {
    const file = req.files.file; // 假设前端通过 FormData 上传文件
    const workbook = xlsx.read(file.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // 批量插入前先删除原有数据（或根据需求改为更新）
    await Project.deleteMany({});
    await Project.insertMany(data.map(item => ({
      ...item,
      completionProgress: parseFloat(item.completionProgress),
      paymentProgress: parseFloat(item.paymentProgress),
      totalContractAmount: parseFloat(item.totalContractAmount),
      subcontractAmount: parseFloat(item.subcontractAmount)
    })));

    res.status(200).send('导入成功');
  } catch (err) {
    console.error('导入错误:', err);
    res.status(500).send('导入失败');
  }
});

// 导出 CSV
app.get('/api/export', async (req, res) => {
  try {
    const projects = await Project.find();
    const worksheet = xlsx.utils.json_to_sheet(projects, {
      header: ['currentMonth', 'project', 'contractNumber', 'projectName',
        'paymentPerson', 'taskProcess', 'completionProgress', 'paymentProgress',
        'totalContractAmount', 'subcontractAmount']
    });
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'ProjectData');
    
    // 生成 Excel 文件
    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=project_data.xlsx');
    res.end(excelBuffer, 'binary');
  } catch (err) {
    res.status(500).send('导出失败');
  }
});

// 启动服务器
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
