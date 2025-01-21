import "./SectionInvitado.css"
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


const SectionInvitado = () => {
    const { guestId } = useParams();
    const [guest, setGuest] = useState();
    const handleFetchGuest = () => {
        axios
            .get(`/wedding_guest/${guestId}`)
            .then((guestResponse) => {
                console.log(guestResponse.data);
                setGuest(guestResponse.data);
            })
            .catch(() => {
                // do nothing
            });
    }
    const handleUpdateGuest = (level) => {
        if (guest?.level === level) {
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
                    <div className="dressCodeSpa">Estimad@:</div>
                    <div className="dressCode">{guest?.name ?? 'INVITADO'}</div>
                    <div className="dressCodeSpa">Os invitamos a ser parte de nuestro SI en el Altar!</div>
                    <div className="fakeRow2" />
                    <div className="dressCodeSeparator">_____ Nivel de bebedor _____</div>
                    <div className={isSelected(0)} onClick={() => handleUpdateGuest(0)}>No bebo</div>
                    <div className={isSelected(1)} onClick={() => handleUpdateGuest(1)}>Bebedor Casual</div>
                    <div className={isSelected(2)} onClick={() => handleUpdateGuest(2)}>Borracho</div>
                    <div className={isSelected(3)} onClick={() => handleUpdateGuest(3)}>He bebido con los novios</div>
                    <div className="dressCodeSeparator">__________ . __________</div>
                    <div className="fakeRow2" />
                    <div className="fakeRow2" />
                </div>
            </div>
        </div>
    </Fragment>
}

export { SectionInvitado };
