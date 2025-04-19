import React, { useState, useEffect } from 'react';
import { queryRequestTable } from '../backend/requestTable';

function RequestTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await queryRequestTable();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>序号</th>
          <th>项目名称</th>
          <th>合同编号</th>
          <th>总包请款金额</th>
          <th>分包请款金额</th>
          <th>完成进度</th>
        </tr>
      </thead>
      <tbody>
        {requests.map(request => (
          <tr key={request.id}>
            <td>{request.xuhao}</td>
            <td>{request.xiangmumingcheng}</td>
            <td>{request.hetongbianhao}</td>
            <td>{request.zongbaoqingkuanjinger}</td>
            <td>{request.fenbaoqingkuanjinger}</td>
            <td>{request.wanchengjingdu * 100}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RequestTable;
