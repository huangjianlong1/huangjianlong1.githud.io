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
        if (headers.length!== 16) {
            alert('导入的XLSX文件格式不正确，列数不匹配');
            return;
        }
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';
        const token = 'YOUR_GITHUB_TOKEN'; // 替换为你的令牌
        const gistData = {
            description: 'Imported project data',
            public: true,
            files: {
                'imported_data.json': {
                    content: JSON.stringify(jsonData)
                }
            }
        };
        fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gistData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.html_url) {
                console.log('数据已存储为 Gist: ', result.html_url);
                // 处理导入成功后的逻辑，如更新表格显示等
                jsonData.forEach(dataRow => {
                    const newRow = document.createElement('tr');
                    // 构建表格行逻辑...
                    tableBody.appendChild(newRow);
                });
            } else {
                alert('数据存储失败');
            }
        })
        .catch(error => {
            console.error('发送数据时出错: ', error);
        });
    };
    reader.readAsArrayBuffer(file);
}
