import "./Section4.css"
import { Fragment, useState } from "react";
import axios from "axios";

const Section4 = () => {
    return <Fragment>
        <div className="section4">
            <div className="background">
                <img
                    src="./assets/imgs/wedding/sectionBlank.jpg"
                    className="w-100 rounded shadow"
                />
            </div>
            <div className="namesSection">
                <div className="mainColumn">
                    <div className="fakeRow1" />
                    <div className="mainRow">
                        <img src="./assets/imgs/wedding/dressCode.png" />
                    </div>
                    <div className="fakeRow2" />
                    <div className="dressCode">Dress Code</div>
                    <div className="dressCodeSpa">Código de Vestimenta</div>
                    <div className="dressCodeSeparator">__________ . __________</div>
                    <div className="dressCodeSpaNotSelected">Etiqueta</div>
                    <div className="dressCodeSpa">Formal</div>
                    <div className="dressCodeSpaNotSelected">Semiformal</div>
                    <div className="dressCodeSpaNotSelected">Casual</div>
                    <div className="dressCodeSeparator">__________ . __________</div>
                    <div className="fakeRow3" />
                    <div className="dressCodePlanification">Con el fin de garantizar una experiencia agradable para todos los asistentes, hemos planificado este evento con un enfoque en el público adulto. Les agradecemos su comprensión al abstenerse de traer niños.</div>
                </div>
            </div>
        </div>
    </Fragment>
}

export { Section4 };
