/** 一键复制 .copy-block 内代码/提示词 */
(function () {
  function initCopyBlocks() {
    document.querySelectorAll('.copy-block').forEach((block) => {
      if (block.querySelector('.copy-block-btn')) return;
      const pre = block.querySelector('pre, code.copy-block-body');
      if (!pre) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-block-btn';
      btn.textContent = '复制';
      btn.setAttribute('aria-label', '复制到剪贴板');
      btn.addEventListener('click', async () => {
        const text = pre.innerText || pre.textContent;
        try {
          await navigator.clipboard.writeText(text.trim());
          btn.textContent = '已复制';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = '复制';
            btn.classList.remove('copied');
          }, 2000);
        } catch {
          btn.textContent = '请手动复制';
        }
      });
      block.insertBefore(btn, block.firstChild);
    });
  }

  document.addEventListener('DOMContentLoaded', initCopyBlocks);
})();
