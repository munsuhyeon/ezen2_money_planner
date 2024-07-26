import React, { useState } from 'react';
import './Checkbox.css'
const Checkbox = ({id,text,checked, onChange}) => {
    /*const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    }*/
    return(
        <div>
            <input id={id} type='checkbox' checked={checked} onChange={onChange} value={text}/>
            <label htmlFor={id} className={`filter-check-box ${checked ? 'checked' : ''}`}></label>
            <p htmlFor={id} className="filter-binding">{text}</p>
        </div>
    )
}
export default Checkbox;