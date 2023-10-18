import React from "react";
import Modal from "./modal";

interface Props {
  error: string;
  onClose: () => void;
}

const ErrorModal: React.FC<Props> = ({ error, onClose }) => {
  return (
    <Modal isOpen={Boolean(error)} closeModal={onClose}>
      {error}
      {error === "WebSocket disconnected" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          Unfortunately you have to start over :(
          <button
            className="custom-button green-button"
            style={{ height: 40 }}
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      )}
    </Modal>
  );
};

export default ErrorModal;
