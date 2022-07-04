let Timetable = require('./index.js');

window.t = new Timetable('#t').show(' T');

(() => {
  let timetable = new Timetable('#timer', { rootWidth: 180 });
  let format = time => time < 10 ? '0' + time : time;

  setInterval(() => {
    let date = new Date();
    const HOURS = format(date.getHours());
    const MINUTES = format(date.getMinutes());
    const SECONDS = format(date.getSeconds());

    timetable.show(` ${HOURS}:${MINUTES}:${SECONDS}`);
  }, 1000);
})();

// ENG CHARACTERS

(() => {
  const TEXT = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-.':?><+/=_!0123456789";

  let options = {
    // language: 'eng',
    boardHeight: 25,
    boardBgColor: 'black',
    lampColorOn: 'white',
    lampColorOff: 'red',
    // timeInterval: 500,
    columnsInBoard: Timetable.getColumnsByText(TEXT, 'eng')

  };
  new Timetable('#eng_char', options).show(TEXT);
})();

// UA CHARACTERS

(() => {
  const TEXT = 'АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ._-!:><=+/0123456789';

  let options = {
    language: 'ua',
    boardHeight: 25,
    boardBgColor: 'black',
    lampColorOn: 'yellow',
    lampColorOff: 'blue',
    columnsInBoard: Timetable.getColumnsByText(TEXT, 'ua')
  };
  new Timetable('.ua_char', options).show(TEXT);
})();

//          ****  MOVE LEFT    ***
(() => {
  const TEXT = 'An Application\n' +
      'Using props and state, we can put together a small Todo application. This example uses state to track the current list of items as well as the text that the user has entered. Although event handlers appear to be rendered inline, they will be collected and implemented using event delegation.';
  const options = {
    boardHeight: 45,
    boardBgColor: 'red',
    timeInterval: 30,
    columnsInBoard: 38
  };

  new Timetable('.scoreboard0', options).moveLeft(TEXT);
})();

//          ****  MOVE RIGHT    ***
(() => {
  const TEXT = 'scoreboard1';
  const options = {
    boardHeight: 45,
    boardBgColor: 'red',
    lampColorOn: 'blue',
    lampColorOff: 'orange',
    timeInterval: 600,
    columnsInBoard: 38
  };

  new Timetable('.scoreboard1', options).moveRight(TEXT);
})();

//          **** SHOW  ***
(() => {
  const TEXT = 'scoreboard2';
  const options = {
    boardHeight: 45,
    boardBgColor: 'red',
    lampColorOn: 'yellow'
  };

  new Timetable('.scoreboard2', options).show(TEXT);
})();

// CREATE CHARACTER
Timetable.createCharacter('.character');
