import React, { useState, useEffect } from 'react';
import './Transaction.css';
import { AddDataModal, SearchModal } from '../../Ui/Modal';
import { call } from '../../Components/service/ApiService';
const TransactionList = () => {
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [expenseCategory, setExpenseCategory] = useState([]);
    const [incomeCategory, setIncomeCategory] = useState([]);
    const [assetsCategory, setAssetsCategory] = useState([]);
    const [installmentCategory, setInstallmentCategory] = useState([]);
    const showModal = (btn) => {
        if(btn == 'addData'){
            setAddModalOpen(true);
        }else if(btn == 'search'){
            setSearchModalOpen(true)
        }
    }
    const [activeTab, setActiveTab] = useState('all');
    
    const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    };

    useEffect(() => {
        call("/category","GET",null)
        .then((response) => {
            if (response) {
                const expenseData = response.data.filter(category => category.categoryType === 'expense');
                const incomeData = response.data.filter(category => category.categoryType === 'income');
                const assetsData = response.data.filter(category => category.categoryType === 'assets');
                const installmentsData = response.data.filter(category => category.categoryType === 'installments');
                setExpenseCategory(expenseData);
                setIncomeCategory(incomeData);
                setAssetsCategory(assetsData);
                setInstallmentCategory(installmentsData);
            } else {
                throw new Error("응답 구조가 잘못되었습니다");
            }
        })
        .catch((error) => {
            console.error("API call error:", error);
        });
    },[])
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
                    <button className={`tab ${activeTab === 'expense' ? 'active' : ''}`} onClick={() => handleTabClick('expense')}><span>지출 (1)</span><span className="tab_expense">1,000,000 원</span></button>
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
        
        {addModalOpen && <AddDataModal setAddModalOpen={setAddModalOpen}/>}
        {searchModalOpen && <SearchModal setSearchModalOpen={setSearchModalOpen}/>}
        </div>       
    )
}
export default TransactionList;