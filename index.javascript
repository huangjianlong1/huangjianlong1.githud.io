function importXLSX() {
    const fileInput = document.getElementById('importFile');
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('请选择要导入的XLSX文件');
        return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
            alert('导入的XLSX文件中没有数据');
            return;
        }

        const headers = Object.keys(jsonData[0]);
        // 确保文档列数和预期一致（这里假设预期为10列，根据实际调整）
        if (headers.length!== 10) {
            alert('导入的XLSX文件格式不正确，列数不匹配');
            return;
        }

        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        jsonData.forEach((dataRow, index) => {
            const newRow = document.createElement('tr');
            const rowIndex = index + 1;
            // 序号按数量自动生成
            const columns = [
                rowIndex,
                dataRow['当前月份'],
                dataRow['项目'],
                dataRow['合同编号'],
                dataRow['项目名称'],
                dataRow['请款人员'],
                dataRow['任务进程'],
                parseFloat(dataRow['完成进度']) / 100,
                parseFloat(dataRow['请款进度']) / 100,
                dataRow['总包金额'],
                dataRow['分包金额']
            ];

            columns.forEach((col, colIndex) => {
                const td = document.createElement('td');
                if (colIndex === 7 || colIndex === 8) { // 完成进度和请款进度列
                    const progressBar = document.createElement('div');
                    progressBar.className = 'progress-bar';
                    const progressBarFill = document.createElement('div');
                    progressBarFill.className = `progress-bar-fill ${col === 1? 'complete' : ''}`;
                    progressBarFill.style.width = `${col * 100}%`;
                    progressBarFill.textContent = `${(col * 100).toFixed(0)}%`;
                    progressBar.appendChild(progressBarFill);
                    td.appendChild(progressBar);
                } else {
                    td.textContent = col;
                    td.contentEditable = true;
                }
                newRow.appendChild(td);
            });

            const delBtn = document.createElement('button');
            delBtn.textContent = "删除";
            delBtn.onclick = function () {
                deleteRow(newRow);
            };
            const td = document.createElement('td');
            td.appendChild(delBtn);
            newRow.appendChild(td);

            tableBody.appendChild(newRow);
        });
    };

    reader.readAsArrayBuffer(file);
}
