const path = window.location.pathname;
if (path.endsWith('.html')) {
    const cleanPath = path.replace('.html', '');
    window.history.replaceState(null, '', cleanPath);
}

if (window.location.pathname === '/index') {
    window.history.replaceState(null, '', '/');
}