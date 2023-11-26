import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useSearchParams } from "react-router-dom"
import "../assets/css/style.css";
import img1 from '../assets/images/santa.jpg'
import img2 from '../assets/images/Lock.svg'
import img3 from '../assets/images/userlogo.png'
import img4 from '../assets/images/Heart.svg'
import img6 from '../assets/images/Lockwhite.svg'
import video from '../assets/videos/_import_60746195038a67.00479292_FPpreview.mp4'
import WhiteSanta_en_US_DavisNeural from '../assets/videos/WhiteSanta-en-US-DavisNeural.mp4'
import AsianSanta_en_U_DavisNeural from '../assets/videos/AsianSanta-en-U-DavisNeural.mp4'
// import randomSantaVideo1 from '../assets/videos/random_video1.mp4'
// import randomSantaVideo2 from '../assets/videos/random_video2.mp4'
import WhiteSantaRandomVideo1 from '../assets/videos/WhiteSanta-1.mp4'
import WhiteSantaRandomVideo2 from '../assets/videos/WhiteSanta-2.mp4'
import WhiteSantaRandomVideo3 from '../assets/videos/WhiteSanta-3.mp4'
import SantaMessageComponent from '../components/SantaMessage'
import UserMessageComponent from '../components/UserMessage';
import InputSection from '../components/InputSection';
import useStateRef from 'react-usestateref';

function ChatWithSanta() {

    const didApiUrl = "https://api.d-id.com";
    const didApiKey = "aGVhZF9lbGZAZW1haWxzYW50YS5jb20:F3KSu-hy_1U8DJLuejdB3";

    // let peerConnection;
    // let streamId;
    // let sessionId;
    let sessionClientAnswer;

    let statsIntervalId;
    let videoIsPlaying;
    let lastBytesReceived;



    




    // let InitialSantaVideoLoaded=false




    const [searchParams, setSearchParams] = useSearchParams(59);
    const [peerConnection, setPeerConnection, peerConnectionref] = useStateRef();
    const [streamId, setStreamId, streamIdref] = useStateRef();
    const [sessionId, setISessionId, sessionIdref] = useStateRef();
    // const [sessionClientAnswer, setSessionClientAnswer] = useState();
    // const [statsIntervalId, setStatsIntervalId] = useState();
    // const [videoIsPlaying, setVideoIsPlaying] = useState(false);
    // const [lastBytesReceived, setLastBytesReceived] = useState();

    // const [chatMessages, setChatMessages] = useState([]);
    const [chatWithSanta, setchatWithSanta] = useState();
    const [InitialSantaVideoLoaded, setInitialSantaVideoLoaded, InitialSantaVideoLoadedref] = useStateRef(false);
    const [seconds, setSeconds] = useState(59);
    const [minutes, setMinutes] = useState(14);
    const [chatMessages, setChatMessages] = useState([
        { message: 'Hello, how can I help you?', type: 'santa', time: getCurrentDateTimeInString() }
    ]);
    const [userInputText, setUserInputText] = useState('');
    // const [currentSantaMessage, setCurrentSantaMessage] = useState('hello how can i help you?');
    // const [currentUserMessage, setCurrentUserMessage] = useState('');
    let currentSantaMessage = 'hello how can i help you?';
    let currentUserMessage = '';
    // const [talkVideo, setTalkVideo] = useState();
    const [recognizedSpeechText, setRecognizedSpeechText] = useState('');
    const [isVoiceInput, setIsVoiceInput] = useState(false);
    const [isLoadingSantaMessage, setIsLoadingSantaMessage] = useState(false);
    const [isSantaReplyVideoVideoStreaming, setSantaReplyVideoVideoStreaming] = useState(false);
    const [voiceTimer, setVoiceTimer] = useState();


    const videoRef = useRef(null);

    let santaName;
    let voiceId;

    santaName = searchParams.get("santaName")
    voiceId = searchParams.get("voiceId")

    let santaVideos= {
        "WhiteSanta-en-US-DavisNeural-InitialVideo" : WhiteSanta_en_US_DavisNeural,
        "WhiteSanta-RandomVideos" : [WhiteSantaRandomVideo1, WhiteSantaRandomVideo2, WhiteSantaRandomVideo3],
        "AsianSanta-en-US-DavisNeural-InitialVideo" : AsianSanta_en_U_DavisNeural,
        "AsianSanta-RandomVideos" : [WhiteSantaRandomVideo1, WhiteSantaRandomVideo2, WhiteSantaRandomVideo3]
    };

    let santaInitialVideo;
    let randomVideosKey;
    let randomVideosList;
    let santaInitialVideoKey;

    randomVideosKey = `${santaName}-RandomVideos`
    randomVideosList = santaVideos[randomVideosKey]
    santaInitialVideoKey = `${santaName}-${voiceId}-InitialVideo`
    santaInitialVideo = santaVideos[santaInitialVideoKey]


    // const peerStatusLabel = document.getElementById('peer-status-label');
    // const iceStatusLabel = document.getElementById('ice-status-label');
    // const iceGatheringStatusLabel = document.getElementById('ice-gathering-status-label');
    // const signalingStatusLabel = document.getElementById('signaling-status-label');
    // console.log("signalingStatusLabel 1:", signalingStatusLabel)
    // const streamingStatusLabel = document.getElementById('streaming-status-label');
    const talkVideo = document.getElementById('talk-video');
    // talkVideo?.setAttribute('playsinline', '');
    // talkVideo?.setAttribute('autoPlay', '');




    useEffect(() => {
        const RTCPeerConnection = (
            window.RTCPeerConnection ||
            window.webkitRTCPeerConnection ||
            window.mozRTCPeerConnection
        ).bind(window);
        // const talkVideo = document.getElementById('talk-video');
        // talkVideo.src = santaInitialVideo;



        console.log("santaName", santaName)
        console.log("voiceId", voiceId)
        estabilish_DID_connection()


        console.log("santaVideos", santaVideos)
        console.log("randomVideosKey", randomVideosKey)
        console.log("randomVideosList", randomVideosList)
        console.log("santaInitialVideoKey", santaInitialVideoKey)
        console.log("santaInitialVideo", santaInitialVideo)
        // invokeDidChatResponse()
        // console.log("After setIsVoiceInput: ", isVoiceInput);
        // setTimeout(() => {
        //     setInitialSantaVideoLoaded(true)
        // }, 5000);

    }, []);

    useEffect(() => {

        if (peerConnectionref.current) {
            peerConnectionref.current.addEventListener('track', onTrack, true);
        }

    },);

    useEffect(() => {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [chatMessages]);

    const handleChatWithSanta = () => {
        
        if (videoRef.current) {
            videoRef.current.src = santaInitialVideo
            videoRef.current.play();
            setchatWithSanta(true)
            startChatTimer(setMinutes, setSeconds)
            setTimeout(() => {
                setInitialSantaVideoLoaded(true)
                console.log("############--########", InitialSantaVideoLoadedref.current)
            }, 2500);
            console.log("############--########", InitialSantaVideoLoadedref.current)
        }
    }

    const estabilish_DID_connection = async () => {
        //estabilish d-id cinnection
        await handleConnect()
        //    await invokeDidChatResponse()
    };

    const handleChangeInUserInputText = (e) => {
        console.log("event e: ", e)
        setUserInputText(e.target.value)
    };

    const handleChangeInInputType = () => {
        console.log("isVoiceInput: ", isVoiceInput)
        setIsVoiceInput((prevIsVoiceInput) => !prevIsVoiceInput);
        console.log("isVoiceInput after: ", isVoiceInput)
    };

    const handleChangeInRecognizedSpeech = (recognizedText) => {
        console.log("recognizedText: ", recognizedText)

        // setRecognizedSpeechText(recognizedText)
        // currentUserMessage = recognizedSpeechText
        let currentChatMessage = { message: recognizedText, type: 'user', time: getCurrentDateTimeInString() };
        let chatMessagesCopy = [...chatMessages]
        chatMessagesCopy.push(currentChatMessage)
        setChatMessages((prevChatMessages) => [
            ...prevChatMessages,
            { message: recognizedText, type: 'user', time: getCurrentDateTimeInString() }
        ]);
        generateSantaMessageAndVideoFromVoiceInput(chatMessagesCopy)

    };

    async function generateSantaMessageAndVideoFromVoiceInput(chatMessagesCopy) {
        setIsLoadingSantaMessage(true)
        const requestBody = buildChatMessageForOpenAi(chatMessagesCopy);
        console.log("requestBody: ", requestBody)
        const chatResponse = await callChatService(requestBody);
        console.log("chatResponse: ", chatResponse)
        const { message } = await chatResponse.json();
        console.log("message: ", message)
        currentSantaMessage = message;
        setChatMessages((prevChatMessages) => [
            ...prevChatMessages,
            { message: currentSantaMessage, type: 'santa', time: getCurrentDateTimeInString() }
        ]);
        // if (!peerConnection && !peerConnection.connectionState === 'connected') {
        //     await estabilish_DID_connection();
        // }
        // await estabilish_DID_connection()
        await invokeDidChatResponse(currentSantaMessage);
    }

    const handleConnect = async () => {
        // console.log('connect-button');
        console.log('talkvideo:::::::: ', talkVideo);

        if (peerConnectionref?.current && peerConnectionref?.current.connectionState === 'connected') {

            return;
        }

        stopAllStreams();
        closePC();

        const sessionResponse = await fetchWithRetries("https://api.d-id.com/talks/streams", {
            method: 'POST',
            headers: {
                Authorization: `Basic ${didApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source_url: `https://customlogssantachatter.blob.core.windows.net/images/${santaName}.jpg`
            })
        });
        console.log("sessionResponse", sessionResponse)

        const { id: newStreamId, offer, ice_servers: iceServers, session_id: newSessionId } = await sessionResponse.json();
        setStreamId(newStreamId);
        setISessionId(newSessionId);

        try {
            sessionClientAnswer = await createPeerConnection(offer, iceServers);
            console.log("sessionClientAnswer", sessionClientAnswer)
            console.log("peerConnection in handleConnect", peerConnectionref.current)
        } catch (e) {
            console.log('error during streaming setup', e);
            stopAllStreams();
            closePC();
            return;
        }

        await fetch(`${didApiUrl}/talks/streams/${streamIdref.current}/sdp`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${didApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                answer: sessionClientAnswer,
                session_id: sessionIdref.current
            })
        });
    };

    function getCurrentDateTimeInString() {
        const currentDateTime = new Date();
        return currentDateTime.toString();

    }

    function stopAllStreams() {
        console.log("talkVideo in stopAllStreams: ", talkVideo)
        if (talkVideo?.srcObject) {
            console.log('stopping video streams');
            talkVideo.srcObject.getTracks().forEach((track) => track.stop());
            talkVideo.srcObject = null;
        }
    }

    function closePC(pc = peerConnectionref.current) {

        if (!pc) return;
        console.log('stopping peer connection');
        pc.close();
        pc.removeEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
        pc.removeEventListener('icecandidate', onIceCandidate, true);
        pc.removeEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
        pc.removeEventListener('connectionstatechange', onConnectionStateChange, true);
        pc.removeEventListener('signalingstatechange', onSignalingStateChange, true);
        pc.removeEventListener('track', onTrack, true);
        clearInterval(statsIntervalId);

        console.log('stopped peer connection');
        if (pc === peerConnectionref.current) {
            // setPeerConnection(null);
        }
    }

    async function fetchWithRetries(url, options, retries = 1) {
        const maxRetryCount = 3;
        const maxDelaySec = 4;
        try {
            return await fetch(url, options);
        } catch (err) {
            if (retries <= maxRetryCount) {
                const delay = Math.min(Math.pow(2, retries) / 4 + Math.random(), maxDelaySec) * 1000;

                await new Promise((resolve) => setTimeout(resolve, delay));

                console.log(`Request failed, retrying ${retries}/${maxRetryCount}. Error ${err}`);
                return fetchWithRetries(url, options, retries + 1);
            } else {
                throw new Error(`Max retries exceeded. error: ${err}`);
            }
        }
    }

    async function createPeerConnection(offer, iceServers) {
        let peerConnectionobj

        if (!peerConnectionref.current) {

            peerConnectionobj = new RTCPeerConnection({ iceServers });
            setPeerConnection(peerConnectionobj)
            peerConnectionref.current.addEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
            peerConnectionref.current.addEventListener('icecandidate', onIceCandidate, true);
            peerConnectionref.current.addEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
            peerConnectionref.current.addEventListener('connectionstatechange', onConnectionStateChange, true);
            peerConnectionref.current.addEventListener('signalingstatechange', onSignalingStateChange, true);
            peerConnectionref.current.addEventListener('track', onTrack, true);


        }


        await peerConnectionref.current.setRemoteDescription(offer);

        console.log('set remote sdp OK');

        const sessionClientAnswer = await peerConnectionref.current.createAnswer();
        console.log('create local sdp OK');

        await peerConnectionref.current.setLocalDescription(sessionClientAnswer);
        console.log('set local sdp OK');

        return sessionClientAnswer;
    }

    function onIceGatheringStateChange() {
        // iceGatheringStatusLabel.innerText = peerConnection.iceGatheringState;
        // iceGatheringStatusLabel.className = 'iceGatheringState-' + peerConnection.iceGatheringState;
        // console.log("iceGatheringStatus: ", peerConnectionref.current.iceGatheringState)
    }

    function onIceCandidate(event) {

        if (event.candidate) {
            const { candidate, sdpMid, sdpMLineIndex } = event.candidate;

            fetch(`${didApiUrl}/talks/streams/${streamIdref.current}/ice`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${didApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    candidate,
                    sdpMid,
                    sdpMLineIndex,
                    session_id: sessionIdref.current
                })
            });
        }
    }

    function onIceConnectionStateChange() {
        console.log("iceStatus: ", peerConnectionref.current.iceConnectionState)
        if (peerConnectionref.current.iceConnectionState === 'failed' || peerConnectionref.current.iceConnectionState === 'closed') {
            console.log("onIceConnectionStateChange close: ", peerConnectionref.current.iceConnectionState)
            stopAllStreams();
            closePC();
        }
    }

    function onConnectionStateChange() {
        // not supported in firefox
        console.log("peerStatus: ", peerConnectionref.current.connectionState)
    }

    function onSignalingStateChange() {
        console.log("signalingStatus: ", peerConnectionref.current.signalingState)
    }

    function onTrack(event) {
        /**
         * The following code is designed to provide information about wether currently there is data
         * that's being streamed - It does so by periodically looking for changes in total stream data size
         *
         * This information in our case is used in order to show idle video while no talk is streaming.
         * To create this idle video use the POST https://api.d-id.com/talks endpoint with a silent audio file or a text script with only ssml breaks
         * https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html#break-tag
         * for seamless results use `config.fluent: true` and provide the same configuration as the streaming video
         */

        console.log("----------->", event.track)
        console.log('MediaStream active:', event.streams[0].active);


        if (!event.track) return;

        statsIntervalId = setInterval(async () => {
            const stats = await peerConnectionref.current.getStats(event.track);
            stats.forEach((report) => {
                if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
                    const videoStatusChanged = videoIsPlaying !== report.bytesReceived > lastBytesReceived;

                    if (videoStatusChanged) {
                        videoIsPlaying = report.bytesReceived > lastBytesReceived;
                        onVideoStatusChange(videoIsPlaying, event.streams[0]);
                    }
                    lastBytesReceived = report.bytesReceived;
                }
            });
        }, 500);
    }




    // useEffect(() => {

    //     const interval = setInterval(() => {
    //         if (seconds > 0) {
    //             setSeconds(seconds - 1);
    //         }

    //         if (seconds === 0) {
    //             if (minutes === 0) {
    //                 clearInterval(interval);
    //             } else {
    //                 setSeconds(59);
    //                 setMinutes(minutes - 1);
    //             }
    //         }
    //     }, 1000);

    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, [seconds]);
    function useInterval(callback, delay) {
        const savedCallback = useRef();
      
        useEffect(() => {
          savedCallback.current = callback;
        }, [callback]);
      
        useEffect(() => {
          function tick() {
            savedCallback.current();
          }
          if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
          }
        }, [delay]);
      }

    const [time, setTime] = useState({ minutes: 14, seconds: 59 });

    const startChatTimer = () => {
      setTime({ minutes: 14, seconds: 59 });
    };
  
    useInterval(() => {
      setTime((prevTime) => {
        if (prevTime.minutes === 0 && prevTime.seconds === 0) {
          // Optionally, you can perform some action when the timer reaches 00:00
          // For example, you can call a function or update some state
          return prevTime;
        }
  
        const newSeconds = prevTime.seconds === 0 ? 59 : prevTime.seconds - 1;
        const newMinutes = prevTime.seconds === 0 ? prevTime.minutes - 1 : prevTime.minutes;
  
        return { minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    function onVideoStatusChange(videoIsPlaying, stream) {
        let status;

        if (videoIsPlaying) {
            setSantaReplyVideoVideoStreaming(true)
            status = 'streaming';
            console.log(stream)
            console.log('MediaStream active:', stream.active, peerConnectionref.current);
            const remoteStream = stream;
            setVideoElement(remoteStream);
            setIsLoadingSantaMessage(false)
        } else {
            setSantaReplyVideoVideoStreaming(false)
            status = 'empty';
            playIdleVideo();
        }

    }



    function setVideoElement(stream) {
        const talkVideo = document.getElementById('talk-video');
        if (!stream) return;
        if (talkVideo) {

            talkVideo.srcObject = stream;
            talkVideo.loop = false;

            // safari hotfix
            if (talkVideo.paused) {
                talkVideo
                    .play()
                    .then((_) => { })
                    .catch((e) => { });
            }
        }
    }

    function playIdleVideo() {
        if (talkVideo) {

            // fetch( randomSantaVideo1)
            // .then(response => response.blob())
            // .then(blob => {
            //   // Convert the Blob into a MediaStream
            //   const stream = new MediaStream([blob]);

            //   // Set the MediaStream to the srcObject property
            //   video.srcObject = stream;
            // })
            // .catch(error => {
            //   console.error('Error fetching video:', error);
            // });

            if (InitialSantaVideoLoadedref.current) {
                talkVideo.srcObject = undefined;
                talkVideo.src = getVideo(randomVideosList);
                talkVideo.loop = true;
            }
        }
    }

    function getVideo(randomVideosList) {
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * randomVideosList.length);

        // Return the item at the random index
        return randomVideosList[randomIndex];
    }

    async function invokeDidChatResponse(input) {
        // connectionState not supported in firefox
        console.log("peerConnection: ", peerConnectionref.current)

        if (peerConnectionref.current?.signalingState === 'stable' || peerConnectionref.current?.iceConnectionState === 'connected') {


            console.log("invokeDidChatResponse")

            await fetchWithRetries(`${didApiUrl}/talks/streams/${streamIdref.current}`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${didApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    script: {
                        type: 'text',
                        input: input ?? 'Hello, how can I help you?',
                        provider: {
                            type: 'microsoft',
                            voice_id: voiceId,
                            voice_config: {
                                style: 'Friendly'
                            }
                        }
                    },
                    config: {
                        stitch: true
                    },
                    session_id: sessionIdref.current
                })
            });
        }
    }



    async function callChatService(requestBody) {
        const hostname = "https://didsantachatter-api.azurewebsites.net/VideoCallApp/RetriveResponse";
        const body = JSON.stringify(requestBody);

        const headers = {
            'Api-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzd',
            'Content-Type': 'application/json',
        };
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body
        };

        const response = await fetch(hostname, requestOptions);
        return response;
    }

    const updateChatMessagesAndInvokeSantaReply = async (currentChatMessage, callback) => {
        setIsLoadingSantaMessage(true)
        await setChatMessages((prevChatMessages) => [
            ...prevChatMessages,
            currentChatMessage
        ]);
        callback(); // Execute the callback
    };

    const handleSendMessageButton = async () => {
        // const userInput = document.getElementById('user-input').value;
        const userInput = userInputText
        if (!userInput) return;
        currentUserMessage = userInput;
        // // Clear user input
        // document.getElementById('user-input').value = '';
        setUserInputText('')


        let currentChatMessage = { message: currentUserMessage, type: 'user', time: getCurrentDateTimeInString() };
        let chatMessagesCopy = [...chatMessages]
        chatMessagesCopy.push(currentChatMessage)
        updateChatMessagesAndInvokeSantaReply(currentChatMessage, async () => {
            console.log("33333");
            const requestBody = buildChatMessageForOpenAi(chatMessagesCopy);
            console.log("requestBody: ", requestBody)
            const chatResponse = await callChatService(requestBody);
            console.log("44444");
            console.log("chatResponse: ", chatResponse)
            const { message } = await chatResponse.json();
            console.log("55555");
            console.log("chatResponse message: ", message)
            currentSantaMessage = message;
            // console.log("CurrentSantaMessage: ", currentSantaMessage)
            console.log("66666");
            setChatMessages((prevChatMessages) => [
                ...prevChatMessages,
                { message: currentSantaMessage, type: 'santa', time: getCurrentDateTimeInString() }
            ]);
            console.log("77777");
            // if (!peerConnection && !peerConnection.connectionState === 'connected') {
            //     await estabilish_DID_connection();
            // }
            // await estabilish_DID_connection()
            await invokeDidChatResponse(currentSantaMessage);
            //Todo await invokeDidChatResponse({ message });
        });

        console.log("ChatMessages in handleSendMessageButton: ", chatMessages)
    };

    function buildChatMessageForOpenAi(currentChatMessages) {
        // let currentChatMessages = [...chatMessages];
        // let currentChatMessages = chatMessagesCopy
        console.log("...chatMessages: ", currentChatMessages)
        let requestBody = [];
        for (let i = 0; i < currentChatMessages.length; i++) {
            console.log(currentChatMessages[i]);
            if (currentChatMessages[i].type === "santa") {
                let botMessage = currentChatMessages[i++]?.message || '';
                let userMessage = '';
                if (currentChatMessages[i].type === "user") {
                    userMessage = currentChatMessages[i]?.message || '';
                }
                requestBody.push({
                    botMessage: botMessage,
                    userMessage: userMessage
                });
            } else {
                let botMessage = '';
                let userMessage = currentChatMessages[i]?.message || '';
                requestBody.push({
                    botMessage: botMessage,
                    userMessage: userMessage
                });
            }
        }
        return requestBody.slice(-3)
    }


    return (


        <div className='Mainlayout d-flex '>
            <div className='container1 my-5'>
                <div className='my-5'>
                    <h1 className='d-none d-sm-block text-white text-center SantaHeading mb-4'>
                        Welcome to Santa's Enchanted Chatroom!
                    </h1>
                    <div className='UserHead row bg-white  '>
                        <div className='col-12 col-lg-3 pe-0 overflow-hidden'>
                            <div className='UserColumn py-4 px-3'>
                                <div className='d-flex justify-content-lg-center justify-content-between align-items-center'>
                                    <div>
                                        <h1 className='text-center mb-1'>Welcome</h1>
                                        <h3 className='text-center'>Arturo Cruz</h3>
                                    </div>
                                    <div className='d-lg-none'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M21 10H7" stroke="#021101" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M21 6H3" stroke="#021101" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M21 14H3" stroke="#021101" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M21 18H7" stroke="#021101" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <div className='d-flex mt-1 mt-md-3 justify-content-center'>
                                    <img src={img1} className='d-none UserView  rounded-pill' alt="" />

                                    <video id="talk-video" ref={videoRef} src={santaInitialVideo} className='rounded-pill UserView' autoPlay    >
                                    </video>
                                </div>
                                {
                                    !chatWithSanta ? <div className=" bd_gray3 h-100  px_loader   top-0 start-0 w-100  ">
                                        <div className="d-flex align-items-center justify-content-center w-100 h-100">
                                            <div className='d-flex justify-content-center w-100   p-4'>
                                                <button className='btn btn-success' onClick={handleChatWithSanta}> Chat with Santa</button>

                                            </div>
                                        </div>
                                    </div> :
                                        <div className='TimeRemain text-center d-flex flex-column align-items-center'>
                                            <h5 className={`${time.minutes < 4 ? "text-danger" : ""} text-center mt-2`}>Remaining time</h5>
                                            <h6 className='text-center px-4 py-2 bg-white rounded'>
                                                <span className={`${time.minutes < 4 ? "text-danger" : ""} `}>
                                                {`${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`}
                                                </span>

                                            </h6>
                                        </div>
                                }
                                <div className='lockScreen  px-2 py-3 py-md-4 bg-white '>
                                    <h2 className='text-center mb-1'>Lock the screen for your child</h2>
                                    <h4 className='text-center'>Use the code to unlock</h4>
                                    <div className='d-flex justify-content-center gap-2 mt-3'>
                                        <input type="text" className='lockinput text-center bg-white' />
                                        <input type="text" className='lockinput text-center bg-white' />
                                        <input type="text" className='lockinput text-center bg-white' />
                                        <input type="text" className='lockinput text-center bg-white' />
                                    </div>
                                    <div className='d-flex mt-4 me-0 me-lg-3 align-items-center justify-content-center justify-content-lg-end'>
                                        <h3 className='mb-0 me-2'>Lock Screen</h3>
                                        <img src={img2} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 col-lg-9 px-0 position-relative '>
                            {
                                !chatWithSanta ? <div></div> : <div>                            
                                    <header className='Header d-none  d-lg-flex justify-content-between px-3 py-3'>
                                    <div className='d-flex align-items-center'>
                                        <img src={img3} className='headeruserimg me-2' alt="" />
                                        <div>
                                            <div className='UserName'>Arturo Cruz<img src={img4} className='userNameIcon ms-2' alt="" />
                                            </div>
                                            <div className='OnlineStatus d-flex align-items-center'>
                                                <div className='OnlineIcon'></div>
                                                <h3 className='mb-0 ms-1'>Online</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <div className='Nav-item d-flex align-items-center justify-content-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16" fill="none">
                                                <path d="M15.2998 5.97984L18.5928 3.28484C19.4088 2.61684 20.6328 3.19884 20.6318 4.25184L20.6198 11.6008C20.6188 12.6538 19.3938 13.2308 18.5798 12.5628L15.2998 9.86784" stroke="#128C7E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.2966 11.5383C15.3775 13.3704 13.8989 14.9196 11.9944 14.9975C11.8541 15.0034 5.01507 14.9896 5.01507 14.9896C3.11972 15.1335 1.46091 13.7715 1.31141 11.9463C1.30014 11.8103 1.30322 4.47219 1.30322 4.47219C1.21925 2.63815 2.6958 1.08499 4.60139 1.00418C4.74372 0.997278 11.5735 1.01009 11.5735 1.01009C13.4781 0.868176 15.142 2.24001 15.2895 4.07405C15.2997 4.2061 15.2966 11.5383 15.2966 11.5383Z" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <div className=''>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                <rect width="48" height="48" rx="8" fill="#DCEFED" />
                                                <path d="M9.5 31.018V31.5415C9.49998 31.846 9.55994 32.1474 9.67644 32.4287C9.79293 32.71 9.96369 32.9656 10.179 33.1809C10.3942 33.3962 10.6498 33.567 10.9311 33.6835C11.2124 33.8 11.5138 33.86 11.8183 33.86H36.1814C36.7963 33.86 37.386 33.6157 37.8209 33.1809C38.2557 32.7461 38.5 32.1564 38.5 31.5415V31.018H9.5Z" fill="#128C7E" />
                                                <path d="M36.1784 15.8799C36.1783 15.4185 35.995 14.9759 35.6687 14.6496C35.3424 14.3233 34.8998 14.14 34.4384 14.14H13.5581C13.3296 14.14 13.1034 14.185 12.8923 14.2725C12.6812 14.3599 12.4894 14.4881 12.3279 14.6497C12.1663 14.8112 12.0382 15.003 11.9507 15.2141C11.8633 15.4252 11.8183 15.6515 11.8184 15.8799V29.742H36.1784V15.8799ZM29.2184 22.0048C29.2184 22.9649 28.96 23.9073 28.4703 24.7331C27.9806 25.559 27.2777 26.2378 26.4353 26.6984L23.9984 28.0311L21.5611 26.6983C20.7188 26.2377 20.016 25.5588 19.5264 24.733C19.0367 23.9072 18.7784 22.9649 18.7784 22.0048V18.0962L23.9984 16.4311L29.2184 18.0962V22.0048Z" fill="#128C7E" />
                                                <path d="M21.7535 22.0196C21.6943 21.9602 21.624 21.913 21.5466 21.8808C21.4692 21.8486 21.3862 21.832 21.3023 21.8319C21.2185 21.8318 21.1354 21.8483 21.058 21.8803C20.9805 21.9124 20.9101 21.9594 20.8508 22.0187C20.7915 22.078 20.7445 22.1483 20.7125 22.2258C20.6804 22.3033 20.664 22.3863 20.6641 22.4702C20.6641 22.554 20.6808 22.637 20.713 22.7144C20.7452 22.7918 20.7923 22.8621 20.8517 22.9213L22.4915 24.561C22.5507 24.6203 22.6211 24.6673 22.6985 24.6994C22.7759 24.7315 22.8588 24.748 22.9426 24.748C23.0264 24.748 23.1094 24.7315 23.1868 24.6994C23.2642 24.6673 23.3345 24.6203 23.3938 24.561L27.1519 20.8024C27.2715 20.6826 27.3386 20.5203 27.3385 20.3511C27.3384 20.1819 27.271 20.0197 27.1513 19.9001C27.0316 19.7805 26.8692 19.7134 26.7 19.7135C26.5308 19.7136 26.3686 19.7809 26.249 19.9007L22.9424 23.2079L21.7535 22.0196Z" fill="#128C7E" />
                                            </svg>
                                        </div>
                                    </div>
                                </header>
                                    <div className='chatSection px-3 px-lg-5' id='chat-container'>
                                        <div className='d-flex messageSection h-100 flex-column justify-content-between'>

                                            <div className='d-flex'>
                                                <div className='m-auto mt-3 mb-3 securityMessge d-flex align-items-center px-2 py-3 '>
                                                    <img src={img6} alt="" />
                                                    <p className='ms-2 mb-0 text-white'>Messages are end-to-end encrypted. No one outside of this chat, not even ChatterSanta can read or listen to them.</p>
                                                </div>
                                            </div>
                                            <div className=''>

                                                <ul className='ps-0'>
                                                    {
                                                        chatMessages.map((messageItem, index) =>
                                                            messageItem.type === "santa" ? <SantaMessageComponent key={index} messagetext={messageItem.message} time={messageItem.time} isLoadingSantaMessage={isLoadingSantaMessage} chatMessages={chatMessages} index={index} /> : <UserMessageComponent key={index} messagetext={messageItem.message} time={messageItem.time} />
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <InputSection
                                        userInputText={userInputText}
                                        handleChangeInUserInputText={handleChangeInUserInputText}
                                        handleSendMessageButton={handleSendMessageButton}
                                        handleChangeInRecognizedSpeech={handleChangeInRecognizedSpeech}
                                        isVoiceInput={isVoiceInput}
                                        handleChangeInInputType={handleChangeInInputType}
                                    /></div>
                            }


                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ChatWithSanta;