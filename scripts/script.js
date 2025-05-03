// 控制保护功能开关
window.block = false;

// 动态加载block.css
if (window.block) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'block/block.css';
  document.head.appendChild(link);
}

// 按钮状态管理和面板控制
const buttons = document.querySelectorAll('.circle-button');
const panels = document.querySelectorAll('.panel-box');

// 初始化按钮和面板状态
buttons.forEach((button, index) => {
  if (index === 0) {
    button.style.backgroundColor = 'var(--primary-color)';
    button.style.boxShadow = '0 0 10px rgba(46, 125, 50, 0.8)';
    panels[index].style.display = 'block';
  } else {
    button.style.backgroundColor = '#cccccc';
    button.style.boxShadow = 'none';
    panels[index].style.display = 'none';
  }
});

// 为所有按钮添加点击事件
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    // 重置所有按钮状态
    buttons.forEach(btn => {
      btn.style.backgroundColor = '#cccccc';
      btn.style.boxShadow = 'none';
    });
    
    // 隐藏所有面板
    panels.forEach(panel => {
      panel.style.display = 'none';
    });
    
    // 设置当前按钮为选中状态并显示对应面板
    button.style.backgroundColor = 'var(--primary-color)';
    button.style.boxShadow = '0 0 10px rgba(46, 125, 50, 0.8)';
    panels[index].style.display = 'block';
  });
});