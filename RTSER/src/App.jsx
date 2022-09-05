import "./App.css";
import { useReactMediaRecorder } from "react-media-recorder";
import { useEffect, useState } from "react";
import Timer from "./components/Timer";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// import loadingGif from "./assets/loading.gif";
// import errorGif from "./assets/error.gif";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const classes = [
  "Angry 😠",
  "Disgust 🤮",
  "Fear 😨",
  "Happy 😃",
  "Neutral 😐",
  "Pleasantly Surprised 😲",
  "Sad 😭",
];

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Results",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Emotions",
        color: "blue",
      },
    },
    y: {
      title: {
        display: true,
        text: "Probability",
        color: "blue",
      },
      ticks: {
        callback: function (value, index, values) {
          return value + "%";
        },
      },
    },
  },
};

function App() {
  const {
    status,
    error,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewAudioStream,
  } = useReactMediaRecorder({
    audio: true,
    askPermissionOnMount: true,
    blobPropertyBag: { type: "audio/wav" },
  });

  let [emotion, setEmotion] = useState([
    {
      name: "CNN+LSTM (SUBESCO)",
      values: [0, 0, 0, 0, 0, 0, 0],
    },
  ]);

  if (error) {
    console.log(error);
  }

  const getEmotion = async (blob) => {
    console.log("Making request from frontend", blob);

    const fd = new FormData();
    fd.append("audio", blob);

    try {
      const res = await fetch("http://localhost:8000/get-emo", {
        method: "post",
        body: fd,
      });
      console.log(res);
      const data = await res.json();
      console.log(data);
      setEmotion(data.results);
    } catch (err) {
      console.error("Failed to get emotion. ", err);
    }
  };

  const updateChart = () => {
    let chunks = [];
    const stream = new MediaRecorder(previewAudioStream);
    stream.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    // Send to server
    stream.onstop = (e) => getEmotion(new Blob(chunks));

    setTimeout(() => {
      if (stream.state != "inactive") {
        stream.stop();
      }
    }, 3000);
    stream.start();
  };

  useEffect(() => {
    if (status !== "recording") return;

    let interval;
    interval = setInterval(() => updateChart(), 3000);

    return () => {
      clearInterval(interval);
    };
  }, [status]);

  return (
    <div className="App">
      <h1>Real Time Speech Emotion Recognition</h1>

      <div>
        <audio className="mx-auto my-10" src={mediaBlobUrl} controls />
        <div className="text-2xl mb-3">
          <Timer status={status} />
        </div>
        <p className="mb-3">
          {status === "acquiring_media" && "⏳ Getting permission..."}
          {status === "idle" && "🎙️ Ready for Input"}
          {status === "recording" && "🔴 Recording..."}
          {status === "stopping" && "❕ Stopping..."}
          {status === "stopped" && "❌ Stopped"}
          {/* {console.log("Recording status: ", status)} */}
        </p>
        <div className="text-3xl space-x-5">
          <button
            className={
              status !== "recording" ? "btn-primary" : "btn-primary__disabled"
            }
            onClick={startRecording}
            disabled={status === "recording"}
          >
            Start Speaking
          </button>

          <button
            className={
              status !== "recording" ? "btn-delete__disabled" : "btn-delete"
            }
            onClick={stopRecording}
            disabled={status !== "recording"}
          >
            Stop Speaking
          </button>
        </div>
      </div>

      <div className="mt-5">
        <Bar
          data={{
            labels: classes,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            datasets: [
              {
                label: emotion[0].name,
                data: emotion[0].values,
                // backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
            ],
          }}
          options={options}
        />
      </div>
    </div>
  );
}

export default App;
