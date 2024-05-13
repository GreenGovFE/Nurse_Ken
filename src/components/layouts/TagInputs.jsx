import React from 'react'
import SelectInput from '../../Input/SelectInput'

export default function TagInputs(props) {
    return (
        <div className='m-t-10'>
        <div className='flex'>
            {props.label && 
                <div className={` ${props.type === 'textArea' ? 'label-textarea' : 'label-box'} ${props.className}`}>{props.label}</div>
            }
            {props.type === 'select' ? (
                <SelectInput
                    onChange={props.onChange}
                    isDisabled={props.disabled}
                    value={props.value}
                    name={props.name}
                    options={props?.options}
                    className="w-100"
                    style={{
                        height: "40px",
                        border: "1px solid #3C7E2D",
                        width: "100%",
                        borderRadius: "0px 4px 4px 0px"
                    }}
                />
            ) : (
                <div style={{ width: "100%", ...(props.type !== "textArea" && {
                    border: "1px solid #3C7E2D", borderRadius: "0px 4px 4px 0px"
                }) }}>
                    {props.type === "date" ? (
                        <input
                            onChange={props.onChange}
                            name={props.name}
                            disabled={props.disabled}
                            value={props.value}
                            type="date"
                            className="w-100"
                            style={{
                                
                                borderRadius: props.type !== "textArea" ? "0px 4px 4px 0px" : "0px"
                            }}
                        />
                    ) : props.type === "textArea" ? (
                        <textarea rows={2} type="text" style={{ width: "100%", borderRadius: "0px 4px 4px 0px" }} />
                    ) : (
                        <input
                            onChange={props.onChange}
                            name={props.name}
                            disabled={props.disabled}
                            placeholder = {props?.placeholder}
                            value={props.value}
                            type={props.type === "password" ? "password" : (props?.variation ? "number" : "text")}
                            className="w-100"
                            style={{
                                borderRadius: props.type !== "textArea" ? "0px 4px 4px 0px" : "0px"
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    </div>
    

    )
}

