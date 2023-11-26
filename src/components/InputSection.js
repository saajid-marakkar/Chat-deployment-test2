import React, { useState, useEffect, useRef } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const SPEECH_KEY = 'af4c0c6b30a84483a4a3f4c0823cd8fc';
const SPEECH_REGION = 'westus';


function InputSection({
    userInputText,
    handleChangeInUserInputText,
    handleSendMessageButton,
    handleChangeInRecognizedSpeech,
    isVoiceInput,
    handleChangeInInputType
}) {


    const [isListening, setIsListening] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const speechConfig = useRef(null);
    const audioConfig = useRef(null);
    const recognizer = useRef(null);
    const [timerInterval, setTimerInterval] = useState(null);
    const [totalSeconds, setTotalSeconds] = useState(0);

    const [myTranscript, setMyTranscript] = useState("");
    const [recognizingTranscript, setRecTranscript] = useState("");
    // let inputVoiceSpeechTextList = []
    const inputVoiceSpeechTextList = useRef([]);
    // const [inputVoiceSpeechTextList, setInputVoiceSpeechTextList] = useState([]);

    useEffect(() => {

        console.log("isListening", isListening)
    }, );

    useEffect(() => {
        speechConfig.current = sdk.SpeechConfig.fromSubscription(
            SPEECH_KEY,
            SPEECH_REGION
        );
        speechConfig.current.speechRecognitionLanguage = 'en-US';

        audioConfig.current = sdk.AudioConfig.fromDefaultMicrophoneInput();
        recognizer.current = new sdk.SpeechRecognizer(
            speechConfig.current,
            audioConfig.current
        );

        const processRecognizedTranscript = (event) => {
            const result = event.result;
            // console.log('Recognized result:', result);

            if (result.reason === sdk.ResultReason.RecognizedSpeech) {
                const transcript = result.text;
                // console.log('Transcript: -->', transcript);
                // Call a function to process the transcript as needed

                setMyTranscript(transcript);

            }
        };

        const processRecognizingTranscript = (event) => {
            const result = event.result;
            console.log('Recognition result:', result);
            if (result.reason === sdk.ResultReason.RecognizingSpeech) {
                const transcript = result.text;
                console.log('Transcript: -->', transcript);
                inputVoiceSpeechTextList.current.push(transcript);
                // inputVoiceSpeechTextList.push(transcript)
                // setInputVoiceSpeechTextList((prevInputVoiceSpeechTextList) => [
                //     ...prevInputVoiceSpeechTextList,
                //     transcript
                // ]);
                console.log("inputVoiceSpeechTextList in processRecognizingTranscript", inputVoiceSpeechTextList)
                // Call a function to process the transcript as needed

                setRecTranscript(transcript);
                console.log('recognizingTranscript: -->', recognizingTranscript);

            }

        }

        recognizer.current.recognized = (s, e) => processRecognizedTranscript(e);
        recognizer.current.recognizing = (s, e) => processRecognizingTranscript(e);


        recognizer.current.startContinuousRecognitionAsync(() => {
            console.log('Speech recognition started.');
            // setIsListening(true);
        });

        return () => {
            recognizer.current.stopContinuousRecognitionAsync(() => {
                setIsListening(false);
            });
        };
    }, []);


    const startStop = () => {
        if (!timerInterval) {
            // Start the stopwatch
            setTimerInterval(setInterval(updateTimer, 1000));
        } else {
            // Stop the stopwatch
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
    };

    const updateTimer = () => {
        setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1);
    };

    const resetTimer = () => {
        // Stop the stopwatch and reset values
        clearInterval(timerInterval);
        setTimerInterval(null);
        setTotalSeconds(0);
    };

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${padNumber(minutes)}:${padNumber(seconds)}`;
    };

    const padNumber = (number) => {
        return (number < 10 ? "0" : "") + number;
    };

    useEffect(() => {
        // Cleanup the interval on component unmount
        return () => {
            clearInterval(timerInterval);
        };
    }, [timerInterval]);

    const pauseListening = () => {
        setIsTyping(false);
        setIsListening(false);
        recognizer.current.stopContinuousRecognitionAsync();
        console.log('Paused listening.');
    };

    const resumeListening = () => {
        startStop()
        setIsTyping(false);
        if (!isListening) {
            handleChangeInInputType()
            setIsListening(true);
            console.log("isVoiceInput after in comp: ", isVoiceInput)
            recognizer.current.startContinuousRecognitionAsync(() => {
                console.log('Resumed listening...');
            });
        }
    };

    const stopListening = () => {
        resetTimer()
        setIsListening(false);
        setIsTyping(false);
        recognizer.current.stopContinuousRecognitionAsync(() => {



            console.log('Speech recognition stopped.');
        });
        console.log("inputVoiceSpeechTextList in stopListening", inputVoiceSpeechTextList)
        console.log("11111111111111111111111111111111")
        // let inputVoiceSpeechTextListCopy = [...inputVoiceSpeechTextList]
        // console.log("inputVoiceSpeechTextListCopy", inputVoiceSpeechTextListCopy)
        // const voiceInputInText = inputVoiceSpeechTextListCopy.join(" ");

        // // const voiceInputInText = inputVoiceSpeechTextList.reduce((accumulator, currentValue) => {
        // //     return accumulator + " " + currentValue;
        // // });
        // console.log("22222222222222222222222222222222")
        // console.log("voiceInputInText", voiceInputInText)
        // console.log("3333333333333333333333333333333333")
        // setInputVoiceSpeechTextList([])
        inputVoiceSpeechTextList.current = [];
        handleChangeInRecognizedSpeech(recognizingTranscript)
        setRecTranscript('')
    };

    const deleteCurrentVoiceInput = () => {
        resetTimer()
        setRecTranscript('')
        setIsListening(false)
    };

    const handleInputTextOnChange = (e) => {
        if (e.target.value.length > 0) {
            setIsTyping(true);
        }
        else {
            setIsTyping(false);
        }
        handleChangeInUserInputText(e);
    };

    const handleChangeInSendMessageButton = () => {
        handleSendMessageButton();
        setIsTyping(false)
    };

    return (
        <div className='MessageSendSection px-4 px-lg-4  d-flex justify-content-end align-items-center w-100 px-2 py-3 position-absolute bottom-0'>
            {
                !isListening && <div className='pe-3 pe-lg-3 w-100'>
                    <input className='text-black px-3 w-100  bg-white ' name="userInputText"
                        value={userInputText} onChange={(e) => handleInputTextOnChange(e)} onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleChangeInSendMessageButton();
                            }
                        }} placeholder='Say Something to Santa...' id="user-input" type="text" />
                    <div>
                    </div>
                </div>
            }
            <div className='d-flex align-items-center'>
                {
                    isListening && <i className="fas fa-trash deleteIcon me-2" onClick={deleteCurrentVoiceInput}></i>
                }
                {
                    isListening && <span id="timer" className='Voicetimer classic me-3 py-2 px-2 px-md-3 bg-white rounded-pill' >{formatTime(totalSeconds)}</span>
                }
                {
                    isTyping ? <i className='d-block fas fa-location-arrow send_message_icon ms-2 ' onClick={() => handleChangeInSendMessageButton()}></i>
                        : !isListening && <i className="fas fa-microphone voiceIcon" onClick={resumeListening} ></i>
                }
                {
                    // isListening && <i className="far fa-pause-circle pauseIcon d-block" onClick={pauseListening}></i>
                }
                {
                    isListening && <i className='d-block fas fa-location-arrow send_message_icon ms-2' onClick={stopListening}></i>
                }
            </div>
        </div>
    )
}

export default InputSection