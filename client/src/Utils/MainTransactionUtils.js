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
  // 선택된 날짜의 주 시작일과 종료일을 계산합니다.
  const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 }); // 월요일 기준으로 시작일
  const endOfSelectedWeek = endOfWeek(selectedDate, { weekStartsOn: 1 }); // 월요일 기준으로 종료일

  // 집계 결과를 저장할 객체를 초기화합니다.
  const aggregatedData = {};

  // 거래 목록을 순회하며 데이터 집계
  transactions.forEach((transaction) => {
    // 수입 거래는 제외합니다.
    if (transaction.incomeType === "income") return;

    // 거래 날짜를 Date 객체로 변환
    const transactionDate = new Date(transaction.transactionDate);
    if (
      // 선택된 주 시작일 이전
      transactionDate < startOfSelectedWeek ||
      // 선택된 주 종료일 이후
      transactionDate > endOfSelectedWeek
    )
      return; // 선택된 주 범위 이외의 데이터 제외

    // 거래 날짜의 주 시작일과 종료일을 계산합니다.
    const weekStart = startOfWeek(transactionDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(transactionDate, { weekStartsOn: 1 });

    // 주 범위에 대한 레이블을 포맷합니다.
    const weekLabel = `${format(weekStart, "yyyy-MM-dd")} - ${format(
      weekEnd,
      "yyyy-MM-dd"
    )}`;

    // 주 범위 레이블에 대한 데이터를 초기화합니다.
    if (!aggregatedData[weekLabel]) {
      aggregatedData[weekLabel] = {};
    }

    // 카테고리별로 데이터를 초기화합니다.
    if (!aggregatedData[weekLabel][transaction.categoryName]) {
      aggregatedData[weekLabel][transaction.categoryName] = 0;
    }

    // 해당 카테고리의 거래 금액을 추가합니다.
    aggregatedData[weekLabel][transaction.categoryName] += transaction.amount;
  });

  // 집계된 데이터를 반환합니다.
  return aggregatedData;
};

// 주간 데이터에서 상위 3개의 카테고리를 집계하는 함수
export const aggregateWeeklyData = (transactions) => {
  // 주간 데이터를 집계합니다.
  const weeklyData = getWeeklyAggregatedData(transactions);

  // 카테고리별 총합을 저장할 객체를 초기화합니다.
  const categoryTotals = {};
  Object.keys(weeklyData).forEach((week) => {
    Object.keys(weeklyData[week]).forEach((category) => {
      if (!categoryTotals[category]) {
        // 카테고리 총합 초기화
        categoryTotals[category] = 0;
      }
      // 카테고리별 총합을 추가합니다.
      categoryTotals[category] += weeklyData[week][category];
    });
  });

  // 상위 3개의 카테고리 추출
  const topCategories = Object.entries(categoryTotals)
    // 총합을 기준으로 내림차순 정렬
    .sort((a, b) => b[1] - a[1])
    // 상위 3개 추출
    .slice(0, 3);

  // 상위 3개의 카테고리를 반환합니다.
  return topCategories;
};

// 주 번호를 계산하는 함수
export const getWeekNumber = (date) => {
  // 해당 연도의 시작일
  const start = new Date(date.getFullYear(), 0, 1);
  // 해당 날짜까지의 일수
  const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
  // 주 번호 계산
  return Math.ceil((date.getDay() + 1 + days) / 7);
};

// 월간 데이터를 집계하는 함수

export const getMonthlyAggregatedData = (transactions, selectedMonth) => {
  // 선택된 월의 시작일과 종료일을 계산합니다.
  const startOfSelectedMonth = startOfMonth(selectedMonth);
  const endOfSelectedMonth = endOfMonth(selectedMonth);

  // 집계 결과를 저장할 객체를 초기화합니다.
  const aggregatedData = {};

  // 거래 목록을 순회하며 데이터 집계
  transactions.forEach((transaction) => {
    if (transaction.incomeType === "income") return; // 수입 제외

    const transactionDate = new Date(transaction.transactionDate);
    if (
      transactionDate < startOfSelectedMonth ||
      transactionDate > endOfSelectedMonth
    )
      return; // 선택된 월 범위 이외의 데이터 제외

    // 카테고리별로 데이터를 초기화합니다.
    if (!aggregatedData[transaction.categoryName]) {
      aggregatedData[transaction.categoryName] = 0;
    }

    // 해당 카테고리의 거래 금액을 추가합니다.
    aggregatedData[transaction.categoryName] += transaction.amount;
  });

  return aggregatedData;
};
