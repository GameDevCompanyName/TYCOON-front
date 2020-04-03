import * as React from 'react';
import {Config} from "../../../common/config";
import host = Config.host;

const LinkButton = (props : any) => {
    return (
        <form action={props.href}>
            <button className="common-styles__button" type="submit">
                <span>{props.text}</span>
            </button>
        </form>
    )
};

export default LinkButton;
