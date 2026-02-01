const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
    overlay.style.display = sidebar.classList.contains('show') ? 'block' : 'none';
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('show');
    overlay.style.display = 'none';
});