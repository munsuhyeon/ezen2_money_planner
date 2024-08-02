// src/Utils/TransactionUtils.js

import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";

// 주간 데이터를 집계하는 함수
export const getWeeklyAggregatedData = (transactions, selectedDate) => {
  const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 }); // 월요일 기준
  const endOfSelectedWeek = endOfWeek(selectedDate, { weekStartsOn: 1 });

  const aggregatedData = {};

  transactions.forEach((transaction) => {
    if (transaction.incomeType === "income") return; // 수입 제외

    const transactionDate = new Date(transaction.transactionDate);
    if (
      transactionDate < startOfSelectedWeek ||
      transactionDate > endOfSelectedWeek
    )
      return; // 선택된 주 범위 이외의 데이터 제외

    const weekStart = startOfWeek(transactionDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(transactionDate, { weekStartsOn: 1 });

    // 주 범위 포맷
    const weekLabel = `${format(weekStart, "yyyy-MM-dd")} - ${format(
      weekEnd,
      "yyyy-MM-dd"
    )}`;

    if (!aggregatedData[weekLabel]) {
      aggregatedData[weekLabel] = {};
    }

    if (!aggregatedData[weekLabel][transaction.categoryName]) {
      aggregatedData[weekLabel][transaction.categoryName] = 0;
    }

    aggregatedData[weekLabel][transaction.categoryName] += transaction.amount;
  });

  return aggregatedData;
};

// 주간 데이터에서 상위 3개의 카테고리를 집계하는 함수
export const aggregateWeeklyData = (transactions) => {
  const weeklyData = getWeeklyAggregatedData(transactions);

  const categoryTotals = {};
  Object.keys(weeklyData).forEach((week) => {
    Object.keys(weeklyData[week]).forEach((category) => {
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += weeklyData[week][category];
    });
  });

  // 상위 3개의 카테고리 추출
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return topCategories;
};

// 주 번호를 계산하는 함수
export const getWeekNumber = (date) => {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + 1 + days) / 7);
};

// 월간 데이터를 집계하는 함수

export const getMonthlyAggregatedData = (transactions, selectedMonth) => {
  const startOfSelectedMonth = startOfMonth(selectedMonth);
  const endOfSelectedMonth = endOfMonth(selectedMonth);

  const aggregatedData = {};

  transactions.forEach((transaction) => {
    if (transaction.incomeType === "income") return; // 수입 제외

    const transactionDate = new Date(transaction.transactionDate);
    if (
      transactionDate < startOfSelectedMonth ||
      transactionDate > endOfSelectedMonth
    )
      return; // 선택된 월 범위 이외의 데이터 제외

    if (!aggregatedData[transaction.categoryName]) {
      aggregatedData[transaction.categoryName] = 0;
    }

    aggregatedData[transaction.categoryName] += transaction.amount;
  });

  return aggregatedData;
};
