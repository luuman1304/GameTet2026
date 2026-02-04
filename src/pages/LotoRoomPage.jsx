import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRoom } from "../api/client.js";
import { useStore } from "../store/index.js";

const LotoRoomPage = () => {
  const { roomId } = useParams();
  const {
    state: { room },
    actions,
  } = useStore();

  useEffect(() => {
    let isMounted = true;
    actions.setRoomLoading(roomId);

    getRoom(roomId)
      .then((data) => {
        if (!isMounted) return;
        actions.setRoomSnapshot(data);
      })
      .catch((error) => {
        if (!isMounted) return;
        actions.setRoomError(error.status === 404 ? "not_found" : "error");
      });

    return () => {
      isMounted = false;
    };
  }, [actions, roomId]);

  if (room.status === "loading") {
    return (
      <section className="page">
        <h1>Loto Room</h1>
        <p>Đang tải phòng...</p>
      </section>
    );
  }

  if (room.status !== "ready") {
    return (
      <section className="page">
        <h1>Loto Room</h1>
        <p>Không thể tải phòng. Hệ thống sẽ điều hướng bạn về lobby.</p>
      </section>
    );
  }

  const { snapshot, playerIds, playersById, round, tickets } = room;

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
