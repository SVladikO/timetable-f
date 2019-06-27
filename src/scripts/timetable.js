'use strict';

const Table = require('./table.js');
const Character = require('./character.js');
const getColumnsByText = require('./features/get-columns-by-text.js');
const getColumnsFullWidth = require('./features/get-columns-full-width.js');
const createBoard = require('./features/create-board.js');
const getDiv = require('./features/get-div.js');
const getConvertedText = require('./features/get-converted-text.js');

const imageDisabledLamp = 'public/img/off.png';

const TABLE_ROWS = 7;

/**
 * Manipulation ua/eng text in div(table)
 */
class Timetable extends Table {
  init() {
    createBoard(this.className, this.height, this.columns, imageDisabledLamp, this.backgroundColor);
    this._images = this._getImgFromDOM();
    return this;
  }

  /**
   * Clear previous and show new text
   * @param  {string} text
   */
  show(text) {
    this._prepareDataAndTable(text);
    this._turnOnAllCoordinates();
  }

  /**
   * Clear previous and move left new text.
   * @param  {string} text
   * @param  {number} [time] circles to repeat
   * @param  {number} [interval] seconds for setInterval
   */
  moveLeft(text, time = 0, interval) {
    this._prepareDataAndTable(text);
    this._goToRight();
    this._moveCoreFunctionality(checkPosition, position => position - TABLE_ROWS, interval);

    function checkPosition() {
      if (!(this._convertedText.slice(-1)[0] < 0)) return;

      if (--time) {
        this._goToRight();
      } else {
        clearInterval(this.intervalID);
      }
    }
  }

  /**
    * Clear previous and move right new text.
    * @param  {string} text
    * @param  {number} [time] circles to repeat
    * @param  {number} [interval] seconds for setInterval
    */
  moveRight(text, time = 0, interval) {
    this._prepareDataAndTable(text);
    this._goToLeft();
    this._moveCoreFunctionality(checkPosition, position => position + TABLE_ROWS, interval);

    function checkPosition() {
      if (!(this._convertedText[0] > this._images.length)) return;

      if (--time) {
        this._goToLeft();
      } else {
        clearInterval(this.intervalID);
      }
    }
  }

  /**
   * Unique method to stop work any method show/moveLeft/moveRight
   * Clear intervalID
   * Disable text (It's mean we delete background color for processed text)
   */
  clear() {
    clearInterval(this.intervalID);
    this._turnOffAllCoordinates();
  }
  /**
   * Calculate columns depends on div[className].width.
   * We need here height too, because image size calculated from height
   * @param  {number} height    Table's
   * @param  {string} className Where you want to create table
   * @returns {string} columns
   */
  static getColumnsFullWidth(height, className) {
    return getColumnsFullWidth(height, className);
  }

  /**
   * Calculate columns depends on text length.
   * @param  {string} text
   * @param  {string} language = 'eng'
   * @returns {number} columns
   */
  static getColumnsByText(text, language = 'eng') {
    return getColumnsByText(text, language, Character, TABLE_ROWS)
  }

  /**
   * Add eventListener on create table. Print clicked coordinates in console
   */
  createCharacter() {
    const root = getDiv(this.className);
    addStyle(root);

    const nodes = Array.prototype.slice.call(root.children);
    root.addEventListener('click', function(event) {
      this.clear();
      addOrDeleteCoordinate(nodes, event.target, this._convertedText);
      console.log(sort(this._convertedText));
      this._turnOnAllCoordinates();
    }.bind(this));

    function addStyle(root) {
      root.style.border = 'solid 2px red';
      root.style.width = '80px';
      root.style.margin = 'auto';
      return root
    }

    function sort(coordinates) {
      return (coordinates.length >= 2) ? coordinates.sort((a, b) => a - b) : coordinates;
    }

    function addOrDeleteCoordinate(nodes, target, coordinates) {
      const imageIndex = nodes.indexOf(target);
      let indexOf = coordinates.indexOf(imageIndex);

      if (indexOf >= 0) {
        coordinates.splice(indexOf, 1);
      } else if (imageIndex > 0) {
        coordinates.push(imageIndex);
      }
    }
  }

  _prepareDataAndTable(text) {
    this.clear();
    this.text = '' + text;
    this._convertedText = getConvertedText(this.text, this.language, Character);
  }

  _goToRight() {
    const POSITION_FIRST = this._convertedText[0];
    const INCREMENT = Math.floor(POSITION_FIRST / -TABLE_ROWS) * TABLE_ROWS + this._images.length;
    this._convertedText = this._convertedText.map(num => num + INCREMENT);
  }

  _goToLeft() {
    const POSITION_LAST = this._convertedText.slice(-1)[0];
    const INCREMENT = Math.floor(POSITION_LAST / TABLE_ROWS) * TABLE_ROWS;
    this._convertedText = this._convertedText.map(num => num - INCREMENT);
  }

  _getImgFromDOM() {
    let root = document.getElementsByClassName(this.className)[0];
    return root.getElementsByTagName('IMG');
  }

  _switchColor(position, color) {
    if (position >= 0 && position < this._images.length) {
      this._images[position].style.backgroundColor = color;
    }
  }

  _turnOnAllCoordinates() {
    this._convertedText.forEach(position => this._switchColor(position, this.color.active));
  }

  _turnOffAllCoordinates() {
    this._convertedText.forEach(position => this._switchColor(position, this.color.disabled));
  }

  /**
   * Full circle movement text's coordinates
   * @param  {function} checkCallback
   * @param  {function} changeCallback
   * @param  {number} interval=this.interval
   */
  _moveCoreFunctionality(checkCallback, changeCallback, interval = this.interval) {
    this.intervalID = setInterval(function() {
      try {
        checkCallback.call(this);
        this._turnOffAllCoordinates();
        this._convertedText = this._convertedText.map(position => {
          let newPosition = changeCallback(position);
          this._switchColor(newPosition, this.color.active);
          return newPosition;
        });
      } catch (error) {
        clearInterval(this.intervalID);
        throw error;
      }
    }.bind(this), interval);
  }
}

module.exports = Timetable;
