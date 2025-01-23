import "./WeddingInvite.css";
import { Fragment, useEffect, useRef } from "react";
import { Section1 } from "./Section1";
import { Section2 } from "./Section2";
import { Section3 } from "./Section3";
import { Section4 } from "./Section4";
import { SectionInvitado } from "./SectionInvitado";
import { Section5 } from "./Section5";

const WeddingInvite = () => {
    const audio = useRef(null);

    useEffect(() => {
        setInterval(async () => {
            try {
                await audio?.current.play()
            } catch(err) {
                // do nothing
            }
        }, 500);
    });

    return <Fragment>
        <Section1 />
        <SectionInvitado />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
        <video ref={audio} autoPlay name="media">
            <source src="./assets/audio/audio.mp3" type="audio/mpeg" />
        </video>
    </Fragment>
}

export { WeddingInvite };
