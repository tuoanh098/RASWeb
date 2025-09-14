import React from "react";
import rasLogo from "../assets/ras_logo.jpg";

export default function Logo({ size = 96 }) {
  return (
    <img
      src={rasLogo}
      width={size}
      height={size}
      alt="RAS Logo"
      className="rounded-lg border shadow-sm object-cover bg-white"
      style={{ aspectRatio: "1 / 1" }}
    />
  );
}
