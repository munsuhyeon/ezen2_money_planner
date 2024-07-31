import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { startOfMonth, endOfMonth } from "date-fns";
import ko from "date-fns/locale/ko";

const MonthDatePick = ({ onChangeDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChange = (date) => {
    setSelectedDate(date);
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);
    onChangeDate(startDate, endDate);
  };

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="yyyy년 MM월"
        showMonthYearPicker
        locale={ko}
      />
    </div>
  );
};

export default MonthDatePick;
