import { Vika } from "@vikadata/vika";

// 初始化维格表实例
const vika = new Vika({
    token: "usk0hOtSGQBGMkZzNnBwDUx",
    fieldKey: "name"
});

// 指定要操作的维格表
const datasheet = vika.datasheet("dstaRya3LFuYPVxBKb");

/**
 * 查询项目请款金额汇总表格的记录
 * @param {Object} options - 查询选项
 * @param {string} [options.viewId] - 视图 ID
 * @param {Array} [options.sort] - 排序条件
 * @param {Array} [options.recordIds] - 要查询的记录 ID 数组
 * @param {Array} [options.fields] - 要返回的字段数组
 * @param {string} [options.filterByFormula] - 筛选公式
 * @param {number} [options.maxRecords] - 最大返回记录数
 * @param {string} [options.cellFormat] - 单元格值类型
 * @param {string} [options.fieldKey] - 字段查询和返回的 key
 * @returns {Promise<Object>} - 包含查询结果的 Promise
 */
async function queryProjectPaymentRecords(options = {}) {
    try {
        const response = await datasheet.records.query(options);
        if (response.success) {
            return response.data;
        } else {
            console.error(response);
            throw new Error("查询失败");
        }
    } catch (error) {
        console.error("查询时出错:", error);
        throw error;
    }
}

// 示例使用
const queryOptions = {
    viewId: "viwwHaGWmSr6k"
};

queryProjectPaymentRecords(queryOptions)
   .then(data => {
        console.log("查询结果:", data);
    })
   .catch(error => {
        console.error("查询出错:", error);
    });
    
