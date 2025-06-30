const routes = {
  '/': () => import('./pages/home.js'),
  '/login': () => import('./pages/login.js'),
  '/signup': () => import('./pages/signup.js'),
  '/mypage': () => import('./pages/mypage.js'),
  '/chatbot': () => import('./pages/chatbot.js'),
};

function loadCss(path) {
  const cssPath = `/src/styles/${path}.css`;
  const old = document.getElementById('page-style');
  if (old) old.remove();

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssPath;
  link.id = 'page-style';
  document.head.appendChild(link);
}

async function router() {
  const path = location.hash.slice(1) || '/';
  const page = routes[path];
  if (page) {
    const module = await page();
    module.init?.();
    loadCss(path === '/' ? 'home' : path.slice(1)); // 경로 기준 CSS 로딩
  } else {
    document.getElementById('app').innerHTML = '<h2>404 - 페이지 없음</h2>';
  }
}

window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);
