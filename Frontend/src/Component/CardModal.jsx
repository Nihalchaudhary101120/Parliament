import { useCardModal } from "../context/CardModalContext";
import './CardModal.css'
const CardModal = ({ socket, roomId, myUserIdRef, currentTurnRef }) => {
  const { isOpen, card, closeCard, purchasable, cardName } = useCardModal();

  const handleCardClick = (e) => {
    e.preventDefault();
    if (!purchasable) return;
    if (currentTurnRef?.toString() !== myUserIdRef.current?.toString()) return;
    const confirmed = window.confirm(`Do you want to purchase ${cardName}`);
    if (!confirmed) return;
    if (cardName === "emergency-meeting") {
      socket.emit("emergency-meeting", { gameCode: roomId });
    }
    else if(cardName === "wall-maria" || cardName ==="wall-rose" || cardName ==="wall-sena"){
      socket.emit("wall-purchase",{gameCode : roomId , cardName : cardName });
    }
    closeCard();
  };

  if (!isOpen) return null;

  return (
    <div className="card-overlay" onClick={closeCard}>
      <img
        className="card-image"
        src={card}
        alt="card"
        // onClick={(e)=>e.stopPropagation()}
      />
      <button
      onClick={handleCardClick}
      >Buy</button>
    </div>
  );
};

export default CardModal;
