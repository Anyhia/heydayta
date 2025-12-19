import { Container, Button, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPenToSquare, faTrashCan, faFloppyDisk} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import api from '../api';
import './ShowLogs.css';

export const ShowLogs = ({logs, refreshLogs}) => {

    return (
        <Container className='show-logs-container'>
            <ul className='list'>
                {logs.map((log) => 
                    (<LogCard log ={log} key={log.id} refreshLogs={refreshLogs}/>)
                )}
            </ul>
        </Container>
    )
}

export const LogCard = ({log, refreshLogs}) => {
    // Show label on the card, not the values.
    const CATEGORY_LABELS = {
        logs: "Captain's Logs",
        travel: "Travel",
        work: "Work",
        health: "Health",
        family: "Family",
        ideas: "Ideas",
        education: "Education",
    };

    // state for edit
    const [editing, setEditing] = useState(false);
    const [newLog, setNewLog] = useState(log.entry);

    // Call for edit button
    function updateLog() {
        api.patch(`/logs/${log.id}/`, {entry : newLog} )
        .then((response) => {
            setNewLog(response.data.entry);
            setEditing(false);
            refreshLogs();
        })
    }

    // Call for delete button
    function deleteLog() {
        api.delete(`/logs/${log.id}/`)
        .then((response) => {
            refreshLogs();
        })
    }

    // Date is a built‑in JavaScript constructor for date/time objects.
    const d = new Date(log.created_at);
    const date = d.toLocaleDateString();
    // Only hours and minutes
    const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    let tag;
    let logClass;
    if(log.entry_type==='journal') {
        const labelCategory = CATEGORY_LABELS[log.category];
        logClass = 'log-card-journal';
        tag = labelCategory || "Captain's Log";
    } else {
        logClass = 'log-card-reminder'
        tag = 'Reminders'
    }

    return (
        
        <Container className={`log-card-container ${logClass}`}>
            <div className='date-buttons-container'>
                <div>
                    <div className='date'>STARDATE: {date}; {time} </div>
                    <div className="tag"> {tag} </div>
                </div>
                <div className='button-container'>
                    {editing ? 
                    (<Button className='edit-button' onClick={updateLog}>
                        <FontAwesomeIcon icon={faFloppyDisk} />
                    </Button>) :                     
                    (<Button className='edit-button' onClick={() => setEditing(true)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>)}

                    <Button
                        className='edit-button delete'
                        onClick={deleteLog}
                    >
                        <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                </div>
            </div>
            
            {editing ? (<Form.Control
                        id='editLog'
                        as="textarea"
                        placeholder={log.entry}
                        value={newLog}
                        onChange={(e) => setNewLog(e.target.value)}
                        className='create-log-form-control bg-grey-inner'
                    />) : <div className='entry-text'> {newLog} </div>

            }
            
        </Container>
    )
}



