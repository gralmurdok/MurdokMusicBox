import "./WeddingGuestList.css";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";

const WeddingGuestList = () => {
    const [guestListInfo, setGuestListInfo] = useState();
    const handleFetchGuestListInfo = () => {
        axios
            .get('/wedding_guests')
            .then((guestResponse) => {
                console.log(guestResponse.data);
                setGuestListInfo(guestResponse.data);
            })
            .catch(() => {
                // do nothing
            });
    }

    useEffect(() => {
        handleFetchGuestListInfo()
    }, []);

    const TableRow = ({ entry }) => {
        const inviteLink = `https://www.wishitngetit.com/wedding?guestId=${entry._id}`;
        const whatsappInvite = `https://wa.me/${entry.phone}?text=${encodeURIComponent(inviteLink)}`;

        return (
            <tr>
                <td><a href={whatsappInvite}>{entry.phone}</a></td>
                <td><a href={inviteLink}>{entry.name}</a></td>
                <td>{entry.admission}</td>
            </tr>
        );
    };

    const Table = () => {
        return (
            <table border={1} width={'100%'}>
                <thead>
                    <tr>
                        <th>Phone</th>
                        <th>Name</th>
                        <th>Admission</th>
                    </tr>
                </thead>
                <tbody>
                    {guestListInfo?.entries.map(element => <TableRow key={element._id} entry={element} />)}
                </tbody>
                <tfoot>
                        <tr>
                            <td></td>
                            <td>Total admissions</td>
                            <td>{guestListInfo?.total_admissions}</td>
                        </tr>
                    </tfoot>
            </table>
        );
    };

    return <Fragment>
        <div className="weddingGuestList">
            <Table />
        </div>
    </Fragment>
}

export { WeddingGuestList };
