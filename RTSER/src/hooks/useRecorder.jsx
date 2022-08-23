import { useEffect, useState } from "react";

const useRecorder = () => {
  const [audioURL, setAudioURL] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    // Get permission to use the microphone.
    if (recorder === null) {
      if (isRecording) {
        requestRecorder().then(setRecorder, console.error);
      }
      return;
    }

    // Manage recorder state.
    isRecording ? recorder.start() : recorder.stop();

    // Obtain the audio when ready.
    const handleData = (e) => {
      setAudioURL(URL.createObjectURL(e.data));
    };

    // recorder.onstop = () => {
    //   if (audioURL !== "") {
    //     fetch(audioURL)
    //       .then((response) => response.blob())
    //       .then((data) => console.log(data));
    //   }
    // };

    recorder.addEventListener("dataavailable", handleData);
    return () => recorder.removeEventListener("dataavailable", handleData);
  }, [recorder, isRecording]);

  const toggleRecording = () => {
    setIsRecording(() => !isRecording);
  };

  return [audioURL, isRecording, toggleRecording];
};

async function requestRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return new MediaRecorder(stream);
}
export default useRecorder;
