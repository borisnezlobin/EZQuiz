import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

const configs = {
    sm: {
        force: 0.4,
        duration: 2200,
        particleCount: 30,
        width: 400,
      },
    md: {
        force: 0.6,
        duration: 2500,
        particleCount: 80,
        width: 1000,
    },
    lg: {
        force: 0.8,
        duration: 3000,
        particleCount: 250,
        width: 1600,
    }
};

const Confetti = ({ size }: { size: "sm" | "md" | "lg" }) => {
    const [exploding, setExploding] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setExploding(false);
        }, configs[size].duration + 1000); // to be safe
    }, []);

    if(exploding){
        return <div className="absolute top-0 left-1/2 pointer-events-none">
            <ConfettiExplosion {...configs[size]} />
        </div>;
    }

    return (<></>);
}

export default Confetti;