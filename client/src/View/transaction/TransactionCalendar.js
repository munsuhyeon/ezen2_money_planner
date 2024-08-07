import React, { useState,useRef,useContext, useEffect } from 'react';
import Calendar from 'react-calendar';
import DatePicker from "react-datepicker";
import {TransactionListContext } from '../../App';
import {convertToCustomDateFormat, formatPrice, formatMonth} from '../../Utils/Utils';
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";
import 'react-calendar/dist/Calendar.css';
import './Transaction.css';
import "./TransactionCalendar.css";
const TransactionCalendar = () => {
    const {transactionList,getTransactionList} = useContext(TransactionListContext);
    const [value, onChange] = useState(new Date()); 
    const [activeTab, setActiveTab] = useState("all");
    
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };
        // 전체 내역의 갯수
    const countTotal = transactionList.length;
        // 전체 지출의 갯수
    const countExpense = transactionList.filter((item) => item.incomeType === "expense").length;
    // 전체 수입의 갯수
    const countIncome = transactionList.filter((item) => item.incomeType === "income").length;
    // 'expense'의 총 합계 계산
    const totalExpense = transactionList
    .filter(item => item.incomeType === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

    // 'income'의 총 합계 계산
    const totalIncome = transactionList
    .filter((item) => item.incomeType === "income")
    .reduce((sum, item) => sum + item.amount, 0);
    // 전체 amount의 합계 계산
    const totalAmount = transactionList.reduce((total, item) => {
    // 'expense'일 경우 amount를 음수로 변환하고, 'income'일 경우 양수로 유지
    const adjustedAmount =
        item.incomeType === "expense" ? -item.amount : item.amount;
    return total + adjustedAmount;
    }, 0);
    // 날짜별 지출,수입을 매핑하는 객체 생성
    const transactionMap = transactionList.reduce((map,list) => {
        const date = new Date(list.transactionDate).toDateString();
        if(!map[date]){
            map[date] = []
        }
        map[date].push(list);
        return map
    },{})
    useEffect(() => {
        console.log("transactionMap")
        console.log(transactionMap)
    },[transactionMap])
    const tileContent = ({ date, view }) => {
        const dateString = date.toDateString();
        if (view === 'month') {
            return (
                <div>
                    {dateString === new Date().toDateString() && (
                        <div className='today-label'>오늘</div>
                    )}
                    {transactionMap[dateString] && (
                        <div className="transaction-amounts">
                            {transactionMap[dateString].map((transaction, index) => {
                                const shortDescription = transaction.description.length > 9 
                                    ? transaction.description.slice(0, 9) + '...' 
                                    : transaction.description;
    
                                return (
                                    <div key={index} className={`transaction-amount ${transaction.incomeType}`}>
                                        {transaction.incomeType === 'expense' ? '-' : '+'}
                                        {transaction.amount.toLocaleString()} &nbsp;
                                        {shortDescription}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };
    
    return(
        <div className="transcation">
            <div className="table-content">
                <div className="tabs">
                    <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => handleTabClick('all')}>전체 ({countTotal})<br/><span className={`${totalAmount < 0 ? 'tab_expense' : 'tab_income'}`}>{formatPrice(totalAmount)} 원</span></button>
                    <button className={`tab ${activeTab === 'income' ? 'active' : ''}`} onClick={() => handleTabClick('income')}>수입 ({countIncome})<br/><span className="tab_income">{formatPrice(totalIncome)} 원</span></button>
                    <button className={`tab ${activeTab === 'expense' ? 'active' : ''}`} onClick={() => handleTabClick('expense')}>지출 ({countExpense})<span className="tab_expense">-{formatPrice(totalExpense)} 원</span></button>
                </div>
            </div>
            <Calendar onChange={onChange} value={value} formatDay={(locale, date) => date.toLocaleString("en", {day: "numeric"})} tileContent={tileContent}/> {/* 날짜를 클릭할 때마다 value가 해당 날짜로 변경된다*/}
        </div>
    )
}
export default TransactionCalendar;