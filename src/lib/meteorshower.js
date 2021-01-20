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

// stars
function Star(options) {
	this.size = Math.random() * 3;
	this.x = options.x;
	this.y = options.y;
}

//TODO: make the rolling window infinite by teleporting the star to the inverse of the moving vector
Star.prototype.update = function () {
	if (Animate.gyro.limit.x < Animate.width && Animate.gyro.limit.x > 0) {
		this.x -= Animate.mult(Animate.gyro.x, this.size, Animate.width);
	}
	if (Animate.gyro.limit.y < Animate.height && Animate.gyro.limit.y > 0) {
		this.y += Animate.mult(Animate.gyro.y, this.size, Animate.height);
	}
	Animate.bgCtx.fillRect(this.x, this.y, this.size, this.size);
};

function ShootingStar() {
	this.reset();
}

ShootingStar.prototype.reset = function () {
	this.x = Math.random() * Animate.width;
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
		if (this.x < 0 || this.y >= Animate.height) {
			this.reset();
		} else {
			Animate.bgCtx.lineWidth = this.size;
			Animate.bgCtx.beginPath();
			Animate.bgCtx.moveTo(this.x, this.y);
			Animate.bgCtx.lineTo(this.x + this.len, this.y - this.len);
			Animate.bgCtx.stroke();
		}
	} else {
		if (this.waitTime < new Date().getTime()) {
			this.active = true;
		}
	}
};


//TODO: Maybe slowly calibrate the zero point
//TODO: Remove extraRoom
class Animate {
	// Gyroscope Setup
	static gyro = {
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
	static extraRoom = 1000;
	static movement = {
		acc: 6.50,
		mouse: 0.0055
	};
	static entities = [];
	static width = window.innerWidth;
	static height = window.innerHeight;
	static height = Animate.height < 400 ? 400 : Animate.height;
	static bgCtx;

	constructor(target, bgColor, starColor) {
		if (target == null) return;
		Animate.target = target;
		Animate.width = window.innerWidth;
		Animate.height = window.innerHeight;
		Animate.bgColor = bgColor;
		Animate.starColor = starColor;

		if (window.DeviceMotionEvent && !matchMedia('(pointer:fine)').matches) {
			window.addEventListener("devicemotion", function (event) {
				Animate.gyro.x = -(Math.round(event.accelerationIncludingGravity.x * 10) / 100) * Animate.movement.acc;
				Animate.gyro.y = -(Math.round(event.accelerationIncludingGravity.y * 10) / 100) * Animate.movement.acc;

				if (!Animate.gyro.calibrated) {
					Animate.gyro.zero.x = Animate.gyro.x;
					Animate.gyro.zero.y = Animate.gyro.y;
					Animate.gyro.calibrated = true;
				}

				// Calibrating
				Animate.gyro.x = Animate.gyro.x < Animate.gyro.zero.x ? -1 * Math.abs(Animate.gyro.x - Animate.gyro.zero.x) : Math.abs(Animate.gyro.x - Animate.gyro.zero.x);
				Animate.gyro.y = Animate.gyro.y < Animate.gyro.zero.y ? -1 * Math.abs(Animate.gyro.y - Animate.gyro.zero.y) : Math.abs(Animate.gyro.y - Animate.gyro.zero.y);

				// Landscape fix
				if (window.innerWidth > window.innerHeight) {
					var tmp = Animate.gyro.x;
					Animate.gyro.x = Animate.gyro.y;
					Animate.gyro.y = tmp;
				}
			}, false);
		} else {
			window.addEventListener("mousemove", function (event) {
				Animate.gyro.x = (event.clientX - (window.innerWidth / 2)) * Animate.movement.mouse;
				Animate.gyro.y = ((window.innerHeight / 2) - event.clientY) * Animate.movement.mouse;
			});
		}

		Animate.bgCtx = target.getContext("2d");

		Animate.resetCanvas();

		// Second canvas used for the stars
		Animate.bgCtx.fillStyle = Animate.bgColor;
		Animate.bgCtx.fillRect(0, 0, Animate.width, Animate.height);

		// init the stars 
		Animate.initStars();
	}

	static resetCanvas() {
		Animate.width = window.innerWidth;
		Animate.height = window.innerHeight;
		// Extra room for gyroscope
		Animate.target.width = Animate.width;
		Animate.target.height = Animate.height;

		Animate.width += Animate.extraRoom;
		Animate.height += Animate.extraRoom;
		Animate.gyro.limit = {
			x: Animate.width / 2,
			y: Animate.height / 2
		};

		Animate.initStars();
	}

	static initStars() {
		Animate.entities = [];
		for (var i = 0; i < Animate.height + Animate.gyro.limit.y; i++) {
			Animate.entities.push(new Star({
				x: (Math.random() * (Animate.width + Animate.gyro.limit.x)) - Animate.gyro.limit.x,
				y: (Math.random() * (Animate.height + Animate.gyro.limit.y)) - Animate.gyro.limit.y
			}));
		}

		// Add 2 shooting stars that just cycle.
		Animate.entities.push(new ShootingStar());
		Animate.entities.push(new ShootingStar());
		Animate.entities.push(new ShootingStar());
	}

	static mult(val, size, lim) {
		var mult = ((Math.abs(val) * 6 / 8) + 2);
		mult = mult < 6 ? mult : 5.99;
		mult = val * (size / 2) * mult / Math.log10(lim);
		if (mult < 0.08 && mult > -0.08) mult = 0.08 * Math.sign(mult);
		return mult;
	}

	//animate background
	static animate() {
		Animate.bgCtx.fillStyle = Animate.bgColor;
		Animate.bgCtx.fillRect(0, 0, Animate.width, Animate.height);
		Animate.bgCtx.fillStyle = Animate.starColor;
		Animate.bgCtx.strokeStyle = Animate.starColor;

		var entLen = Animate.entities.length;

		//Gyro Limit update
		Animate.gyro.limit.x += Animate.mult(Animate.gyro.x, 2, Animate.width);
		Animate.gyro.limit.y -= Animate.mult(Animate.gyro.y, 2, Animate.height);
		if (Animate.gyro.limit.x > Animate.width) {
			Animate.gyro.limit.x = Animate.width;
		} else if (Animate.gyro.limit.x < 0) {
			Animate.gyro.limit.x = 0;
		}
		if (Animate.gyro.limit.y > Animate.height) {
			Animate.gyro.limit.y = Animate.height;
		} else if (Animate.gyro.limit.y < 0) {
			Animate.gyro.limit.y = 0;
		}

		while (entLen--) {
			Animate.entities[entLen].update();
		}

		requestAnimationFrame(Animate.animate);
	}
}

export default Animate;