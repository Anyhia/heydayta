import { Alert, Button, Container, Form} from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import api from '../api';
import './Question.css';

function Question() {
    const [error, setError] = useState(null);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('')

    const questionRef= useRef();

    useEffect(() => {
        questionRef.current.focus();
    }, []);    

    const handleSubmit = (e) => {
        e.preventDefault();
        // Get the correct date and time (for the reminders)
        const localDate = new Date().getTimezoneOffset(); 
        const questionData = {
            localDate:localDate,
            question:question,
        }
        api.post('/logs/ask_question/', questionData)
        .then((response) => {
            setError('')
            setQuestion('');
            setAnswer(response.data.answer)
        })
        .catch((error) => {
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Question could not be answered. Please try again.')
            }
        })
    }


    return(        
        <Container className='question-container'>
            <Form onSubmit={handleSubmit} className='question-form'>
                {/* If error has a value, show the Alert */}
                {error && <Alert variant='danger'>{error}</Alert>}
                <div className='ask-dayta-text'>
                    ASK DAYTA
                </div>
                <div className='question-group'>
                    
                    <Form.Control
                        as="textarea"
                        placeholder="Ask Dayta..."
                        aria-label="Ask Dayta a question"
                        ref={questionRef}
                        value={question}
                        required
                        onChange={(e) => {
                            setQuestion(e.target.value);
                            setAnswer('');
                        }}
                        className='question-form-control bg-grey-inner'
                    />
                    
                    <Button type="submit" className='question-form-button'><FontAwesomeIcon icon={faPaperPlane} /></Button>
                </div>
            </Form>

            {answer && <Container className='bg-grey-inner answer-box'> {answer} </Container>}
        </Container>
    )
}

export default Question