import AudioRecorder from "./components/AudioInput";
import { useState } from "react";
import { ChartGenerator } from "./components/ChartGenerator";

function App() {
    const [blob, setBlob] = useState<null | Blob>(null);
    const [transcript, setTranscript] = useState("");

    const [isTranscribing, setIsTranscribing] = useState(false);

    const transcribe = async () => {
        setTranscript("");
        setIsTranscribing(true);
        if (!blob) return;

        const formData = new FormData();
        formData.append("audio", blob);

        const response = await fetch("http://localhost:8080/transcribe", {
            method: "POST",
            body: formData,
        });

        const text = (await response.json()).text;
        setTranscript(text);
        setIsTranscribing(false);
    };

    return (
        <>
            <header className="m-10">
                <h1 className="text-center text-5xl font-semibold ">
                    Conv2Chart
                </h1>
                <p className="text-center">
                    <small>A Project by Evan Chisholm</small>
                </p>
            </header>
            <div className="flex flex-col gap-2 place-items-center">
                <div className="flex flex-col gap-2 w-96">
                    <AudioRecorder onRecordingFinish={(b) => setBlob(b)} />

                    {blob ? (
                        <button
                            className="bg-blue-500 text-white rounded-md p-2 px-5 font-semibold hover:bg-blue-600"
                            onClick={transcribe}
                        >
                            Transcribe
                        </button>
                    ) : (
                        ""
                    )}

                    {isTranscribing ? <p>Transcribing...</p> : ""}

                    {transcript && (
                        <>
                            <textarea
                                className="outline-none border-none ring-2 ring-gray-300 rounded focus:ring-blue-500 h-[500px] p-3"
                                onChange={(e) => setTranscript(e.target.value)}
                                value={transcript}
                            ></textarea>
                        </>
                    )}

                    {transcript ? (
                        <ChartGenerator transcript={transcript} />
                    ) : (
                        ""
                    )}
                </div>
            </div>

            <footer></footer>
        </>
    );
}

export default App;
