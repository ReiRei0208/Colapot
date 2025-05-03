// 这里是字母分组的功能
// 先做个大盒子放所有分组
const container = document.createElement('div');
container.id = 'letters';
// 第一行默认显示
const firstRow = document.createElement('div');
firstRow.className = 'container';
firstRow.id = 'firstRow';

// 做个选字母的下拉框
const select = document.createElement('select');
select.className = 'letRounded-select';
select.id = 'firstSelect';
// 先加个空选项
select.innerHTML = '<option value="">▨</option>';
// 把A到Z的字母都加进去
for (let i = 65; i <= 90; i++) {
  select.innerHTML += `<option value="${String.fromCharCode(i)}">${String.fromCharCode(i)}</option>`;
}

// 做个输入框写分组内容
const input = document.createElement('input');
input.className = 'rounded-input';
input.type = 'text';
input.id = 'firstInput';
input.placeholder = '字母元素';

// 做个删除按钮，先藏起来
const firstDeleteBtn = document.createElement('button');
firstDeleteBtn.className = 'delete-btn';
firstDeleteBtn.textContent = '×';
firstDeleteBtn.style.display = 'none';
// 点删除按钮就把这行去掉，再看看要不要禁用清空按钮
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

// 启动时检查浏览器里存的东西
function initDictionary() {
  const storedDictionary = localStorage.getItem('elementDictionary');
  if (storedDictionary) {
    const dictionary = JSON.parse(storedDictionary);
    
    // 把每个字母都看一遍
    Object.entries(dictionary).forEach(([key, value], index) => {
      if (index === 0) {
        // 第一行直接填上
        const firstSelect = document.getElementById('firstSelect');
        const firstInput = document.getElementById('firstInput');
        firstSelect.value = key;
        firstInput.value = value.map(e => e.length > 1 ? `/${e}/` : e).join('');
      } else {
        // 其他行要现做
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

// 等页面加载完再开始
// 等所有东西都加载好了再开始
window.addEventListener('DOMContentLoaded', initDictionary);

// 添加和删除行的交互逻辑
// 输入框有变化就自动保存
// 当输入框内容变化时自动保存到本地存储
const inputs = container.getElementsByTagName('input');
for (let input of inputs) {
  input.addEventListener('input', saveDictionaryToLocal);
}

// 为所有下拉框添加change事件监听
// 下拉框选了别的也自动保存
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
      // 把每行的删除按钮都藏起来
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
  // 把每行的删除按钮都显示
  const rows = container.getElementsByClassName('container');
  for (let row of rows) {
    const btn = row.querySelector('.delete-btn');
    if (btn) btn.style.display = 'inline-block';
  }
  saveDictionaryToLocal();
});

removeButton.addEventListener('click', function() {
  // 把多余的行都删掉，只留第一行
  const rows = container.getElementsByClassName('container');
  while (rows.length > 1) {
    container.removeChild(rows[rows.length - 1]);
  }
  
  // 把第一行清空
  const firstSelect = document.getElementById('firstSelect');
  const firstInput = document.getElementById('firstInput');
  firstSelect.value = '';
  firstInput.value = '';
  
  // 隐藏删除按钮
  firstDeleteBtn.style.display = 'none';
  
  // 禁用清空按钮
  removeButton.classList.add('disabled-button');
  removeButton.disabled = true;
  
  // 把浏览器里存的东西都删掉
  localStorage.removeItem('elementDictionary');
  
  saveDictionaryToLocal();
});

// 把分组存到浏览器里
// 把每行的数据都收起来存好
function saveDictionaryToLocal() {
  // 找到所有分组行
  const rows = container.getElementsByClassName('container');
  // 先把相同字母的东西放一起
  let tempDict = {};
  
  // 先把选相同字母的东西收起来
  for (let row of rows) {
    const select = row.querySelector('select');
    const input = row.querySelector('input');
    if (select && input && select.value && select.value !== "" && input.value) {
      // 把空格都去掉
      const trimmedValue = input.value.replace(/\s+/g, '');
      
      // 把内容分开：普通字单独算，//中间的字算一组
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
      
      // 处理最后没闭合的部分
      if (currentElement) {
        elements.push(currentElement);
      }
      
      // 先把相同字母的东西放一起
      if (!tempDict[select.value]) {
        tempDict[select.value] = [];
      }
      tempDict[select.value] = tempDict[select.value].concat(elements);
    }
  }
  
  // 把相同字母的东西合并不重复
  let dictionary = {};
  for (const [key, value] of Object.entries(tempDict)) {
    dictionary[key] = [...new Set(value)];
  }
  
  // 存到浏览器里
  localStorage.setItem('elementDictionary', JSON.stringify(dictionary));
  
}
