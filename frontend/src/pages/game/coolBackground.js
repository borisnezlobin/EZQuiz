import { CircleNotch, Plus } from "@phosphor-icons/react"
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast";
import "../../playground.css";
import { v4 } from "uuid";

const coolBackground = () => {
    var mouseX = 0;
    var mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    setTimeout(start, 500);
    function start() {
        try {   
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
                    obj.vx = Math.cos(0) * speed;
                    obj.vy = Math.sin(0) * speed;
                    obj.speed = speed;
                    return obj;
                },
        
                getSpeed: function() {
                    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                },
        
                setSpeed: function(speed) {
                    this.vx = Math.cos(0) * speed;
                    this.vy = Math.sin(0) * speed;
                },
        
        
                update: function() {
                    var dist = Math.sqrt((this.y - mouseY)*(this.y - mouseY)+(this.x-mouseX)*(this.x-mouseX));
                    if (dist != 0){
                        this.vx -= (this.x - mouseX) * 10 / (dist * dist * dist);
                        this.vy -= (this.y - mouseY) * 10 / (dist * dist * dist);
                    }
                    if (this.vx > 0.15) this.vx = 0.15;
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
                starBaseRadius = 2,
                shootingStarRadius = 3,
                paused = false;
        
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
        } catch (e){
            console.log(e);
        }
    }
    return (
        <canvas id="canvas" width="100%" height="100%" className="absolute -z-1" />
    )
}

export default coolBackground;