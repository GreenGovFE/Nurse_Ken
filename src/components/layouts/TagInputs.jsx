import React from 'react'
import SelectInput from '../../Input/SelectInput'

export default function TagInputs(props) {
    return (
        <div className='m-t-10'>
            <div className='flex'>
                {props.label && <div className={`label-box ${props.className}`}> {props.label} </div>
                }                {
                    props.type === 'select' ?
                        <div style={{ height: "40px", border: "1px solid #17621A", width: "100%" }}><SelectInput onChange={props.onChange} name={props.name} options={props?.options} className="w-100" /></div>
                        :
                        <div style={{ height: "40px", border: "1px solid #17621A", width: "100%" }}>
                            {
                                props.type === "date" ?
                                    <input onChange={props.onChange} name={props.name} value={props.value} type={props.type} className="w-100" />
                                    :
                                    props.type === "textArea" ? <textarea rows={2} type="text" />
                                        : <input onChange={props.onChange} name={props.name} value={props.value} type={props.type === "password" ? "password" : (props?.variation) ? "number" : "text"} className="w-100" />
                            }
                        </div>
                }
            </div>
        </div>
    )
}

