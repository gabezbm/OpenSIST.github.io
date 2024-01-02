import React, {useRef} from 'react';
import ReactMarkdown from 'react-markdown';
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./css/github.css";
import Draggable from 'react-draggable';
import './ProgramContent.css'
import {Form, useLoaderData} from "react-router-dom";

import {getProgramContent, getProgramDesc} from "../../../Data/ProgramData";

export async function loader({params}) {
    const programId = params.programId;
    const programContent = await getProgramContent(programId);
    return {programContent};
}

export async function action({request, params}) {
    const programId = params.programId;
    return await getProgramDesc(programId, true);
}

function ProgramContent() {
    const {programContent} = useLoaderData();
    const nodeRef = useRef(null);

    return (
        <div className="ProgramContent">
            <div className='ProgramDescription'>
                <ReactMarkdown>{programContent.description}</ReactMarkdown>
                <Draggable nodeRef={nodeRef} defaultClassName="DraggableButtonGroup">
                    <div ref={nodeRef}>
                        <Form action='edit'>
                            <button type='submit' title='Edit' className='Button'>
                                <FontAwesomeIcon icon={solid("pen-to-square")}/>
                            </button>
                        </Form>
                        <Form method='post'>
                            <button type='submit' title='Refresh' className='Button'><FontAwesomeIcon
                                icon={solid("arrows-rotate")}/></button>
                        </Form>
                    </div>
                </Draggable>
            </div>
        </div>
    );
}

export default ProgramContent;