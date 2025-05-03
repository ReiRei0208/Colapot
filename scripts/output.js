// 输出界面功能
// 创建主容器div，用于存放所有控件
const outputContainer = document.createElement('div');
outputContainer.id = 'output';

// 创建下拉框行容器
const selectRow = document.createElement('div');
selectRow.className = 'output-row';
selectRow.id = 'selectRow';

// 创建按钮行容器
const buttonRow = document.createElement('div');
buttonRow.className = 'output-row';
buttonRow.id = 'buttonRow';

// 创建排布方式下拉菜单
const layoutSelect = document.createElement('select');
layoutSelect.className = 'rounded-select';
layoutSelect.id = 'layoutSelect';
layoutSelect.innerHTML = `
  <option value="block">换行排布</option>
  <option value="inline">同行排布</option>
`;

// 创建间隔方式下拉菜单
const spacingSelect = document.createElement('select');
spacingSelect.className = 'rounded-select';
spacingSelect.id = 'spacingSelect';
spacingSelect.innerHTML = `
  <option value="none">无间隔</option>
  <option value="space">空格间隔</option>
  <option value="comma">逗号间隔</option>
  <option value="semicolon">分号间隔</option>
`;

// 创建数量输入框
const quantityInput = document.createElement('input');
quantityInput.className = 'rounded-input';
quantityInput.type = 'number';
quantityInput.id = 'quantity';
quantityInput.min = '1';
quantityInput.step = '1';
quantityInput.value = '5';
quantityInput.placeholder = '数量';

// 创建生成按钮
const generateButton = document.createElement('button');
generateButton.className = 'button';
generateButton.id = 'generate';
generateButton.textContent = '生成';

// 创建复制按钮
const copyButton = document.createElement('button');
copyButton.className = 'button';
copyButton.id = 'copy';
copyButton.textContent = '复制';

copyButton.addEventListener('click', () => {
    const outputBox = document.getElementById('outputBox');
    outputBox.select();
    document.execCommand('copy');
    copyButton.textContent = '已复制';
    setTimeout(() => {
        copyButton.textContent = '复制';
    }, 500);
});

// 创建导出按钮
const exportButton = document.createElement('button');
exportButton.className = 'button';
exportButton.id = 'export';
exportButton.textContent = '导出';

exportButton.addEventListener('click', () => {
    const outputBox = document.getElementById('outputBox');
    const content = outputBox.value;
    if (!content) return;
    
    // 获取当前时间并格式化为年月日时分秒
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 获取数量
    const quantity = document.getElementById('quantity').value;
    
    // 创建文件名
    const fileName = `${year}${month}${day}${hours}${minutes}${seconds}_${quantity}_words.txt`;
    
    // 创建Blob对象并下载
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

generateButton.addEventListener('click', () => {
    // 从本地存储获取元素词典、构词法词典和元素频率词典
    const elementDict = JSON.parse(localStorage.getItem('elementDictionary')) || {};
    const morphologyDict = JSON.parse(localStorage.getItem('morphologyDictionary')) || {};
    const frequencyDict = JSON.parse(localStorage.getItem('elementFrequency')) || {};
    
    // 检查efCheck按钮是否开启
    const efCheckEnabled = document.getElementById('efCheck')?.checked || false;
  
    
    // 如果启用了元素频率功能，为每个元素添加权重
    if (efCheckEnabled && Object.keys(frequencyDict).length > 0) {
    
      
      // 遍历元素词典中的每个键
      for (const key in elementDict) {
        const elements = elementDict[key];
        const weightedElements = [];
        
        // 为每个元素添加权重
        elements.forEach(element => {
          const weight = frequencyDict[element] || 0; // 默认权重为1
          weightedElements.push({ element, weight });
        });
        
        // 对权重进行归一化处理
        const totalWeight = weightedElements.reduce((sum, item) => sum + item.weight, 0);
        if (totalWeight > 0) {
      
          weightedElements.forEach(item => {
        
            item.normalizedWeight = item.weight / totalWeight;
          });
      
          weightedElements.forEach(item => {
        
          });
      
        }
        
        // 替换原始元素数组为带权重的数组
        elementDict[key] = weightedElements;
      }
    
    }
    
    // 对构词法词典中的权重进行归一化处理
    const weights = Object.values(morphologyDict);
    const sum = weights.reduce((a, b) => a + b, 0);
    if (sum > 0) {
        for (const rule in morphologyDict) {
            morphologyDict[rule] = parseFloat((morphologyDict[rule] / sum).toPrecision(3));
        }
    }
    
    // 获取数量输入框的值
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // 根据权重随机选择构词法规则
    const rules = Object.keys(morphologyDict);
    const weightedRules = rules.map(rule => ({
        rule,
        weight: morphologyDict[rule]
    }));
    
    // 生成待生成列表
    const toGenerate = [];
    for (let i = 0; i < quantity; i++) {
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (const {rule, weight} of weightedRules) {
            cumulativeWeight += weight;
            if (random <= cumulativeWeight) {
                toGenerate.push(rule);
                break;
            }
        }
    }
  
    
    // 生成结果列表
    const results = [];
    toGenerate.forEach(rule => {
        let word = '';
        let inAngleBrackets = false;
        let angleBracketContent = '';
        let inSquareBrackets = false;
        let squareBracketContent = '';
        rule.split('').forEach(key => {
            if (key === '<') {
                inAngleBrackets = true;
                angleBracketContent = '';
                return;
            }
            if (key === '>') {
                inAngleBrackets = false;
                // 处理尖括号内容
                let tempWord = '';
                let inSquareBracketsInAngle = false;
                let squareBracketContentInAngle = '';
                angleBracketContent.split('').forEach(subKey => {
                    if (subKey === '[') {
                        inSquareBracketsInAngle = true;
                        squareBracketContentInAngle = '';
                        return;
                    }
                    if (subKey === ']') {
                        inSquareBracketsInAngle = false;
                        // 保留方括号内容并重复两次
                        tempWord += squareBracketContentInAngle;
                        return;
                    }
                    if (inSquareBracketsInAngle) {
                        squareBracketContentInAngle += subKey;
                    } else {
                        const elements = elementDict[subKey] || [];
                        if (elements.length > 0) {
                            if (efCheckEnabled && elements[0]?.weight) {
                              // 根据权重随机选择元素
                              const random = Math.random();
                              let cumulativeWeight = 0;
                              for (const {element, normalizedWeight} of elements) {
                                cumulativeWeight += normalizedWeight;
                                if (random <= cumulativeWeight) {
                                  tempWord += element;
                                  break;
                                }
                              }
                            } else {
                              // 均匀随机选择
                              const randomIndex = Math.floor(Math.random() * elements.length);
                              tempWord += elements[randomIndex];
                            }
                        }
                    }
                });
                // 重复拼接两次
                word += tempWord + tempWord;
                return;
            }
            if (key === '[' && !inAngleBrackets) {
                inSquareBrackets = true;
                squareBracketContent = '';
                return;
            }
            if (key === ']' &&!inAngleBrackets) {
                inSquareBrackets = false;
                word += squareBracketContent;
                return;
            }
            if (inAngleBrackets) {
                angleBracketContent += key;
            } else if (inSquareBrackets) {
                squareBracketContent += key;
            } else {
                const elements = elementDict[key] || [];
                if (elements.length > 0) {
                    if (efCheckEnabled && elements[0]?.weight) {
                      // 根据权重随机选择元素
                      const random = Math.random();
                      let cumulativeWeight = 0;
                      for (const {element, normalizedWeight} of elements) {
                        cumulativeWeight += normalizedWeight;
                        if (random <= cumulativeWeight) {
                          word += element;
                          break;
                        }
                      }
                    } else {
                      // 均匀随机选择
                      const randomIndex = Math.floor(Math.random() * elements.length);
                      word += elements[randomIndex];
                    }
                }
            }
        });
        results.push(word);
    });
    
    // 输出到控制台和界面
  
    
    // 获取排布方式和间隔方式
    const layout = document.getElementById('layoutSelect').value;
    const spacing = document.getElementById('spacingSelect').value;
    
    // 根据间隔方式选择分隔符
    let separator = '';
    if (spacing === 'space') separator = ' ';
    else if (spacing === 'comma') separator = ',';
    else if (spacing === 'semicolon') separator = ';';
    
    // 根据排布方式决定换行处理
    if (layout === 'inline') {
      outputBox.value = results.join(separator);
    } else {
      outputBox.value = results.join(separator + '\n');
    }
});

// 将下拉框和输入框添加到下拉框行
selectRow.appendChild(layoutSelect);
selectRow.appendChild(spacingSelect);
selectRow.appendChild(quantityInput);
outputContainer.appendChild(selectRow);

// 将按钮添加到按钮行
buttonRow.appendChild(generateButton);
buttonRow.appendChild(copyButton);
buttonRow.appendChild(exportButton);
outputContainer.appendChild(buttonRow);

// 创建输出框
const outputBox = document.createElement('textarea');
outputBox.className = 'output-box';
outputBox.id = 'outputBox';
outputBox.placeholder = '单词将生成在这里...';
outputBox.rows = 5;
outputContainer.appendChild(outputBox);

// 将容器添加到第五个panel-box
document.querySelector('.panel-box:nth-child(5)').appendChild(outputContainer);