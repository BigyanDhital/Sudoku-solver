import React from "react";

export default function Block(props) {
  return (
    <div className={`block ${props.number ? "filled" : "empty"}`}>
      <input value={props.number} />
      {/* <p> {props.number}</p> */}
    </div>
  );
}
