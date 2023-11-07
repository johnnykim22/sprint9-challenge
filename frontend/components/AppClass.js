import React from "react";

export default class AppClass extends React.Component {
  state = {
    message: "",
    email: "",
    steps: 0,
    index: 4,
    submittedEmail: "",
  };

  getXY = (index) => {
    const x = index % 3;
    const y = Math.floor(index / 3);
    return { x, y };
  };

  getXYMessage = () => {
    const { x, y } = this.getXY(this.state.index);
    return `Coordinates (${x + 1}, ${y + 1})`;
  };

  reset = () => {
    this.setState({
      index: 4,
      steps: 0,
      email: "",
      message: "",
      submittedEmail: "",
    });
  };

  getNextIndex = (direction, index) => {
    const { x, y } = this.getXY(index);
    if (direction === "left" && x > 0) return index - 1;
    if (direction === "right" && x < 2) return index + 1;
    if (direction === "up" && y > 0) return index - 3;
    if (direction === "down" && y < 2) return index + 3;
    return index;
  };

  move = (direction) => {
    this.setState((prevState) => {
      const newIndex = this.getNextIndex(direction, prevState.index);
      const isSameIndex = newIndex === prevState.index;
      const messages = {
        left: "You can't go left",
        right: "You can't go right",
        up: "You can't go up",
        down: "You can't go down",
      };
      return {
        index: newIndex,
        steps: isSameIndex ? prevState.steps : prevState.steps + 1,
        message: isSameIndex ? messages[direction] : "",
      };
    });
  };

  onChange = (evt) => {
    this.setState({ email: evt.target.value });
  };

  onSubmit = (evt) => {
    evt.preventDefault();
    const { index, steps, email } = this.state;
    const { x, y } = this.getXY(index);

    const payload = {
      x: x + 1,
      y: y + 1,
      steps: steps,
      email: email,
    };

    fetch("http://localhost:9000/api/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unprocessable Entity");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          message: `Thanks for submitting your email, ${email}! lady win #${steps}`,
          submittedEmail: email,
          email: "",
        });
      })
      .catch((error) => {
        this.setState({ message: error.toString() });
      })
      .finally(() => {
        this.setState({ email: "" });
      });
  };

  renderSquare = (idx) => {
    const isActive = idx === this.state.index;
    return (
      <div key={idx} className={`square ${isActive ? "active" : ""}`}>
        {isActive ? "B" : null}
      </div>
    );
  };

  render() {
    const { message, steps, email, submittedEmail } = this.state;
    return (
      <div id="wrapper" className={this.props.className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">
            You moved {steps} {steps === 1 ? "time" : "times"}
          </h3>
          {submittedEmail && <p>Last submitted email: {submittedEmail}</p>}
          <h3 id="message">{message}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(this.renderSquare)}
        </div>
        <div id="keypad">
          <button onClick={() => this.move("left")} id="left">
            LEFT
          </button>
          <button onClick={() => this.move("up")} id="up">
            UP
          </button>
          <button onClick={() => this.move("right")} id="right">
            RIGHT
          </button>
          <button onClick={() => this.move("down")} id="down">
            DOWN
          </button>
          <button onClick={this.reset} id="reset">
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={email}
            onChange={this.onChange}
          ></input>
          <input id="submit" type="submit" />
        </form>
      </div>
    );
  }
}
