import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { formatDate } from "../../utility/general";
import TagInputs from '../layouts/TagInputs';
import { get, post } from '../../utility/fetch';

function ViewImunizationNotes({ closeModal, visit, next }) {

    return (
        <div className='overlay'>
                <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-contents">
                <div className="flex space-between">
                    <div className="flex space-between flex-v-center m-t-20  m-l-30 col-4">
                        <p>Immunization Record</p>
                    </div>
                </div>
                <div className="p-40">
                   <div>
                   <TagInputs label="Nurse Notes" name="additonalNoteOnTreatment" value={visit.notes} readOnly={true} type='textArea' />
                   </div>
                    {visit?.immunizationDocuments?.map((item, index) => (
                        <div key={index} className="m-t-10 flex">
                            <a href={item.docPath} target="_blank" className="m-r-10">
                                {item.docName}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ViewImunizationNotes;