import { CircleNotch, Plus } from "@phosphor-icons/react"
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"
import { RoomContext, UserContext } from "../context";
import toast from "react-hot-toast";
import { v4 } from "uuid";
import "../App.css"
import logo from './images/image.png'; // with import


const HomePage = () => {
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);
    const { setRoom } = useContext(RoomContext);
    const nav = useNavigate();

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    var objects = [];
    class Object {
        constructor() {
          this.newObj = document.createElement("img");
          this.newObj.style.left = String(Math.random() * window.innerWidth) + "px";
          this.newObj.style.top = "-70px";
          this.yVel = getRandomInt(2, 4);
          this.xVel = Math.sign(getRandomInt(-10, 10)) * ((getRandomInt(1, 2) - 3.0) / 2.0);
          this.rVel = getRandomInt(-3, 3);
          this.currentRotation = 0;
          this.opacity = "100%";
        }
        move() {
          this.newObj.style.left = String(parseInt(this.newObj.style.left) + this.xVel) + "px";
          this.newObj.style.top = String(parseInt(this.newObj.style.top) + this.yVel) + "px";
          this.currentRotation += this.rVel;
          this.newObj.style.transform = 'rotate(' + String(this.currentRotation) + 'deg)';
        }
        createDiv() {
            try {
                this.newObj.src = "./images/logo.jpeg";
                const maxSize = 40;
                const minSize = 40;
                var wh = String(getRandomInt(minSize, maxSize) * 10 + 5) + "px";
                this.wh = wh;
                this.newObj.style.width = wh;
                this.newObj.style.height = wh;
                this.newObj.style.opacity = String(getRandomInt(50, 70)) + "%";
                document.body.appendChild(this.newObj);
            } catch (e){
                console.log(e);
            }
        }
      }
    function createObj() {
        objects.push(new Object());
        objects[objects.length - 1].createDiv();
    }
    setInterval(move, 10);

    function move() {
        for (let i = 0; i < objects.length; i++) {
            if (parseInt(objects[i].newObj.style.top) > window.innerHeight) {
                const elem = objects[i].newObj;
                elem.remove();
                objects.splice(i, 1);
            } else {
                objects[i].move();
            }
        }
    }
      setInterval(createObj, 25);

    return (
        <>
            <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center ban">
                <div class="justify-center items-center ezquiz">
                    <h1 id="text">EZQuiz</h1>
                    <img src={logo} className="w-48 h-48 object-contain"/>
                </div>
            </div>
            <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center main">
                <h1 className="">EZQuiz</h1>
                <p className="mb-24 text-center">Create a game, play with your friends, and answer questions...<br />there are no answer options to save you now!</p>
                <div className="flex flex-row justify-center items-center gap-2">
                    <button disabled={loading} onClick={() => nav("/join")}>
                        Join Game
                    </button>

                    <button disabled={loading} onClick={() => {
                        setLoading(true);
                        fetch("http://localhost:9000/create-room", {
                            body: JSON.stringify({
                                ownerId: v4(),
                            }),
                            method: "POST",
                            headers: { "Content-Type": "application/json" }
                        })
                        .then(res => res.json())
                        .then(res => {
                            if(res.error){
                                toast.error("Failed to create room :(");
                                setLoading(false);
                                return;
                            }
                            
                            setUser(res.player);
                            setRoom(res.room);
                            nav("/game");
                        });
                    }}>
                        Create Game
                        {loading ? <CircleNotch className="animate-spin" /> : <Plus />}
                    </button>
                </div>
            </div>
        </>
    )
}

export default HomePage;