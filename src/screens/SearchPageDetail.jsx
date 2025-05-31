import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import styles from "../styles/SearchPageDetail.module.css";
import LocationDate from "../components/LocationDate";

export default function SearchPageDetail() {
  return (
    <>
      <Logo />
      <LocationDate location="위치(지점)" />
      <LocationDate location="날짜" />
    </>
  );
}
