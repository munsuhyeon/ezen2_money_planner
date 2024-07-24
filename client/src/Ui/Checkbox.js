import React, { useState } from 'react';
import './Checkbox.css'
const Checkbox = ({text}) => {
    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    }
    return(
        <div>
            <input id='checkbox' type='checkbox' checked={isChecked} onChange={handleCheckboxChange} value={text}/>
            <label htmlFor='checkbox' className={`filter-check-box ${isChecked ? 'checked' : ''}`}></label>
            <p htmlFor='checkbox' className="filter-binding">{text}</p>
        </div>
    )
}
export default Checkbox;