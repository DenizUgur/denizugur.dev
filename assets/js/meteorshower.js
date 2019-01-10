// Credits to: https://codepen.io/loktar00/pen/Jdwug
// Motion support by Deniz Uğur
(function () {
	var requestAnimationFrame =
		window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	window.requestAnimationFrame = requestAnimationFrame;
})();

// Gyroscope Setup
var gyro = {
	x: 0,
	y: 0,
	zero: {
		x: 0,
		y: 0
	},
	limit: {
		x: 0,
		y: 0
	},
	calibrated: false
};
var extraRoom = 1000;
var movement = {
	acc: 6.50,
	mouse: 0.0055
};
if (window.DeviceMotionEvent && !matchMedia('(pointer:fine)').matches) {
	window.addEventListener("devicemotion", function (event) {
		gyro.x = -(Math.round(event.accelerationIncludingGravity.x * 10) / 100) * movement.acc;
		gyro.y = -(Math.round(event.accelerationIncludingGravity.y * 10) / 100) * movement.acc;

		if (!gyro.calibrated) {
			gyro.zero.x = gyro.x;
			gyro.zero.y = gyro.y;
			gyro.calibrated = true;
		}

		// Calibrating
		gyro.x = gyro.x < gyro.zero.x ? -1 * Math.abs(gyro.x - gyro.zero.x) : Math.abs(gyro.x - gyro.zero.x);
		gyro.y = gyro.y < gyro.zero.y ? -1 * Math.abs(gyro.y - gyro.zero.y) : Math.abs(gyro.y - gyro.zero.y);

		// Landscape fix
		if (window.innerWidth > window.innerHeight) {
			var tmp = gyro.x;
			gyro.x = gyro.y;
			gyro.y = tmp;
		}
	}, false);
} else {
	window.addEventListener("mousemove", function (event) {
		gyro.x = (event.clientX - (window.innerWidth / 2)) * movement.mouse;
		gyro.y = ((window.innerHeight / 2) - event.clientY) * movement.mouse;
	});
}

$("body").on("click", function () {
	gyro.calibrated = false;
});

// Terrain stuff.
var background = document.getElementById("bgCanvas"),
	bgCtx = background.getContext("2d"),
	width = window.innerWidth,
	height = document.body.offsetHeight;
height < 400 ? (height = 400) : height;

// Extra room for gyroscope
width += extraRoom;
height += extraRoom;
gyro.limit = {
	x: width / 2,
	y: height / 2
};
background.width = width;
background.height = height;

// Second canvas used for the stars
bgCtx.fillStyle = "#1d195d";
bgCtx.fillRect(0, 0, width, height);

// stars
function Star(options) {
	this.size = Math.random() * 2;
	this.x = options.x;
	this.y = options.y;
}

Star.prototype.update = function () {
	if (gyro.limit.x < width && gyro.limit.x > 0) {
		this.x -= mult(gyro.x, this.size, width);
	}
	if (gyro.limit.y < height && gyro.limit.y > 0) {
		this.y += mult(gyro.y, this.size, height);
	}
	bgCtx.fillRect(this.x, this.y, this.size, this.size);
};

function ShootingStar() {
	this.reset();
}

ShootingStar.prototype.reset = function () {
	this.x = Math.random() * width;
	this.y = 0;
	this.len = Math.random() * 80 + 10;
	this.speed = Math.random() * 10 + 6;
	this.size = Math.random() * 1 + 0.1;
	// this is used so the shooting stars arent constant
	this.waitTime = new Date().getTime() + Math.random() * 3000 + 500;
	this.active = false;
};

ShootingStar.prototype.update = function () {
	if (this.active) {
		this.x -= this.speed;
		this.y += this.speed;
		if (this.x < 0 || this.y >= height) {
			this.reset();
		} else {
			bgCtx.lineWidth = this.size;
			bgCtx.beginPath();
			bgCtx.moveTo(this.x, this.y);
			bgCtx.lineTo(this.x + this.len, this.y - this.len);
			bgCtx.stroke();
		}
	} else {
		if (this.waitTime < new Date().getTime()) {
			this.active = true;
		}
	}
};

// Helper functions
function mult(val, size, lim) {
	var mult = ((Math.abs(val) * 6 / 8) + 2);
	mult = mult < 6 ? mult : 5.99;
	mult = val * (size / 2) * mult / Math.log10(lim);
	if (mult < 0.08 && mult > -0.08) mult = 0.08 * Math.sign(mult);
	return mult;
}

var entities = [];

// init the stars
for (var i = 0; i < height + gyro.limit.y; i++) {
	entities.push(new Star({
		x: (Math.random() * (width + gyro.limit.x)) - gyro.limit.x,
		y: (Math.random() * (height + gyro.limit.y)) - gyro.limit.y
	}));
}

// Add 2 shooting stars that just cycle.
entities.push(new ShootingStar());
entities.push(new ShootingStar());
entities.push(new ShootingStar());

//animate background
function animate() {
	bgCtx.fillStyle = "#05004c";
	bgCtx.fillRect(0, 0, width, height);
	bgCtx.fillStyle = "#ffffff";
	bgCtx.strokeStyle = "#ffffff";

	var entLen = entities.length;

	//Gyro Limit update
	gyro.limit.x += mult(gyro.x, 2, width);
	gyro.limit.y -= mult(gyro.y, 2, height);
	if (gyro.limit.x > width) {
		gyro.limit.x = width;
	} else if (gyro.limit.x < 0) {
		gyro.limit.x = 0;
	}
	if (gyro.limit.y > height) {
		gyro.limit.y = height;
	} else if (gyro.limit.y < 0) {
		gyro.limit.y = 0;
	}

	// Debug
	/*$("#header").html(
		"gyro.x: " + gyro.x.toFixed(2) + " gyro.y: " + gyro.y.toFixed(2) + "<br>gyro.zero.x: " + gyro.zero.x.toFixed(2) + " gyro.zero.y: " + gyro.zero.y.toFixed(2) + "<br>gyro.limit.x: " + gyro.limit.x.toFixed(2) + " gyro.limit.y: " + gyro.limit.y.toFixed(2) + "<br> mouse: " + matchMedia('(pointer:fine)').matches);*/


	while (entLen--) {
		entities[entLen].update();
	}

	requestAnimationFrame(animate);
}
animate();