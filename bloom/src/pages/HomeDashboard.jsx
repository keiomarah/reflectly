import { MenuIcon } from "../components/MenuIcon";
import { AddButton } from "../components/AddButton";
import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../assets/reflectly-logo.png";
import { MoodForm } from "../components/MoodForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ENTRY_PREVIEW = 255;

function WeekViewCalendar() {
  const [week, setWeek] = useState([]);
  const today = new Date();
  useEffect(() => {
    const todayIndex = today.getDay() - 1;
    let difference = 0 - todayIndex;
    const newWeek = [];
    for (let i = 0; i < 7; i++) {
      const newDay = new Date(
        today.getTime() + 24 * 60 * 60 * 1000 * difference,
      );
      difference++;
      newWeek.push(newDay);
    }

    setWeek(newWeek);
  }, []);
  return (
    <div className="calendar-container">
      <div className="mini-calendar">
        {week.map((day, index) => (
          <div
            key={index}
            className={`day ${day.getDate() === today.getDate() ? "today" : ""}`}
          >
            <div>{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
            <div>{day.getDate()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyMoodButton({ setShowMoodForm }) {
  return (
    <button
      className="btn-primary daily-mood-btn"
      onClick={() => {
        setShowMoodForm(true);
      }}
    >
      How are you feeling today?
    </button>
  );
}

function JournalEntries({ entries, setShowMoodForm, setEntry, setEntries }) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  async function deleteEntry(entry) {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/journal/entry/${entry.id}`,
        {
          withCredentials: true,
        },
      );

      toast.success(response.data.message);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/journal/entries`,
          {
            withCredentials: true,
          },
        );
        setEntries(response.data);
      } catch (error) {
        toast.error("Error updating entries. Please try again later.");
      }
    } catch (error) {
      toast.error("Error deleting entry. Please try again later.");
    }
  }
  return (
    <div className="journal-entry-container">
      {entries.length > 0 &&
        entries
          .map((entry) => (
            <div className="journal-entry-wrapper" key={entry.id}>
              <div
                className={`journal-entry background-${entry.mood}`}
                onClick={(e) => {
                  setEntry(entry);
                  setShowMoodForm(true);
                }}
              >
                <h2>{entry.submood}</h2>
                <p className="journal-entry-date">
                  {formatter.format(new Date(entry["updated-at"]))}
                </p>
                {entry.text.substring(0, ENTRY_PREVIEW)}
              </div>
              <button
                className="control-btn delete-button"
                onClick={() => {
                  deleteEntry(entry);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))
          .reverse()}
    </div>
  );
}

export function HomeDashboard() {
  const [name, setName] = useState("");
  const [isLoadingName, setIsLoadingName] = useState(true);
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [entry, setEntry] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function getName() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            withCredentials: true,
          },
        );
        setName(response.data.name);
        return true;
      } catch (error) {
        navigate("/auth/login");
        toast.error(
          "Error encountered while logging in. Please try again later.",
        );
        return false;
      } finally {
        setIsLoadingName(false);
      }
    }

    async function getEntries() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/journal/entries`,
          {
            withCredentials: true,
          },
        );
        setEntries(response.data);
      } catch (error) {
        toast.error("Error loading entries. Please try again later.");
      }
    }

    async function init() {
      const success = await getName();
      if (success) await getEntries();
    }
    init();
  }, []);
  return (
    <div className="home-dashboard-page">
      <MoodForm
        isOpen={showMoodForm}
        setShowMoodForm={setShowMoodForm}
        entry={entry}
        setEntry={setEntry}
        setEntries={setEntries}
      />
      <MenuIcon />
      <AddButton setShowMoodForm={setShowMoodForm} />
      <div className="welcome-header">
        <img src={logo} className="home-logo" alt="Concentric circle logo" />
        <h1 className="dashboard-user-name">
          {!isLoadingName && `Hi, ${name}.`}
        </h1>
      </div>
      <DailyMoodButton setShowMoodForm={setShowMoodForm} />
      <WeekViewCalendar />
      <JournalEntries
        setEntry={setEntry}
        setShowMoodForm={setShowMoodForm}
        entries={entries}
        setEntries={setEntries}
      />
    </div>
  );
}
