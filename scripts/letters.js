// 元素分组功能
// 创建主容器div，用于存放所有分组行
const container = document.createElement('div');
container.id = 'letters';
// 创建第一行容器，作为默认显示的行
const firstRow = document.createElement('div');
firstRow.className = 'container';
firstRow.id = 'firstRow';

// 创建字母选择下拉框
const select = document.createElement('select');
select.className = 'letRounded-select';
select.id = 'firstSelect';
// 添加默认空选项
select.innerHTML = '<option value="">▨</option>';
// 循环添加A-Z的字母选项
for (let i = 65; i <= 90; i++) {
  select.innerHTML += `<option value="${String.fromCharCode(i)}">${String.fromCharCode(i)}</option>`;
}

// 创建输入框，用于输入元素分组内容
const input = document.createElement('input');
input.className = 'rounded-input';
input.type = 'text';
input.id = 'firstInput';
input.placeholder = '字母元素';

// 创建删除按钮，初始隐藏
const firstDeleteBtn = document.createElement('button');
firstDeleteBtn.className = 'delete-btn';
firstDeleteBtn.textContent = '×';
firstDeleteBtn.style.display = 'none';
// 删除按钮点击事件：移除当前行并检查是否需要禁用清空按钮
firstDeleteBtn.onclick = function() {
  container.removeChild(firstRow);
  if (container.getElementsByClassName('container').length === 1) {
    removeButton.classList.add('disabled-button');
    removeButton.disabled = true;
  }
};

firstRow.appendChild(select);
firstRow.appendChild(input);
firstRow.appendChild(firstDeleteBtn);
container.appendChild(firstRow);

const summon = document.createElement('div');
summon.id = 'summon';
container.appendChild(summon);

const controls = document.createElement('div');
controls.className = 'controls';

const addButton = document.createElement('button');
addButton.id = 'add';
addButton.className = 'button';
addButton.textContent = '添加';

const removeButton = document.createElement('button');
removeButton.id = 'remove';
removeButton.className = 'button disabled-button';
removeButton.textContent = '清空';
removeButton.disabled = true;

controls.appendChild(addButton);
controls.appendChild(removeButton);
container.appendChild(controls);

document.querySelector('.panel-box:nth-child(2)').appendChild(container);

// 初始化函数：检查并加载本地词典
function initDictionary() {
  const storedDictionary = localStorage.getItem('elementDictionary');
  if (storedDictionary) {
    const dictionary = JSON.parse(storedDictionary);
    
    // 遍历字典中的每个键值对
    Object.entries(dictionary).forEach(([key, value], index) => {
      if (index === 0) {
        // 第一行直接设置值
        const firstSelect = document.getElementById('firstSelect');
        const firstInput = document.getElementById('firstInput');
        firstSelect.value = key;
        firstInput.value = value.map(e => e.length > 1 ? `/${e}/` : e).join('');
      } else {
        // 其他行需要动态创建
        const newSelect = document.createElement('select');
        newSelect.className = 'letRounded-select';
        newSelect.innerHTML = '<option value="">▨</option>';
        for (let i = 65; i <= 90; i++) {
          newSelect.innerHTML += `<option value="${String.fromCharCode(i)}">${String.fromCharCode(i)}</option>`;
        }
        newSelect.value = key;
        newSelect.addEventListener('change', saveDictionaryToLocal);

        const newInput = document.createElement('input');
        newInput.className = 'rounded-input';
        newInput.type = 'text';
        newInput.value = value.map(e => e.length > 1 ? `/${e}/` : e).join('');
        newInput.addEventListener('input', saveDictionaryToLocal);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = function() {
          container.removeChild(newRow);
          if (container.getElementsByClassName('container').length === 1) {
            removeButton.classList.add('disabled-button');
            removeButton.disabled = true;
            const rows = container.getElementsByClassName('container');
            for (let row of rows) {
              const btn = row.querySelector('.delete-btn');
              if (btn) btn.style.display = 'none';
            }
          }
          saveDictionaryToLocal();
        };

        const newRow = document.createElement('div');
        newRow.className = 'container';
        newRow.appendChild(newSelect);
        newRow.appendChild(newInput);
        newRow.appendChild(deleteBtn);

        container.insertBefore(newRow, summon);
        newRow.classList.add('animated');

        if (removeButton.classList.contains('disabled-button')) {
          removeButton.classList.remove('disabled-button');
          removeButton.disabled = false;
        }
        const rows = container.getElementsByClassName('container');
        for (let row of rows) {
          const btn = row.querySelector('.delete-btn');
          if (btn) btn.style.display = 'inline-block';
        }
      }
    });
  }
}

// 页面加载完成后执行初始化
// 监听DOMContentLoaded事件，确保DOM完全加载后再执行初始化
window.addEventListener('DOMContentLoaded', initDictionary);

// 添加和删除行的交互逻辑
// 为所有输入框添加input事件监听
// 当输入框内容变化时自动保存到本地存储
const inputs = container.getElementsByTagName('input');
for (let input of inputs) {
  input.addEventListener('input', saveDictionaryToLocal);
}

// 为所有下拉框添加change事件监听
// 当下拉框选择变化时自动保存到本地存储
const selects = container.getElementsByTagName('select');
for (let select of selects) {
  select.addEventListener('change', saveDictionaryToLocal);
}

addButton.addEventListener('click', function() {
  const newSelect = document.createElement('select');
  newSelect.className = 'letRounded-select';
  newSelect.innerHTML = '<option value="">▨</option>';
  for (let i = 65; i <= 90; i++) {
    newSelect.innerHTML += `<option value="${String.fromCharCode(i)}">${String.fromCharCode(i)}</option>`;
  }
  newSelect.addEventListener('change', saveDictionaryToLocal);

  const newInput = document.createElement('input');
  newInput.className = 'rounded-input';
  newInput.type = 'text';
  newInput.placeholder = '字母元素';
  newInput.addEventListener('input', saveDictionaryToLocal);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '×';
  deleteBtn.onclick = function() {
    container.removeChild(newRow);
    if (container.getElementsByClassName('container').length === 1) {
      removeButton.classList.add('disabled-button');
      removeButton.disabled = true;
      // 隐藏所有行的删除按钮
      const rows = container.getElementsByClassName('container');
      for (let row of rows) {
        const btn = row.querySelector('.delete-btn');
        if (btn) btn.style.display = 'none';
      }
    }
    saveDictionaryToLocal();
  };

  const newRow = document.createElement('div');
  newRow.className = 'container';
  newRow.appendChild(newSelect);
  newRow.appendChild(newInput);
  newRow.appendChild(deleteBtn);

  container.insertBefore(newRow, summon);
  newRow.classList.add('animated');

  if (removeButton.classList.contains('disabled-button')) {
    removeButton.classList.remove('disabled-button');
    removeButton.disabled = false;
  }
  // 显示所有行的删除按钮
  const rows = container.getElementsByClassName('container');
  for (let row of rows) {
    const btn = row.querySelector('.delete-btn');
    if (btn) btn.style.display = 'inline-block';
  }
  saveDictionaryToLocal();
});

removeButton.addEventListener('click', function() {
  // 移除所有额外行，只保留第一行
  const rows = container.getElementsByClassName('container');
  while (rows.length > 1) {
    container.removeChild(rows[rows.length - 1]);
  }
  
  // 重置第一行的值
  const firstSelect = document.getElementById('firstSelect');
  const firstInput = document.getElementById('firstInput');
  firstSelect.value = '';
  firstInput.value = '';
  
  // 隐藏删除按钮
  firstDeleteBtn.style.display = 'none';
  
  // 禁用清空按钮
  removeButton.classList.add('disabled-button');
  removeButton.disabled = true;
  
  // 清空本地存储
  localStorage.removeItem('elementDictionary');
  
  saveDictionaryToLocal();
});

// 保存字典到本地存储的函数
// 功能：收集所有行的数据，处理后存入localStorage
function saveDictionaryToLocal() {
  // 获取所有容器行
  const rows = container.getElementsByClassName('container');
  // 临时存储相同字母的元素
  let tempDict = {};
  
  // 首先收集所有选择相同字母的元素
  for (let row of rows) {
    const select = row.querySelector('select');
    const input = row.querySelector('input');
    if (select && input && select.value && select.value !== "" && input.value) {
      // 去除所有空格
      const trimmedValue = input.value.replace(/\s+/g, '');
      
      // 拆分字符串：普通字符单独作为元素，两个斜杠之间的字符串作为一个整体元素
      const elements = [];
      let currentElement = '';
      let inSlash = false;
      
      for (const char of trimmedValue) {
        if (char === '/') {
          if (inSlash) {
            // 结束斜杠部分
            elements.push(currentElement);
            currentElement = '';
            inSlash = false;
          } else {
            // 开始斜杠部分
            if (currentElement) {
              elements.push(currentElement);
              currentElement = '';
            }
            inSlash = true;
          }
        } else {
          if (inSlash) {
            currentElement += char;
          } else {
            elements.push(char);
          }
        }
      }
      
      // 处理最后未闭合的部分
      if (currentElement) {
        elements.push(currentElement);
      }
      
      // 临时存储相同字母的元素
      if (!tempDict[select.value]) {
        tempDict[select.value] = [];
      }
      tempDict[select.value] = tempDict[select.value].concat(elements);
    }
  }
  
  // 合并并去重相同字母的元素
  let dictionary = {};
  for (const [key, value] of Object.entries(tempDict)) {
    dictionary[key] = [...new Set(value)];
  }
  
  // 保存到localStorage
  localStorage.setItem('elementDictionary', JSON.stringify(dictionary));
  
}
