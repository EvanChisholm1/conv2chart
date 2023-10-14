import { FC, useState, useRef, useEffect } from "react";

const AudioRecorder: FC = () => {
    const [isRecording, setRecording] = useState(false);
    const recorder = useRef<null | MediaRecorder>(null);
    const chunks = useRef<Blob[]>([]);
    const [url, setUrl] = useState("");

    useEffect(() => {
        const setRecorder = async () => {
            const deviceStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });

            recorder.current = new MediaRecorder(deviceStream);
            recorder.current.stop();

            recorder.current.addEventListener("dataavailable", (e) => {
                chunks.current.push(e.data);
                console.log("new chunk", e.data);
            });

            recorder.current.addEventListener("stop", () => {
                const blob = new Blob(chunks.current, {
                    type: "audio/ogg; codecs=opus",
                });

                const audioURL = URL.createObjectURL(blob);
                setUrl(audioURL);
            });
        };

        setRecorder();
    }, []);

    useEffect(() => {
        if (!recorder.current) return;

        if (isRecording) {
            if (recorder.current.state === "inactive") {
                recorder.current.start();
            }

            if (recorder.current.state === "paused") recorder.current.resume();
        } else {
            if (recorder.current.state === "recording") {
                recorder.current.pause();
            }
        }
    }, [isRecording]);

    const finish = () => {
        if (!recorder.current) return;

        recorder.current.stop();
    };

    return (
        <div>
            {!isRecording ? (
                <button onClick={() => setRecording(true)}>Start</button>
            ) : (
                <button onClick={() => setRecording(false)}>Pause</button>
            )}

            <button onClick={finish}>finish</button>
            {url && <audio controls={true} src={url}></audio>}
        </div>
    );
};

export default AudioRecorder;
