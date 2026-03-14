import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

let userSelectedDate = null;
let timerInterval = null;

const refs = {
    dateTimePicker: document.querySelector('#datetime-picker'),
    startButton: document.querySelector('[data-start]'),
    timerDisplay: {
        days: document.querySelector('[data-days]'),
        hours: document.querySelector('[data-hours]'),
        minutes: document.querySelector('[data-minutes]'),
        seconds: document.querySelector("[data-seconds]"),
    }
}

flatpickr(refs.dateTimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
  window.alert("Please choose a date in the future");
      refs.startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      refs.startButton.disabled = false;
    }
  },
});

refs.startButton.addEventListener('click', ()=>{
    if(!userSelectedDate) return;
    refs.startButton.disabled = true;
    refs.dateTimePicker.disabled = true;

    timerInterval = setInterval(()=>{
        const currentTime = new Date();
        const timeDiff = userSelectedDate - currentTime;
        if(timeDiff<=0){
         clearInterval(timerInterval);
         resetUI();
         return;
        }
        updateTimerDisplay(convertMs(timeDiff));
    },1000);
})

function resetUI() {
refs.dateTimePicker.disabled = false;
refs.startButton.disabled = true;
  updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
}

function updateTimerDisplay({days, hours, minutes, seconds}){
 refs.timerDisplay.days.textContent = addLeadingZero(days);
  refs.timerDisplay.hours.textContent = addLeadingZero(hours);
  refs.timerDisplay.minutes.textContent = addLeadingZero(minutes);
  refs.timerDisplay.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);
  return { days, hours, minutes, seconds };
}