import "./App.css";
// import { MediaRecorder as EMR, register } from "extendable-media-recorder";
// import { connect } from "extendable-media-recorder-wav-encoder";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const classes_bar = [
  "Angry 😠",
  "Disgust 🤮",
  "Fear 😨",
  "Happy 😃",
  "Neutral 😐",
  "Sad 😭",
  "Surprised 😲",
];

// const classes = ["🤮😠", "🤮😠", "😲😨", "😃", "😐", "😭", "😲😨"];

const classes = [
  "Angry / Disgust",
  "Angry / Disgust",
  "Fear / Surprised",
  "Happy",
  "Neutral",
  "Sad",
  "Fear / Surprised",
];

colors = [
  ["rgba(255, 99, 132, 1)", "rgba(255, 99, 132, 0.2)"],
  ["rgba(0, 150, 255, 1)", "rgba(0, 150, 255, 0.2)"],
  ["rgba(223, 255, 0, 1)", "rgba(223, 255, 0, 0.2)"],
  ["rgba(255, 127, 80 1)", "rgba(255, 127, 80, 0.2)"],
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
        color: "black",
      },
    },
    y: {
      max: 100,
      min: 0,
      title: {
        display: true,
        text: "Probability",
        color: "black",
      },
      ticks: {
        callback: function (value, index, values) {
          return value + " %";
        },
        stepSize: 5,
      },
    },
  },
};

const UPDATE_RATE = 2000;

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
  });

  let [emotion, setEmotion] = useState([
    {
      name: "...",
      values: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "...",
      values: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "...",
      values: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "...",
      values: [0, 0, 0, 0, 0, 0, 0],
    },
  ]);

  let [color, setColor] = useState({
    c1: [],
    c2: [],
    c3: [],
    c4: [],
  });

  let [showClass, setShowClass] = useState(true);

  if (error) {
    console.log(error);
  }

  const assignColor = (datapoints, highColor, normalColor) => {
    const max = Math.max(...datapoints);
    const res = [];

    datapoints.forEach((point) => {
      if (point === max) {
        res.push(highColor);
      } else {
        res.push(normalColor);
      }
    });

    return res;
  };

  const getEmotion = async (blob) => {
    console.log("Sending audio: ", blob);

    const fd = new FormData();
    fd.append("audio", blob);

    try {
      console.time("update");
      const res = await fetch("http://localhost:8000/get-emo", {
        method: "post",
        body: fd,
      });
      const data = await res.json();
      setEmotion(data.results);
      const c1 = assignColor(
        data.results[0].values,
        "rgba(255, 99, 132, 1)",
        "rgba(255, 99, 132, 0.2)"
      );
      const c2 = assignColor(
        data.results[1].values,
        "rgba(0, 150, 255, 1)",
        "rgba(0, 150, 255, 0.2)"
      );
      const c3 = assignColor(
        data.results[2].values,
        "rgba(223, 255, 0, 1)",
        "rgba(223, 255, 0, 0.2)"
      );
      const c4 = assignColor(
        data.results[3].values,
        "rgba(255, 127, 80 1)",
        "rgba(255, 127, 80, 0.2)"
      );
      setColor({
        c1: c1,
        c2: c2,
        c3: c3,
        c4: c4,
      });
      console.timeEnd("update");
    } catch (err) {
      console.error("Failed to get emotion. ", err);
    }
  };

  const updateChart = async () => {
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
    }, UPDATE_RATE);
    stream.start();
  };

  useEffect(() => {
    if (status !== "recording") return;

    let interval;
    interval = setInterval(() => updateChart(), UPDATE_RATE);

    return () => {
      clearInterval(interval);
    };
  }, [status]);

  return (
    <div className="App">
      <h1>Real Time Speech Emotion Recognition</h1>

      <div>
        <audio className="mx-auto my-10 " src={mediaBlobUrl} controls />
        <div className="text-2xl mb-3">
          <Timer status={status} />
        </div>
        <p className="mb-3">
          {status === "acquiring_media" && "⏳ Getting permission..."}
          {status === "idle" && "🎙️ Ready for Input"}
          {status === "recording" && "🔴 Listening..."}
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
            Start
          </button>

          <button
            className={
              status !== "recording" ? "btn-delete__disabled" : "btn-delete"
            }
            onClick={stopRecording}
            disabled={status !== "recording"}
          >
            Stop
          </button>
        </div>
      </div>

      <div className="text-3xl space-x-5">
        <button
          className={"btn-primary"}
          onClick={() => setShowClass((prev) => !prev)}
        >
          {showClass ? "Show Probabilities" : "Show Class"}
        </button>
      </div>

      {showClass ? (
        <div className="mt-5 flex justify-center">
          <table>
            <tbody>
              {emotion.map(
                (e, i) =>
                  e.name != "..." && (
                    <tr key={i} className="text-4xl">
                      <th>{e.name} : </th>
                      <th>
                        {classes[e.values.indexOf(Math.max(...e.values))]}
                      </th>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5">
          <Bar
            data={{
              labels: classes_bar,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              datasets: [
                {
                  label: emotion[0].name,
                  data: emotion[0].values,
                  borderColor: "rgb(255, 99, 132)",
                  // backgroundColor: "rgba(255, 99, 132, 0.5)",
                  backgroundColor: color.c1,
                },
                {
                  label: emotion[1].name,
                  data: emotion[1].values,
                  borderColor: "rgb(0, 71, 171)",
                  // backgroundColor: "rgba(0, 150, 255, 0.5)",
                  backgroundColor: color.c2,
                },
                {
                  label: emotion[2].name,
                  data: emotion[2].values,
                  borderColor: "rgb(223, 255, 70)",
                  // backgroundColor: "rgba(0, 150, 255, 0.5)",
                  backgroundColor: color.c3,
                },
                {
                  label: emotion[3].name,
                  data: emotion[3].values,
                  borderColor: "rgb(255, 127, 60)",
                  // backgroundColor: "rgba(0, 150, 255, 0.5)",
                  backgroundColor: color.c4,
                },
              ],
            }}
            options={options}
          />
        </div>
      )}
    </div>
  );
}

export default App;
