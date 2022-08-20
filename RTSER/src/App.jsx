import "./App.css";
import useRecorder from "./hooks/useRecorder";
import { useEffect, useState } from "react";
import loadingGif from "./assets/loading.gif";
import errorGif from "./assets/error.gif";

function App() {
  let [audioURL, isRecording, toggleRecording] = useRecorder();
  let [emotion, setEmotion] = useState("");

  const getEmotion = async (blob) => {
    setEmotion("loading");
    console.log("Making request from frontend", blob);

    const fd = new FormData();
    fd.append("audio", blob);

    fetch("http://localhost:8000/get-emo", {
      method: "post",
      body: fd,
    })
      .then((res) => res.json())
      .then((data) => setEmotion(data.emotion))
      .catch((err) => {
        console.error(err);
        setEmotion("error");
      });
  };

  useEffect(() => {
    if (audioURL !== "") {
      fetch(audioURL)
        .then((response) => response.blob())
        .then((data) => getEmotion(data))
        .catch((err) =>
          console.error("Failed to fetch blob from audio URL", err)
        );
    }

    // Cleanup
    return () => (audioURL = "");
  }, [audioURL]);

  const showResult = () => {
    if (emotion === "loading") {
      return (
        <img
          className="block mx-auto w-1/12"
          src={loadingGif}
          alt="loading..."
        />
      );
    } else if (emotion === "error") {
      return (
        <img className="block mx-auto w-1/12" src={errorGif} alt="loading..." />
      );
    } else if (emotion === "") {
      return "Allow microphone access to see results";
    } else {
      return (
        <div className="flex justify-center mt-5">
          <div className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full">
            {emotion}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="App">
      <h1>Real Time Speech Emotion Recognition</h1>
      <audio className="mx-auto my-10" src={audioURL} controls />
      <div className="text-3xl">
        <button onClick={toggleRecording}>
          {isRecording ? "🔴 Stop Recording" : "🎙️ Start Recording"}
        </button>
      </div>
      <div className="mt-5 text-xl max-h-3">
        <div>{showResult()}</div>
      </div>
    </div>
  );
}

export default App;
