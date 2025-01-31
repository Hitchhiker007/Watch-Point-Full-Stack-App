'use client'

import React, { useState } from "react";
import CustomTextField from "./CustomTextField";
import CustomDropDown from "./CustomDropDown";
import styles from "./form.module.css";
import { uploadVideo } from "../../firebase/functions";

const genre = [
    { value: "comedy", label: "comedy" },
    { value: "horror", label: "horror" },
    { value: "educational", label: "educational" },
    { value: "lifestyle", label: "lifestyle" },
    { value: "business", label: "business" },
    { value: "art", label: "art" },
    { value: "gaming", label: "gaming" },
];

type Values = {
    genre: string;
    title: string;
    description: string;
};

const Form = () => {
    const [values, setValues] = useState<Values>({
        genre: "",
        title: "",
        description: "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Handle changes in form fields
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    // Handle file input change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (file) {
            setSelectedFile(file); // Store selected file
        }
    };

    // Handle form submission (including file upload)
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!selectedFile) {
            alert('No video file selected!');
            return;
        }

        // Handle form submission and file upload
        try {
            const uploadResponse = await uploadVideo(selectedFile);
            console.log(uploadResponse);
            alert(`File uploaded successfully. Server responded with: ${JSON.stringify(uploadResponse)}`);

            // You can also log other form data here
            console.log('Form data:', values);

            // Reset the form after successful submission
            setValues({
                genre: "",
                title: "",
                description: "",
            });
            setSelectedFile(null); // Reset selected file
        } catch (error) {
            alert(`Failed to upload file: ${error}`);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>Upload A Video</div>
            <form onSubmit={handleSubmit} className={styles.form}>
                {/* File Input */}
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
                {/* Show the selected file name */}
                {/* {selectedFile && <p>Selected file: {selectedFile.name}</p>} */}

                {/* Form Fields */}
                <CustomTextField changeHandler={handleChange} label="Title" name="title" />
                <CustomTextField changeHandler={handleChange} label="Description" name="description" />
                <CustomDropDown
                    label="Genre"
                    name="genre"
                    changeHandler={handleChange}
                    values={genre}
                    currentValue={values.genre}
                />

                {/* Submit Button */}
                <button type="submit" className={styles.button}>Submit</button>
            </form>
        </div>
    );
};

export default Form;
