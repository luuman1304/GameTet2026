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
      <h1>{snapshot?.name}</h1>
      <p>Mã phòng: {snapshot?.id}</p>
      <p>Trạng thái phòng: {snapshot?.status}</p>
      <div className="card">
        <h3>Vòng chơi</h3>
        <p>ID: {round?.id ?? "Chưa bắt đầu"}</p>
        <p>Trạng thái: {round?.status ?? "N/A"}</p>
        <p>Số đã gọi: {round?.calledNumbers?.join(", ") ?? "-"}</p>
      </div>
      <div className="card">
        <h3>Người chơi</h3>
        <ul>
          {playerIds.map((playerId) => {
            const player = playersById[playerId];
            return (
              <li key={playerId}>
                {player.name} — {player.roundStatus}
                {player.isHost ? " (host)" : ""}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="card">
        <h3>Vé Loto</h3>
        <p>Tổng vé: {tickets.length}</p>
      </div>
      <p>Chúc bạn chơi vui vẻ!</p>
    </section>
  );
};

export default LotoRoomPage;
