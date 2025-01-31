import React from "react";

type CustomTextFieldProps = {
    label: string;
    name: string;
    changeHandler: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

const CustomTextField = (props: CustomTextFieldProps) => {
    return (
        <div style={{ margin: "8px 0" }}>
            <label htmlFor={props.name} style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
                {props.label}
            </label>
            <input
                type="text"
                name={props.name}
                onChange={props.changeHandler}
                style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginTop: "4px",
                    boxSizing: "border-box",
                }}
            />
        </div>
    );
};

export default CustomTextField;
