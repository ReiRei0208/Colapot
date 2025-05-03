// 这里是生成结果的界面
// 先做个大盒子放所有东西
const outputContainer = document.createElement('div');
outputContainer.id = 'output';

// 放选择框的那一行
const selectRow = document.createElement('div');
selectRow.className = 'output-row';
selectRow.id = 'selectRow';

// 放按钮的那一行
const buttonRow = document.createElement('div');
buttonRow.className = 'output-row';
buttonRow.id = 'buttonRow';

// 选择怎么排列的下拉框
const layoutSelect = document.createElement('select');
layoutSelect.className = 'rounded-select';
layoutSelect.id = 'layoutSelect';
layoutSelect.innerHTML = `
  <option value="block">换行排布</option>
  <option value="inline">同行排布</option>
`;

// 选择用什么分开的下拉框
const spacingSelect = document.createElement('select');
spacingSelect.className = 'rounded-select';
spacingSelect.id = 'spacingSelect';
spacingSelect.innerHTML = `
  <option value="none">无间隔</option>
  <option value="space">空格间隔</option>
  <option value="comma">逗号间隔</option>
  <option value="semicolon">分号间隔</option>
`;

// 输入要生成多少个的框
const quantityInput = document.createElement('input');
quantityInput.className = 'rounded-input';
quantityInput.type = 'number';
quantityInput.id = 'quantity';
quantityInput.min = '1';
quantityInput.step = '1';
quantityInput.value = '5';
quantityInput.placeholder = '数量';

// 点这个按钮开始生成
const generateButton = document.createElement('button');
generateButton.className = 'button';
generateButton.id = 'generate';
generateButton.textContent = '生成';

// 点这个复制结果
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

// 点这个保存到文件
const exportButton = document.createElement('button');
exportButton.className = 'button';
exportButton.id = 'export';
exportButton.textContent = '导出';

exportButton.addEventListener('click', () => {
    const outputBox = document.getElementById('outputBox');
    const content = outputBox.value;
    if (!content) return;
    
    // 记下现在的时间
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 看看要生成多少个
    const quantity = document.getElementById('quantity').value;
    
    // 给文件起个名字
    const fileName = `${year}${month}${day}${hours}${minutes}${seconds}_${quantity}_words.txt`;
    
    // 把结果做成文件下载
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
    // 从浏览器里拿出之前存的东西
    const elementDict = JSON.parse(localStorage.getItem('elementDictionary')) || {};
    const morphologyDict = JSON.parse(localStorage.getItem('morphologyDictionary')) || {};
    const frequencyDict = JSON.parse(localStorage.getItem('elementFrequency')) || {};
    
    // 看看频率功能开了没
    const efCheckEnabled = document.getElementById('efCheck')?.checked || false;
  
    
    // 如果开了频率功能，就给每个东西加个权重
    if (efCheckEnabled && Object.keys(frequencyDict).length > 0) {
    
      
      // 把每个东西都看一遍
      for (const key in elementDict) {
        const elements = elementDict[key];
        const weightedElements = [];
        
        // 给每个东西加个权重
        elements.forEach(element => {
          const weight = frequencyDict[element] || 0; // 默认权重为1
          weightedElements.push({ element, weight });
        });
        
        // 把权重调整成0到1之间
        const totalWeight = weightedElements.reduce((sum, item) => sum + item.weight, 0);
        if (totalWeight > 0) {
          weightedElements.forEach(item => {
            item.normalizedWeight = item.weight / totalWeight;
          });
        }
        
        // 换成带权重的列表
        elementDict[key] = weightedElements.map(item => item.element);
      }
    
    }
    
    // 把构词法的权重也调整一下
    const weights = Object.values(morphologyDict);
    const sum = weights.reduce((a, b) => a + b, 0);
    if (sum > 0) {
        for (const rule in morphologyDict) {
            morphologyDict[rule] = parseFloat((morphologyDict[rule] / sum).toPrecision(3));
        }
    }
    
    // 看看用户要生成多少个
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // 按权重随机选个构词法
    const rules = Object.keys(morphologyDict);
    const weightedRules = rules.map(rule => ({
        rule,
        weight: morphologyDict[rule]
    }));
    
    // 准备要生成的东西
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
  
    
    // 开始生成结果
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
                // 处理<>里的内容
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
                        // []里的内容要重复两次
                        tempWord += squareBracketContentInAngle;
                        return;
                    }
                    if (inSquareBracketsInAngle) {
                        squareBracketContentInAngle += subKey;
                    } else {
                        const elements = elementDict[subKey] || [];
                        if (elements.length > 0) {
                            if (efCheckEnabled && elements[0]?.weight) {
                              // 按权重随机选个东西
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
                              // 随便选一个
                              const randomIndex = Math.floor(Math.random() * elements.length);
                              tempWord += elements[randomIndex];
                            }
                        }
                    }
                });
                // 同样的东西拼两次
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
                      // 按权重随机选个东西
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
                      // 随便选一个
                      const randomIndex = Math.floor(Math.random() * elements.length);
                      word += elements[randomIndex];
                    }
                }
            }
        });
        results.push(word);
    });
    
    // 在控制台和页面上显示结果
  
    
    // 看看用户选了怎么排列和分开
    const layout = document.getElementById('layoutSelect').value;
    const spacing = document.getElementById('spacingSelect').value;
    
    // 选个分隔符
    let separator = '';
    if (spacing === 'space') separator = ' ';
    else if (spacing === 'comma') separator = ',';
    else if (spacing === 'semicolon') separator = ';';
    
    // 看看要不要换行
    if (layout === 'inline') {
      outputBox.value = results.join(separator);
    } else {
      outputBox.value = results.join(separator + '\n');
    }
});

// 把选择框和输入框放到那一行
selectRow.appendChild(layoutSelect);
selectRow.appendChild(spacingSelect);
selectRow.appendChild(quantityInput);
outputContainer.appendChild(selectRow);

// 把按钮放到按钮行
buttonRow.appendChild(generateButton);
buttonRow.appendChild(copyButton);
buttonRow.appendChild(exportButton);
outputContainer.appendChild(buttonRow);

// 做个显示结果的框
const outputBox = document.createElement('textarea');
outputBox.className = 'output-box';
outputBox.id = 'outputBox';
outputBox.placeholder = '单词将生成在这里...';
outputBox.rows = 5;
outputContainer.appendChild(outputBox);

// 把东西放到第五个面板里
document.querySelector('.panel-box:nth-child(5)').appendChild(outputContainer);