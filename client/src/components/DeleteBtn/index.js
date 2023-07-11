import React from "react"; // import React
function DeleteBtn(props) { // define DeleteBtn component with props as argument
  return (
    <span {...props} role="button" tabIndex="0">
      ✗
    </span>
  );
}

export default DeleteBtn; // export DeleteBtn
