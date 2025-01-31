import React from "react";

type CustomDropDownProps = {
    label: string;
    name: string;
    changeHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    values: Array<{ value: string; label: string }>;
    currentValue: string;
};

const CustomDropDown = (props: CustomDropDownProps) => {
    return (
        <div style={{ margin: "8px 0" }}>
            <label htmlFor={props.name} style={{ display: "block", fontWeight: "bold" }}>
                {props.label}
            </label>
            <select
                name={props.name}
                value={props.currentValue}
                onChange={props.changeHandler}
                style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginTop: "4px",
                }}
            >
                {props.values.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CustomDropDown;
