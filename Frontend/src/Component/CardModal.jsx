import { useCardModal } from "../context/CardModalContext";
import './CardModal.css'
const CardModal = () => {
  const { isOpen, card, closeCard } = useCardModal();

  if (!isOpen) return null;

  return (
    <div className="card-overlay" onClick={closeCard}>
      <img
        className="card-image"
        src={card}
        alt="card"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default CardModal;
