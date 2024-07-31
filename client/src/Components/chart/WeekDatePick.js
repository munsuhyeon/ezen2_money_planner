import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

export default class WeekDatePick extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1, locale: ko });
    const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1, locale: ko });

    this.state = {
      startDate: startOfThisWeek,
      endDate: endOfThisWeek,
      highlightDates: [],
      isOpen: false,
    };
  }

  setChangeDate = (dates) => {
    const [start, end] = dates;
    if (start && !end) {
      const startOfSelectedWeek = startOfWeek(start, {
        weekStartsOn: 1,
        locale: ko,
      });
      const endOfSelectedWeek = endOfWeek(start, {
        weekStartsOn: 1,
        locale: ko,
      });
      const daysOfWeek = eachDayOfInterval({
        start: startOfSelectedWeek,
        end: endOfSelectedWeek,
      });

      this.setState({
        startDate: startOfSelectedWeek,
        endDate: endOfSelectedWeek,
        highlightDates: daysOfWeek,
      });
      this.props.onChangeDate(startOfSelectedWeek, endOfSelectedWeek);
    } else {
      this.setState({
        startDate: start,
        endDate: end,
        highlightDates: [],
      });

      this.props.onChangeDate(start, end);
    }
  };

  render() {
    return (
      <div>
        <DatePicker
          selectsRange
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
