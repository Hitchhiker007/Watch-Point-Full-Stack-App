'use client'

import React, { useState } from "react";
import CustomTextField from "./CustomTextField";
import CustomDropDown from "./CustomDropDown";
import styles from "./form.module.css";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase/firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../../firebase/firebase"; // or however you init
import { uploadVideo } from "../../firebase/functions";

const firestore = getFirestore(app);

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

 // client Form.tsx (inside handleSubmit)
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!selectedFile) {
    alert("No video file selected!");
    return;
  }

  if (!values.title || !values.description || !values.genre) {
    alert("Please fill in all fields before uploading.");
    return;
  }

  try {

    await uploadVideo(selectedFile, {
      title: values.title,
      description: values.description,
      genre: values.genre
    });

    alert("Video uploaded successfully with metadata!");

    // Reset form
    setValues({ genre: "", title: "", description: "" });
    setSelectedFile(null);
  } catch (error) {
    console.error(error);
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
