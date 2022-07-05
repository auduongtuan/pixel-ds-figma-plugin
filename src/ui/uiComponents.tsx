import * as React from 'react';
import * as ReactDOM from 'react-dom';
export const Field = ({label, id, defaultValue = "", type = "text", className = "", ...rest}) => {
    return (
        <div className={className && className}>
            <label htmlFor={id} className="mb-8">{label}</label>
            {type == "textarea" ? <textarea id={id} placeholder={label} defaultValue={defaultValue} className="textarea" {...rest}></textarea> : 
            <input id={id} placeholder={label} defaultValue={defaultValue} className="input__field show-border" type={type} />}
        </div>
    )
}
export const Select = ({label, id, defaultValue = "", type = "text", className = "", children, ...rest}) => {
    return (
        <div className={`show-border ${className && className}`}>
            <label htmlFor={id} className="mb-8">{label}</label>
            
            <select id={id} placeholder={label} defaultValue={defaultValue} className="select-menu" {...rest}>
                {children}
            </select>
        </div>
    )
}
export const Grid = ({children}) => {
    return <div className="grid">{children}</div>;
}
export const MenuItem = ({children, className='', ...rest}) => {
    return <button className={`menu-item ${className}`} {...rest}>{children}</button>
}