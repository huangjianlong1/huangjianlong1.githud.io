// 监听数据库数据变化
db.ref('projects/').on('value', (snapshot) => {
  const data = snapshot.val();
  // 清空表格并渲染新数据
  tableBody.innerHTML = '';
  Object.values(data).forEach((row, index) => {
    const newRow = document.createElement('tr');
    // 按列填充数据（序号、当前月份、项目等）
    newRow
