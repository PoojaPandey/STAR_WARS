// import react, { useState } from 'react';

// function Timer() {
//   const [timeCount, setTimeCount] = useState(60);
//   //   const [isTimerRunning, setIsTimerRunning] = useState(false);
//   const [apiCallCount, setApiCallCount] = useState(0);
//   const [searchDisable, setSearchDisablet] = useState(false);

//   function cleareTimer() {
//     clearInterval(this.timer);
//   }
//   function tick() {
//     if (timeCount === 0 && searchDisable === true) {
//       setTimeCount(60);
//       setSearchDisablet(false);
//       setApiCallCount(0);
//       alert('You can continue your search');
//     }
//     setTimeCount(timeCount - 1);
//   }
//   function startTimer() {
//     clearInterval(this.timer);
//     this.timer = setInterval(this.tick.bind(this), 1000);
//   }
//   function stopTimer() {
//     clearInterval(this.timer);
//   }
// }
// export default Timer;
