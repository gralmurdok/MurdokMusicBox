import "./Section1.css"
import { Fragment } from "react";

const Section1 = () => {
    return <Fragment>
        <div className="section1">
            <div className="background">
                <img
                    src="./assets/imgs/wedding/no_name_background.jpg"
                    className="w-100 rounded shadow"
                />
            </div>
            <div className="namesSection">
                <div className="mainColumn">
                    <div className="fakeRow1" />
                    <div className="mainRow">
                        <div>Silvana</div>
                        <div className="namesConnector">
                            <div className="separator"></div>
                            y
                        </div>
                        <div>Luis</div>
                    </div>
                    <div className="fakeRow2" />
                    <div className="weGetMarried">¡Nos casamos!</div>
                    <div className="fakeRow3" />
                    <div className="marriageDate">8 de Marzo de 2025</div>
                </div>
            </div>
        </div>
    </Fragment>
}

export { Section1 };
