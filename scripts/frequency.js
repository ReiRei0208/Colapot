// 元素频率统计功能
function updateElementFrequency() {
  // 检查本地是否存在元素频率词典
  let frequencyDict = JSON.parse(localStorage.getItem('elementFrequency')) || {};
  
  // 获取元素分组词典
  const elementDict = JSON.parse(localStorage.getItem('elementDictionary')) || {};
  
  // 获取所有元素值的并集
  const allElements = new Set();
  Object.values(elementDict).forEach(elements => {
    elements.forEach(element => allElements.add(element));
  });
  
  // 更新频率词典
  const newFrequencyDict = {};
  allElements.forEach(element => {
    // 如果元素在频率词典中不存在，设置默认值1
    // 如果已存在，保留原值
    newFrequencyDict[element] = frequencyDict[element] || 0;
  });
  
  // 保存更新后的频率词典
  localStorage.setItem('elementFrequency', JSON.stringify(newFrequencyDict));
  
  // 打印频率词典到控制台
  
  // 更新UI中的下拉框选项
  updateFrequencyDropdown(newFrequencyDict);
}

// 更新频率设置下拉框
function updateFrequencyDropdown(frequencyDict) {
  const dropdown = document.getElementById('frequencyDropdown');
  const slider = document.getElementById('frequencySlider');
  const valueDisplay = document.getElementById('frequencyValue');
  
  // 清空并重新填充下拉框
  dropdown.innerHTML = '';
  Object.keys(frequencyDict).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = key;
    dropdown.appendChild(option);
  });
  
  // 设置默认选中项和滑动条初始值
  if (dropdown.options.length > 0) {
    dropdown.selectedIndex = 0;
    const currentValue = frequencyDict[dropdown.value];
    slider.value = currentValue;
    valueDisplay.textContent = currentValue.toFixed(2);
  }
}

// 监听设置按钮点击事件
document.addEventListener('DOMContentLoaded', () => {
  const settingButton = document.querySelector('.circle-button:nth-child(4)');
  if (settingButton) {
    settingButton.addEventListener('click', updateElementFrequency);
  }
  
  // 初始化频率设置UI
  const frequencyDict = JSON.parse(localStorage.getItem('elementFrequency')) || {};
  updateFrequencyDropdown(frequencyDict);
  
  // 监听下拉框变化
  const dropdown = document.getElementById('frequencyDropdown');
  const slider = document.getElementById('frequencySlider');
  const valueDisplay = document.getElementById('frequencyValue');
  
  dropdown.addEventListener('change', () => {
    const frequencyDict = JSON.parse(localStorage.getItem('elementFrequency')) || {};
    const currentValue = frequencyDict[dropdown.value] || 1;
    slider.value = currentValue;
    valueDisplay.textContent = currentValue.toFixed(2);
  });
  
  // 监听滑动条变化
  slider.addEventListener('input', () => {
    const frequencyDict = JSON.parse(localStorage.getItem('elementFrequency')) || {};
    const currentKey = dropdown.value;
    if (currentKey) {
      const newValue = parseFloat(slider.value);
      frequencyDict[currentKey] = newValue;
      localStorage.setItem('elementFrequency', JSON.stringify(frequencyDict));
      valueDisplay.textContent = newValue.toFixed(2);
    }
  });
});