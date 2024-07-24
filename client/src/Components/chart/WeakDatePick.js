import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ko } from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css";

export default class WeakDatePick extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const startOfMonthDate = startOfMonth(today);
    const endOfMonthDate = endOfMonth(today);
    
    this.state = {
      startDate: startOfMonthDate,
      endDate: endOfMonthDate,
    };
  }

  setChangeDate = (dates) => {
    const [start, end] = dates;
    if (start && !end) {
      const startOfMonthDate = startOfMonth(start);
      const endOfMonthDate = endOfMonth(start);
      const daysOfMonth = eachDayOfInterval({
        start: startOfMonthDate,
        end: endOfMonthDate,
      });

      this.setState({
        startDate: start,
        endDate: endOfMonthDate,
        highlightDates: daysOfMonth,
      });
    } else {
      this.setState({ startDate: start, endDate: end, highlightDates: [] });
    }
  };

  render() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 31);

    return (
      <div>
        <DatePicker
          selectsRange={true}
          className="datepicker"
          locale={ko}
          dateFormat="yyyy년 MM월 dd일"
          selected={this.state.startDate}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          maxDate={new Date()}
          onChange={(dates) => this.setChangeDate(dates)}
          highlightDates={this.state.highlightDates}
        />
      </div>
    );
  }
}