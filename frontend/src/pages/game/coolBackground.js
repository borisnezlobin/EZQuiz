import "../../playground.css";
import { v4 } from "uuid";

const CoolBackground = () => {
    var mouseX, mouseY;
    var mass = 10;
    function randomFloat(min, max)
    {
        return Math.random() * (max - min) + min;
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.onload = () => {
        start();
    };

    function start() {
        function lineToAngle(x1, y1, length, radians) {
            var x2 = x1 + length * Math.cos(radians),
                y2 = y1 + length * Math.sin(radians);
            return { x: x2, y: y2 };
        }
    
        function randomRange(min, max) {
            return min + Math.random() * (max - min);
        }
    
        function degreesToRads(degrees) {
            return degrees / 180 * Math.PI;
        }
    
        //Particle
        var particle = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 0,
    
            create: function(x, y, speed, direction) {
                var obj = Object.create(this);
                obj.errorRange = randomFloat(-1,1);
                obj.x = x;
                obj.y = y;
                obj.vx = Math.cos(direction) * speed;
                obj.vy = Math.sin(direction) * speed;
                obj.speed = speed;
                return obj;
            },
    
            getSpeed: function() {
                return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            },
    
            setSpeed: function(speed, direction) {
                this.vx = Math.cos(direction) * speed;
                this.vy = Math.sin(direction) * speed;
                this.basevx = speed*.7;
                this.basevy = speed*.7;
            },
    
            update: function() {
                var dy = (mouseY - this.y);
                var dx = (mouseX - this.x);
                var dist = Math.sqrt(dy*dy+dx*dx);
                if (dist < 50){
                    this.vx += Math.sign(dx)*(50-Math.abs(dx))/900;
                    this.vy += Math.sign(dy)*(50-Math.abs(dy))/900;
                    if (this.vx > .07)
                        this.vx = .07;
                    if (this.vy > .07)
                        this.vy = .07;
                }
                if (dist > 50){
                    if (this.vx > this.basevx)
                        this.vx -= 0.001;
                    if (this.vy > this.basevy)
                        this.vy -= 0.001;
                }
                this.x += this.vx;
                this.y += this.vy;
                
            }
        };
    
        var canvas = document.getElementById("canvas"),
            context = canvas.getContext("2d"),
            width = canvas.width = window.innerWidth,
            height = canvas.height = window.innerHeight,
            stars = [],
            layers = [
                { speed: 0.015, scale: 0.2, count: 320 },
                { speed: 0.03, scale: 0.5, count: 50 },
                { speed: 0.05, scale: 0.75, count: 30 }
            ],
            starBaseRadius = 3;
    
        //Create all stars
        for (var j = 0; j < layers.length; j += 1) {
            var layer = layers[j];
            for (var i = 0; i < layer.count; i += 1) {
                var star = particle.create(randomRange(0, width), randomRange(0, height), 0, 0);
                star.radius = starBaseRadius * layer.scale;
                star.setSpeed(layer.speed);
                stars.push(star);
            }
        }
    
        function update() {
            context.clearRect(0, 0, width, height);
            context.fillStyle = "#FFFFFF";
            context.fillRect(0, 0, width, height);
            context.fill();

            for (var i = 0; i < stars.length; i += 1) {
                var star = stars[i];
                star.update();
                drawStar(star);
                if (star.x > width) {
                    star.x = 0;
                }
                if (star.x < 0) {
                    star.x = width;
                }
                if (star.y > height) {
                    star.y = 0;
                }
                if (star.y < 0) {
                    star.y = height;
                }
            }
            requestAnimationFrame(update);
        }
    
        function drawStar(star) {
            context.fillStyle = "rgb(60, 60, 60)";
            context.beginPath();
            context.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
            context.fill();
        }
    
        //Run
        update();
    }
    return (
        <canvas id="canvas" width="100%" height="100%" className="absolute z-0" />
    )
}

export default CoolBackground;