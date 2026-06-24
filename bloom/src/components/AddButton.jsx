import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
export function AddButton({ setShowMoodForm }) {
  return (
    <button
      className="control-btn add-btn"
      onClick={() => {
        setShowMoodForm(true);
      }}
    >
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
}
