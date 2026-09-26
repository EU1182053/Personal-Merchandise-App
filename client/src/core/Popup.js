import React from "react";

const Popup = ({ type = "success", message, onClose, children }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
      }}
    >
      <div
        style={{
          background: "#343a40",
          color: "#fff",
          padding: "30px",
          borderRadius: "10px",
          textAlign: "center",
          width: "350px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h5 className={type === "success" ? "text-success" : "text-danger"}>
          {type === "success" ? "Success" : "Error"}
        </h5>

        <p>{message}</p>

        {children}

        {onClose && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default Popup;