import AudioRecorder from "./components/AudioInput";
import "./App.css";
import { useState } from "react";

function App() {
    const [blob, setBlob] = useState<null | Blob>(null);
    const [transcript, setTranscript] = useState("");
    const transcribe = async () => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("audio", blob);

        const response = await fetch("http://localhost:8080/transcribe", {
            method: "POST",
            body: formData,
        });

        const text = (await response.json()).text;
        setTranscript(text);
    };

    return (
        <>
            <h1>Conv2Chart</h1>
            <AudioRecorder onRecordingFinish={(b) => setBlob(b)} />
            <button onClick={transcribe}>transcribe</button>
            {transcript && (
                <textarea
                    onChange={(e) => setTranscript(e.target.value)}
                    value={transcript}
                ></textarea>
            )}
        </>
    );
}

export default App;
