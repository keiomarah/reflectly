import { useState } from "react";

export function FlashMessage({ message, type, setFlashMessage }) {
  const [hidden, setHidden] = useState(false);

  function dismissMessage(e) {
    const message = e.target.closest(".flashed-message");
    setFlashMessage("");
  }
  return (
    <>
      {!hidden && (
        <div className={`flashed-message ${type}`}>
          {message}
          <button className="dismiss-btn" onClick={dismissMessage}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}
    </>
  );
}
