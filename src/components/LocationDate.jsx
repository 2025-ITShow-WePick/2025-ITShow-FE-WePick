import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LocationDate.module.css";

export default function LocationDate(props) {
  const location = props.location;
  const date = props.date;

  return (
    <>
      <h1>{location}</h1>
      <h1>{date}</h1>
    </>
  );
}
