import React, { useEffect, useState } from 'react';
import axios from 'axios';

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

function MessMenu() {
  const [menu, setMenu] = useState(null);
  const [day, setDay] = useState("Monday");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/mess")
      .then(res => setMenu(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!menu) return <p>Loading menu...</p>;

  const todayMenu = menu.menus[day];

  return (
    <div>
      <h2>Girls Hostel Mess Menu</h2>

      <select value={day} onChange={(e) => setDay(e.target.value)}>
        {days.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {todayMenu ? (
        <div style={{ marginTop: "20px" }}>
          <h4>Breakfast</h4>
          <ul>{todayMenu.breakfast.map((i, idx) => <li key={idx}>{i}</li>)}</ul>

          <h4>Lunch</h4>
          <ul>{todayMenu.lunch.map((i, idx) => <li key={idx}>{i}</li>)}</ul>

          <h4>Snacks</h4>
          <ul>{todayMenu.snacks.map((i, idx) => <li key={idx}>{i}</li>)}</ul>

          <h4>Dinner</h4>
          <ul>{todayMenu.dinner.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
        </div>
      ) : (
        <p>No menu available for this day.</p>
      )}
    </div>
  );
}

export default MessMenu;
