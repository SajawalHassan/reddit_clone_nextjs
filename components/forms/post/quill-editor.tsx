"use client";

import React, { useState } from "react";
import ReactQuill from "react-quill-new";
// @ts-ignore
import "react-quill-new/dist/quill.snow.css"; // Load the theme styles

const QuillEditor = (props: { value: string; setValue: (val: string) => void }) => {
  // Custom toolbar configuration (optional)
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link", "image"];

  return (
    <div className="w-full max-w-3xl mx-auto my-4 bg-white text-black">
      <ReactQuill
        theme="snow"
        value={props.value}
        onChange={props.setValue}
        modules={modules}
        formats={formats}
        placeholder="Compose something epic..."
        className="h-64 mb-12" // Gives the editor baseline height
      />
    </div>
  );
};

export default QuillEditor;
