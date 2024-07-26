import React from "react";
import "./BudgetModification.css";

const BudgetModification = () => {
  return (
    <section id="budget_modification">
      <div className="budget_modification_container">
        <div className="image_container">
          <img
            src="/assets/logo/pocketcat.png"
            alt="예산 고양이"
            class="cat_image"
          />
        </div>
        <div className="budget_page_title">
          <img
            src="/assets/logo/Thicklogo.png"
            alt="모으냥 로고"
            class="logo_image"
          />
        </div>
        <div className="budget_page_sub_title">
          나의 이번 달 예산을 설정해주세요
        </div>
        <div className="input_container">
          <input type="text" id="budget_input" value="0" />
          <span className="budget_span">원</span>
        </div>
        <button className="confirm_button">확인</button>
      </div>
    </section>
  );
};

export default BudgetModification;
