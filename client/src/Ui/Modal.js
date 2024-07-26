import React, { useState, useRef} from 'react';
import './Modal.css';
import Checkbox from './Checkbox';
import { formatDate,formatTime } from '../Utils/Utils';
import { call } from '../Components/service/ApiService';

export const AddDataModal = ({ setAddModalOpen,expenseCategory,incomeCategory,assetsCategory }) => {
    const closeModal = () => {
        setAddModalOpen(false);
    };
    const handlePopupTab = (tab) => {
        setPopupTab(tab);
    }
    const [popupTab,setPopupTab] = useState("expense");
    const [nowDate,setNowDate] = useState(formatDate(new Date()));
    const handleDateChange = (e) => {
        setNowDate(e.target.value)
    }
    const [nowTime, setNowTime] = useState(formatTime(new Date()));
    const handleTimeChange = (e) => {
        setNowTime(e.target.value)
    }
        const dateRef = useRef(null);
        const timeRef = useRef(null);
        const amountRef = useRef(null);
        const categoryRef = useRef(null);
        const assetRef = useRef(null);
        const installmenttRef = useRef(null);
        const descriptionRef = useRef(null);
        const userId = 'test123;'
        const transactionDate = '';

        const handleSubmit = (e) => {
            e.preventDefault();
    
            const formData = {
                date: dateRef.current.value,
                time: timeRef.current.value,
                amount: amountRef.current.value,
                category: categoryRef.current.value,
                asset: assetRef.current.value,
                installment: repeatRef.current.value,
                description: descriptionRef.current.value,
                userId: userId,
                transactionDate : date + time
            };
    
            console.log('formData :', formData);
            call('/transactions',"POST",formData).then(() => console.log("저장 성공"));
        };
    return(
        <div className="popup-menu" id="popup-menu">
                <div className="pop-menu-head">
                    <h1 className="pop-menu-title">입력</h1>
                    <p id="closeButton" className="close-button" onClick={closeModal}><img src={process.env.PUBLIC_URL + `assets/close-svgrepo-com.svg`} alt="close"/></p>
                </div>
                <form onSubmit={handleSubmit} className={`input-form ${popupTab === 'income' ? 'income' : 'expense'}`}>
                    <div className="tab-buttons">
                        <button className={`pop-up-tab incomeTab ${popupTab === 'income' ? 'active' : ''}`} onClick={()=>{handlePopupTab('income')}}>수입</button>
                        <button className={`pop-up-tab expenseTab ${popupTab === 'expense' ? 'active' : ''}`} onClick={()=>{handlePopupTab('expense')}}>지출</button>
                    </div>
                    <div className="input-wrap">
                        <div className="date-time">
                            <div>
                                <label htmlFor="date">날짜</label>
                                <input type="date" id="date" value={nowDate} onChange={handleDateChange} ref={dateRef}/>
                            </div>
                            <div>
                                <label htmlFor="time">시간</label>
                                <input type="time" id="time" value={nowTime} onChange={handleTimeChange} ref={timeRef}/>
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="amount">금액</label>
                            <input type="text" id="amount"  ref={amountRef}/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="category">분류</label>
                            <select id="category"  className="custom-select" ref={categoryRef}>
                                {popupTab === 'expense' &&
                                    expenseCategory.map((item) => (
                                        <option key={item.categoryId}>{item.categoryName}</option>
                                    ))
                                }
                                {popupTab === 'income' &&
                                    incomeCategory.map((item) => (
                                        <option key={item.categoryId}>{item.categoryName}</option>
                                    ))
                                }
                            </select>
                            <img src={process.env.PUBLIC_URL + `assets/arrow-down-2-svgrepo-com.svg`} alt="Arrow Down" className="custom-select-arrow"/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="asset">자산</label>
                            <select id="asset"  ref={assetRef}>
                                {assetsCategory.map((item) => (
                                    <option key={item.categoryId}>{item.categoryName}</option>
                                ))}
                                {/* 옵션 추가 */}
                            </select>
                            <img src={process.env.PUBLIC_URL + `assets/arrow-down-2-svgrepo-com.svg`} alt="Arrow Down" className="custom-select-arrow"/>
                        </div>
                        <div className="input-group" id="repeat-wrap">
                            <label htmlFor="repeat">할부</label>
                            <select id="repeat" ref={installmenttRef}>
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
                            </select>
                            <img src={process.env.PUBLIC_URL + `assets/arrow-down-2-svgrepo-com.svg`} alt="Arrow Down" className="custom-select-arrow"/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="description">내용</label>
                            <input type="text" id="description" ref={descriptionRef}/>
                        </div>
                        <div className="button-group">
                            <button type="submit" className={`save-button ${popupTab === 'expense' ? 'expense-active' : 'income-active'}`} >저장</button>
                        </div>
                    </div>
                </form>
            </div>
    )
}

export const SearchModal = ({setSearchModalOpen,expenseCategory,incomeCategory,assetsCategory,installmentCategory}) => {
    const closeModal = () => {
        setSearchModalOpen(false);
    };
    const [checkedBoxes, setCheckedBoxes] = useState({
        expense: Array(expenseCategory.length).fill(false),
        income: Array(incomeCategory.length).fill(false),
        assets: Array(assetsCategory.length).fill(false),
        installment: Array(installmentCategory.length).fill(false),
    });

    const toggleCheckBox = (categoryType, index) => {
        setCheckedBoxes(prev => ({
            ...prev,
            [categoryType]: prev[categoryType].map((checked, i) => i === index ? !checked : checked)
        }));
    };

    const renderCheckboxList = (categoryType, categories) => (
        <ul>
            {categories.map((item, index) => (
                <li className="categoryList" key={item.categoryId}>
                    <Checkbox
                        id={item.categoryId}
                        text={item.categoryName}
                        checked={checkedBoxes[categoryType][index]}
                        onChange={() => toggleCheckBox(categoryType, index)}
                    />
                </li>
            ))}
        </ul>
    );
    return(
        <div className="popup-menu" id="search-menu">
                <div className="pop-menu-head">
                    <h1 className="pop-menu-title">검색</h1>
                    <p id="closeButton" className="close-button" onClick={closeModal}><img src={process.env.PUBLIC_URL + `assets/close-svgrepo-com.svg`} alt="close"/></p>
                </div>
                <div className="check-wrap">
                    <div className='search-wrap'>
                        <input type='text' className='searchForm'/>
                        <div className='searchImg'>
                            <img src={process.env.PUBLIC_URL + `assets/search-svgrepo-com.svg`}/>
                        </div>
                    </div>
                    
                    <div className="expense-checkbox">
                        <p className="filter-title">카테고리(지출)</p>
                        {renderCheckboxList('expense', expenseCategory)}
                    </div>
                   
                    <div className="income-checkbox">
                        <p className="filter-title">카테고리(수입)</p>
                        {renderCheckboxList('income', incomeCategory)}
                    </div>

                    <div className="property-checkbox">
                        <p className="filter-title">자산</p>
                        {renderCheckboxList('assets', assetsCategory)}
                    </div>

                    <div className="installment-checkbox">
                        <p className="filter-title">할부</p>
                        {renderCheckboxList('installment', installmentCategory)}
                    </div>
                </div>

                <div className="button-group">
                    <button className="search-button">검색</button>
                </div>
            </div>
    )
}
