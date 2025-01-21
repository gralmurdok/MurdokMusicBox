import "./Section3.css"
import { Fragment, useState } from "react";
import axios from "axios";

const Section3 = () => {
    return <Fragment>
        <div className="section3">
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
                        <img src="./assets/imgs/wedding/cups.png" />
                    </div>
                    <div className="fakeRow2" />
                    <div className="marriageDate">La Celebración</div>
                    <div className="fakeRow3" />
                    <div className="weGetMarried">Estancia Hakan</div>
                    <div className="address">Avenida lateral de paso, Loja</div>
                    <div className="hour">a las 17:00 h.</div>
                    <button onClick={() => window.open("https://maps.app.goo.gl/gFK5jcqkJkH6n3v5A")} className="seeLocation">
                        Ver ubicacion
                    </button>
                </div>
            </div>
        </div>
    </Fragment>
}

export { Section3 };
