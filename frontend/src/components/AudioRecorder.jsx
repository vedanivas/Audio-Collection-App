import React, { useState, useEffect, useRef } from 'react';

const AudioRecorder = () => {
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);

    useEffect(() => {
        const getMicrophonePermission = async () => {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({ audio: true });
                setPermission(true);
                setStream(streamData);
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        };

        if (!permission) {
            getMicrophonePermission();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [permission, stream]);

    const startRecording = () => {
        if (!stream) return;
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = event => {
            if (event.data.size > 0) {
                setAudioChunks(prevChunks => [...prevChunks, event.data]);
            }
        };
        recorder.start();
        setRecording(true);
        setMediaRecorder(recorder);
    };

    const stopRecording = () => {
        if (mediaRecorder && recording) {
            mediaRecorder.stop();
            setRecording(false);
        }
    };

    const handleUpload = async () => {
        if (!audioChunks.length) return;
        
        // Convert audio chunks to Blob
        const blob = new Blob(audioChunks, { type: 'audio/webm' });

        // Convert Blob to WAV format
        const reader = new FileReader();
        reader.onloadend = async () => {
            const audioBuffer = await decodeAudioData(reader.result);
            const wavBlob = encodeWav(audioBuffer);
            const wavFile = new File([wavBlob], 'recording.wav', { type: 'audio/wav' });

            console.log(wavFile);
            // Upload WAV file
            const formData = new FormData();
            formData.append('audio', wavFile);

            try {
                const response = await fetch('YOUR_UPLOAD_API_ENDPOINT', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    console.log('Audio uploaded successfully');
                } else {
                    console.error('Failed to upload audio');
                }
            } catch (error) {
                console.error('Error uploading audio:', error);
            }
        };
        reader.readAsArrayBuffer(blob);
    };

    const decodeAudioData = (data) => {
        return new Promise((resolve, reject) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContext.decodeAudioData(data, resolve, reject);
        });
    };

    const encodeWav = (audioBuffer) => {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const bitsPerSample = 16;

        const interleaved = interleave(audioBuffer.getChannelData(0), audioBuffer.getChannelData(1));

        const buffer = new ArrayBuffer(44 + interleaved.length * 2);
        const view = new DataView(buffer);

        writeString(view, 0, 'RIFF'); // RIFF identifier
        view.setUint32(4, 44 + interleaved.length * 2, true); // RIFF chunk length
        writeString(view, 8, 'WAVE'); // RIFF type
        writeString(view, 12, 'fmt '); // format chunk identifier
        view.setUint32(16, 16, true); // format chunk length
        view.setUint16(20, 1, true); // sample format (1 means PCM)
        view.setUint16(22, numChannels, true); // number of channels
        view.setUint32(24, sampleRate, true); // sample rate
        view.setUint32(28, sampleRate * numChannels * bitsPerSample / 8, true); // byte rate
        view.setUint16(32, numChannels * bitsPerSample / 8, true); // block align
        view.setUint16(34, bitsPerSample, true); // bits per sample
        writeString(view, 36, 'data'); // data chunk identifier
        view.setUint32(40, interleaved.length * 2, true); // data chunk length

        floatTo16BitPCM(view, 44, interleaved);

        return new Blob([view], { type: 'audio/wav' });
    };

    const interleave = (inputL, inputR) => {
        const length = inputL.length + inputR.length;
        const result = new Float32Array(length);

        let index = 0,
            inputIndex = 0;

        while (index < length) {
            result[index++] = inputL[inputIndex];
            result[index++] = inputR[inputIndex];
            inputIndex++;
        }

        return result;
    };

    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    const floatTo16BitPCM = (output, offset, input) => {
        for (let i = 0; i < input.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    };

    return (
        <div>
            {!permission && <p>Permission needed to access microphone</p>}
            {permission && !recording && <button onClick={startRecording}>Start Recording</button>}
            {recording && <button onClick={stopRecording}>Stop Recording</button>}
            {audioChunks.length > 0 && <button onClick={handleUpload}>Upload Recording</button>}
        </div>
    );
};

export default AudioRecorder;
