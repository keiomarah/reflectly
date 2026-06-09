import { MenuIcon } from "../components/MenuIcon";
import { AddButton } from "../components/AddButton";
import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../assets/reflectly-logo.png";

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
function DailyMoodButton() {
  return (
    <button className="btn-primary daily-mood-btn">
      How are you feeling today?
    </button>
  );
}

export function HomeDashboard() {
  const [name, setName] = useState("Guest");
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
    getName();
  }, []);

  return (
    <div className="home-dashboard-page">
      <MenuIcon />
      <AddButton />
      <div className="welcome-header">
        <img src={logo} className="home-logo" />
        <h1>Hi, {name}.</h1>
      </div>
      <DailyMoodButton />
      <WeekViewCalendar />
    </div>
  );
}
