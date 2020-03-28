import * as React from 'react';
import "./info-note.css";

const InfoNote = (props : any) => {
    return (
        <div className="info-note__main">
            {props.text}
        </div>
    )
};

export default InfoNote;
