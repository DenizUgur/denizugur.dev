// Credits to: https://codepen.io/loktar00/pen/Jdwug
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
var gyro = {x: 0, y: 0, z: 0, limit: 0};
var extraRoom = 1500;
if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", function(event) {
        gyro.x = event.accelerationIncludingGravity.x;
        gyro.y = event.accelerationIncludingGravity.y;
        gyro.z = event.accelerationIncludingGravity.z;
    }, false);
} else {
    console.log("DeviceMotionEvent is not supported");
}

// Terrain stuff.
var background = document.getElementById("bgCanvas"),
    bgCtx = background.getContext("2d"),
    width = window.innerWidth,
    height = document.body.offsetHeight;
height < 400 ? (height = 400) : height;

// Extra room for gyroscope
width += extraRoom;
background.width = width;
background.height = height;

// Some random points
var points = [],
    displacement = 140,
    power = Math.pow(2, Math.ceil(Math.log(width) / Math.log(2)));

// set the start height and end height for the terrain
points[0] = height - Math.random() * height / 2 - displacement;
points[power] = height - Math.random() * height / 2 - displacement;

// create the rest of the points
for (var i = 1; i < power; i *= 2) {
    for (var j = power / i / 2; j < power; j += power / i) {
        points[j] =
            (points[j - power / i / 2] + points[j + power / i / 2]) / 2 +
            Math.floor(Math.random() * -displacement + displacement);
    }
    displacement *= 0.6;
}

// Second canvas used for the stars
bgCtx.fillStyle = "#1d195d";
bgCtx.fillRect(0, 0, width, height);

// stars
function Star(options) {
    this.size = Math.random() * 2;
    this.speed = Math.random() * 0.1;
    this.x = options.x;
    this.y = options.y;
}

Star.prototype.reset = function () {
    this.size = Math.random() * 2;
    this.speed = Math.random() * 0.1;
    this.x = width;
    this.y = Math.random() * height;
};

Star.prototype.update = function () {
    if (gyro.limit < width - 100 && gyro.limit > 100) {
        mult = ((Math.abs(gyro.x) * 6 / 8) + 2);
        mult = mult < 6 ? mult : 5.99;
        mult = gyro.x * (this.size / 2) * mult / Math.log10(width);
        if (mult < 0.08 && mult > -0.08) mult = 0.08;
        this.x -= mult;
    }
    if (this.x >= 0) {
        bgCtx.fillRect(this.x, this.y, this.size, this.size);
    }
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

var entities = [];

// init the stars
for (var i = 0; i < height; i++) {
    entities.push(
        new Star({
            x: (Math.random() * width) - 100,
            y: Math.random() * height
        })
    );
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
    gyro.limit += gyro.x;
    if (gyro.limit > width - 100) {
        gyro.limit = width - 100;
    } else if (gyro.limit < 100) {
        gyro.limit = 100;
    }

    while (entLen--) {
        entities[entLen].update();
    }

    requestAnimationFrame(animate);
}
animate();