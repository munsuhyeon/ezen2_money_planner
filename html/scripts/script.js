function showTab(tabName) {
    var tabs = document.getElementsByClassName('tab-content');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
    }
    document.getElementById(tabName).style.display = 'table-row-group';

    var tabButtons = document.getElementsByClassName('tab');
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    event.currentTarget.classList.add('active');
}
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('add-data');
    const slideMenu = document.getElementById('add-data-slidebar');
    const closeButton = document.getElementById('closeButton');

    menuButton.addEventListener('click', function() {
        slideMenu.classList.add('open');
    });

    closeButton.addEventListener('click', function() {
        slideMenu.classList.remove('open');
    });

    // 메뉴 외부를 클릭하면 메뉴 닫기
    document.addEventListener('click', function(event) {
        if (!slideMenu.contains(event.target) && !menuButton.contains(event.target)) {
            slideMenu.classList.remove('open');
        }
    });
});