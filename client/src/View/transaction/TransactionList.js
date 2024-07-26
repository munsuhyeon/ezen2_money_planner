import React, { useState, useEffect, useContext } from 'react';
import './Transaction.css';
import { AddDataModal, SearchModal } from '../../Ui/Modal';
import { call } from '../../Components/service/ApiService';
import { CategoryContext } from '../../App';

const TransactionList = () => {
    const categoryList = useContext(CategoryContext);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [expenseCategory, setExpenseCategory] = useState([]);
    const [incomeCategory, setIncomeCategory] = useState([]);
    const [assetsCategory, setAssetsCategory] = useState([]);
    const [installmentCategory, setInstallmentCategory] = useState([]);
    useEffect(() => {
        if (categoryList && categoryList.length > 0) {
            const expense = categoryList.filter(category => category.categoryType === 'expense');
            const income = categoryList.filter(category => category.categoryType === 'income');
            const assets = categoryList.filter(category => category.categoryType === 'assets');
            const installment = categoryList.filter(category => category.categoryType === 'installments');

            setExpenseCategory(expense);
            setIncomeCategory(income);
            setAssetsCategory(assets);
            setInstallmentCategory(installment);
        }
    },[categoryList])
    const showModal = (btn) => {
        if(btn == 'addData'){
            setAddModalOpen(true);
        }else if(btn == 'search'){
            setSearchModalOpen(true)
        }
    }
    
    const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    };

    return(
            <div className="transcation" id="transcation">
            <div className="content-header">
                <h2 className="date-button">
                    07월 2024
                    <img src={process.env.PUBLIC_URL + `assets/arrow-down-2-svgrepo-com.svg`} alt="arrow-down" className="arrow-down"/>
                </h2>
                <div className="btn-wrap">
                    <div className="add-data" id="add-data" onClick={() => {showModal('addData')}}>
                        <img src={process.env.PUBLIC_URL + `assets/plus-svgrepo-com.svg`} alt="plus"/>
                    </div>
                    <div className="circle-btn" id="search-btn" onClick={() => {showModal('search')}}>
                        <img src={process.env.PUBLIC_URL + `assets/search-svgrepo-com.svg`} alt="search"/>
                    </div>
                    <div className="circle-btn">
                        <img src={process.env.PUBLIC_URL + `assets/excel2-svgrepo-com.svg`} alt="excel"/>
                    </div>
                </div>
            </div>
            <div className="table-content">
                <div className="tabs">
                    <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => handleTabClick('all')}>전체 (1)<br/><span className="tab_total">-1,000 원</span></button>
                    <button className={`tab ${activeTab === 'income' ? 'active' : ''}`} onClick={() => handleTabClick('income')}>수입 (0)<br/><span className="tab_income">0 원</span></button>
                    <button className={`tab ${activeTab === 'expense' ? 'active' : ''}`} onClick={() => handleTabClick('expense')}>지출 (1)<span className="tab_expense">1,000,000 원</span></button>
                </div>
                <div>
                    <table className="transcation-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox"/></th>
                                <th>날짜</th>
                                <th>자산</th>
                                <th>분류</th>
                                <th>금액</th>
                                <th>내용</th>
                            </tr>
                        </thead>
                        <tbody id="all" className="tab-content" style={{ display: activeTab === 'all' ? 'table-row-group' : 'none' }}>
                            <tr>
                                <td><input type="checkbox"/></td>
                                <td>07/15 (월) 18:04</td>
                                <td>현금</td>
                                <td>교통/차량</td>
                                <td className="amount">1,300 원</td>
                                <td>버스 교통비</td>
                            </tr>
                        </tbody>
                        <tbody id="income" className="tab-content" style={{ display: activeTab === 'income' ? 'table-row-group' : 'none' }}>
                            <tr>
                                <td colSpan="6" className="no-data">
                                    <div className="no-data-text">
                                        데이터가 없습니다.
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tbody id="expense" className="tab-content" style={{ display: activeTab === 'expense' ? 'table-row-group' : 'none' }}>
                            <tr>
                                <td><input type="checkbox"/></td>
                                <td>07/15 (월) 18:04</td>
                                <td>현금</td>
                                <td>교통/차량</td>
                                <td className="amount">1,300 원</td>
                                <td>버스 교통비</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        
        {addModalOpen && <AddDataModal setAddModalOpen={setAddModalOpen} expenseCategory={expenseCategory}
        incomeCategory={incomeCategory} assetsCategory={assetsCategory}/>}

        {searchModalOpen && <SearchModal setSearchModalOpen={setSearchModalOpen} expenseCategory={expenseCategory}
        incomeCategory={incomeCategory} assetsCategory={assetsCategory} installmentCategory={installmentCategory}/>}

        </div>       
    )
}
export default TransactionList;