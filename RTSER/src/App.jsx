import "./App.css";
import useRecorder from "./hooks/useRecorder";
import { useEffect, useState } from "react";
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
import loadingGif from "./assets/loading.gif";
import errorGif from "./assets/error.gif";
// import Charts from "./components/Charts";

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
  let [audioURL, isRecording, toggleRecording] = useRecorder();
  let [emotion, setEmotion] = useState([
    {
      name: "Model Name",
      values: [0, 0, 0, 0, 0, 0, 0],
    },
  ]);

  console.log(emotion[0].name);

  useEffect(() => {
    const getEmotion = async (blob) => {
      console.log("Making request from frontend", blob);

      const fd = new FormData();
      fd.append("audio", blob);

      fetch("http://localhost:8000/get-emo", {
        method: "post",
        body: fd,
      })
        .then((res) => res.json())
        .then((data) => setEmotion(data.results))
        .catch((err) => {
          console.error("Failed to get emotion. ", err);
        });
    };

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

  return (
    <div className="App">
      <h1>Real Time Speech Emotion Recognition</h1>
      <audio className="mx-auto my-10" src={audioURL} controls />
      <div className="text-3xl">
        <button onClick={toggleRecording}>
          {isRecording ? "🔴 Stop Recording" : "🎙️ Start Recording"}
        </button>
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
