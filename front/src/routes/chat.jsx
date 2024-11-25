import { useEffect, useState } from "react";
import { GET_GetLoggedUser } from "../requests";
import useWebSocket from "react-use-websocket";

export default function Chat() {
  // const [createdWS, setCreatedWS] = useState(false);
  // const [history, setHistory] = useState([]);
  // const [ws, setWS] = useState(null);
  // const [user, setUser] = useState(null);
  // useEffect(() => {
  //   GET_GetLoggedUser().then((loggedUser) => {
  //     setUser(loggedUser);
  //     let newWS = new WebSocket(
  //       `ws://localhost:8000/api/chat/ws/${loggedUser.email}`,
  //     );
  //     setWS(newWS);
  //     return () => newWS.close();
  //   });
  // }, []);
  //
  // if (ws && createdWS == false) {
  //   setHistory([]);
  //   let newWS = new WebSocket(`ws://localhost:8000/api/chat/ws/${user.email}`);
  //   newWS.onmessage = function (event) {
  //     let newHistory = history.slice();
  //     newHistory.push(event.data);
  //     setHistory(newHistory);
  //   };
  //   setWS(newWS);
  //   setCreatedWS(true);
  // }
  //
  // const [msg, setMsg] = useState("");
  // const sendMsg = function () {
  //   ws.send(msg);
  // };

  const [user, setUser] = useState(null);
  useEffect(() => {
    GET_GetLoggedUser().then((loggedUser) => {
      setUser(loggedUser);
    });
  }, []);

  const socketUrl = user
    ? `ws://localhost:8000/api/chat/ws/${user.email}`
    : null;
  const { sendMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    onMessage: (event) => {
      console.log("MESSAGE: " + event.data);
      history.unshift(String(event.data));
      setHistory(history);
    },
    shouldReconnect: () => true,
  });

  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState("");
  const sendMsg = function () {
    sendMessage(msg);
  };

  return (
    <>
      {user ? (
        <>
          <div>{user.email}</div>{" "}
          <div>
            <input
              type="text"
              onChange={(e) => {
                setMsg(e.target.value);
              }}
              value={msg}
            />
            <button type="button" onClick={sendMsg}>
              Send
            </button>
            <ul>
              {history
                ? history.map((msg) => (
                    <li key={msg + Date.now() + Math.random()}>{msg}</li>
                  ))
                : "Loading..."}
            </ul>
          </div>
        </>
      ) : (
        "Loading..."
      )}
    </>
  );
}
