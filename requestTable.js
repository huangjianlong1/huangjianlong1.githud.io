import { Vika } from "@vikadata/vika";

// 初始化Vika客户端
const vika = new Vika({ 
  token: "YOUR_API_TOKEN",  // 替换为你的实际API Token
  fieldKey: "name"
});

// 指定要操作的数据表
const datasheet = vika.datasheet("dstaRya3LFuYPVxBKb");

/**
 * 查询请款表格数据
 * @param {Object} queryParams - 查询参数
 * @returns {Promise<Array>} 返回查询结果数组
 */
export async function queryRequestTable(queryParams = {}) {
  try {
    // 设置默认查询参数
    const defaultParams = {
      viewId: "viwwHaGWmSr6k",  // 默认视图ID
      pageNum: 1,
      pageSize: 10
    };
    
    // 合并默认参数和传入参数
    const params = { ...defaultParams, ...queryParams };
    
    // 执行查询
    const response = await datasheet.records.query({
      viewId: params.viewId,
      pageNum: params.pageNum,
      pageSize: params.pageSize
    });

    if (response.success) {
      // 返回格式化后的数据
      return response.data.records.map(record => ({
        id: record.recordId,
        ...record.fields
      }));
    } else {
      throw new Error(response.message || "查询维格表失败");
    }
  } catch (error) {
    console.error("查询请款表格出错:", error);
    throw error;
  }
}

// ... 其他功能(新增、修改、删除)的代码将在后续添加 ...
