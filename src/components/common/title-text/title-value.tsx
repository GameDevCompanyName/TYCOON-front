import * as React from 'react';
import "./title-value.css";

const TitleField = (props: any) => {

    const title = (props.title == undefined) ? null : (
        <span className="title-field__title">{props.title}</span>
    );

    return (
        <div className="title-field__main">
            <span className="title-field__field">{props.field}</span>
            {title}
        </div>
    )
};

export default TitleField;
