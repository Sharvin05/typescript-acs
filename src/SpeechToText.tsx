import React, { FC, useState, useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import MicIcon from '@material-ui/icons/Mic';

import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'

interface IStates {
    displayText: string;
    audioConfig?: (SpeechSDK.AudioConfig | undefined);
    speechConfig: SpeechSDK.SpeechConfig;
    recognizer: SpeechSDK.SpeechRecognizer;
    isMicOn: boolean;
}

const SpeechToText = () => {
    const [displayText, setDisplayText] = useState<IStates["displayText"]>();
    const [audioConfig, setAudioConfig] = useState<IStates["audioConfig"]>();
    const [speechConfig, setSpeechConfig] = useState<IStates["speechConfig"]>();
    const [recognizer, setRecognizer] = useState<IStates["recognizer"]>();
    const [isMicOn, setIsMicOn] = useState<IStates["isMicOn"]>(false);
    useEffect(() => {
        console.log("audio speech config - ", audioConfig, speechConfig, isMicOn);
        console.log("recognizer - ", recognizer);
        if (!audioConfig || !speechConfig || !isMicOn || recognizer) return;
        console.log("set mic recognizer");
        const recognizerTemp = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
        recognizerTemp.startContinuousRecognitionAsync();
        console.log("starting mic recognition");
        recognizerTemp.recognizing = (s: any, e: SpeechSDK.SpeechRecognitionEventArgs) => {
            setDisplayText(e.result.text); // recognizing text is  assigned here
        };
        recognizerTemp.recognized = (s: any, e: SpeechSDK.SpeechRecognitionEventArgs) => {
            if (e.result.reason == SpeechSDK.ResultReason.RecognizedSpeech) {
                setDisplayText(e.result.text); //recognized text

            }
            //  else if (e.result.reason == SpeechSDK.ResultReason.NoMatch) {
            //     setDisplayText(`Hold the button while you are speaking`);
            // }
        };
        recognizerTemp.canceled = (s: any, e: SpeechSDK.SpeechRecognitionCanceledEventArgs) => {
            console.log(`CANCELED: Reason=${e.reason}`);
            if (e.reason == SpeechSDK.CancellationReason.Error) {
                recognizerTemp.stopContinuousRecognitionAsync();
                console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
                console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
                console.log(
                    "CANCELED: Did you set the speech resource key and region values?"
                );
            }
        };
        recognizerTemp.sessionStopped = (s: any, e) => {
            console.log("\n    Session stopped event.");
            recognizerTemp.stopContinuousRecognitionAsync();
        };
        setRecognizer(recognizerTemp);
    }, [audioConfig, speechConfig, isMicOn]);
    useEffect(() => {
        console.log("useeffect for isMicOn - ", isMicOn, recognizer);
        if (!recognizer) return;
        if (isMicOn) {
            recognizer.startContinuousRecognitionAsync();
            console.log("start mic recognition");
        } else {
            recognizer.stopContinuousRecognitionAsync();
        }
    }, [isMicOn]);
 function sttFromMic(){
        console.log("start mic");
        setIsMicOn(true);
        setAudioConfig(SpeechSDK.AudioConfig.fromDefaultMicrophoneInput());
        setSpeechConfig(SpeechSDK.SpeechConfig.fromSubscription(
            "44338cdb83f74d1e805b732d8fe0bfbe",
            "westeurope")
            );
        // await setRecognizer(new speechsdk.SpeechRecognizer(speechConfig,audioConfig))
    }
    return (
        // <div className="app-container">
        //     <h1 className="display-4 mb-3">Speech sample app</h1>
        //     <div className="row main-container">
        //         <div className="col-6">
        //             <button
        //                 className="btn btn-primary"
        //                 onMouseDown={() => sttFromMic()}
        //                 onTouchStart={() => sttFromMic()}
        //                 onMouseUp={() => setIsMicOn(false)}
        //                 onMouseLeave={() => setIsMicOn(false)}
        //                 onTouchEnd={() => setIsMicOn(false)}

        //             >
        //                 start/stop
        //             </button>
        //         </div>
        //         <div className="col-6 output-display rounded">
        //            the word you spoke:{displayText}
        //         </div>
        //     </div>

        <div className="search">
            <div className="searchInputs search-Box">
                <div className="searchIcon"><SearchIcon /></div>
                <input type="text" placeholder="search here......" value={displayText} />
                <button
                    onMouseDown={() => sttFromMic()}
                    onTouchStart={() => sttFromMic()}
                    onMouseUp={() => setIsMicOn(false)}
                    onMouseLeave={() => setIsMicOn(false)}
                    onTouchEnd={() => setIsMicOn(false)}
                > <div className="micIcon"><MicIcon></MicIcon></div> </button>

            </div>

        </div>
    );




}
export default SpeechToText