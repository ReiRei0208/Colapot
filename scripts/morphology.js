// 元素分组功能
// 创建主容器div，用于存放所有分组行
const morContainer = document.createElement('div');
morContainer.id = 'morphology';
// 创建第一行容器，作为默认显示的行
const morFirstRow = document.createElement('div');
morFirstRow.className = 'morContainer';
morFirstRow.id = 'firstRow';

// 创建构词法输入框
const morphologyInput = document.createElement('input');
morphologyInput.className = 'morRounded-input';
morphologyInput.type = 'text';
morphologyInput.id = 'firstMorphology';
morphologyInput.placeholder = '构词法规则';
morphologyInput.pattern = '([A-Z]*|\\[.*\\]|\\<.*\\>)*';
morphologyInput.oninput = function() {
  const elementDict = JSON.parse(localStorage.getItem('elementDictionary')) || {};
  
  // 把字母都变大写
  let needsUpperCase = false;
  if ((this.value.includes('[') && this.value.includes(']')) || (this.value.includes('<') && this.value.includes('>'))) {
    // 看看方括号外面有没有小写字母
    const parts = this.value.split(/\[[^\]]*\]/);
    needsUpperCase = parts.some(part => /[a-z]/.test(part));
  } else if (/[a-z]/.test(this.value)) {
    needsUpperCase = true;
  }
  
  if (needsUpperCase) {
    let newValue = '';
    let inBrackets = false;
    for (let i = 0; i < this.value.length; i++) {
      const char = this.value[i];
      if (char === '[') inBrackets = true;
      if (char === ']') inBrackets = false;
      newValue += inBrackets ? char : char.toUpperCase();
    }
    this.value = newValue;
  }
  
  if (this.value && !elementDict[this.value]) {
    // 检查方括号外的字符是否在元素词典中
    let filteredValue = this.value;
    if ((this.value.includes('[') && this.value.includes(']')) || (this.value.includes('<') && this.value.includes('>'))) {
      filteredValue = this.value.replace(/\[[^\]]*\]/g, '');
    }
    const invalidChars = [...filteredValue].filter(char => !elementDict[char] && char !== '[' && char !== ']' && char !== '<' && char !== '>');
    if (invalidChars.length > 0) {
      this.setCustomValidity(`分组 ${invalidChars.join(', ')} 不存在`);
      this.reportValidity();
    } else {
      this.setCustomValidity('');
    }
  } else {
    this.setCustomValidity('');
  }
};

// 创建权重输入框
const weightInput = document.createElement('input');
weightInput.className = 'morRounded-input';
weightInput.type = 'number';
weightInput.id = 'firstWeight';
weightInput.placeholder = '频率权重';
weightInput.min = '0';
weightInput.max = '1';
weightInput.step = '0.1';
weightInput.addEventListener('input', function() {
  if (this.value > 1) {
    this.value = 1;
  }
});

// 创建删除按钮，初始隐藏
const morFirstDeleteBtn = document.createElement('button');
morFirstDeleteBtn.className = 'delete-btn';
morFirstDeleteBtn.textContent = '×';
morFirstDeleteBtn.style.display = 'none';
// 删除按钮点击事件：移除当前行并检查是否需要禁用清空按钮
morFirstDeleteBtn.onclick = function() {
  morContainer.removeChild(morFirstRow);
  if (morContainer.getElementsByClassName('morContainer').length === 1) {
    morRemoveButton.classList.add('disabled-button');
    morRemoveButton.disabled = true;
  }
};

morFirstRow.appendChild(morphologyInput);
morFirstRow.appendChild(weightInput);
morFirstRow.appendChild(morFirstDeleteBtn);
morContainer.appendChild(morFirstRow);

const morSummon = document.createElement('div');
morSummon.id = 'summon';
morContainer.appendChild(morSummon);

const morControls = document.createElement('div');
morControls.className = 'controls';

const morAddButton = document.createElement('button');
morAddButton.id = 'add';
morAddButton.className = 'button';
morAddButton.textContent = '添加';

const morRemoveButton = document.createElement('button');
morRemoveButton.id = 'remove';
morRemoveButton.className = 'button disabled-button';
morRemoveButton.textContent = '清空';
morRemoveButton.disabled = true;

morControls.appendChild(morAddButton);
morControls.appendChild(morRemoveButton);
morContainer.appendChild(morControls);

document.querySelector('.panel-box:nth-child(3)').appendChild(morContainer);

// 初始化函数：检查并加载本地词典
function morInitDictionary() {
  const storedDictionary = localStorage.getItem('morphologyDictionary');
  if (storedDictionary) {
    const dictionary = JSON.parse(storedDictionary);
    
    // 遍历字典中的每个键值对
    Object.entries(dictionary).forEach(([key, value], index) => {
      if (index === 0) {
        // 第一行直接设置值
        const firstMorphology = document.getElementById('firstMorphology');
        const firstWeight = document.getElementById('firstWeight');
        firstMorphology.value = key;
        firstWeight.value = value;
      } else {
        // 其他行需要动态创建
        const morNewMorphology = document.createElement('input');
        morNewMorphology.className = 'morRounded-input';
        morNewMorphology.type = 'text';
        morNewMorphology.value = key;
        morNewMorphology.pattern = '([A-Z]*|\\[.*\\]|\\<.*\\>)*';
        morNewMorphology.oninput = function() {
          const elementDict = JSON.parse(localStorage.getItem('elementDictionary')) || {};
          
          // 优化大写转换逻辑
          let needsUpperCase = false;
          if ((this.value.includes('[') && this.value.includes(']')) || (this.value.includes('<') && this.value.includes('>'))) {
            // 检查方括号外的部分是否有小写字母
            const parts = this.value.split(/\[[^\]]*\]/);
            needsUpperCase = parts.some(part => /[a-z]/.test(part));
          } else if (/[a-z]/.test(this.value)) {
            needsUpperCase = true;
          }
          
          if (needsUpperCase) {
            let newValue = '';
            let inBrackets = false;
            for (let i = 0; i < this.value.length; i++) {
              const char = this.value[i];
              if (char === '[') inBrackets = true;
              if (char === ']') inBrackets = false;
              newValue += inBrackets ? char : char.toUpperCase();
            }
            this.value = newValue;
          }
          
          if (this.value && !elementDict[this.value]) {
            // 检查方括号外的字符是否在元素词典中
            let filteredValue = this.value;
            if ((this.value.includes('[') && this.value.includes(']')) || (this.value.includes('<') && this.value.includes('>'))) {
              filteredValue = this.value.replace(/\[[^\]]*\]/g, '');
            }
            const invalidChars = [...filteredValue].filter(char => !elementDict[char] && char !== '[' && char !== ']' && char !== '<' && char !== '>');
            if (invalidChars.length > 0) {
              this.setCustomValidity(`分组 ${invalidChars.join(', ')} 不存在`);
              this.reportValidity();
            } else {
              this.setCustomValidity('');
            }
          } else {
            this.setCustomValidity('');
          }
        };

        const morNewWeight = document.createElement('input');
        morNewWeight.className = 'morRounded-input';
        morNewWeight.type = 'number';
        morNewWeight.min = '0';
        morNewWeight.step = '0.1';
        morNewWeight.value = value;
        morNewWeight.addEventListener('input', function() {
          if (this.value > 1) {
            this.value = 1;
          }
          morSaveDictionaryToLocal();
        });

        const morDeleteBtn = document.createElement('button');
        morDeleteBtn.className = 'delete-btn';
        morDeleteBtn.textContent = '×';
        morDeleteBtn.onclick = function() {
          morContainer.removeChild(morNewRow);
          if (morContainer.getElementsByClassName('morContainer').length === 1) {
            morRemoveButton.classList.add('disabled-button');
            morRemoveButton.disabled = true;
            const morRows = morContainer.getElementsByClassName('morContainer');
            for (let row of morRows) {
              const btn = row.querySelector('.delete-btn');
              if (btn) btn.style.display = 'none';
            }
          }
          morSaveDictionaryToLocal();
        };

        const morNewRow = document.createElement('div');
        morNewRow.className = 'morContainer';
        morNewRow.appendChild(morNewMorphology);
        morNewRow.appendChild(morNewWeight);
        morNewRow.appendChild(morDeleteBtn);

        morContainer.insertBefore(morNewRow, morSummon);
        morNewRow.classList.add('animated');
        
        // 为动态创建的行添加输入事件监听
        morNewMorphology.addEventListener('input', morSaveDictionaryToLocal);
        morNewWeight.addEventListener('input', morSaveDictionaryToLocal);

        if (morRemoveButton.classList.contains('disabled-button')) {
          morRemoveButton.classList.remove('disabled-button');
          morRemoveButton.disabled = false;
        }
        const morRows = morContainer.getElementsByClassName('morContainer');
        for (let row of morRows) {
          const btn = row.querySelector('.delete-btn');
          if (btn) btn.style.display = 'inline-block';
        }
      }
    });
  }
}

// 页面加载完成后执行初始化
// 监听DOMContentLoaded事件，确保DOM完全加载后再执行初始化
window.addEventListener('DOMContentLoaded', morInitDictionary);

// 添加和删除行的交互逻辑
// 为所有输入框添加input事件监听
// 当输入框内容变化时自动保存到本地存储
const morInputs = morContainer.getElementsByTagName('input');
for (let input of morInputs) {
  input.addEventListener('input', morSaveDictionaryToLocal);
}



morAddButton.addEventListener('click', function() {
  const morNewMorphology = document.createElement('input');
  morNewMorphology.className = 'morRounded-input';
  morNewMorphology.type = 'text';
  morNewMorphology.placeholder = '构词法规则';
  morNewMorphology.pattern = '([A-Z]*|\\[.*\\]|\\<.*\\>)*';
  morNewMorphology.oninput = function() {
    const elementDict = JSON.parse(localStorage.getItem('elementDictionary')) || {};
    
    // 优化大写转换逻辑
    let needsUpperCase = false;
    // 处理方括号内的内容：
    // 1. 如果输入包含方括号对[...]，检查方括号外的部分是否有小写字母
    // 2. 如果输入不包含方括号但有小写字母，也需要转换为大写
    if ((this.value.includes('[') && this.value.includes(']')) || (this.value.includes('<') && this.value.includes('>'))) {
      // 用正则分割字符串，获取方括号外的部分
      const parts = this.value.split(/\[[^\]]*\]/);
      // 检查方括号外的部分是否包含小写字母
      needsUpperCase = parts.some(part => /[a-z]/.test(part));
    } else if (/[a-z]/.test(this.value)) {
      // 如果输入不包含方括号但有小写字母，需要转换为大写
      needsUpperCase = true;
    }
    
    if (needsUpperCase) {
      let newValue = '';
      let inBrackets = false;
      // 遍历每个字符，处理大小写转换：
      // 1. 方括号内的内容保持原样
      // 2. 方括号外的字母转换为大写
      for (let i = 0; i < this.value.length; i++) {
        const char = this.value[i];
        if (char === '[') inBrackets = true;  // 遇到[标记进入方括号内
        if (char === ']') inBrackets = false; // 遇到]标记退出方括号
        // 方括号内的字符保持原样，方括号外的字母转换为大写
        newValue += inBrackets ? char : char.toUpperCase();
      }
      this.value = newValue;
    }
    
    if (this.value && !elementDict[this.value]) {
      // 验证构词法规则的有效性：
      // 1. 方括号内的内容会被忽略（允许任意内容）
      // 2. 只检查方括号外的字符是否存在于元素词典中
      let filteredValue = this.value;
      if ((this.value.includes('[') && this.value.includes(']')) || (this.value.includes('<') && this.value.includes('>'))) {
        // 使用正则移除所有方括号及其内容，只保留方括号外的字符
        filteredValue = this.value.replace(/\[[^\]]*\]/g, '');
      }
      // 过滤出无效字符：
      // 1. 不在元素词典中的字符
      // 2. 排除方括号、圆括号等特殊符号
      const invalidChars = [...filteredValue].filter(char => !elementDict[char] && char !== '[' && char !== ']' && char !== '<' && char !== '>');
      if (invalidChars.length > 0) {
        // 设置自定义验证错误信息
        this.setCustomValidity(`分组 ${invalidChars.join(', ')} 不存在`);
        this.reportValidity();
      } else {
        // 清除验证错误
        this.setCustomValidity('');
      }
    } else {
      // 如果值为空或已在词典中存在，清除验证错误
      this.setCustomValidity('');
    }
  };
  morNewMorphology.addEventListener('input', morSaveDictionaryToLocal);

  const morNewWeight = document.createElement('input');
  morNewWeight.className = 'morRounded-input';
  morNewWeight.type = 'number';
  morNewWeight.min = '0';
  morNewWeight.max = '1';
  morNewWeight.step = '0.1';
  morNewWeight.placeholder = '频率权重';
  morNewWeight.addEventListener('input', function() {
    if (this.value > 1) {
      this.value = 1;
    }
    morSaveDictionaryToLocal();
  });

  const morDeleteBtn = document.createElement('button');
  morDeleteBtn.className = 'delete-btn';
  morDeleteBtn.textContent = '×';
  morDeleteBtn.onclick = function() {
    morContainer.removeChild(morNewRow);
    if (morContainer.getElementsByClassName('morContainer').length === 1) {
      removeButton.classList.add('disabled-button');
      removeButton.disabled = true;
      // 隐藏所有行的删除按钮
      const morRows = morContainer.getElementsByClassName('morContainer');
      for (let row of morRows) {
        const btn = row.querySelector('.delete-btn');
        if (btn) btn.style.display = 'none';
      }
    }
    morSaveDictionaryToLocal();
  };

  const morNewRow = document.createElement('div');
  morNewRow.className = 'morContainer';
  morNewRow.appendChild(morNewMorphology);
  morNewRow.appendChild(morNewWeight);
  morNewRow.appendChild(morDeleteBtn);

  morContainer.insertBefore(morNewRow, morSummon);
  morNewRow.classList.add('animated');

  if (morRemoveButton.classList.contains('disabled-button')) {
    morRemoveButton.classList.remove('disabled-button');
    morRemoveButton.disabled = false;
  }
  // 显示所有行的删除按钮
  const morRows = morContainer.getElementsByClassName('morContainer');
  for (let row of morRows) {
    const btn = row.querySelector('.delete-btn');
    if (btn) btn.style.display = 'inline-block';
  }
  morSaveDictionaryToLocal();
});

morRemoveButton.addEventListener('click', function() {
  // 移除所有额外行，只保留第一行
  const morRows = morContainer.getElementsByClassName('morContainer');
  while (morRows.length > 1) {
    morContainer.removeChild(morRows[morRows.length - 1]);
  }
  
  // 重置第一行的值
  const firstMorphology = document.getElementById('firstMorphology');
  const firstWeight = document.getElementById('firstWeight');
  firstMorphology.value = '';
  firstWeight.value = '';
  
  // 隐藏删除按钮
  firstDeleteBtn.style.display = 'none';
  
  // 禁用清空按钮
  removeButton.classList.add('disabled-button');
  removeButton.disabled = true;
  
  // 清空本地存储
  localStorage.removeItem('morphologyDictionary');
  
  morSaveDictionaryToLocal();
});

// 保存字典到本地存储的函数
// 功能：收集所有行的数据，处理后存入localStorage
function morSaveDictionaryToLocal() {
  // 获取所有容器行
  const morRows = morContainer.getElementsByClassName('morContainer');
  let dictionary = {};
  const elementDict = JSON.parse(localStorage.getItem('elementDictionary')) || {};
  const seenRules = new Set();
  
  // 收集所有构词法规则和权重
  for (let row of morRows) {
    const morphologyInput = row.querySelector('input[type="text"]');
    const weightInput = row.querySelector('input[type="number"]');
    
    if (morphologyInput && weightInput && morphologyInput.value && weightInput.value) {
      // 检查构词法规则是否有效（方括号或尖括号外的字符必须存在于元素词典中）
      let filteredValue = morphologyInput.value;
      if ((morphologyInput.value.includes('[') && morphologyInput.value.includes(']')) || 
          (morphologyInput.value.includes('<') && morphologyInput.value.includes('>'))) {
        filteredValue = morphologyInput.value.replace(/\[[^\]]*\]/g, '').replace(/<[^>]*>/g, '');
      }
      const isValid = [...filteredValue].every(char => elementDict[char]);
      if (isValid) {
        const rule = morphologyInput.value;
        // 处理重复构词法规则
        if (seenRules.has(rule)) {
          // 标记重复项为在首部添加❌符号
          morphologyInput.value = '❌' + rule;
          continue;
        }
        seenRules.add(rule);
        // 只有合规且不重复的构词法规则才会被保存
        dictionary[rule] = parseFloat(weightInput.value);
      }
    }
  }
  
  // 保存到localStorage
  localStorage.setItem('morphologyDictionary', JSON.stringify(dictionary));
}
