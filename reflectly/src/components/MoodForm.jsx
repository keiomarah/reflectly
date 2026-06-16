import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { text } from "@fortawesome/fontawesome-svg-core";

const MOODS = {
  Happy: [
    "Playful",
    "Content",
    "Curiosity",
    "Proud",
    "Acceptance",
    "Powerful",
    "Care",
    "Trust",
    "Hope",
  ],
  Surprise: ["Shock", "Confusion", "Amazement", "Excitement"],
  Bad: ["Boredom", "Busy", "Stressed", "Tired"],
  Afraid: ["Scared", "Anxious", "Insecure", "Weak", "Shaky", "Nervous"],
  Angry: [
    "Mistrust",
    "Shame",
    "Jealousy",
    "Mad",
    "Irritation",
    "Frustration",
    "Distant",
    "Critical",
  ],
  Disgust: ["Disapproval", "Disdain", "Sick", "Repulsion"],
};
function MainMood({ setStep, setMainMood }) {
  function handleSelect(e) {
    setMainMood(e.currentTarget.textContent);
    setStep("sub");
  }

  return (
    <div className="main-mood-page">
      <div className="main-mood-btn-container">
        {Object.keys(MOODS).map((mainEmotion, index) => (
          <button
            key={mainEmotion}
            id={`btn-${mainEmotion}`}
            className="mood-btn btn-primary"
            onClick={handleSelect}
            style={{
              transform: `
        translate(-50%, -50%)
          rotate(${index * (360 / Object.keys(MOODS).length)}deg)
          translateY(-120px)
          rotate(${-index * (360 / Object.keys(MOODS).length)}deg)
      `,
            }}
          >
            {mainEmotion}
          </button>
        ))}
      </div>
      <h1>How are you feeling today?</h1>
    </div>
  );
}

function SubMood({ mainMood, setSubMood, setStep }) {
  function handleSelect(e) {
    setSubMood(e.currentTarget.textContent);
    setStep("journal");
  }
  return (
    <div className={`submood-page`}>
      <h1>{mainMood}?</h1>
      <div className="submood-container">
        {mainMood &&
          MOODS[mainMood].map((submood) => (
            <button
              key={submood}
              className="btn-primary"
              onClick={handleSelect}
            >
              {submood}
            </button>
          ))}
      </div>
    </div>
  );
}

function JournalEntry({ mainMood, subMood, setDraft, submitEntry, entry }) {
  const textareaRef = useRef(null);
  useEffect(() => {
    const text = textareaRef.current;
    if (entry) {
      text.value = entry.text;
    }
  }, []);

  function updateDraft(e) {
    setDraft(e.target.value);
  }
  return (
    <div className={`journal-page background-${mainMood || entry?.mood}`}>
      <h1>{subMood || entry?.submood}?</h1>
      <textarea
        ref={textareaRef}
        placeholder="I am feeling..."
        onChange={updateDraft}
      ></textarea>
      <button className="menu-icon" onClick={submitEntry}>
        <FontAwesomeIcon icon={faCheck} />
      </button>
    </div>
  );
}
export function MoodForm({
  setEntries,
  isOpen,
  setShowMoodForm,
  entry,
  setEntry,
}) {
  const [step, setStep] = useState("");
  const [mainMood, setMainMood] = useState("");

  const [subMood, setSubMood] = useState("");
  const [draft, setDraft] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen) {
      dialog.showModal();
      if (entry) {
        setStep("journal");
      } else {
        setStep("main");
      }
    } else {
      dialog.close();
      setStep("");
      setMainMood("");
      setEntry(null);
    }
  }, [isOpen]);

  async function submitEntry() {
    try {
      if (entry) {
        console.log(entry.submood);
        const response = await axios.put(
          `/api/journal/entry/${entry.id}`,
          {
            mood: entry.mood,
            "sub-mood": entry.submood,
            prompt: "None",
            text: draft,
          },
          { withCredentials: true },
        );
      } else {
        const response = await axios.post(
          "/api/journal/entry",
          {
            mood: mainMood,
            "sub-mood": subMood,
            prompt: "None",
            text: draft,
          },
          { withCredentials: true },
        );
      }

      try {
        const response = await axios.get("/api/journal/entries", {
          withCredentials: true,
        });
        setEntries(response.data);
      } catch (error) {
        console.log(error);
      }

      const dialog = dialogRef.current;
      setStep("");
      setEntry(null);
      setShowMoodForm(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <dialog ref={dialogRef} className={`background-${mainMood || entry?.mood}`}>
      <button
        className="close-dialog-btn control-btn"
        onClick={() => {
          setShowMoodForm(false);
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
      {step === "main" && (
        <MainMood setStep={setStep} setMainMood={setMainMood} />
      )}
      {step === "sub" && (
        <SubMood
          mainMood={mainMood}
          setSubMood={setSubMood}
          setStep={setStep}
        />
      )}

      {step === "journal" && (
        <JournalEntry
          mainMood={mainMood}
          subMood={subMood}
          setDraft={setDraft}
          submitEntry={submitEntry}
          entry={entry}
        />
      )}
    </dialog>
  );
}
