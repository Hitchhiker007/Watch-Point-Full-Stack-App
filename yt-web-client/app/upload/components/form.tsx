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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (file) setSelectedFile(file);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedFile) return alert("No video file selected!");
        if (!values.title || !values.description || !values.genre)
            return alert("Please fill in all fields before uploading.");

        try {
            // uploadVideo will call your Firebase function to get a signed URL,
            // upload the file, and save the metadata in Firestore
            await uploadVideo(selectedFile, {
                title: values.title,
                description: values.description,
                genre: values.genre,
            });

            alert("Video uploaded successfully with metadata!");

            // Reset form
            setValues({ genre: "", title: "", description: "" });
            setSelectedFile(null);
        } catch (err) {
            console.error(err);
            alert("Failed to upload video. Check console for details.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>Upload A Video</div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input type="file" accept="video/*" onChange={handleFileChange} className={styles.fileInput} />

                <CustomTextField changeHandler={handleChange} label="Title" name="title" />
                <CustomTextField changeHandler={handleChange} label="Description" name="description" />
                <CustomDropDown
                    label="Genre"
                    name="genre"
                    changeHandler={handleChange}
                    values={genre}
                    currentValue={values.genre}
                />

                <button type="submit" className={styles.button}>Submit</button>
            </form>
        </div>
    );
};

export default Form;
