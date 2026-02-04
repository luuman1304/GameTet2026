import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoom } from "../api/client.js";

const LotoRoomPage = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;
    setStatus("loading");

    getRoom(roomId)
      .then((data) => {
        if (!isMounted) return;
        setRoom(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (!isMounted) return;
        setStatus(error.status === 404 ? "not_found" : "error");
      });

    return () => {
      isMounted = false;
    };
  }, [roomId]);

  if (status === "loading") {
    return (
      <section className="page">
        <h1>Loto Room</h1>
        <p>Đang tải phòng...</p>
      </section>
    );
  }

  if (status !== "ready") {
    return (
      <section className="page">
        <h1>Loto Room</h1>
        <p>Không thể tải phòng. Hệ thống sẽ điều hướng bạn về lobby.</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>{room.name}</h1>
      <p>Mã phòng: {room.id}</p>
      {room.visibility ? <p>Chế độ: {room.visibility}</p> : null}
      {room.winRule ? <p>Win rule: {room.winRule}</p> : null}
      <p>Chúc bạn chơi vui vẻ!</p>
    </section>
  );
};

export default LotoRoomPage;
