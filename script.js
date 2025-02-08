// 获取模态框元素
const modal = document.getElementById('projectModal');
const closeBtn = document.querySelector('.close');
const addProjectBtn = document.querySelector('.add-project-btn');
const projectNameContainer = document.getElementById('projectNamesContainer');

// 打开模态框
addProjectBtn.onclick = function() {
    modal.style.display = 'block';
};

// 关闭模态框
closeBtn.onclick = function() {
    modal.style.display = 'none';
    // 重置表单
    document.getElementById('projectForm').reset();
    // 清空项目名称输入框容器
    projectNameContainer.innerHTML = `
        <input type="text" placeholder="请输入项目名称">
        <button type="button" class="add-remove-btn" onclick="addProjectNameInput()">添加</button>
    `;
};

// 点击空白处关闭模态框
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// 添加项目名称输入框
function addProjectNameInput() {
    const container = document.getElementById('projectNamesContainer');
    const lastChild = container.lastElementChild;
    
    // 如果最后一个元素是添加按钮，则在前面添加新的输入框
    if (lastChild.className === 'add-remove-btn') {
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.placeholder = '请输入项目名称';
        container.insertBefore(newInput, lastChild);
    }
}

// 提交表单处理函数
document.getElementById('projectForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 获取表单数据
    const projectName = document.getElementById('projectName').value;
    const projectDesc = document.getElementById('projectDesc').value;
    const projectManager = document.getElementById('projectManager').value;
    const projectPhase = document.getElementById('projectPhase').value;
    const projectNames = Array.from(projectNameContainer.querySelectorAll('input'))
                            .map(input => input.value)
                            .filter(name => name.trim() !== ''); // 过滤空值
    
    // 创建项目项
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    projectItem.innerHTML = `
        <h4>项目名称: ${projectName}</h4>
        <p>描述: ${projectDesc}</p>
        <p>项目经理: ${projectManager}</p>
        <p>阶段: ${projectPhase}</p>
        <p>相关项目列表:</p>
        <ul>
            ${projectNames.map(name => `<li>${name}</li>`).join('')}
        </ul>
    `;
    
    // 将新项目添加到项目列表中
    document.getElementById('projectList').appendChild(projectItem);
    
    // 关闭模态框
    modal.style.display = 'none';
    // 重置表单
    this.reset();
    // 清空项目名称输入框容器
    projectNameContainer.innerHTML = `
        <input type="text" placeholder="请输入项目名称">
        <button type="button" class="add-remove-btn" onclick="addProjectNameInput()">添加</button>
    `;
});
