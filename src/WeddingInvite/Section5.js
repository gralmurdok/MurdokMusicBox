import "./Section5.css"
import { Fragment } from "react";

const Section5 = () => {
    return <Fragment>
        <div className="section5">
            <div className="background">
                <img
                    src="./assets/imgs/wedding/sectionBlank.jpg"
                    className="w-100 rounded shadow"
                />
            </div>
            <div className="background2">
                <img
                    src="./assets/imgs/wedding/benderyangulina.png"
                />
            </div>
            <div className="namesSection">
                <div className="mainColumn">
                    <div className="fakeRow1" />
                    <div className="mainRow">
                        <div>Silvana y Luis</div>
                    </div>
                    <div className="dressCode">Gracias</div>
                    <div className="dressCodeSpa">por acompañarnos en un día tan especial</div>
                    <div className="dressCodeSeparator">__________ . __________</div>
                    <div className="dressCodePlanification">Nuestro mejor regalo es tu presencia, pero si deseas tener un detalle puedes hacerlo en la siguiente cuenta</div>
                    <div className="fakeRow2" />
                    <div className="dressCodeCta">Pichincha: 2207782811</div>
                    <div className="dressCodeCta">Loja: 2901994733</div>
                    <div className="dressCodeCta">Cuenta de Ahorros</div>
                    <div className="dressCodeCta">A nombre de: Silvana Robles</div>
                    <div className="dressCodeCta">CI: 1104108483</div>
                </div>
            </div>
        </div>
    </Fragment>
}

export { Section5 };
