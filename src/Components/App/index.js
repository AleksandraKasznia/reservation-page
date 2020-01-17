/*
 * Copyright 2020 Aleksandra Kasznia
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {useState} from 'react';
import './App.css';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import TimeField from 'react-simple-timefield';
import { RESERVATION_URL } from '../constants/apiEndpoints';
import Footer from "../Footer";
import NavBar from "../NavBar";

function App() {

    const [name, setName] = useState("");
    const [selectedDayToAddRes, setSelectedDay] = useState(null);
    const [timeToAddRes, setTime] = useState('00:00');
    const [selectedDayToModifyRes, setSelectedDayToModifyRes] = useState(null);
    const [timeToModifyRes, setTimeToModifyRes] = useState('00:00');
    const [reservationId, setReservationId] = useState("");

    const deleteReservationReq = { method: 'DELETE' };
    const createReservationReq = { method: 'POST' };
    const modifyReservationReq = { method: 'PATCH' };

    function constructDate (date, time) {
        let result;
        if (date) {
            result = date.getFullYear().toString() + "-";
            let month = date.getMonth() + 1;

            if (month < 10) {
                result += "0" + month.toString();
            }
            else {
                result += month.toString();
            }

            result += "-";
            let day = date.getDate();

            if (day < 10) {
                result += "0" + day.toString();
            }
            else {
                result += day.toString();
            }
            result += 'T' + time;
        }
        return result;
    }

    const createReservationURL = RESERVATION_URL + "?customerName=" + name + "&date="+ constructDate(selectedDayToAddRes, timeToAddRes) + "&duration=2";
    const deleteReservationURL = RESERVATION_URL + "?customerName=&reservationId=" + reservationId;
    const modifyReservationURL = RESERVATION_URL + "?customerName=&reservationId=" + reservationId + "&date=" + constructDate(selectedDayToModifyRes, timeToModifyRes) + "&duration=2";

    async function reserve() {
        try {
            const resp1 = await fetch(createReservationURL, createReservationReq);
            if (resp1.status === 405) {
                alert("Sorry we're booked. please choose another time and make sure it doesn't exceeds our working hours (you can make reservation in these hours 12AM - 10PM)")
            }
            else {
                const resp = await resp1.json();
                console.log(resp);
                alert("Your reservation id: " + resp + ", you'll need it if you'd like to modify your reservation later on");
            }
        }
        catch (e) {
            alert("Sorry there was an error, please make a reservation via phone call");
            console.log(e);
        }
    }

  return (
      <div>
          <NavBar/>
          <div className="App">
              <div>
                  <h1>Make a reservation</h1>
                  <form className="makeRes" onSubmit={event => {
                      event.preventDefault();
                      reserve()
                  }}>
                      <label>
                          <div>
                              Name to make a reservation on:
                          </div>
                          <input
                              type = "text"
                              value = {name}
                              onChange={event => setName(event.target.value)}
                          />
                      </label>
                      <label>
                          <div>
                              <br/>
                              Choose an hour
                          </div>
                          <TimeField
                              value={timeToAddRes}                     // {String}   required, format '00:00' or '00:00:00'
                              onChange={event => setTime(event.target.value)}      // {Function} required
                          />
                      </label>
                      <label>
                          <DayPicker
                              selectedDays={selectedDayToAddRes}
                              onDayClick={event => (setSelectedDay(new Date(event.getFullYear(), event.getMonth(), event.getDate())))}
                          />
                      </label>
                      <button type="submit"> Submit </button>
                  </form>
              </div>
              <div>
                  <h1>Edit your reservation</h1>
                  <form className="editRes" onSubmit={event => {
                      event.preventDefault();
                      fetch(modifyReservationURL, modifyReservationReq)
                          .then(response => {
                              if (response.status === 406) {
                                  console.log(response.text())
                              }
                              if (response.status === 200) {
                                  alert("Your reservation has been modified successfully")
                              }

                          })
                          .catch(err => console.log(err))
                  }}>
                      <label>
                          <div>
                              Id of your reservation:
                          </div>
                          <input
                              type = "text"
                              value = {reservationId}
                              onChange={event => setReservationId(event.target.value)}
                          />
                      </label>
                      <label>
                          <h3>Change the date or <button type="button" className="deleteButton" onClick={() => {
                              fetch(deleteReservationURL, deleteReservationReq)
                                  .then(response => {
                                      if (response.status === 200) {
                                          alert("Your reservation has been deleted successfully")
                                      }
                                      else {
                                          alert("Yor reservation has not been deleted, make sure you typed in the correct reservation id")
                                      }
                                  })
                          }}>
                              Delete</button>
                          </h3>
                          <div>
                              Choose an hour
                          </div>
                          <TimeField
                              value={timeToModifyRes}
                              onChange={event => setTimeToModifyRes(event.target.value)}
                          />
                      </label>
                      <label>
                          <DayPicker
                              selectedDays={selectedDayToModifyRes}
                              onDayClick={event => (setSelectedDayToModifyRes(new Date(event.getFullYear(), event.getMonth(), event.getDate())))}
                          />
                      </label>
                      <button type="submit"> Submit </button>
                  </form>
              </div>
          </div>
          <Footer/>
      </div>

  );
}

export default App;
