import React, { useState} from 'react';
import './Modal.css';
import Checkbox from './Checkbox';

export const AddDataModal = ({ setAddModalOpen }) => {
    const closeModal = () => {
        setAddModalOpen(false);
    };
    return(
        <div className="popup-menu" id="popup-menu">
                <div className="pop-menu-head">
                    <h1 className="pop-menu-title">입력</h1>
                    <p id="closeButton" className="close-button" onClick={closeModal}><img src={process.env.PUBLIC_URL + `assets/close-svgrepo-com.svg`} alt="close"/></p>
                </div>
                <div className="input-form">
                    <div className="tab-buttons">
                        <button className="pop-up-tab incomeTab" onClick="pop_up_tab(this)">수입</button>
                        <button className="pop-up-tab expenseTab active" onClick="pop_up_tab(this)">지출</button>
                    </div>
                    <div className="input-wrap">
                        <div className="date-time">
                            <div>
                                <label for="date">날짜</label>
                                <input type="text" id="date" value="2024.07.15" />
                            </div>
                            <div>
                                <label for="time">시간</label>
                                <input type="text" id="time" value="17:36" />
                            </div>
                        </div>
                        <div className="input-group">
                            <label for="amount">금액</label>
                            <input type="text" id="amount" />
                        </div>
                        <div className="input-group">
                            <label for="category">분류</label>
                            <select id="category">
                                <option>식비</option>
                                <option>교통/차량</option>
                                <option>문화생활</option>
                                <option>마트/편의점</option>
                                <option>패션/미용</option>
                                <option>생활용품</option>
                                <option>주거/통신</option>
                                <option>건강</option>
                                <option>교육</option>
                                <option>경조사/회비</option>
                                {/* 수입 옵션 */}
                                <option>월급</option>
                                <option>부수입</option>
                                <option>용돈</option>
                                <option>상여</option>
                                <option>금융소득</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label for="asset">자산</label>
                            <select id="asset">
                                <option>카드</option>
                                <option>현금</option>
                                {/* 옵션 추가 */}
                            </select>
                        </div>
                        <div className="input-group" id="repeat-wrap">
                            <label for="repeat">할부</label>
                            <select id="repeat">
                                <option>일시불</option>
                                <option>1개월</option>
                                <option>2개월</option>
                                <option>3개월</option>
                                <option>4개월</option>
                                <option>5개월</option>
                                <option>7개월</option>
                                <option>8개월</option>
                                <option>9개월</option>
                                <option>10개월</option>
                                <option>11개월</option>
                                <option>12개월</option>
                                {/* 옵션 추가 */}
                            </select>
                        </div>
                        <div className="input-group">
                            <label for="content">내용</label>
                            <input type="text" id="content" />
                        </div>
                        <div className="button-group">
                            <button className="save-button">저장</button>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export const SearchModal = ({setSearchModalOpen}) => {
    const closeModal = () => {
        setSearchModalOpen(false);
    };
    const [checkedBoxes, setCheckedBoxes] = useState([]);
    const toggleCheckBox = (index) => {
    setCheckedBoxes((prev) => {
        const newCheckedBoxes = [...prev];
        newCheckedBoxes[index] = !newCheckedBoxes[index];
        return newCheckedBoxes;
    });
    };
    return(
        <div className="popup-menu" id="search-menu">
                <div className="pop-menu-head">
                    <h1 className="pop-menu-title">검색</h1>
                    <p id="closeButton" className="close-button" onClick={closeModal}><img src={process.env.PUBLIC_URL + `assets/close-svgrepo-com.svg`} alt="close"/></p>
                </div>
                <div className="check-wrap">
                    <div className="expense-checkbox">
                        <p className="filter-title">카테고리(지출)</p>
                        <ul>
                            <li className="categoryList">
                                <Checkbox text={'식사'}/>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">카페/간식</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">술/유흥</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">생활/마트</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">온라인 쇼핑</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">백화점/패션</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">금융/보험</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">의료/건강</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">뷰티/미용</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">주거/통신</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">학습/교육</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">문화/예술</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">교통/차량</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">스포츠/레저</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">여행/숙박</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">경조사/회비</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">출금</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">자산이동</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">기타지출</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                   
                    <div className="income-checkbox">
                        <p className="filter-title">카테고리(수입)</p>
                        <ul>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">주수입</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">부수입</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">금융/대출</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">자산이동</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">기타수입</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="property-checkbox">
                        <p className="filter-title">자산</p>
                        <ul>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">카드</p>
                                </div>
                            </li>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">현금</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="installment-checkbox">
                        <p className="filter-title">할부</p>
                        <ul>
                            <li className="categoryList">
                                <div>
                                    <span className="filter-check-box"></span>
                                    <p className="filter-binding">할부</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="button-group">
                    <button className="search-button">검색</button>
                </div>
            </div>
    )
}
