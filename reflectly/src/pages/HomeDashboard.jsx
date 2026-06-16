import { MenuIcon } from "../components/MenuIcon";
import { AddButton } from "../components/AddButton";
import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../assets/reflectly-logo.png";
import { MoodForm } from "../components/MoodForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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
  async function deleteEntry(e, entry) {
    try {
      const response = await axios.delete(`/api/journal/entry/${entry.id}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await axios.get("/api/journal/entries", {
        withCredentials: true,
      });
      setEntries(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="journal-entry-container">
      {entries.length > 0 &&
        entries
          .map((entry) => (
            <div className="journal-entry-wrapper">
              <div
                key={entry.id}
                className={`journal-entry background-${entry.mood}`}
                onClick={(e) => {
                  setEntry(e, entry);
                  setShowMoodForm(true);
                }}
              >
                {entry.text.substring(0, 25)}
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
  const [name, setName] = useState("Guest");
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [entry, setEntry] = useState(null);
  useEffect(() => {
    async function getName() {
      try {
        const response = await axios.get("/api/auth/me", {
          withCredentials: true,
        });
        console.log(response.data.name);
        setName(response.data.name);
      } catch (error) {
        console.log(error);
      }
    }

    async function getEntries() {
      try {
        const response = await axios.get("/api/journal/entries", {
          withCredentials: true,
        });
        setEntries(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getName();
    getEntries();
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
      <AddButton />
      <div className="welcome-header">
        <img src={logo} className="home-logo" />
        <h1>Hi, {name}.</h1>
      </div>
      <DailyMoodButton setShowMoodForm={setShowMoodForm} />
      <WeekViewCalendar />
      <JournalEntries
        setEntry={setEntry}
        entry={entry}
        setShowMoodForm={setShowMoodForm}
        entries={entries}
        setEntries={setEntries}
      />
    </div>
  );
}
