import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
export function AddButton() {
  return (
    <button className="control-btn add-btn">
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
}
