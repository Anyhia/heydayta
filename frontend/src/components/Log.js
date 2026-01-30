import { Alert, Button, Container, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import api from '../api';
import { ShowLogs } from './ShowLogs';
import {useAuth} from './Auth/AuthProvider';
import Question from './Question';
import './Log.css';

const CATEGORY = [
    {value:'logs', label:'Captains Logs'},
    {value:'travel', label:'Travel'},
    {value:'work', label:'Work'},
    {value:'health', label:'Health'},
    {value:'family', label:'Family'},
    {value:'ideas', label:'Ideas'},
    {value:'education', label:'Education'},
]
// CreateLog
function CreateLog() {
    // Get the correct date and time (for the reminders)
    const localDate = new Date().getTimezoneOffset(); 

    const [entryType, setEntryType] = useState('journal');
    const [entry, setEntry] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [category, setCategory] = useState('logs');
    const [logs, setLogs] = useState([]);

    const [filter, setFilter] = useState('all')
    const { isAuthenticated } = useAuth();

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



    useEffect(() => {
        if (!isAuthenticated) return;  // ← Don't fetch if not authenticated
        fetchLogs();
    }, [isAuthenticated]); 


    const handleSubmit = (e) => {
        e.preventDefault();
        const logData = {
            entry_type:entryType,
            entry: entry,
            category: category,
            localDate: localDate,
        }
        api.post('/logs/', logData)
        .then((response) => {
            setSuccess('Entry Log Created');
            setEntry('');

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
                        {/* If error has a value, show the Alert */}
                        {success && <Alert variant="success">{success}</Alert>}
                        {error && <Alert variant='danger'>{error}</Alert>}
                    </div>
                    <div className='new-entry-text'>
                        NEW ENTRY
                    </div>
                    <Form.Control
                        id='captainsLog'
                        as="textarea"
                        placeholder="Captain's Log..."
                        aria-label="Captain's log entry"
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        className='create-log-form-control bg-grey-inner'
                    />
                    <div className='create-log-form-select'>
                        <Form.Select
                            id='select-type'
                            value={entryType}
                            onChange={(e) => setEntryType(e.target.value)}
                            className='select-log-type bg-grey-inner text-color-grey '
                        >
                            <option value="journal">Journal</option>
                            <option value="reminders">Reminder</option>
                        </Form.Select>
                        <Form.Select
                            id='select-category'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className='select-log-type bg-grey-inner text-color-grey '
                        >
                            {CATEGORY.map(item =>
                                <option
                                    value={item.value}
                                    label={item.label}
                                    key={item.value}
            
                                />
                            )}
                        </Form.Select>
                    </div>
            
                    <Button type="submit" className='create-log-form-button'>SAVE</Button>
                </Form>
            </Container>
            <Question />

            
            <Container className='show-logs'>
                <div className='d-flex gap-2 mb-4'>
                    {/* If the button is active, add logs-buttons-active class */}
                    {/* On click, filter the logs depending on type */}
                    <Button 
                        className={`logs-buttons ${filter==='all'? 'logs-buttons-active':''}`} 
                        onClick={() => setFilter('all')}
                    >
                        ALL
                    </Button>
                    <Button 
                        className={`logs-buttons ${filter==='journal'? 'logs-buttons-active':''}`} 
                        onClick={() => setFilter('journal')}
                    >
                        JOURNAL
                    </Button>
                    <Button 
                        className={`logs-buttons ${filter==='reminders'? 'logs-buttons-active':''}`} 
                        onClick={() => setFilter('reminders')}
                    >
                        REMINDERS
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