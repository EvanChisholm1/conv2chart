import { FC, useState, useRef, useEffect } from "react";

interface Props {
    onRecordingFinish?: (blob: Blob) => void;
}

const AudioRecorder: FC<Props> = ({ onRecordingFinish }) => {
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
                setRecording(false);
                const blob = new Blob(chunks.current, {
                    type: "audio/ogg; codecs=opus",
                });

                onRecordingFinish && onRecordingFinish(blob);

                const audioURL = URL.createObjectURL(blob);
                setUrl(audioURL);
            });
        };

        setRecorder();
    }, [onRecordingFinish]);

    useEffect(() => {
        if (!recorder.current) return;

        if (isRecording) {
            if (recorder.current.state === "inactive") {
                recorder.current.start();
            }

            if (recorder.current.state === "paused") recorder.current.resume();
        } else {
            if (recorder.current.state === "recording") {
                recorder.current.stop();
            }
        }
    }, [isRecording]);

    // const finish = () => {
    //     if (!recorder.current) return;

    //     recorder.current.stop();
    // };

    const reset = () => {
        setUrl("");
        chunks.current = [];
    };

    return (
        <div>
            {!isRecording ? (
                <button onClick={() => setRecording(true)}>Start</button>
            ) : (
                <button onClick={() => setRecording(false)}>Stop</button>
            )}

            {!isRecording && <button onClick={reset}>reset</button>}

            {/* <button onClick={finish}>finish</button> */}
            {url && <audio controls={true} src={url}></audio>}
        </div>
    );
};

export default AudioRecorder;
