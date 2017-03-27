/***************
 Setting up the structure of the game and variables, CAPS for static variables
 ***************/
/**
 * Initialize the Game and starts it.
 */
var game = new Game();

function init() {
	if(game.init())
		game.start();
}

KEY_CODES = {
  32: 'space',
  38: 'up',
  40: 'down',
}

// Create an object to check true/false. Initialize all values to false
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[ KEY_CODES[ code ]] = false;
}

document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}

document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}

/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a
 * singleton.
 */
 var imageRepository = new function() {
 	// Define images
 	this.background = new Image()
 	this.runner = new Image()
 // 	this.bullet = new Image()

 	// Ensure all images have loaded before starting the game
 	var numImages = 2;
 	var numLoaded = 0;
 	function imageLoaded() {
 		numLoaded++;
 		if (numLoaded === numImages) {
 			window.init()
			console.log("images loaded!")
 		}
 	}
 	this.background.onload = function() {
 		imageLoaded()
 	}
 	this.runner.onload = function() {
 		imageLoaded()
 	}

 	// Set images src
  this.background.src = "assets/images/bg.png";
  this.runner.src= "assets/images/avatar.png"

// adding obstacles for LATER
 // 	this.obstacle.src = "imgs/bullet.png";
 }

/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up default variables
 * that all child objects will inherit, as well as the defualt
 * functions.
 */

function Drawable() {
	this.init = function(x, y, width, height) {
		// Default variables
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}
/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas and creates the illusion of moving by panning the image.
 */




function Background() {
	this.speed = 1; // Redefine speed of the background for panning

	// Implement abstract function
	this.draw = function() {
		// Pan background
		this.x -= this.speed; //reverse this to move left

		this.context.drawImage(imageRepository.background, this.x, this.y);

		// Draw another image at the right edge of the first image
		this.context.drawImage(imageRepository.background, this.x - this.canvasWidth, this.y);

		// If the image scrolled off the screen, reset
		if (this.x <= -(this.canvasWidth))
			this.x = 0;
	};
}
// Set Background to inherit properties from Drawable
Background.prototype = new Drawable();


/**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */

   function Vector(x, y, dx, dy) {
     // position
     this.x = x || 0;
     this.y = y || 0;
     // direction
     this.dx = dx || 0;
     this.dy = dy || 0;
   }

 function runner() {
 // adding properties directly to runner imported object
		this.speed = 3
    this.width = 44
    this.height = 47
    this.gravity = 0.5
    this.dy        = 0;
    this.jumpDy    = -9;
    this.isFalling = false;
    this.isJumping = false;
    // this.sheet     = new SpriteSheet("---.png", this.width, this.height);
    // this.walkAnim  = new Animation(player.sheet, 4, 0, 15);
    // this.anim      = this.walkAnim;
    // Vector.call(this, 0, 0, 0, this.dy);
    this.draw = function() {
 		this.context.drawImage(imageRepository.runner, this.x, this.y);
		console.log(this.y)
 		};
		this.update = function() {
		// jump if not currently jumping or falling
		if (KEY_STATUS.space && this.dy === 0 && !this.isJumping) {
			console.log("up or space pressed")
		  this.isJumping = true;
		  this.dy = this.jumpDy;

		}
		this.y += this.dy;

		// add gravity
		if (this.isFalling || this.isJumping) {
		  this.dy += this.gravity;
		}
		// // change animation if falling
		// if (this.dy > 0) {
		//   this.anim = this.fallAnim;
		// }
		// // change animation is jumping
		// else if (this.dy < 0) {
		//   this.anim = this.jumpAnim;
		// }
		// else {
		//   this.anim = this.walkAnim;
		// }

		// this.anim.update();

		if (this.y >= 93) {
			this.isJumping = false;
			this.isFalling = false;
			this.dy = 0;
		}
		};

		this.clear = function() {
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
		}


 	};

 runner.prototype = new Drawable();

 function Game() {
 	/*
 	 * Gets canvas information and context and sets up all game
 	 * objects.
 	 * Returns true if the canvas is supported and false if it
 	 * is not. This is to stop the animation script from constantly
 	 * running on browsers that do not support the canvas.
 	 */
 	this.init = function() {
 		// Get the canvas elements
 		this.bgCanvas = document.getElementById('background');
 		this.runnerCanvas = document.getElementById('pangolin');
 	// 	this.obsCanvas = document.getElementById('obstacles');
 		// Test to see if canvas is supported. Only need to
 		// check one canvas

 		if (this.bgCanvas.getContext) {
 			this.bgContext = this.bgCanvas.getContext('2d');
 			this.runnerContext = this.runnerCanvas.getContext('2d');

 			// Prototypal Inheritance
 			Background.prototype.context = this.bgContext;
 			Background.prototype.canvasWidth = this.bgCanvas.width;
 			Background.prototype.canvasHeight = this.bgCanvas.height;
 			runner.prototype.context = this.runnerContext;
 			runner.prototype.canvasWidth = this.runnerCanvas.width;
 			runner.prototype.canvasHeight = this.runnerCanvas.height;
 		// 	obstacles.prototype.context = this.obsContext;
      // obstacles.prototype.canvasWidth = this.obsCanvas.width;
 		// 	obstacles.prototype.canvasHeight = this.obsCanvas.height;

 			// Initialize the background object
 			this.background = new Background();
 			this.background.init(0,0); // Set draw point to 0,0
 			// Initialize the runner object
 			this.runner = new runner();
 			this.runner.init(10, 93, imageRepository.runner.width,
 			               imageRepository.runner.height);
 			return true;
 		} else {
 			return false;
 		}
 	};

 	// Start the animation loop
 	this.start = function() {
 		this.runner.draw();
 		animate();
 	};
 }
 /**
  * The animation loop. Calls the requestAnimationFrame shim to
  * optimize the game loop and draws all game objects. This is a global function
  */
 function animate() {
 	requestAnimFrame( animate );
 	game.background.draw();
 	game.runner.update();
	game.runner.clear();
	game.runner.draw();
 }

// A neater way of using a setTimeout function 
 window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();
