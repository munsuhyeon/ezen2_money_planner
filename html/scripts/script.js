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
