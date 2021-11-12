import * as React from 'react';
import * as ReactDOM from 'react-dom';
export const Field = ({label, id, defaultValue = "", type = "text"}) => {
    return (
        <div>
            <label htmlFor={id} className="mb-8">{label}</label>
            <input id={id} placeholder={label} defaultValue={defaultValue} className="input__field show-border" type={type} />
        </div>
    )
}
export const Grid = ({children}) => {
    return <div className="grid">{children}</div>;
}