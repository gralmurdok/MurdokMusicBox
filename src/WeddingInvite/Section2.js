import "./Section2.css"
import { Fragment, useState } from "react";
import axios from "axios";

const Section2 = () => {
    return <Fragment>
        <div className="section2">
            <div className="background">
                <img
                    src="./assets/imgs/wedding/section2.jpg"
                    className="w-100 rounded shadow"
                />
            </div>
            <div className="namesSection">
                <div className="mainColumn">
                    <div className="fakeRow1" />
                    <div className="mainRow">
                        <img src="./assets/imgs/wedding/rings.png" />
                    </div>
                    <div className="fakeRow2" />
                    <div className="marriageDate">La Ceremonia</div>
                    <div className="fakeRow3" />
                    <div className="weGetMarried">Nuestra Senora de la Paz</div>
                    <div className="address">Cipres y Pinos, La Pradera</div>
                    <div className="hour">a las 14:40 h.</div>
                    <button onClick={() => window.open("https://maps.app.goo.gl/gSh4EnG3Vz9azVpJ6")} className="seeLocation">
                        Ver ubicacion
                    </button>
                </div>
            </div>
        </div>
    </Fragment>
}

export { Section2 };
