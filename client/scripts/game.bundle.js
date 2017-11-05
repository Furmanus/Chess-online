/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**@author Lukasz Lach*/

/**@typedef HighlightEnums*/
var HighlightEnums = {

    RED: 'red',
    BLUE: 'blue'
};

exports.default = HighlightEnums;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**@author Lukasz Lach*/

/**@typedef FigureEnums*/
var FigureEnums = {

    PAWN: 'pawn',
    KNIGHT: 'knight',
    BISHOP: 'bishop',
    ROOK: 'rook',
    QUEEN: 'queen',
    KING: 'king'
};

exports.default = FigureEnums;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**@author Lukasz Lach*/

/**@typedef ColourEnums*/
var ColourEnums = {

    WHITE: 'white',
    BLACK: 'black'
};

exports.default = ColourEnums;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _controller = __webpack_require__(4);

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

    window.front = {

        controller: new _controller2.default()
    };
})();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**@author Lukasz Lach*/

var _board_controller = __webpack_require__(5);

var _board_controller2 = _interopRequireDefault(_board_controller);

var _panel_controller = __webpack_require__(7);

var _panel_controller2 = _interopRequireDefault(_panel_controller);

var _view = __webpack_require__(8);

var _view2 = _interopRequireDefault(_view);

var _socket_manager = __webpack_require__(14);

var _socket_manager2 = _interopRequireDefault(_socket_manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// declarations of class private fields
var mainView = Symbol();
var boardController = Symbol();
var panelController = Symbol();
var socketClientManager = Symbol();

/**
 * Main controller of application.
 * @class
 * @typedef {Object} MainController
 */

var MainController = function () {

  /**
   * Constructor of main controller
   */
  function MainController() {
    _classCallCheck(this, MainController);

    /**
     * @type {View}
     * @private
     */
    this[mainView] = new _view2.default();

    /**
     * @type {SocketClientManager}
     * @private
     */
    this[socketClientManager] = new _socket_manager2.default();

    /**
     * @type {BoardController}
     * @private
     */
    this[boardController] = new _board_controller2.default(this.getMainView().getBoardView(), this.getSocketClientManager());

    /**
     * @type {PanelController}
     * @private
     */
    this[panelController] = new _panel_controller2.default(this.getMainView().getPanelView(), this.getSocketClientManager());
  }

  /**
   * Returns board controller.
   * @returns {BoardController} Board controller object.
   */


  _createClass(MainController, [{
    key: "getBoardController",
    value: function getBoardController() {

      return this[boardController];
    }

    /**
     * Returns panel controller.
     * @returns {PanelController} Panel controller object.
     */

  }, {
    key: "getPanelController",
    value: function getPanelController() {

      return this[panelController];
    }

    /**
     * Returns socket manager for client side.
     * @returns {SocketClientManager}   SocketClientManager instance.
     */

  }, {
    key: "getSocketClientManager",
    value: function getSocketClientManager() {

      return this[socketClientManager];
    }

    /**
     * Returns main view attached to main controller.
     * @returns {View} Main View object.
     */

  }, {
    key: "getMainView",
    value: function getMainView() {

      return this[mainView];
    }
  }]);

  return MainController;
}();

exports.default = MainController;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**@author Lukasz Lach*/

var _highlight = __webpack_require__(0);

var _highlight2 = _interopRequireDefault(_highlight);

var _ajax = __webpack_require__(6);

var _ajax2 = _interopRequireDefault(_ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// declaration of private variables
var boardView = Symbol();
var socketClientManager = Symbol();

/**
 * Controller responsible for taking user input from game board, passing it to model and manipulating view.
 * @class
 * @typedef {Object}    BoardController
 */

var BoardController = function () {

    /**
     * Constructor for board controller.
     * @param {BoardView}           boardViewObject
     * @param {SocketClientManager} socketClientManagerInstance
     */
    function BoardController(boardViewObject, socketClientManagerInstance) {
        _classCallCheck(this, BoardController);

        /**
         * @type {BoardView}
         * @private
         */
        this[boardView] = boardViewObject;

        /**
         * @type {SocketClientManager}
         * @private
         */
        this[socketClientManager] = socketClientManagerInstance;

        this.attachEventListeners();
    }

    /**
     * Method responsible for attaching event listeners to various game board HTML elements.
     * @returns {undefined}
     */


    _createClass(BoardController, [{
        key: "attachEventListeners",
        value: function attachEventListeners() {

            this.attachClickEventListeners();
        }

        /**
         * Method responsible for attaching click event listeners to cells HTML elements.
         * @returns {undefined}
         */

    }, {
        key: "attachClickEventListeners",
        value: function attachClickEventListeners() {

            var cellsMap = Array.from(this.getBoardView().getCells().values()); //we transform map to array;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = cellsMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var cell = _step.value;


                    cell.getElement().addEventListener('click', this.clickEventListener.bind(this));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /**
         *  //TODO pobranie elementu zrobione, dokończyć resztę po zrobieniu modelu
         * @param {Event}   ev                                      Event object which triggered this function.
         * @param {string}  ev.currentTarget.dataset.coordinates    String containing coordinates of chosen cell, stored in 'data-coordinates' HTML element attribute.
         */

    }, {
        key: "clickEventListener",
        value: function clickEventListener(ev) {

            var targetCoordinates = this.convertStringCoordinatesToObject(ev.currentTarget.dataset.coordinates);
            var targetCell = this.getBoardView().getCell(targetCoordinates.x, targetCoordinates.y);

            if (!targetCell.isHighlighted) {

                targetCell.highlightCell(_highlight2.default.RED);
            } else {

                targetCell.removeHighlightCell();
            }
        }

        /**
         * Returns BoardView object.
         * @returns {BoardView} Returns BoardView object.
         */

    }, {
        key: "getBoardView",
        value: function getBoardView() {

            return this[boardView];
        }

        /**
         * Method which converts string with coordinates into object with 'x' and 'y' properties.
         * @param   {string}                    String with cell coordinates. Example '2x1'.
         * @returns {{x: number, y: number}}    Object with cell coordinates.
         */

    }, {
        key: "convertStringCoordinatesToObject",
        value: function convertStringCoordinatesToObject(string) {

            if (string.length !== 3) {

                throw new Error('Invalid string coordinates type.');
            }

            var x = parseInt(string.charAt(0));
            var y = parseInt(string.charAt(2));

            return { x: x, y: y };
        }
    }]);

    return BoardController;
}();

exports.default = BoardController;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author Lukasz Lach
 */

/**
 * TODO poprawić aby obsługiwało zagnieżdżone obiekty.
 * Method which converts object into url like query (example: {a: 1, b: 2} -> 'a=1&b=2'). Works only with object with values of primitive types.
 * @param   {Object}    object  Object to convert.
 * @returns {string}    String containing converted data.
 */
function buildQueryString(object) {

    var keys = Object.keys(object);
    var query = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;


            query.push(key + '=' + object[key]);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return query.join('&');
}

/**
 * Helper class containing static methods for sending AJAX requests.
 * @class
 */

var Ajax = function () {
    function Ajax() {
        _classCallCheck(this, Ajax);
    }

    _createClass(Ajax, null, [{
        key: 'post',


        /**
         * Method responsible for sending AJAX POST request at certain url.
         * @param   {string}    url             URL adress where data should be send.
         * @param   {Object}    data            Data object to send.
         * @param   {function}  callback        Callback function executed upon successful response.
         * @param   {boolean}   isJsonRequest   Parameter determining whether requests content-type should be 'application/json'. If set to false, it will be 'application/x-www-form-urlencoded'. By default set to true.
         */
        value: function post(url, data, callback) {
            var isJsonRequest = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;


            var ajax = new XMLHttpRequest();
            var contentType = isJsonRequest === true ? 'application/json' : 'application/x-www-form-urlencoded';

            ajax.open('POST', url, true);
            ajax.setRequestHeader('Content-type', contentType);

            ajax.onreadystatechange = function () {

                if (ajax.readyState === 4 && ajax.status === 200) {

                    callback(ajax.response);
                }
            };

            data = isJsonRequest === true ? JSON.stringify(data) : buildQueryString(data);

            ajax.send(data);
        }

        /**
         * Method responsible for sending AJAX GET request at certain url.
         * @param   {string}    url         URL adress where data should be send.
         * @param   {Object}    data        Data object to send.
         * @param   {function}  callback    Callback function executed upon successful response.
         */

    }, {
        key: 'get',
        value: function get(url, data, callback) {

            var ajax = new XMLHttpRequest();
            var path = url + '?' + buildQueryString(data);

            ajax.open('GET', path, true);

            ajax.onreadystatechange = function () {

                if (ajax.readyState === 4 && ajax.status === 200) {

                    callback(ajax.response);
                }
            };

            ajax.send();
        }
    }]);

    return Ajax;
}();

exports.default = Ajax;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**@author Lukasz Lach*/

//private variables declaration
var panelView = Symbol();
var socketClientManager = Symbol();

/**
 * Controller responsible for taking user input from panel, passing it to model and manipulating view.
 * @class
 * @typedef {Object} PanelController
 */

var PanelController = function () {

    /**
     * Constructor for panel controller.
     * @param {PanelView}           panelViewObject
     * @param {SocketClientManager} socketClientManagerInstance
     */
    function PanelController(panelViewObject, socketClientManagerInstance) {
        _classCallCheck(this, PanelController);

        this[panelView] = panelViewObject;

        this[socketClientManager] = socketClientManagerInstance;
    }

    /**
     * Returns PanelView object.
     * @returns {PanelView}
     */


    _createClass(PanelController, [{
        key: "getPanelView",
        value: function getPanelView() {

            return this[panelView];
        }

        /**
         * Returns socket manager for client side.
         * @returns {SocketClientManager}
         */

    }, {
        key: "getSocketClientManager",
        value: function getSocketClientManager() {

            return this[socketClientManager];
        }
    }]);

    return PanelController;
}();

exports.default = PanelController;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      @author Lukasz Lach
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _panel_view = __webpack_require__(9);

var _panel_view2 = _interopRequireDefault(_panel_view);

var _board_view = __webpack_require__(10);

var _board_view2 = _interopRequireDefault(_board_view);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// private variables declaration
var boardView = Symbol('boardView');
var panelView = Symbol('panelView');

/**
 * Class representing main view.
 * @class
 * @typedef {Object} View
 */

var View = function () {

  /**
   * Constuctor for main view object.
   * @constructor
   */
  function View() {
    _classCallCheck(this, View);

    /**
     * @private
     * @type {BoardView}
     */
    this[boardView] = null;
    /**
     * @private
     * @type {PanelView}
     */
    this[panelView] = null;

    this.initialize();
  }

  /**
   * Method which initializes main view object.
   * @returns {undefined}
   */


  _createClass(View, [{
    key: "initialize",
    value: function initialize() {

      this[boardView] = new _board_view2.default();
      this[panelView] = new _panel_view2.default();
    }
    /**
     * Method which returns BoardView instance.
     * @returns {BoardView}
     */

  }, {
    key: "getBoardView",
    value: function getBoardView() {

      return this[boardView];
    }

    /**
     * Method which returns PanelView instance.
     * @returns {PanelView}
     */

  }, {
    key: "getPanelView",
    value: function getPanelView() {

      return this[panelView];
    }
  }]);

  return View;
}();

exports.default = View;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**@author Lukasz Lach*/

/**
 * @class
 * @typedef {Object} PanelView
 */
var PanelView =

/**
 * @constructor
 */
function PanelView() {
  _classCallCheck(this, PanelView);
};

exports.default = PanelView;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**@author Lukasz Lach*/

var _cell = __webpack_require__(11);

var _cell2 = _interopRequireDefault(_cell);

var _figure = __webpack_require__(12);

var _figure2 = _interopRequireDefault(_figure);

var _figures = __webpack_require__(1);

var _figures2 = _interopRequireDefault(_figures);

var _colours = __webpack_require__(2);

var _colours2 = _interopRequireDefault(_colours);

var _highlight = __webpack_require__(0);

var _highlight2 = _interopRequireDefault(_highlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// private variables declaration
var gameBoard = Symbol('gameBoard');
var cells = Symbol('cells');

/**
 * @class
 * @typedef {Object} BoardView
 */

var BoardView = function () {

    /**
     * Constructor of game board view.
     * @constructor
     */
    function BoardView() {
        _classCallCheck(this, BoardView);

        /**
         * @type {HTMLElement}
         * @private
         */
        this[gameBoard] = document.getElementById('board');

        /**
         * Holds created cells, where key is in form "<row>x<column". Under key is stored Cell object.
         * @private
         * @type {Map}
         */
        this[cells] = new Map();

        this.initialize();
    }

    /**
     * Initialization method for game board view.
     * @returns {undefined}
     */


    _createClass(BoardView, [{
        key: "initialize",
        value: function initialize() {

            this.prepareGameBoard();

            var d = new _figure2.default(_figures2.default.KING, _colours2.default.WHITE, this.getCell(1, 1).getElement());

            var z = new _figure2.default(_figures2.default.QUEEN, _colours2.default.BLACK, this.getCell(5, 6).getElement());

            //d.moveTo(this.getCell(5, 6));
        }

        /**
         * Fills game board with board cells.
         * @returns {undefined}
         */

    }, {
        key: "prepareGameBoard",
        value: function prepareGameBoard() {

            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {

                    this.setCell(j, i, new _cell2.default(j, i, this.getGameBoard()));
                }
            }
        }

        /**
         * Getter for HTML Element representing game board.
         * @returns {HTMLElement}
         */

    }, {
        key: "getGameBoard",
        value: function getGameBoard() {

            return this[gameBoard];
        }

        /**
         * Returns cell object from cells map.
         * @param {number} x Horizontal (row) coordinate.
         * @param {number} y Vertical (column) coordinate.
         * @returns {Cell} Returns cell object from cells map.
         */

    }, {
        key: "getCell",
        value: function getCell(x, y) {

            return this[cells].get(x + 'x' + y);
        }

        /**
         * Returns Map storing cells objects.
         * @returns {Map} Map storing cells objects.
         */

    }, {
        key: "getCells",
        value: function getCells() {

            return this[cells];
        }

        /**
         * Stores new cell object in cells map.
         * @param x
         * @param y
         * @param cell
         */

    }, {
        key: "setCell",
        value: function setCell(x, y, cell) {

            this.getCells().set(x + 'x' + y, cell);
        }
    }]);

    return BoardView;
}();

exports.default = BoardView;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**@author Lukasz Lach*/

var _highlight = __webpack_require__(0);

var _highlight2 = _interopRequireDefault(_highlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//private variables of Cell class
var parent = Symbol('parent');
var element = Symbol('element');
var x = Symbol('x');
var y = Symbol('y');

/**
 * Class representing single cell in game board.
 * @class
 * @typedef {Object} Cell
 */

var Cell = function () {

    /**
     * Constructor for Cell class.
     * @constructor
     * @param {number} xCoordinate Row (horizontal) coordinate of cell.
     * @param {number} yCoordinate Column (vertical) coordinate of cell.
     * @param {HTMLElement} parentElement HTML Element to which created board cell will be appended.
     */
    function Cell(xCoordinate, yCoordinate, parentElement) {
        _classCallCheck(this, Cell);

        /**@type {number}*/
        this[x] = xCoordinate;

        /**@type {number}*/
        this[y] = yCoordinate;

        /**
         * @private
         * @type {HTMLElement}
         */
        this[parent] = parentElement;

        /**
         * @type {HTMLElement}
         * @private
         */
        this[element] = document.createElement('div');

        /**
         * @type {boolean|string}
         */
        this.isHighlighted = false;

        this.initialize();
    }

    /**
     * Method which prepares HTMLElement and appends it to game board.
     * @returns {undefined}
     */


    _createClass(Cell, [{
        key: 'initialize',
        value: function initialize() {

            this.addClass('cell');

            this.setPosition(this.getX() * 53, this.getY() * 53);
            //we set special attribute to html element, so later click event listener could retrieve with those coordinates this cell object.
            this.getElement().setAttribute('data-coordinates', this.getX() + 'x' + this.getY());

            this.setBackgroundColor();

            this.getParent().appendChild(this.getElement());
        }

        /**
         * Sets element background color (by adding proper css class) depending on its coordinates.
         * @returns {undefined}
         */

    }, {
        key: 'setBackgroundColor',
        value: function setBackgroundColor() {

            if (this.getX() % 2 === this.getY() % 2) {

                this.addClass('cell_white');
            } else {

                this.addClass('cell_black');
            }
        }

        /**
         * Returns HTMLElement appended to game board.
         * @returns {HTMLElement}
         */

    }, {
        key: 'getElement',
        value: function getElement() {

            return this[element];
        }

        /**
         * Returns HTMLElement parent element of this board cell.
         * @returns {HTMLElement}
         */

    }, {
        key: 'getParent',
        value: function getParent() {

            return this[parent];
        }

        /**
         * Sets css class of element.
         * @param {string} className Name of css class to add.
         * @returns {undefined}
         */

    }, {
        key: 'addClass',
        value: function addClass(className) {

            this.getElement().classList.add(className);
        }

        /**
         * Removes css class of element.
         * @param {string} className Name of css class to remove.
         * @returns {undefined}
         */

    }, {
        key: 'removeClass',
        value: function removeClass(className) {

            this.getElement().classList.remove(className);
        }

        /**
         * Sets absolute left and top position (relative to game board left-top edge).
         * @param {number} left Left css style position.
         * @param {number} top Top css style position.
         * @returns {undefined}
         */

    }, {
        key: 'setPosition',
        value: function setPosition(left, top) {

            this.getElement().style.left = left + 'px';
            this.getElement().style.top = top + 'px';
        }

        /**
         * Highlights cell (sets border with certain colour, from HighlightColour enums).
         * @param {string} colour Colour of cell border.
         * @returns {undefined}
         */

    }, {
        key: 'highlightCell',
        value: function highlightCell(colour) {

            if (!Object.values(_highlight2.default).includes(colour)) {

                throw new Error('Invalid colour for cell to highlight');
            }

            this.addClass(colour + '_border');
            this.isHighlighted = colour;
        }

        /**
         * Removes highlight border of cell.
         * @returns {undefined}
         */

    }, {
        key: 'removeHighlightCell',
        value: function removeHighlightCell() {

            if (this.isHighlighted) {

                this.removeClass(this.isHighlighted + '_border');
                this.isHighlighted = false;
            }
        }

        /**
         * Getter for horizontal position of cell on game board.
         * @returns {number} Horizontal position of cell on game board.
         */

    }, {
        key: 'getX',
        value: function getX() {

            return this[x];
        }

        /**
         * Getter for vertical position of cell on game board.
         * @returns {number} Vertical position of cell on game board.
         */

    }, {
        key: 'getY',
        value: function getY() {

            return this[y];
        }
    }]);

    return Cell;
}();

exports.default = Cell;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**@author Lukasz Lach*/

var _figures = __webpack_require__(1);

var _figures2 = _interopRequireDefault(_figures);

var _colours = __webpack_require__(2);

var _colours2 = _interopRequireDefault(_colours);

var _algorithms = __webpack_require__(13);

var _algorithms2 = _interopRequireDefault(_algorithms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// private variables declaration
var type = Symbol();
var colour = Symbol();
var element = Symbol();
var parentElement = Symbol();

/**
 * Class representing view of game figures.
 * @class
 * @typedef {Figure}
 */

var Figure = function () {

    /**
     * Constructor of Figure class.
     * @constructor
     * @param {string} figureType Type of figure. String which is member of FigureEnums object.
     * @param {string} figureColour Colour of figure. String which is member of ColourEnums object.
     * @param {HTMLElement} FigureParentElement HTML Element to which created object will be apended.
     */
    function Figure(figureType, figureColour, FigureParentElement) {
        _classCallCheck(this, Figure);

        if (!Object.values(_figures2.default).includes(figureType)) {

            throw new Error('Invalid figure type');
        }
        if (!Object.values(_colours2.default).includes(figureColour)) {

            throw new Error('Invalid figure colour');
        }

        /**@type {string}*/
        this[type] = figureType;
        /**@type {string}*/
        this[colour] = figureColour;
        /**@type {HTMLElement}*/
        this[parentElement] = FigureParentElement;
        /**@type {HTMLElement}*/
        this[element] = null;

        this.initialize();
    }

    /**
     * Creates HTML Element and appends it to proper cell HTML Element.
     * @returns {undefined}
     */


    _createClass(Figure, [{
        key: "initialize",
        value: function initialize() {

            this[element] = document.createElement('div');

            this.getElement().classList.add('figure');
            this.getElement().classList.add(this.getType() + '_' + this.getColour());

            this.getParentElement().appendChild(this.getElement());
        }

        /**
         * Returns HTML Element representing figure.
         * @returns {HTMLElement} Returns HTML Element representing figure.
         */

    }, {
        key: "getElement",
        value: function getElement() {

            return this[element];
        }

        /**
         * Returns parent html element of figure.
         * @returns {HTMLElement} Returns parent element of figure.
         */

    }, {
        key: "getParentElement",
        value: function getParentElement() {

            return this[parentElement];
        }

        /**
         * Sets parent html element of figure.
         * @param {HTMLElement} element HTML new parent element of figure.
         * @returns {undefined}
         */

    }, {
        key: "setParentElement",
        value: function setParentElement(element) {

            element.appendChild(this.getElement());
            this[parentElement] = element;
        }

        /**
         * Returns type of this figure.
         * @returns {string}
         */

    }, {
        key: "getType",
        value: function getType() {

            return this[type];
        }

        /**
         * Returns colour of this figure.
         * @returns {string} Returns colour of this figure.
         */

    }, {
        key: "getColour",
        value: function getColour() {

            return this[colour];
        }

        /**
         * Moves figures from currently occupied cell to another cell.
         * @param {Cell} cell Destination cell.
         * @returns {undefined}
         */

    }, {
        key: "moveTo",
        value: function moveTo(cell) {

            var convertedStartingPosition = this.getCoordinatesRelativeToBoard();
            var thisPositionX = convertedStartingPosition.x;
            var thisPositionY = convertedStartingPosition.y;
            /**
             * Element top left should be at center of HTML cell, because after appending it to target cell, transform: translate(-50%, -50%) CSS rule will be applied
             * */
            var targetPositionX = cell.getElement().offsetLeft + Math.floor(this.getElement().offsetWidth / 2);
            var targetPositionY = cell.getElement().offsetTop + Math.floor(this.getElement().offsetHeight / 2);

            /**
             * Remove element from its parent, and append it to game board. This is necessary, because later we want to modify its top and left properties, and they should be relative to
             * game board.
             */
            this.getParentElement().removeChild(this.getElement());
            this.setParentElement(cell.getElement().offsetParent);

            /**
             * We set elements left and top position as converted coordinates relative to board.
             */
            this.getElement().style.left = thisPositionX + 'px';
            this.getElement().style.top = thisPositionY + 'px';

            // Execute bresenham algorithm. Figure html element is moved along path from starting point to target point
            _algorithms2.default.bresenham(thisPositionX, thisPositionY, targetPositionX, targetPositionY, 1, function (x, y) {

                this.getElement().style.left = x + 'px';
                this.getElement().style.top = y + 'px';

                // when target point is reached
                if (x === targetPositionX && y === targetPositionY) {

                    // We check if new cell has any figures, if yes, we remove them.
                    if (cell.getElement().children.length && cell.getElement().firstElementChild.classList.contains('figure')) {

                        cell.getElement().removeChild(cell.getElement().firstChild);
                    }

                    // figure html element is removed from board html element, and appended to target cell
                    this.getParentElement().removeChild(this.getElement());
                    this.setParentElement(cell.getElement());

                    // We set figure element top and left to previous values
                    this.getElement().style.left = '50%';
                    this.getElement().style.top = '50%';
                }
            }.bind(this));
        }

        /**
         * Returns coordinates of HTML Element representing figure relative to game board.
         * @returns {{x: number, y: number}} Returns coordinates of HTML Element representing figure relative to game board.
         */

    }, {
        key: "getCoordinatesRelativeToBoard",
        value: function getCoordinatesRelativeToBoard() {

            var x = this.getElement().offsetLeft + this.getParentElement().offsetLeft;
            var y = this.getElement().offsetTop + this.getParentElement().offsetTop;

            return { x: x, y: y };
        }
    }]);

    return Figure;
}();

exports.default = Figure;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
        value: true
});
/**@author Lukasz Lach*/

var Utility = {

        /**
         * Method which executes provided callback function on every point of bresenham line between points (x1, y1) and (x2, y2).
         * @param {number}      x1 Horizontal(row) coordinate of starting point.
         * @param {number}      y1 Vertical(column) coordinate of starting point.
         * @param {number}      x2 Horizontal(row) coordinate of target point.
         * @param {number}      y2 Vertical(column) coordinate of target point.
         * @param {number}      delay Delay in executing each step of algorithms, in miliseconds.
         * @param {function}    callback Callback function to execute on every point of bresenham line.
         */
        bresenham: function bresenham(x1, y1, x2, y2, delay, callback) {
                var _this = this;

                x1 = Math.floor(x1);
                y1 = Math.floor(y1);
                x2 = Math.floor(x2);
                y2 = Math.floor(y2);

                var deltaX = Math.abs(x2 - x1);
                var deltaY = Math.abs(y2 - y1);

                var sx = x1 < x2 ? 1 : -1;
                var sy = y1 < y2 ? 1 : -1;

                var err = deltaX - deltaY;

                var e2 = 2 * err;

                callback(x1, y1);

                if (x1 === x2 && y1 === y2) {

                        return;
                }

                if (e2 > -deltaY) {

                        err -= deltaY;
                        x1 += sx;
                }

                if (e2 < deltaX) {

                        err += deltaX;
                        y1 += sy;
                }

                window.setTimeout(function () {
                        _this.bresenham(x1, y1, x2, y2, delay, callback);
                }, delay);
        }
};

exports.default = Utility;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author Lukasz Lach
 */

//private variables declaration
var socket = Symbol();
var instance = void 0;

/**
 * Class responsible for managing socket connection from client side.
 * @class
 * @typedef {Object}    SocketClientManager
 */

var SocketClientManager = function () {

    /**
     * @constructor
     */
    function SocketClientManager() {
        _classCallCheck(this, SocketClientManager);

        if (!instance) {

            instance = this;

            this[socket] = undefined;
            this.initialize();
        }

        return instance;
    }

    /**
     * Method responsible for making socket listen to certain event.
     * @param   {string}    event       Event on which socket should listen.
     * @param   {function}  callback    Callback function triggered upon event emition.
     */


    _createClass(SocketClientManager, [{
        key: "listenOnEvent",
        value: function listenOnEvent(event, callback) {

            this.getSocketIo().on(event, callback);
        }

        /**
         * Method responsible for initializing SocketClientManager class. Creates new socket connected to server.
         */

    }, {
        key: "initialize",
        value: function initialize() {

            this[socket] = io();
        }
    }]);

    return SocketClientManager;
}();

module.exports = SocketClientManager;

/***/ })
/******/ ]);