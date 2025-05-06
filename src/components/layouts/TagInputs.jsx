import React, { useEffect, useState } from 'react';
import SelectInput from '../../Input/SelectInput';
import Select from 'react-select';

export default function TagInputs(props) {
    // Get the current date in 'YYYY-MM-DD' format
    const currentDate = new Date().toISOString().split('T')[0];

    // Determine the date restrictions based on the `dateRestriction` prop
    let minDate, maxDate;
    if (props?.type === 'time') {
        minDate = props?.min || '';
    } else {
        if (props.dateRestriction === 'current') {
            minDate = currentDate;
            maxDate = currentDate;
        } else if (props.dateRestriction === 'past') {
            maxDate = currentDate;
        } else if (props.dateRestriction === 'future') {
            minDate = currentDate;
        }
    }

    return (
        <div className='m-t-10'>
            <div className='flex'>
                {props.label &&
                    <div className={` ${props.type === 'textArea' ? 'label-textarea' : 'label-box'} ${props.className}`}>{props.label}</div>
                }
                {props.type === 'select' ? (
                    <SelectInput
                        onChange={props.onChange}
                        disabled={props.disabled}
                        value={props.value}
                        name={props.name}
                        options={props?.options}
                        className="w-100"
                        style={{
                            height: "40px",
                            border: "1px solid #3c7e2d73",
                            width: "100%",
                            borderRadius: "0px 4px 4px 0px",
                            paddingRight: "20px"
                        }}
                    />

                ) : (
                    props.type === 'R-select' ? (
                        <Select
                            name={props.name}
                            id={props.name}
                            value={props.value}
                            onChange={props.onChange}
                            onBlur={props.onBlur}
                            isDisabled={props.disabled}
                            options={props.options}
                            menuShouldScrollIntoView={false} // Prevent automatic scrolling to dropdown
                            isMulti={props.isMulti}
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    width: '100%',
                                }),
                                control: (provided) => ({
                                    ...provided,
                                    height: '40px',
                                    border: '1px solid #3c7e2d73',
                                    borderRadius: '0px 4px 4px 0px',
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    maxHeight: '2000px', // Set max height for scrollability
                                }),
                            }}
                        />

                    ) : (
                        <div style={{
                            width: "100%", ...(props.type !== "textArea" && {
                                border: "1px solid #3c7e2d73", borderRadius: "0px 4px 4px 0px"
                            })
                        }}>
                            {props.type === "date" || props.type === "time" ? (
                                <input
                                    onChange={props.onChange}
                                    name={props.name}
                                    disabled={props.disabled}
                                    readOnly={props.readOnly}
                                    value={props.value}
                                    type={props.type}
                                    min={minDate}
                                    max={maxDate}
                                    className="w-100"
                                    style={{
                                        borderRadius: props.type !== "textArea" ? "0px 4px 4px 0px" : "0px"
                                    }}
                                />
                            ) : props.type === "textArea" ? (
                                <textarea
                                    onChange={props.onChange}
                                    rows={2}
                                    value={props.value}
                                    name={props.name}
                                    readOnly={props.readOnly}
                                    disabled={props.disabled}
                                    style={{ width: "100%", borderRadius: "0px 4px 4px 0px" }}
                                />
                            ) : (
                                <input
                                    onChange={props.onChange}
                                    name={props.name}
                                    disabled={props.disabled}
                                    placeholder={props?.placeholder}
                                    readOnly={props.readOnly}
                                    value={props.value}
                                    type={props.type === "password" ? "password" : (props?.variation ? "number" : "text")}
                                    step={props.variation ? "any" : undefined}
                                    className="w-100"
                                    style={{
                                        ...props?.style, borderRadius: props.type !== "textArea" ? "0px 4px 4px 0px" : "0px"
                                    }}
                                />
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
