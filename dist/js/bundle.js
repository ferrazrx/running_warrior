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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/main.js":
/*!*********************!*\
  !*** ./lib/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

window.onload = function () {
  var assets = [],
      KEY_CODE_LEFT = 37,
      KEY_CODE_RIGHT = 39,
      KEY_CODE_SPACE = 32;
  var spriteSheet = null;
  var breathing = null;
  var jump = null;
  var arrow = null;
  var stage = null;
  var viking;
  var grounds = [];
  var trees = [];
  var arrows = [];
  var castle;
  var arrowTargets = [];
  var rocks = [];
  var clouds = [];
  var isVikingMoving = false;
  var isVikingDown = false;
  var arrowsDecoration = [];
  var keyPressedLeft = false;
  var keyPressedRight = false;
  var logo, props;
  var metters = 0;
  var gameStarted = false;
  var gameOver = 0;
  var gameRestarted = 0;
  var gameOverImage = null;
  var scoreText = null;
  var bestScoreText = null;
  var gameSpeed = 0;
  var text;
  var progress;
  stage = new createjs.Stage(document.getElementById("canvas"));
  var manifest = {
    src: "assets/manifest.json",
    callback: "loadSounds",
    type: "manifest"
  };
  preload = new createjs.LoadQueue(true);
  createjs.Sound.alternateExtensions = ["mp3", "wav"];
  createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]); // need this so it doesn't default to Web Audio

  preload.installPlugin(createjs.Sound);
  preload.on("fileload", handleFileLoad);
  preload.on("complete", handleComplete);
  preload.on("progress", handleProgress);
  preload.loadManifest(manifest, true, "./");

  function handleFileLoad(event) {
    assets.push(event);
  }

  function handleProgress(event) {
    console.log(event.loaded.toFixed(2));
    progress = event.loaded.toFixed(2);
    var circle = new createjs.Shape();
    var text = new createjs.Text("".concat((progress * 100).toFixed(0), "%"), "60px impact", "#FFF");
    console.log(text);
    circle.graphics.beginFill("#000").drawCircle(0, 0, stage.canvas.height * progress + 15);
    circle.x = stage.canvas.width / 2;
    circle.y = stage.canvas.height / 2;
    text.x = stage.canvas.width / 2 - text.getBounds().width / 2;
    text.y = stage.canvas.height / 2;
    stage.addChild(circle, text);
    stage.update();
    stage.removeAllChildren();
  }

  function handleComplete() {
    for (var i = 0; i < assets.length; i++) {
      var event = assets[i];
      var result = event.result;

      switch (event.item.id) {
        case "runner_sheet":
          spriteSheet = result;
          break;

        case "music":
          props = new createjs.PlayPropsConfig().set({
            interrupt: createjs.Sound.INTERRUPT_ANY,
            loop: -1,
            volume: 0.2
          });
          createjs.Sound.play("music", props);
          break;

        case "jump":
          jump = result;
          break;

        case "breathing":
          breathing = result;
          break;
      }
    }

    initScene();
  } // Code from the lesson


  function keyDownHandler(e) {
    switch (e.keyCode) {
      case KEY_CODE_LEFT:
        keyPressedLeft = true;
        break;

      case KEY_CODE_RIGHT:
        keyPressedRight = true;
        break;

      case KEY_CODE_SPACE:
        if (!isVikingDown && gameStarted) {
          jumpViking();
        }

        break;
    }
  }

  function jumpViking() {
    if (gameStarted && gameOver == 0) {
      props = new createjs.PlayPropsConfig().set({
        interrupt: createjs.Sound.INTERRUPT_ANY,
        loop: 0,
        volume: 1
      });
      createjs.Sound.play("jump", props);
      isVikingMoving = true;
    }
  }

  function keyUpHandler(e) {
    switch (e.keyCode) {
      case KEY_CODE_LEFT:
        keyPressedLeft = false;
        break;

      case KEY_CODE_RIGHT:
        keyPressedRight = false;
        break;
    }
  }

  function handleStart() {
    setTimeout(function () {
      if (!gameRestarted) {
        if (!arrow) {
          props = new createjs.PlayPropsConfig().set({
            interrupt: createjs.Sound.INTERRUPT_ANY,
            loop: -1,
            volume: 1
          });
          arrow = createjs.Sound.play("arrow", props);
        } else {
          arrow.setVolume(1);
        }

        console.log("Game Started");
        createjs.Tween.get(gameOverImage, {
          loop: false
        }).to({
          alpha: 0
        }, 10);
        createjs.Tween.get(logo, {
          loop: false
        }).to({
          scaleX: 1.1,
          scaleY: 1.1
        }, 600).to({
          alpha: 0
        }, 600, createjs.Ease.getPowInOut(2));
        createjs.Tween.get(start, {
          loop: false
        }).to({
          alpha: 1
        }, 0, createjs.Ease.getPowInOut(2)).to({
          alpha: 0
        }, 600, createjs.Ease.getPowInOut(2));
        resetGame();
        gameStarted = true;
      }
    }, 200);
  }

  function resetGame() {
    viking.x = stage.canvas.width / 2;
    viking.y = 365;
    gameOver = 0;
    isVikingDown = false;
    metters = 0;
    gameRestarted = true;
    gameSpeed = 0;
  }

  function colisionDetect(caracter, objects, speedImpact) {
    var react = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    if (gameStarted) {
      objects.forEach(function (object) {
        if (caracter.x < object.x + object.getBounds().width && caracter.x > object.x - object.getBounds().width // check colision in the x axis
        ) {
            if (caracter.y < object.y + object.getBounds().height && caracter.y > object.y - object.getBounds().height // check colision in the x axis
            ) {
                caracter.x = caracter.x - (speedImpact + gameSpeed);
                gameOver = gameOver === 0 ? 1 : 2; // 0 - false, 1- true, 2- reset

                if (react) {
                  createjs.Tween.get(caracter, {
                    loop: false
                  }).to({
                    rotation: -360
                  }, 600);
                }
              }
          }
      });
    }
  }

  function handleGameOver() {
    if (gameOver === 1) {
      props = new createjs.PlayPropsConfig().set({
        interrupt: createjs.Sound.INTERRUPT_ANY,
        loop: 0,
        volume: 1
      });
      createjs.Sound.play("gameOver", props);
      createjs.Sound.play("gameOverSong", props);
      arrow.setVolume(0);
      createjs.Tween.get(gameOverImage, {
        loop: false
      }).to({
        alpha: 1
      }, 0).to({
        scaleX: 0.8,
        scaleY: 0.8
      }, 0, createjs.Ease.getPowInOut(2)).to({
        scaleX: 1.2,
        scaleY: 1.2
      }, 150, createjs.Ease.getPowInOut(2)).to({
        scaleX: 1,
        scaleY: 1
      }, 250, createjs.Ease.getPowInOut(2));
      createjs.Tween.get(start, {
        loop: false
      }).to({
        alpha: 0
      }, 1000, createjs.Ease.getPowInOut(2)).to({
        alpha: 1
      }, 700, createjs.Ease.getPowInOut(2));
      gameOver = 2;
      gameRestarted = false;
      saveScore(metters);
      bestScoreText.text = "Best: ".concat(getScore(), " m");
      gameSpeed = 0;
    }
  }

  function moveViking(speed, height) {
    var initialVikingY = 365;

    if (isVikingMoving && gameStarted && !gameOver) {
      viking.y = viking.y - speed;

      if (viking.y < initialVikingY - height) {
        isVikingMoving = false;
      }
    }

    if (!isVikingMoving && viking.y < initialVikingY && gameStarted && !gameOver) {
      viking.y = viking.y + speed;
      isVikingDown = true;

      if (viking.y == initialVikingY) {
        props = new createjs.PlayPropsConfig().set({
          interrupt: createjs.Sound.INTERRUPT_ANY,
          loop: 0,
          volume: 0.5
        });
        createjs.Sound.play("land", props);
        isVikingDown = false;
      }
    }

    if (keyPressedLeft && gameStarted && !gameOver) {
      // Move vicking x
      viking.x = viking.x - 5;

      if (viking.x < 0) {
        viking.x = 0;
      }
    }

    if (keyPressedRight && gameStarted && !gameOver) {
      viking.x = viking.x + 5;

      if (viking.x > stage.canvas.width) {
        viking.x = stage.canvas.width;
      }
    }
  }

  function moveInCanvas(item, speed, distance) {
    if (item.speed) {
      item.x -= item.speed + gameSpeed;
    }

    item.x -= speed + gameSpeed;

    if (item.x + distance < 0) {
      item.x = stage.canvas.width + distance;
    }
  }

  function increaseSpeed() {
    gameSpeed += 0.001; //console.log(gameSpeed);
  }

  function tick(e) {
    //ground.x = (viking.x + e.delta * 0.5) % stage.canvas.width;
    grounds.forEach(function (ground) {
      moveInCanvas(ground, 6, 100);
    });
    moveInCanvas(castle, 1.5, 600);
    trees.forEach(function (tree) {
      moveInCanvas(tree, 6, 50);
    });
    arrowTargets.forEach(function (target) {
      moveInCanvas(target, 4, 950);
    });
    rocks.forEach(function (rock) {
      moveInCanvas(rock, 6, 250);
    });
    arrows.forEach(function (arrow) {
      moveInCanvas(arrow, 15, 2000);
    });
    arrowsDecoration.forEach(function (arrow) {
      moveInCanvas(arrow, 12, 900);
    });
    clouds.forEach(function (cloud) {
      moveInCanvas(cloud, 0.9, 900);
    });
    moveViking(4.3, 75);
    colisionDetect(viking, rocks, 6, true);
    colisionDetect(viking, arrows, 17, true);
    score();
    handleGameOver();
    increaseSpeed();
  }

  function score() {
    if (gameStarted && !gameOver) {
      metters += 0.1;
      scoreText.text = "Distance: ".concat(metters.toFixed(2), " m");
    }
  }

  function saveScore(score) {
    if (localStorage.getItem("score")) {
      var lastScore = parseFloat(localStorage.getItem("score"));

      if (lastScore < score) {
        localStorage.setItem("score", score);
      }
    } else {
      localStorage.setItem("score", score);
    }
  }

  function getScore(score) {
    if (localStorage.getItem("score")) {
      return parseFloat(localStorage.getItem("score")).toFixed(2);
    }

    return 0;
  }

  function initScene() {
    window.onkeyup = keyUpHandler;
    window.onkeydown = keyDownHandler;
    window.onclick = jumpViking;
    stage.on("stagemousemove", function () {
      if (gameStarted && gameOver == 0) viking.x = stage.mouseX;
    });

    for (var i = 1; i < 30; i++) {
      var cloud = new createjs.Sprite(spriteSheet, "cloud");
      var x = Math.random() * (900 - 100) + 100;
      var y = Math.random() * (200 - 30) + 30;
      cloud.x = i * x;
      cloud.y = y;
      clouds.push(cloud);
      stage.addChild(cloud);
    }

    castle = new createjs.Sprite(spriteSheet, "castle");
    castle.x = 180;
    castle.y = 330;
    stage.addChild(castle);

    for (var _i = 1; _i < 2; _i++) {
      target = new createjs.Sprite(spriteSheet, "arrowtarget");
      target.x = 250 * _i;
      target.y = 394;
      arrowTargets.push(target);
      stage.addChild(target);
    }

    for (var _i2 = 0; _i2 < 30; _i2++) {
      var ground = new createjs.Sprite(spriteSheet, "ground");
      ground.x = _i2 * 180;
      ground.y = 410;
      grounds.push(ground);
      stage.addChild(ground);
    }

    for (var _i3 = 1; _i3 < 5; _i3++) {
      var tree = new createjs.Sprite(spriteSheet, "tree");
      var _y = 218;
      var t = Math.random() * (5 - 1) + 1;
      tree.x = t * 900;
      tree.y = _y;
      trees.push(tree);
      stage.addChild(tree);
    }

    viking = new createjs.Sprite(spriteSheet, "viking");
    viking.x = stage.canvas.width / 2;
    viking.y = 365;
    viking.setBounds(viking.regX, viking.regY, 50, 50);
    stage.addChild(viking);

    for (var _i4 = 1; _i4 < 2; _i4++) {
      var _arrow = new createjs.Sprite(spriteSheet, "arrow");

      var _y2 = Math.random() * (312 - 290) + 290;

      var _x = Math.random() * (900 - 1) + 1;

      _arrow.x = stage.canvas.width + _x;
      _arrow.y = _y2;

      _arrow.setBounds(viking.regX, viking.regY, 10, 50);

      arrows.push(_arrow);
      stage.addChild(_arrow);
    }

    for (var _i5 = 1; _i5 < 5; _i5++) {
      var _arrow2 = new createjs.Sprite(spriteSheet, "arrow");

      var _y3 = Math.random() * (250 - 200) + 200;

      var _x2 = Math.random() * (900 - 1) + 1;

      _arrow2.x = stage.canvas.width + _x2;
      _arrow2.y = _y3;
      _arrow2.speed = _i5 * 2;

      _arrow2.setBounds(_arrow2.regX, _arrow2.regY, 2, 5);

      arrowsDecoration.push(_arrow2);
      stage.addChild(_arrow2);
    }

    for (var _i6 = 1; _i6 < 3; _i6++) {
      var rock = new createjs.Sprite(spriteSheet, "rock");
      var _y4 = 400;

      var _t = Math.random() * (900 - 0) + 0;

      rock.setBounds(rock.regX, rock.regY, 40, 40);
      rock.x = _i6 * 900 + _t;
      rock.y = _y4;
      rocks.push(rock);
      stage.addChild(rock);
    }

    for (var _i7 = 1; _i7 < 3; _i7++) {
      var _tree = new createjs.Sprite(spriteSheet, "tree");

      var _y5 = Math.random() * (298 - 238) + 218;

      _tree.x = _i7 * 900;
      _tree.y = _y5;
      trees.push(_tree);
      stage.addChild(_tree);
    }

    logo = new createjs.Sprite(spriteSheet, "logo");
    logo.x = stage.canvas.width / 2;
    logo.y = stage.canvas.height / 2 - 90;
    stage.addChild(logo);
    gameOverImage = new createjs.Sprite(spriteSheet, "gameOver");
    gameOverImage.x = stage.canvas.width / 2;
    gameOverImage.y = stage.canvas.height / 2 - 90;
    createjs.Tween.get(gameOverImage, {
      loop: false
    }).to({
      alpha: 0
    }, 0);
    stage.addChild(gameOverImage);
    start = new createjs.Sprite(spriteSheet, "start");
    start.x = stage.canvas.width / 2;
    start.y = stage.canvas.height - 40;
    start.addEventListener("click", handleStart);
    stage.addChild(start);
    scoreText = new createjs.Text("Distance: ".concat(metters, " m"), "23px Impact", "#fff");
    scoreText.x = 20;
    scoreText.y = stage.canvas.height - 40;
    stage.addChild(scoreText);
    bestScoreText = new createjs.Text("Best: ".concat(getScore(), " m"), "23px Impact", "#fff");
    bestScoreText.x = stage.canvas.width - 150;
    bestScoreText.y = stage.canvas.height - 40;
    stage.addChild(bestScoreText);
    createjs.Ticker.on("tick", tick);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", stage);
  }
};

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map