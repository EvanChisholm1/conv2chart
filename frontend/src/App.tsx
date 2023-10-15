import AudioRecorder from "./components/AudioInput";
import "./App.css";
import { useState } from "react";

interface ChartItem {
    name: string;
    content: string;
}

function App() {
    const [blob, setBlob] = useState<null | Blob>(null);
    const [transcript, setTranscript] = useState("");
    const [chartItems, setChartItems] = useState<null | ChartItem[]>(null);

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

    const generateChart = async () => {
        const response = await fetch("http://localhost:8080/fill-chart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ transcript: transcript }),
        });

        const json = await response.json();
        console.log(json);

        setChartItems(json["chart_items"]);
    };

    return (
        <>
            <h1>Conv2Chart</h1>
            <AudioRecorder onRecordingFinish={(b) => setBlob(b)} />
            <button onClick={transcribe}>transcribe</button>
            {transcript && (
                <>
                    <textarea
                        onChange={(e) => setTranscript(e.target.value)}
                        value={transcript}
                    ></textarea>
                    <button onClick={generateChart}>Generate Chart</button>
                </>
            )}

            {chartItems
                ? chartItems.map((item) => (
                      <div key={item.name}>
                          <h2>{item.name}</h2>
                          <p>{item.content}</p>
                      </div>
                  ))
                : ""}
        </>
    );
}

export default App;
