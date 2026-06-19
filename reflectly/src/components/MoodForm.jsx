import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCheck,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { text } from "@fortawesome/fontawesome-svg-core";
import toast from "react-hot-toast";

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
  Sad: ["Lonely", "Vulnerable", "Despair", "Guilty", "Depression", "Hurt"],
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
          <div
            key={mainEmotion}
            className="mood-btn-wrapper"
            style={{
              transform: `
        translate(-50%, -50%)
          rotate(${(index - 3) * (360 / 8)}deg)
          translateY(-10rem)
          rotate(${-(index - 3) * (360 / 8)}deg)
      `,
            }}
          >
            <button
              className="mood-btn"
              id={`btn-${mainEmotion}`}
              onClick={handleSelect}
            >
              {mainEmotion}
            </button>
          </div>
        ))}
      </div>
      <h1>How are you feeling today?</h1>
    </div>
  );
}

function SubMood({ mainMood, setSubMood, setStep, entry }) {
  let mainMoodRef;

  if (mainMood) {
    mainMoodRef = mainMood;
  } else {
    mainMoodRef = entry?.mood;
  }
  function handleSelect(e) {
    setSubMood(e.currentTarget.textContent);
    setStep("journal");
  }
  return (
    <div className={`submood-page`}>
      <button
        className="control-btn return-btn"
        onClick={() => {
          setStep("main");
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>{mainMoodRef}?</h1>
      <div className="submood-container">
        {mainMoodRef &&
          MOODS[mainMoodRef].map((submood) => (
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

function JournalEntry({
  mainMood,
  subMood,
  setDraft,
  submitEntry,
  entry,
  setStep,
}) {
  const textareaRef = useRef(null);
  const today = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  useEffect(() => {
    const text = textareaRef.current;
    if (entry) {
      text.value = entry.text;
    }

    setDraft(text.value);
  }, []);

  function updateDraft(e) {
    const text = textareaRef.current;

    text.style.height = "auto";
    text.style.height = `${text.scrollHeight}px`;
    setDraft(e.target.value);
  }
  return (
    <div className={`journal-page background-${mainMood || entry?.mood}`}>
      <button
        className="control-btn return-btn"
        onClick={() => {
          setStep("sub");
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className="journal-header">
        <h1>{subMood || entry?.submood}?</h1>
        <p>{formatter.format(today)}</p>
        <textarea
          ref={textareaRef}
          placeholder="I am feeling..."
          onChange={updateDraft}
        ></textarea>
      </div>

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
      setSubMood("");
      setEntry(null);
    }
  }, [isOpen]);

  async function submitEntry() {
    try {
      if (entry) {
        const response = await axios.put(
          `/api/journal/entry/${entry.id}`,
          {
            mood: mainMood || entry.mood,
            "sub-mood": subMood || entry.submood,
            prompt: "None",
            text: draft,
          },
          { withCredentials: true },
        );

        toast.success(response.data.message);
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
        toast.success(response.data.message);
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
    <dialog
      ref={dialogRef}
      className={`background-${step === "main" ? "" : mainMood || entry?.mood}`}
    >
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
          entry={entry}
        />
      )}

      {step === "journal" && (
        <JournalEntry
          mainMood={mainMood}
          subMood={subMood}
          setDraft={setDraft}
          submitEntry={submitEntry}
          entry={entry}
          setStep={setStep}
        />
      )}
    </dialog>
  );
}
