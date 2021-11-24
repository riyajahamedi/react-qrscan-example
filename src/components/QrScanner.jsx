import { useEffect, useRef, useState } from "react";
import QrcodeDecoder from "qrcode-decoder";
import axios from "axios";

const onScan = async (start, video, callback) => {
  const qr = new QrcodeDecoder();
  if (start) {
    if (!qr.isCanvasSupported()) {
      alert("Your browser doesn't match the required specs.");
      throw new Error("Canvas and getUserMedia are required");
    }

    let code = await qr.decodeFromCamera(video);
    qr.stop();
    callback(code);
  }
};

export const QRScanView = (props) => {
  const [showScanner, setShowScanner] = useState(false);
  const [user, setUser] = useState(null);
  const videoRef = useRef(null);
  useEffect(() => {
    onScan(showScanner, videoRef.current, async (code) => {
      try {
        const userId = parseInt(code.data);
        if (userId) {
          const userData = await axios.get(
            `https://1xfkvu74fb.execute-api.us-east-1.amazonaws.com/default/aurora_users?id=${userId}`
          );
          setUser(userData.data[0]);
        }
      } catch (e) {
        console.log(e);
      }
      console.log(code);
      setShowScanner(false);
    });
  }, [showScanner]);

  return (
    <div className="flex">
      <div className="flex-1 flex justify-center items-start">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            if (!showScanner) {
              setShowScanner(true);
            }
          }}
        >
          Scan
        </button>
      </div>

      <div className="flex-1">
        {showScanner && <video ref={videoRef} autoPlay className="scanner" />}
        {!showScanner && user && (
          <ul>
            <li className="py-2">
              <label className="text-lg">Name: </label>
              <label className="text-lg font-bold">{user.name}</label>
            </li>
            <li className="py-2">
              <label className="text-lg">E-mail: </label>
              <label className="text-lg font-bold">{user.email}</label>
            </li>
            <li className="py-2">
              <label className="text-lg">Phone: </label>
              <label className="text-lg font-bold">{user.phone_number}</label>
            </li>
            <li className="py-2">
              <label className="text-lg">City: </label>
              <label className="text-lg font-bold">{user.city}</label>
            </li>
            <li className="py-2">
              <label className="text-lg">State: </label>
              <label className="text-lg font-bold">{user.state}</label>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};
