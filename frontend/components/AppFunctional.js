import React, { useState } from "react";

const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4;

export default function AppFunctional(props) {
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState(initialMessage);
  const [submittedEmail, setSubmittedEmail] = useState(""); 

 
  function onChange(evt) {
    setEmail(evt.target.value);
  }

  function getXY(idx) {
    const x = idx % 3;
    const y = Math.floor(idx / 3);
    return { x, y };
  }

  function getXYMessage(idx) {
    const { x, y } = getXY(idx);
    return `Coordinates (${x + 1}, ${y + 1})`;
  }

  function reset() {
    setIndex(initialIndex);
    setSteps(initialSteps);
    setEmail(initialEmail);
    setMessage("");
    setSubmittedEmail(""); 
  }

  function getNextIndex(direction, position) {
    const { x, y } = getXY(position);
    if (direction === "left" && x > 0) return position - 1;
    if (direction === "right" && x < 2) return position + 1;
    if (direction === "up" && y > 0) return position - 3;
    if (direction === "down" && y < 2) return position + 3;
    return position; 
  }

  function move(direction) {
    const newIndex = getNextIndex(direction, index);
    if (newIndex === index) {
      
      const messages = {
        left: "You can't go left",
        right: "You can't go right",
        up: "You can't go up",
        down: "You can't go down",
      };
      setMessage(messages[direction]);
    } else {
      
      setIndex(newIndex);
      setSteps(steps + 1);
      setMessage(""); 
    }
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const { x, y } = getXY(index);
    const currentSteps = steps + 1
    const payload = {
      x: x + 1,
      y: y + 1,
      steps: steps,
      email: email
    };

    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Unprocessable Entity');
      }
      return response.json();
    })
    .then(data => {
     
      setMessage(`lady win #${currentSteps}`);
      setSubmittedEmail(email);
      console.log(data);
    })
    .catch(error => {
      setMessage(error.message);
      console.log('Error:', error.message);
    })
    .finally(() => {
      setEmail("");
    
      setSteps(currentSteps);
    });
  }

  
  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage(index)}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
        {submittedEmail && <p>Last submitted email: {submittedEmail}</p>}
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={() => move("left")} id="left">LEFT</button>
        <button onClick={() => move("up")} id="up">UP</button>
        <button onClick={() => move("right")} id="right">RIGHT</button>
        <button onClick={() => move("down")} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange} 
        />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}
