import "../playground.css";

const Playground = () => {
    var mouseX, mouseY;
    var mass = 10;
    function randomFloat(min, max)
    {
        return Math.random() * (max - min) + min;
    }

    var mouseDown = true;
    var realDown = false;
    document.body.onmousedown = function() { 
        mass += 10;
        console.log(mass);
        realDown = true;
      }

    document.body.onmouseup = function() {
        realDown = false;
        mass = 10;
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function addMass(){
        if (realDown){
            mass+=1
            console.log(mass);
        }
    }

    
    // function start() {
    //     function lineToAngle(x1, y1, length, radians) {
    //         var x2 = x1 + length * Math.cos(radians),
    //             y2 = y1 + length * Math.sin(radians);
    //         return { x: x2, y: y2 };
    //     }
    //     addMass();
    //     function randomRange(min, max) {
    //         return min + Math.random() * (max - min);
    //     }
    
    //     function degreesToRads(degrees) {
    //         return degrees / 180 * Math.PI;
    //     }
    
    //     //Particle
    //     var particle = {
    //         x: 0,
    //         y: 0,
    //         vx: 0,
    //         vy: 0,
    //         radius: 0,
    
    //         create: function(x, y, speed, direction) {
    //             var obj = Object.create(this);
    //             obj.errorRange = randomFloat(-1,1);
    //             obj.x = x;
    //             obj.y = y;
    //             obj.vx = Math.cos(direction) * speed;
    //             obj.vy = Math.sin(direction) * speed;
    //             obj.speed = speed;
    //             return obj;
    //         },
    
    //         getSpeed: function() {
    //             return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    //         },
    
    //         setSpeed: function(speed) {
    //             var heading = this.getHeading();
    //         this.vx = Math.cos(heading) * speed;
    //         this.vy = Math.sin(heading) * speed;
    //         },
    
    //         getHeading: function() {
    //             return Math.atan2(this.vy, this.vx);
    //         },
    
    //         setHeading: function(heading) {
    //             // var speed = this.getSpeed();
    //             var speed = randomFloat(0.2,0.7);
    //             this.vx = Math.cos(heading) * speed;
    //             this.vy = Math.sin(heading) * speed;
    //         },
    
    //         update: function() {
    //             var dy = (this.y - mouseY);
    //             var dx = (this.x - mouseX);
    //             var dist = Math.sqrt(dy*dy+dx*dx);
    //             var speed = randomFloat(0.2,0.7);
    //             if (dist != 0 && mouseDown) {
    //                 if (dy != 0 && dx != 0 && Math.cos(dy/dx) != NaN){
    //                     this.vx += Math.cos(Math.atan(dy/dx)) * mass/(dist*dist);
    //                     this.vy += Math.sin(Math.atan(dy/dx)) * mass/(dist*dist);
    //                     // this.vy += Math.sin(Math.atan(dy/dx)-this.errorRange) * speed;
    //                 }
    //             } 
    //             this.x += this.vx;
    //             this.y += this.vy;
    //             console.log("moving");
    //         }
    //     };
    function start() {

        //Helpers
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
                obj.x = x;
                obj.y = y;
                obj.vx = Math.cos(direction) * speed;
                obj.vy = Math.sin(direction) * speed;
                return obj;
            },
    
            getSpeed: function() {
                return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            },
    
            setSpeed: function(speed) {
                var heading = this.getHeading();
                this.vx = Math.cos(heading) * speed;
                this.vy = Math.sin(heading) * speed;
            },
    
            getHeading: function() {
                return Math.atan2(this.vy, this.vx);
            },
    
            setHeading: function(heading) {
                var speed = this.getSpeed();
                this.vx = Math.cos(heading) * speed;
                this.vy = Math.sin(heading) * speed;
            },
    
            update: function() {
                this.x += this.vx;
                this.y += this.vy;
            }
        };
    
        var canvas = document.getElementById("canvas"),
            context = canvas.getContext("2d"),
            width = canvas.width = window.innerWidth,
            height = canvas.height = window.innerHeight,
            stars = [],
            shootingStars = [],
            layers = [
                { speed: 0.015, scale: 0.2, count: 320 },
                { speed: 0.03, scale: 0.5, count: 50 },
                { speed: 0.05, scale: 0.75, count: 30 }
            ],
            starsAngle = 145,
            shootingStarSpeed = {
                min: 15,
                max: 20
            },
            shootingStarOpacityDelta = 0.01,
            trailLengthDelta = 0.01,
            shootingStarEmittingInterval = 2000,
            shootingStarLifeTime = 500,
            maxTrailLength = 300,
            starBaseRadius = 3,
            shootingStarRadius = 3,
            paused = false;
    
        //Create all stars
        for (var j = 0; j < layers.length; j += 1) {
            var layer = layers[j];
            for (var i = 0; i < layer.count; i += 1) {
                var star = particle.create(randomRange(0, width), randomRange(0, height), 0, 0);
                star.radius = starBaseRadius * layer.scale;
                star.setSpeed(layer.speed);
                star.setHeading(degreesToRads(starsAngle));
                stars.push(star);
            }
        }
    
        function createShootingStar() {
            var shootingStar = particle.create(randomRange(width / 2, width), randomRange(0, height / 2), 0, 0);
            shootingStar.setSpeed(randomRange(shootingStarSpeed.min, shootingStarSpeed.max));
            shootingStar.setHeading(degreesToRads(starsAngle));
            shootingStar.radius = shootingStarRadius;
            shootingStar.opacity = 0;
            shootingStar.trailLengthDelta = 0;
            shootingStar.isSpawning = true;
            shootingStar.isDying = false;
            shootingStars.push(shootingStar);
        }
    
        function killShootingStar(shootingStar) {
            setTimeout(function() {
                shootingStar.isDying = true;
            }, shootingStarLifeTime);
        }
    
        function update() {
            if (!paused) {
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
    
                for (i = 0; i < shootingStars.length; i += 1) {
                    var shootingStar = shootingStars[i];
                    if (shootingStar.isSpawning) {
                        shootingStar.opacity += shootingStarOpacityDelta;
                        if (shootingStar.opacity >= 1.0) {
                            shootingStar.isSpawning = false;
                            killShootingStar(shootingStar);
                        }
                    }
                    if (shootingStar.isDying) {
                        shootingStar.opacity -= shootingStarOpacityDelta;
                        if (shootingStar.opacity <= 0.0) {
                            shootingStar.isDying = false;
                            shootingStar.isDead = true;
                        }
                    }
                    shootingStar.trailLengthDelta += trailLengthDelta;
    
                    shootingStar.update();
                    if (shootingStar.opacity > 0.0) {
                        drawShootingStar(shootingStar);
                    }
                }
    
                //Delete dead shooting shootingStars
                for (i = shootingStars.length -1; i >= 0 ; i--){
                    if (shootingStars[i].isDead){
                        shootingStars.splice(i, 1);
                    }
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
    
        function drawShootingStar(p) {
            var x = p.x,
                y = p.y,
                currentTrailLength = (maxTrailLength * p.trailLengthDelta),
                pos = lineToAngle(x, y, -currentTrailLength, p.getHeading());
    
            context.fillStyle = "rgba(255, 255, 255, " + p.opacity + ")";
            // context.beginPath();
            // context.arc(x, y, p.radius, 0, Math.PI * 2, false);
            // context.fill();
            var starLength = 5;
            context.beginPath();
            context.moveTo(x - 1, y + 1);
    
            context.lineTo(x, y + starLength);
            context.lineTo(x + 1, y + 1);
    
            context.lineTo(x + starLength, y);
            context.lineTo(x + 1, y - 1);
    
            context.lineTo(x, y + 1);
            context.lineTo(x, y - starLength);
    
            context.lineTo(x - 1, y - 1);
            context.lineTo(x - starLength, y);
    
            context.lineTo(x - 1, y + 1);
            context.lineTo(x - starLength, y);
    
            context.closePath();
            context.fill();
    
            //trail
            context.fillStyle = "rgba(100, 100, 100, " + (p.opacity-0.1) + ")";
            context.beginPath();
            context.moveTo(x - 1, y - 1);
            context.lineTo(pos.x, pos.y);
            context.lineTo(x + 1, y + 1);
            context.closePath();
            context.fill();
        }
    
        //Run
        update();
    
        //Shooting stars
        setInterval(function() {
            if (paused) return;
            createShootingStar();
        }, shootingStarEmittingInterval);
    
    }
    return (
        // <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center z-10">
            
        <canvas id="canvas" width="100%" height="100%" className="absolute z-0 min-h-screen min-w-screen"/>
            /* <div style = {{position:"absolute", zIndex:"69420", textAlign: "center"}}>
                <h1 className="">Leaderboards</h1>
                <p className="mb-24 text-center">Create a game, play with your friends, and answer questions...<br />there are no answer options to save you now!</p>
                <div className="flex flex-row justify-center items-center gap-2">
                    <button type="button" className="hover:rotate-4 transition-all duration-100 active:skew-y-[7deg] startBtn bg-blue-700">
                        Enter Game
                    </button>

                    <button type="button"  className="hover:rotate-4 transition-all duration-1000 active:skew-x-[20deg] active:skew-y-[20deg]  startBtn bg-blue-700">
                        second enter
                    </button>
                </div>
            </div> */
        // </div>
    )
}

export default Playground;