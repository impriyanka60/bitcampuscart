import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BusSchedule() {
  const [type, setType] = useState('weekday');
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/bus/${type}`)
      .then(res => setSchedule(res.data))
      .catch(err => console.error(err));
  }, [type]);

  return (
    <div>
      <h2>Campus Bus Schedule</h2>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setType('weekday')}>Weekday</button>
        <button onClick={() => setType('weekend')}>Weekend</button>
      </div>

      {!schedule && <p>Loading...</p>}

      {schedule && schedule.trips.map(trip => (
        <div key={trip.tripNumber} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h4>Trip {trip.tripNumber}</h4>
          <p><strong>Time:</strong> {trip.startTime} – {trip.endTime}</p>
          <p><strong>Route:</strong> {trip.route.join(' → ')}</p>
        </div>
      ))}
    </div>
  );
}

export default BusSchedule;
