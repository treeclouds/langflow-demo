// src/pages/UserChat.jsx

import { ChatWindow } from "../../components";

// async function fetchLiveKitToken(id, room) {
//   try {
//     const response = await axios.post("http://localhost:4000/api/token", {
//       identity: id,
//       room,
//     });
//     return response.data.token;
//   } catch (error) {
//     throw new Error("Failed to get token");
//   }
// }

const UserChat = () => {
  // const [livekitRoom, setLivekitRoom] = useState(null);
  // const room = "sbx-2dg2di-mkqQUmUvHyMNh7HJbREPNZ";
  // const { id } = useParams();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const roomInstance = new Room();

  //   async function init() {
  //     try {
  //       const token = await fetchLiveKitToken(id, room);
  //       const url = process.env.REACT_APP_LIVEKIT_URL;
  //       await roomInstance.connect(url, token);

  //       // Get mic and publish audio track
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         audio: true,
  //       });
  //       const audioTrack = stream.getAudioTracks()[0];
  //       await roomInstance.localParticipant.publishTrack(audioTrack);
  //       setLivekitRoom(roomInstance);
  //     } catch (error) {
  //       console.error("LiveKit connection failed", error);
  //     }
  //   }

  //   init();

  //   return () => {
  //     roomInstance.disconnect();
  //   };
  // }, [id, room]);

  // useEffect(() => {
  //   const storedData = JSON.parse(localStorage.getItem("personal_data"));

  //   if (!storedData) {
  //     navigate("/login");
  //     return;
  //   }

  //   // Adjust this based on how you store user ID in localStorage
  //   if (storedData.username !== id) {
  //     navigate("/forbidden");
  //   }
  // }, [id, navigate]);

  return (
    <div style={{ padding: "2rem" }}>
      <ChatWindow />
    </div>
  );
};

export default UserChat;
