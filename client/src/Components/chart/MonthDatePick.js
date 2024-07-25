import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";

export default class YearMonthPicker extends Component {
  constructor(props) {
    super(props);
    const today = new Date();

    this.state = {
      selectedDate: today,
    };
  }

  handleChange = (date) => {
    this.setState({
      selectedDate: date,
    });
  };

  render() {
    return (
      <div>
        <DatePicker
          selected={this.state.selectedDate}
          onChange={this.handleChange}
          dateFormat="yyyy년 MM월"
          showMonthYearPicker
          locale={ko}
        />
      </div>
    );
  }
}
