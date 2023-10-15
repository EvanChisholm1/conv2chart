import AudioRecorder from "./components/AudioInput";
import { useState } from "react";

interface ChartItem {
    name: string;
    content: string;
}

function App() {
    const [blob, setBlob] = useState<null | Blob>(null);
    const [transcript, setTranscript] = useState("A");
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
            <h1 className="text-center text-5xl font-semibold m-10">
                Conv2Chart
            </h1>
            <div className="flex flex-col gap-2 place-items-center">
                <div className="flex flex-col gap-2 w-96">
                    <AudioRecorder onRecordingFinish={(b) => setBlob(b)} />
                    <button
                        className="bg-blue-500 text-white rounded-md p-2 px-5 font-semibold hover:bg-blue-600"
                        onClick={transcribe}
                    >
                        Transcribe
                    </button>
                    {transcript && (
                        <>
                            <textarea
                                className="outline-none border-none ring-2 ring-gray-300 rounded focus:ring-blue-500 h-[500px] p-3"
                                onChange={(e) => setTranscript(e.target.value)}
                                value={transcript}
                            ></textarea>
                            <button
                                className="bg-green-600 text-white rounded-md p-2 px-5 font-semibold hover:bg-green-700"
                                onClick={generateChart}
                            >
                                Generate Chart
                            </button>
                        </>
                    )}
                    {chartItems ? (
                        <>
                            <h2 className="font-semibold text-3xl">Chart:</h2>
                            <ul className="flex flex-col gap-2">
                                {chartItems.map((item) => (
                                    <li
                                        className="flex flex-col gap-2"
                                        key={item.name}
                                    >
                                        <hr />
                                        <h3 className="font-medium text-lg">
                                            {item.name}:
                                        </h3>
                                        {item.content
                                            .split("\n")
                                            .map((c, i) => (
                                                <p key={i}>{c}</p>
                                            ))}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </>
    );
}

export default App;
