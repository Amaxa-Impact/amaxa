"use client";
import { memo } from "react";

export interface CursorProps {
  x: number;
  y: number;
  name?: string;
  color?: string;
}

export const Cursor = memo(function Cursor({
  x,
  y,
  name,
  color = "#3b82f6",
}: CursorProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 1000,
        transform: "translate(-2px, -2px)",
        transition: "left 0.1s ease-out, top 0.1s ease-out",
      }}
    >
      <svg
        aria-labelledby="cursorSvgTitle"
        fill="none"
        height="24"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="cursorSvgTitle">User Cursor</title>
        <path
          d="M5.65376 12.3673L17.6856 3.77517C18.2611 3.34205 19.0663 3.76704 19.077 4.46906L19.2875 18.3033C19.2983 19.0053 18.4934 19.4303 17.9179 18.9972L13.1 15.2156C12.871 15.0383 12.5794 14.9621 12.2929 15.0036L7.48433 15.6604C6.76441 15.7647 6.22436 15.0559 6.4799 14.3769L8.52814 8.74953C8.65706 8.40316 8.58686 8.01599 8.34801 7.73706L5.52569 4.42352C5.07084 3.87288 5.45078 3.04474 6.15432 3.00912L18.4946 2.31849C19.1981 2.28287 19.578 3.11101 19.1231 3.66165L7.09132 15.0927"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
        />
      </svg>

      {name && (
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 2,
            backgroundColor: color,
            color: "white",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 500,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {name}
        </div>
      )}
    </div>
  );
});
