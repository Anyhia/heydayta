import { useState } from 'react';
import api from '../api';

/**
 * Custom hook for voice recording functionality
 * @param {Function} onTranscript - Callback function that receives the transcribed text
 * @param {Function} onError - Callback function that receives error messages
 * @returns {Object} - { isRecording, startRecording, stopRecording }
 */
export const useVoiceRecording = (onTranscript, onError) => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    // Start recording audio
    const startRecording = async () => {
        try {
            // Ask the browser for permission to use the microphone
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Create a MediaRecorder object that will handle the recording
            // It takes the audio stream from the microphone
            const recorder = new MediaRecorder(stream);
            
            // Array to store chunks (pieces) of audio data as they're recorded
            const audioChunks = [];

            // Runs every time the recorder has new audio data available
            // This happens continuously while recording
            recorder.ondataavailable = (event) => {
                // Add each chunk of audio data to our array
                audioChunks.push(event.data);
            };

            // Event handler: runs when recording stops (when user clicks stop button)
            recorder.onstop = async () => {
                // Combine all audio chunks into a single Blob (Binary Large Object)
                // audio/webm is a common format for web audio recording
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                
                // Create FormData to send the file to the backend
                const formData = new FormData();
                
                // Add the audio blob to FormData with the key 'audio'
                // Django will receive this as request.FILES.get('audio')
                // 'recording.webm' is just the filename
                formData.append('audio', audioBlob, 'recording.webm');

                try {
                    const response = await api.post('logs/transcribe/', formData);
                    
                    // Call the callback with the transcribed text
                    onTranscript(response.data.text);
                } catch (error) {
                    // Call the error callback
                    onError('Transcription failed. Please try again.');
                }

                // Stop the microphone stream (turns off the microphone)
                stream.getTracks().forEach(track => track.stop());
            };

            // Start the actual recording
            recorder.start();
        
            // Save the recorder object in state so we can stop it later
            setMediaRecorder(recorder);
            
            // Update state to show we're recording (button will turn red)
            setIsRecording(true);
        } catch (error) {
            // If user denies microphone permission or microphone not available
            // Call the error callback with the error message
            onError('Microphone access denied.');
        }
    };

    // Stop recording
    const stopRecording = () => {
        // Check if we have an active recorder
        if (mediaRecorder) {
            // Stop the recording (this triggers the recorder.onstop event above)
            mediaRecorder.stop();
            
            // Update state to show we're not recording anymore 
            setIsRecording(false);
            
            // Clear the recorder from state
            setMediaRecorder(null);
        }
    };

    // Return the recording state and control functions
    return {
        isRecording,
        startRecording,
        stopRecording
    };
};