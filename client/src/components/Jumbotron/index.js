import React from "react"; // import React

function Jumbotron({ children }) { // define Jumbotron component with children as argument
  return (
    <div
      style={{ height: 560, clear: "both", paddingTop: 120, textAlign: "center" }}
    >
      {children}
    </div>
  );
}

export default Jumbotron; // export Jumbotron
