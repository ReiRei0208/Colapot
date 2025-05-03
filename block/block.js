// 监听主js中的block变量
let blockEnabled = true; // 默认启用保护;

// 检查主js中的block变量
function checkBlockStatus() {
  if (typeof window.block !== 'undefined') {
    blockEnabled = window.block;
    applyProtection();
  } else {
    setTimeout(checkBlockStatus, 100);
  }
}

// 应用保护措施
function applyProtection() {
  if (blockEnabled) {
    // 阻止选择文本
    document.addEventListener('selectstart', function(e) {
      e.preventDefault();
    });

    // 阻止复制
    document.addEventListener('copy', function(e) {
      e.preventDefault();
    });

    // 阻止剪切
    document.addEventListener('cut', function(e) {
      e.preventDefault();
    });

    // 阻止拖动
    document.addEventListener('dragstart', function(e) {
      e.preventDefault();
    });

    // 阻止右键菜单
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });

    // 阻止键盘快捷键
    document.addEventListener('keydown', function(e) {
      // 阻止Ctrl+C, Ctrl+X, Ctrl+S等
      if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 88 || e.keyCode === 83)) {
        e.preventDefault();
      }
      // 阻止F12键
      if (e.keyCode === 123) {
        e.preventDefault();
      }
    });
  }
}

// 初始化检查
checkBlockStatus();