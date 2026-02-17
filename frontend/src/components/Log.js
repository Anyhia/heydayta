import { Alert, Button, Container, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';
import api from '../api';
import { ShowLogs } from './ShowLogs';
import { useVoiceRecording } from './useVoiceRecording';
import {useAuth} from './Auth/AuthProvider';
import Question from './Question';
import './Log.css';


// CreateLog
function CreateLog() {
    // Get the correct date and time (for the reminders)
    const localDate = new Date().getTimezoneOffset(); 

    const [entryType, setEntryType] = useState('journal');
    const [entry, setEntry] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [logs, setLogs] = useState([]);

    const [filter, setFilter] = useState('all');
    const textareaRef = useRef(null);

    const { isAuthenticated } = useAuth();

    // Auto-expand textarea function
    const handleTextareaChange = (e) => {
        setEntry(e.target.value);
        
        // Auto-expand textarea
        const textarea = e.target;
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = textarea.scrollHeight + 'px'; // Set to scroll height
    };


    function fetchLogs() {
        api.get('/logs/')
        .then((response) => {
            setLogs(response.data);
        })
        .catch((error) => {
            console.error('Failed to fetch logs:', error);
        });
    }

    const filteredLogs = logs.filter(
        log => filter === 'all' ? true : log.entry_type === filter
    );


const { isRecording, startRecording, stopRecording } = useVoiceRecording(
    (transcribedText) => {
        setEntry(prev => {
            const newEntry = prev + (prev ? ' ' : '') + transcribedText;
            // Trigger auto-expand after voice input
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
                }
            }, 0);
            return newEntry;
        });
        setError(null);  
    },
    (errorMessage) => {
        setError(errorMessage);
    }
);


    useEffect(() => {
        if (!isAuthenticated) return;  // ← Don't fetch if not authenticated
        fetchLogs();
    }, [isAuthenticated]); 


    const handleSubmit = (e) => {
        e.preventDefault();
        const logData = {
            entry_type:entryType,
            entry: entry,
            localDate: localDate,
        }
        api.post('/logs/', logData)
        .then((response) => {
            setSuccess('Entry Log Created');
            setEntry('');
           // Reset textarea height after clearing
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }

            setLogs((prevlogs) => [response.data,...prevlogs])

            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        })
        .catch((error) => {
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Entry Log not created. Please try again.');
            }
        })
    }



    return (
        <Container className='create-log-container'>
            <Container className='create-log-form-container'>
                <Form onSubmit={handleSubmit} className='create-log-form'>
                    <div>
                        {success && <Alert variant="success">{success}</Alert>}
                        {error && <Alert variant='danger'>{error}</Alert>}
                    </div>

                    {/* Top row: Just tabs */}
                    <div className='form-controls-row'>
                        <div className='entry-type-toggle'>
                            <Button
                                type="button"
                                className={`type-toggle-btn ${entryType === 'journal' ? 'type-toggle-active' : ''}`}
                                onClick={() => setEntryType('journal')}
                            >
                                Journal
                            </Button>
                            <Button
                                type="button"
                                className={`type-toggle-btn ${entryType === 'reminders' ? 'type-toggle-active' : ''}`}
                                onClick={() => setEntryType('reminders')}
                            >
                                Reminder
                            </Button>
                        </div>
                    </div>

                    {/* Textarea with mic button inside */}
                    <div className='textarea-wrapper'>
                        <Form.Control
                            ref={textareaRef}
                            id='captainsLog'
                            as="textarea"
                            rows={1}
                            placeholder={entryType === 'journal' ? "What's on your mind?" : "Set reminder for..."}
                            aria-label="Entry text"
                            value={entry}
                            onChange={handleTextareaChange}
                            className='create-log-form-control bg-grey-inner'
                        />
                        
                        {/* Mic icon positioned inside textarea */}
                        <Button
                            type="button"
                            className={isRecording ? "voice-recording-btn" : "voice-mic-btn"}
                            onClick={isRecording ? stopRecording : startRecording}
                        >
                            <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
                        </Button>
                    </div>

                    {/* Save button - right aligned */}
                    <div className='save-button-container'>
                        <Button type="submit" className='create-log-form-button'>Log it</Button>
                    </div>
                </Form>
            </Container>
            <Question />

            
            <Container className='show-logs'>
                <div className='d-flex gap-2 mb-3'>
                    {/* If the button is active, add logs-buttons-active class */}
                    {/* On click, filter the logs depending on type */}
                    <Button 
                        className={`logs-buttons ${filter==='all'? 'logs-buttons-active':''}`} 
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                    <Button 
                        className={`logs-buttons ${filter==='journal'? 'logs-buttons-active':''}`} 
                        onClick={() => setFilter('journal')}
                    >
                        Journal
                    </Button>
                    <Button 
                        className={`logs-buttons ${filter==='reminders'? 'logs-buttons-active':''}`} 
                        onClick={() => setFilter('reminders')}
                    >
                        Reminders
                    </Button>
                </div>
                {/* Pass the fetchLogs function, so everytime a log gets edited or deleted, refresh the logs */}
                {filteredLogs.length === 0 && (
                    <div className='empty-logs-message'>
                        <p className='empty-logs-title'>No logs yet</p>
                        <p className='empty-logs-subtitle'>Start your journey by creating your first entry above</p>
                    </div>
                )}
                <ShowLogs logs={filteredLogs} refreshLogs={fetchLogs}/>
            </Container>
        </Container>
    )
}

export default CreateLog