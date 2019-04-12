window.onload = () => {
  const assets = [],
    KEY_CODE_LEFT = 37,
    KEY_CODE_RIGHT = 39,
    KEY_CODE_SPACE = 32;
  let spriteSheet = null;
  let breathing = null;
  let jump = null;
  let arrow = null;
  let stage = null;
  let viking;
  let grounds = [];
  let trees = [];
  let arrows = [];
  let castle;
  let arrowTargets = [];
  let rocks = [];
  let clouds = [];
  let isVikingMoving = false;
  let isVikingDown = false;
  let arrowsDecoration = [];
  let keyPressedLeft = false;
  let keyPressedRight = false;
  let logo, props;
  let metters = 0;
  let gameStarted = false;
  let gameOver = 0;
  let gameRestarted = 0;
  let gameOverImage = null;
  let scoreText = null;
  let bestScoreText = null;
  let gameSpeed = 0;
  let text;
  let progress;

  stage = new createjs.Stage(document.getElementById("canvas"));

  const manifest = {
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

    let circle = new createjs.Shape();
    let text = new createjs.Text(
      `${(progress * 100).toFixed(0)}%`,
      "60px impact",
      "#FFF"
    );
    console.log(text);
    circle.graphics
      .beginFill("#000")
      .drawCircle(0, 0, stage.canvas.height * progress + 15);
    circle.x = stage.canvas.width / 2;
    circle.y = stage.canvas.height / 2;
    text.x = stage.canvas.width / 2 - text.getBounds().width / 2;
    text.y = stage.canvas.height / 2;
    stage.addChild(circle, text);
    stage.update();
    stage.removeAllChildren();
  }

  function handleComplete() {
    for (let i = 0; i < assets.length; i++) {
      let event = assets[i];
      let result = event.result;
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
  }

  // Code from the lesson
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
    setTimeout(() => {
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
        createjs.Tween.get(gameOverImage, { loop: false }).to({ alpha: 0 }, 10);
        createjs.Tween.get(logo, { loop: false })
          .to({ scaleX: 1.1, scaleY: 1.1 }, 600)
          .to({ alpha: 0 }, 600, createjs.Ease.getPowInOut(2));
        createjs.Tween.get(start, { loop: false })
          .to({ alpha: 1 }, 0, createjs.Ease.getPowInOut(2))
          .to({ alpha: 0 }, 600, createjs.Ease.getPowInOut(2));

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

  function colisionDetect(caracter, objects, speedImpact, react = null) {
    if (gameStarted) {
      objects.forEach(object => {
        if (
          caracter.x < object.x + object.getBounds().width &&
          caracter.x > object.x - object.getBounds().width // check colision in the x axis
        ) {
          if (
            caracter.y < object.y + object.getBounds().height &&
            caracter.y > object.y - object.getBounds().height // check colision in the x axis
          ) {
            caracter.x = caracter.x - (speedImpact + gameSpeed);
            gameOver = gameOver === 0 ? 1 : 2; // 0 - false, 1- true, 2- reset

            if (react) {
              createjs.Tween.get(caracter, { loop: false }).to(
                { rotation: -360 },
                600
              );
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
      createjs.Tween.get(gameOverImage, { loop: false })
        .to({ alpha: 1 }, 0)
        .to({ scaleX: 0.8, scaleY: 0.8 }, 0, createjs.Ease.getPowInOut(2))
        .to({ scaleX: 1.2, scaleY: 1.2 }, 150, createjs.Ease.getPowInOut(2))
        .to({ scaleX: 1, scaleY: 1 }, 250, createjs.Ease.getPowInOut(2));
      createjs.Tween.get(start, { loop: false })
        .to({ alpha: 0 }, 1000, createjs.Ease.getPowInOut(2))
        .to({ alpha: 1 }, 700, createjs.Ease.getPowInOut(2));
      gameOver = 2;
      gameRestarted = false;
      saveScore(metters);
      bestScoreText.text = `Best: ${getScore()} m`;
      gameSpeed = 0;
    }
  }

  function moveViking(speed, height) {
    let initialVikingY = 365;
    if (isVikingMoving && gameStarted && !gameOver) {
      viking.y = viking.y - speed;
      if (viking.y < initialVikingY - height) {
        isVikingMoving = false;
      }
    }
    if (
      !isVikingMoving &&
      viking.y < initialVikingY &&
      gameStarted &&
      !gameOver
    ) {
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
    gameSpeed += 0.001;
    //console.log(gameSpeed);
  }

  function onOrientationChange() {
    setTimeout(resizeGame, 100);
  }

  function resizeGame() {
    var nTop, nLeft, scale;

    var gameWrapper = document.getElementById("gameWrapper");

    var w = window.innerWidth;

    var h = window.innerHeight;

    var nWidth = window.innerWidth;

    var nHeight = window.innerHeight;

    var widthToHeight = stage.canvas.width / stage.canvas.height;

    var nWidthToHeight = nWidth / nHeight;

    if (nWidthToHeight > widthToHeight) {
      console.log("Resizing Game - Screen too wide to stretch game");

      nWidth = nHeight * widthToHeight;

      scale = nWidth / stage.canvas.width;

      nLeft = w / 2 - nWidth / 2;

      gameWrapper.style.left = nLeft + "px";

      gameWrapper.style.top = "0px";
    } else {
      console.log("Resizing Game - Game can be stretched full screen width");

      nHeight = nWidth / widthToHeight;

      scale = nHeight / stage.canvas.height;

      nTop = h / 2 - nHeight / 2;

      //gameWrapper.style.top = (nTop) + "px";

      gameWrapper.style.top = "0px";

      gameWrapper.style.left = "0px";
    }

    stage.canvas.setAttribute(
      "style",
      "-webkit-transform:scale(" + scale + ")"
    );

    window.scrollTo(0, 0);
  }

  function optimizeForTouchAndScreens() {
    if (typeof window.orientation !== "undefined") {
      window.onorientationchange = onOrientationChange;
      if (createjs.Touch.isSupported()) {
        console.log("Touch - Enabled");
        createjs.Touch.enable(stage);
      } else {
        console.log("Touch - Not Enabled");
      }
      onOrientationChange();
    } else {
      window.onresize = resizeGame;
      resizeGame();
    }
  }

  function tick(e) {
    //ground.x = (viking.x + e.delta * 0.5) % stage.canvas.width;
    grounds.forEach(ground => {
      moveInCanvas(ground, 6, 100);
    });
    moveInCanvas(castle, 1.5, 600);

    trees.forEach(tree => {
      moveInCanvas(tree, 6, 50);
    });
    arrowTargets.forEach(target => {
      moveInCanvas(target, 4, 950);
    });

    rocks.forEach(rock => {
      moveInCanvas(rock, 6, 250);
    });

    arrows.forEach(arrow => {
      moveInCanvas(arrow, 15, 2000);
    });

    arrowsDecoration.forEach(arrow => {
      moveInCanvas(arrow, 12, 900);
    });

    clouds.forEach(cloud => {
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
      scoreText.text = `Distance: ${metters.toFixed(2)} m`;
    }
  }

  function saveScore(score) {
    if (localStorage.getItem("score")) {
      const lastScore = parseFloat(localStorage.getItem("score"));
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

    stage.on("stagemousemove", () => {
      if (gameStarted && gameOver == 0) viking.x = stage.mouseX;
    });

    stage.on("stagemouseup", () => {
      jumpViking();
    });

    for (let i = 1; i < 30; i++) {
      let cloud = new createjs.Sprite(spriteSheet, "cloud");
      let x = Math.random() * (900 - 100) + 100;
      let y = Math.random() * (200 - 30) + 30;
      cloud.x = i * x;
      cloud.y = y;
      clouds.push(cloud);
      stage.addChild(cloud);
    }

    castle = new createjs.Sprite(spriteSheet, "castle");
    castle.x = 180;
    castle.y = 330;
    stage.addChild(castle);

    for (let i = 1; i < 2; i++) {
      target = new createjs.Sprite(spriteSheet, "arrowtarget");
      target.x = 250 * i;
      target.y = 394;
      arrowTargets.push(target);
      stage.addChild(target);
    }

    for (let i = 0; i < 30; i++) {
      let ground = new createjs.Sprite(spriteSheet, "ground");
      ground.x = i * 180;
      ground.y = 410;
      grounds.push(ground);
      stage.addChild(ground);
    }

    for (let i = 1; i < 5; i++) {
      let tree = new createjs.Sprite(spriteSheet, "tree");
      let y = 218;
      let t = Math.random() * (5 - 1) + 1;
      tree.x = t * 900;
      tree.y = y;
      trees.push(tree);
      stage.addChild(tree);
    }

    viking = new createjs.Sprite(spriteSheet, "viking");
    viking.x = stage.canvas.width / 2;
    viking.y = 365;
    viking.setBounds(viking.regX, viking.regY, 50, 50);
    stage.addChild(viking);

    for (let i = 1; i < 2; i++) {
      let arrow = new createjs.Sprite(spriteSheet, "arrow");
      let y = Math.random() * (312 - 290) + 290;
      let x = Math.random() * (900 - 1) + 1;
      arrow.x = stage.canvas.width + x;
      arrow.y = y;
      arrow.setBounds(viking.regX, viking.regY, 10, 50);
      arrows.push(arrow);
      stage.addChild(arrow);
    }

    for (let i = 1; i < 5; i++) {
      let arrow = new createjs.Sprite(spriteSheet, "arrow");
      let y = Math.random() * (250 - 200) + 200;
      let x = Math.random() * (900 - 1) + 1;
      arrow.x = stage.canvas.width + x;
      arrow.y = y;
      arrow.speed = i * 2;
      arrow.setBounds(arrow.regX, arrow.regY, 2, 5);
      arrowsDecoration.push(arrow);
      stage.addChild(arrow);
    }

    for (let i = 1; i < 3; i++) {
      let rock = new createjs.Sprite(spriteSheet, "rock");
      let y = 400;
      let t = Math.random() * (900 - 0) + 0;
      rock.setBounds(rock.regX, rock.regY, 40, 40);
      rock.x = i * 900 + t;
      rock.y = y;
      rocks.push(rock);
      stage.addChild(rock);
    }

    for (let i = 1; i < 3; i++) {
      let tree = new createjs.Sprite(spriteSheet, "tree");
      let y = Math.random() * (298 - 238) + 218;
      tree.x = i * 900;
      tree.y = y;
      trees.push(tree);
      stage.addChild(tree);
    }

    logo = new createjs.Sprite(spriteSheet, "logo");
    logo.x = stage.canvas.width / 2;
    logo.y = stage.canvas.height / 2 - 90;
    stage.addChild(logo);

    gameOverImage = new createjs.Sprite(spriteSheet, "gameOver");
    gameOverImage.x = stage.canvas.width / 2;
    gameOverImage.y = stage.canvas.height / 2 - 90;
    createjs.Tween.get(gameOverImage, { loop: false }).to({ alpha: 0 }, 0);
    stage.addChild(gameOverImage);

    start = new createjs.Sprite(spriteSheet, "start");
    start.x = stage.canvas.width / 2;
    start.y = stage.canvas.height - 40;
    start.addEventListener("click", handleStart);
    stage.addChild(start);

    // jumpButton = new createjs.Shape();
    // jumpButton.graphics.beginFill("#F00").drawCircle(0, 0, 50);
    // jumpButton.x = stage.canvas.width - 60;
    // jumpButton.y = stage.canvas.height / 2;
    // jumpButton.addEventListener("click", jumpViking);
    // stage.addChild(jumpButton);

    scoreText = new createjs.Text(
      `Distance: ${metters} m`,
      "23px Impact",
      "#fff"
    );
    scoreText.x = 20;
    scoreText.y = stage.canvas.height - 40;
    stage.addChild(scoreText);

    bestScoreText = new createjs.Text(
      `Best: ${getScore()} m`,
      "23px Impact",
      "#fff"
    );
    bestScoreText.x = stage.canvas.width - 150;
    bestScoreText.y = stage.canvas.height - 40;
    stage.addChild(bestScoreText);

    optimizeForTouchAndScreens();
    createjs.Ticker.on("tick", tick);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", stage);
  }
};
