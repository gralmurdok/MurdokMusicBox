import "./SectionInvitado.css"
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";


const SectionInvitado = () => {
    const [searchParams] = useSearchParams();
    const [guest, setGuest] = useState();
    const handleFetchGuest = () => {
        axios
            .get(`/wedding_guest/${searchParams.get('guestId')}`)
            .then((guestResponse) => {
                setGuest(guestResponse.data);
            })
            .catch(() => {
                // do nothing
            });
    }
    const handleUpdateGuest = (level) => {
        if (guest?._id && guest?.level === level) {
            return;
        }

        const nextGuestData = {
            ...guest,
            level
        };

        // for feedback purposes we change it right away
        setGuest(nextGuestData);

        axios
            .post('/register_guest', nextGuestData)
            .then(() => {
                // ensures data gets updated
                handleFetchGuest();
            })
            .catch(() => {
                // do nothing
            });
    }

    useEffect(() => {
        handleFetchGuest();
    }, []);

    const isSelected = (expectedLevel) => guest?.level !== expectedLevel ? 'dressCodeSpaNotSelected' : 'dressCodeSpa'
    const renderPlural = guest?.admission > 1 ? 's' : '';
    const option0 = guest?.special ? 'Mao/Mi Tio' : 'No bebo';
    const option1 = guest?.special ? 'Pez/Pecesillo' : 'Bebedor Casual';
    const option2 = guest?.special ? 'Santiaguito' : 'Borracho';
    const option3 = guest?.special ? 'Wicho' : 'He bebido con los novios';


    return <Fragment>
        <div className="sectionInvitado">
            <div className="background">
                <img
                    src="./assets/imgs/wedding/sectionBlank.jpg"
                    className="w-100 rounded shadow"
                />
            </div>
            <div className="namesSection">
                <div className="mainColumn">
                    <div className="fakeRow1" />
                    <div className="dressCodeSpa">Estimad@{renderPlural}:</div>
                    <div className="dressCode">{guest?.name ?? 'INVITADO'}</div>
                    <div className="dressCodeSpa">Os invitamos a ser parte de nuestro SI en el Altar!</div>
                    <div className="fakeRow2" />
                    <div className="dressCodeSeparator">_____ Confirme Nivel de Bebedor _____</div>
                    <div className={isSelected(0)} onClick={() => handleUpdateGuest(0)}>{option0}</div>
                    <div className={isSelected(1)} onClick={() => handleUpdateGuest(1)}>{option1}</div>
                    <div className={isSelected(2)} onClick={() => handleUpdateGuest(2)}>{option2}</div>
                    <div className={isSelected(3)} onClick={() => handleUpdateGuest(3)}>{option3}</div>
                    <div className="dressCodeSeparator">_________ . _________</div>
                    <div className="dressCodeSpa">Admisión: {guest?.admission} persona{renderPlural}.</div>
                    <div className="fakeRow2" />
                    <div className="fakeRow2" />
                </div>
            </div>
        </div>
    </Fragment>
}

export { SectionInvitado };
