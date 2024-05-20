const cnv = document.getElementById('cnv');
cnv.width = window.innerWidth;
cnv.height = window.innerHeight;

var c = cnv.getContext("2d");
var mouse = {
	x1: 0,
	y1: 0,
	x2: 0,
	y2: 0
}
var ball = {
	x: 200,
	y: 200,
	dx: 0,
	dy: 0,
	r: 12
}
var wallThick = 30;
var maxSpeed = 55;
var collisionObjs = [
	[150, 500, 1000, wallThick],
	[150, 300, wallThick, 230],
	[150, 300, 800, wallThick],
	[1150, 50, wallThick, 480],
	[150, 50, 1000, wallThick],
	[150, 50, wallThick, 280],
	[400, 50, wallThick, 180],
	[600, 150, wallThick, 150],
	[800, 50, wallThick, 180],
	[500, 400, 450, wallThick]
];
var flag = { x: 230, y: 420, r: 20 }
var slowness = 20;
var deceleration = 0.985;
var mousedown = false;

document.addEventListener("mousedown", e => {
	mouse.x1 = e.x;
	mouse.y1 = e.y;
	mousedown = true;
});
document.addEventListener("mousemove", e => {
	mouse.x2 = e.x;
	mouse.y2 = e.y;
	//console.log(mouse.x1-mouse.x2,mouse.y1-mouse.y2);
});
document.addEventListener("mouseup", e => {
	mouse.x2 = e.x;
	mouse.y2 = e.y;
	mousedown = false;
	if (ball.dx === 0 && ball.dy === 0) {
		ball.dx = (mouse.x1 - mouse.x2) / slowness;
		ball.dy = (mouse.y1 - mouse.y2) / slowness;
		if (ball.dx > maxSpeed) {
			ball.dx = maxSpeed;
		} else if (ball.dx < -maxSpeed) {
			ball.dx = -maxSpeed;
		}
		if (ball.dy > maxSpeed) {
			ball.dy = maxSpeed;
		} else if (ball.dy < -maxSpeed) {
			ball.dy = -maxSpeed;
		}
		console.log("Launching! ", ball.dx, ball.dy)
	}
});

//dont draw ball twice
function draw() {
	c.clearRect(0, 0, cnv.width, cnv.height);

	for (let col of collisionObjs) {
		c.fillStyle = "gray";
		c.fillRect(...col);
		c.fill();
	}

	c.beginPath();
	c.fillStyle = "#DD2F2F";
	c.arc(flag.x, flag.y, flag.r, 0, 2 * Math.PI);
	c.fill();
	c.beginPath();
	c.fillStyle = `rgba(110,110,200,1)`;
	c.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
	c.fill();
	if (mousedown && ball.dx === 0 && ball.dy === 0) {
		c.beginPath();
		c.fillStyle = "#BDBDBD";
		c.arc(ball.x, ball.y, 3, 0, 2 * Math.PI);
		c.arc(ball.x + (mouse.x2 - mouse.x1), ball.y + (mouse.y2 - mouse.y1), 3, 0, 2 * Math.PI);
		c.fill();
		c.beginPath();
		c.lineWidth = 6;
		c.strokeStyle = "#BDBDBD";
		c.moveTo(ball.x, ball.y);
		c.lineTo(ball.x + (mouse.x2 - mouse.x1), ball.y + (mouse.y2 - mouse.y1));
		c.stroke();
	}
	requestAnimationFrame(draw);
}
draw();

function physicsLoop() {
	applyVelocity(ball, ball);
	/*ball.x += ball.dx;
	ball.y += ball.dy;*/

	for (let obj of collisionObjs) {
		var col = circleRectCollision(ball, obj);
	}
	requestAnimationFrame(physicsLoop);
}
physicsLoop();


let prev = false;
setInterval(() => {
	if (Math.pow(ball.x - flag.x, 2) + Math.pow(ball.y - flag.y, 2) <= Math.pow(ball.r + flag.r, 2) && prev) {
		alert("you win");
	} else if (Math.pow(ball.x - flag.x, 2) + Math.pow(ball.y - flag.y, 2) <= Math.pow(ball.r + flag.r, 2)) {
		prev = true;
		return;
	}
	prev = false;
}, 1000)

function launchBall() {
	let dx = (mouse.x1 - mouse.x2) / slowness;
	let dy = (mouse.y1 - mouse.y2) / slowness;
	ball.dx = dx >= 0 ?
		(dx > maxSpeed ? maxSpeed : dx) :
		(dx < -maxSpeed ? -maxSpeed : dx);
	ball.dy = dy >= 0 ?
		(dy > maxSpeed ? maxSpeed : dy) :
		(dy < -maxSpeed ? -maxSpeed : dy);
}

function applyVelocity(circle, vel) {
	// Save the initial position in case of collision
	let initialX = circle.x;
	let initialY = circle.y;

	while (initialX === circle.x && initialY === circle.y && 
		(circle.dy !== 0 || circle.dx !== 0)) {
		// Apply velocity
		circle.x += vel.dx;
		circle.y += vel.dy;

		// Iterate over all rectangles
		for (let rect of collisionObjs) {
			// Check if the circle is colliding with the current rectangle
			if (circleRectCollision(circle, rect)) {
				// Restore the initial position
				circle.x = initialX;
				circle.y = initialY;

				// Move the circle incrementally until it's no longer colliding with this rectangle
				while (circleRectCollision(circle, rect)) {
					circle.x += (vel.x / Math.abs(vel.dx)) * circle.r;
					circle.y += (vel.y / Math.abs(vel.dy)) * circle.r;
				}
			}
		}
	
		circle.dx = circle.dx * deceleration;
		circle.dy = circle.dy * deceleration;
		if (Math.abs(ball.dx * deceleration) < 0.15 && Math.abs(ball.dy * deceleration) < 0.15) {
			ball.dx = 0;
			ball.dy = 0;
		}
	}
}

function circleRectCollision(circle, rect) {
	// Find the closest point on the rectangle to the circle
	let closestX = clamp(circle.x, rect[0], rect[0] + rect[2]);
	let closestY = clamp(circle.y, rect[1], rect[1] + rect[3]);

	// Calculate the distance between the circle's center and this closest point
	let distanceX = circle.x - closestX;
	let distanceY = circle.y - closestY;
	let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

	// Check if the distance is less than the circle's radius
	if (distanceSquared < (circle.r * circle.r)) {
		// Collision detected, resolve it
		let distance = Math.sqrt(distanceSquared);
		let overlap = circle.r - distance;

		console.log(distance)
		console.log(overlap, overlap * (distanceX / distance), overlap * (distanceY / distance))
		// Move the circle out of the rectangle
		if (distance > 0) {
			circle.x += overlap * (distanceX / distance);
			circle.y += overlap * (distanceY / distance);
		}

		// Calculate new velocity if necessary
		let velocityMagnitude = Math.sqrt(circle.dx * circle.dx + circle.dy * circle.dy);
		if (velocityMagnitude > 0) {
			let normalX = distanceX / distance;
			let normalY = distanceY / distance;
			let dotProduct = circle.dx * normalX + circle.dy * normalY;

			// If the circle is moving towards the rectangle, reflect its velocity
			if (dotProduct < 0) {
				circle.dx -= 2 * dotProduct * normalX;
				circle.dy -= 2 * dotProduct * normalY;
			}
		}

		return true;
	}

	return false;
}

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

/*
function circleRectCollision(circle, rect) {
	let nearestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
	let nearestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
	let deltaX = circle.x - Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
	let deltaY = circle.y - Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
	let side = "";
	if (nearestX === rect.x || nearestX === rect.x + rect.w) {
		side += "x";
	}
	if (nearestY === rect.y || nearestY === rect.y + rect.h) {
		side += "y";
	}
	return [((Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) < (Math.pow(circle.r, 2))), side];
}*/
//https://yal.cc/rectangle-circle-intersection-test/
//http://www.migapro.com/circle-and-rotated-rectangle-collision-detection/
//CTF{Th3re_15_n0_fl4g_her3}
//http://www.migapro.com/circle-and-rotated-rectangle-collision-detection/