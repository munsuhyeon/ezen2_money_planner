// 테이블 수입/목록 탭 전환
// 테이블 수입/목록 탭 전환
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

// 데이터 입력 버튼 팝업 열기
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('add-data');
    const popupMenu = document.getElementById('popup-menu');
    const closeButton = document.getElementById('closeButton');
    const wrap = document.getElementById('container');
    const searchButton = document.getElementById('search-btn');
    const popupSearch = document.getElementById('search-menu');

    // 팝업 내부 클릭 시 이벤트 전파 방지
    popupMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // 데이터입력 버튼 클릭하면 입력팝업창 보여주기
    menuButton.addEventListener('click', function(event) {
        wrap.classList.add('open');
        popupMenu.classList.add('open');
        event.stopPropagation();  // 이벤트 전파 막기
    });
    // 팝업창 내부 닫기 버튼 클릭하면 팝업창 닫기
    closeButton.addEventListener('click', function(event) {
        wrap.classList.remove('open');
        popupMenu.classList.remove('open');
        popupSearch.classList.remove('open');
        event.stopPropagation();  // 이벤트 전파 막기
    });

    // 검색 버튼 클릭하면 입력팝업창 보여주기
    searchButton.addEventListener('click', function(event) {
        wrap.classList.add('open');
        popupSearch.classList.add('open');
        event.stopPropagation();  // 이벤트 전파 막기
    });
     
    // 팝업 외부를 클릭하면 팝업 닫기
    wrap.addEventListener('click', function() {
        wrap.classList.remove('open');
        popupMenu.classList.remove('open');
        popupSearch.classList.remove('open');
    });

     // 모든 체크박스 요소들을 선택
     const checkBoxes = document.querySelectorAll('.filter-check-box');
        
     checkBoxes.forEach(checkBox => {
         checkBox.addEventListener('click', function() {
             // 체크박스 상태 토글
             checkBox.classList.toggle('checked');
             // 이벤트 전파 막기
            event.stopPropagation();
         });
     });

});
function pop_up_tab(element) {
    //console.log(element)
    let buttons = document.querySelectorAll('.pop-up-tab');
    buttons.forEach(function(button) {
        button.classList.remove('active');
    });
    element.classList.add('active');

    let saveButton = document.querySelector('.save-button');
    saveButton.classList.remove('expense-active', 'income-active');

    let inputForm = document.querySelector(".input-form");
    inputForm.classList.remove('expense', 'income');

    let repeatWrap = document.getElementById("repeat-wrap");

    if (element.classList.contains('expenseTab')) {
        saveButton.classList.add('expense-active');
        inputForm.classList.add("expense");
        repeatWrap.style.display = ''
    } else if (element.classList.contains('incomeTab')) {
        saveButton.classList.add('income-active');
        inputForm.classList.add("income")
        repeatWrap.style.display = 'none'
    }

    
}
