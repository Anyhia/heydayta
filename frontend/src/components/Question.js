import { Alert, Button, Container, Form} from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import { faMicrophone, faStop, faSearch } from '@fortawesome/free-solid-svg-icons';
import api from '../api';
import './Question.css';
import { useVoiceRecording } from './useVoiceRecording';

function Question() {
    const [error, setError] = useState(null);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('')
    const [isAsking, setIsAsking] = useState(false);

    const questionRef = useRef();

    useEffect(() => {
        questionRef.current.focus();
    }, []);   

    // Auto-expand textarea function
    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
        setAnswer('');
        
        // Auto-expand textarea
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };
    
    const { isRecording, startRecording, stopRecording } = useVoiceRecording(
        (transcribedText) => {
            setQuestion(prev => {
                const newQuestion = prev + (prev ? ' ' : '') + transcribedText;
                // Trigger auto-expand after voice input
                setTimeout(() => {
                    if (questionRef.current) {
                        questionRef.current.style.height = 'auto';
                        questionRef.current.style.height = questionRef.current.scrollHeight + 'px';
                    }
                }, 0);
                return newQuestion;
            });
            setError(null); 
        },
        (errorMessage) => {
            setError(errorMessage);
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsAsking(true);
        const localDate = new Date().getTimezoneOffset(); 
        const questionData = {
            localDate: localDate,
            question: question,
        }
        api.post('/logs/ask_question/', questionData)
        .then((response) => {
            setError('')
            setQuestion('');
            setAnswer(response.data.answer)
            
            // Reset textarea height after clearing
            if (questionRef.current) {
                questionRef.current.style.height = 'auto';
            }
        })
        .catch((error) => {
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Question could not be answered. Please try again.')
            }
        })
        .finally(() => {
            setIsAsking(false);
        })
    }

    return (        
        <Container className='question-container'>
            <Form onSubmit={handleSubmit} className='question-form'>
                {error && <Alert variant='danger'>{error}</Alert>}

                <div className='question-group'>
                    <div className='question-input-wrapper'>
                        <Form.Control
                            as="textarea"
                            rows={1}
                            placeholder="Ask Dayta..."
                            aria-label="Ask Dayta a question"
                            ref={questionRef}
                            value={question}
                            required
                            onChange={handleQuestionChange}
                            onKeyDown={(e) => {
                                // Submit on Enter, allow new line on Shift+Enter
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            className='question-form-control bg-grey-inner'
                        />
                        
                        {/* Mic button - always inside */}
                        <Button
                            type="button"
                            className={isRecording ? "question-recording-button" : "question-mic-button"}
                            onClick={isRecording ? stopRecording : startRecording}
                        >
                            <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
                        </Button>
                    </div>

                    {/* Search button - outside wrapper */}
                    <Button type="submit" className='question-form-button' disabled={isAsking}>
                        {isAsking 
                            ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            : <FontAwesomeIcon icon={faSearch} />
                        }
                    </Button>
                </div>
            </Form>

            {answer && (
                <Container className='answer-box'>
                    {answer}
                </Container>
            )}
        </Container>
    )
}

export default Question