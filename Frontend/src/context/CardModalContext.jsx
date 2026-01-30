import { createContext, useContext, useState } from "react";


import agentCard from "../assets/weapons/agent.png";
import airStrikeCard from "../assets/weapons/air-strike.png";
import ballisticMissileCard from "../assets/weapons/ballistic-missile.png";
import brahmosCard from "../assets/weapons/brahmos.png";
import doubleBarrelCard from "../assets/weapons/double-barrel.png";
import dragonCanonCard from "../assets/weapons/drogon-canon.png";
import emergencyMeetingCard from "../assets/weapons/emergency-meeting.png";
import engineerCard from "../assets/weapons/engineer.png";
import grenadeCard from "../assets/weapons/grenade.png";
import hammerCard from "../assets/weapons/hammer.png";
import laserCard from "../assets/weapons/laser.png";
import machineGunCard from "../assets/weapons/machine-gun.png";
import mineCard from "../assets/weapons/mine.png";
import mysteryCard from "../assets/weapons/mystery.png";
import nuclearWeaponCard from "../assets/weapons/nuclear-weapon.png";
import radiationZoneCard from "../assets/weapons/radiation-zone.png";
import revolverCard from "../assets/weapons/revolver.png";
import scientistCard from "../assets/weapons/scientist.png";
import shockWaveCard from "../assets/weapons/shock-wave.png";
import tankCard from "../assets/weapons/tank.png";
import terrorAttackCard from "../assets/weapons/terror-attack.png";
import timeBombCard from "../assets/weapons/timebomb.png";
import torpedoCard from "../assets/weapons/torpedo.png";
import tsunamiCard from "../assets/weapons/tsunami.png";


export const cardMap = {
  "double-barrel": doubleBarrelCard,

  "air-strike": airStrikeCard,
  "ballistic-missile": ballisticMissileCard,
  brahmos: brahmosCard,

  "dragon-cannon": dragonCanonCard,
  "emergency-meeting": emergencyMeetingCard,
  engineer: engineerCard,

  grenade: grenadeCard,
  hammer: hammerCard,
  laser: laserCard,
  "machine-gun": machineGunCard,
  "agent" :agentCard,
  mine: mineCard,
  mystery: mysteryCard,

  "nuclear-attack": nuclearWeaponCard,
  "radiation-zone": radiationZoneCard,

  revolver: revolverCard,
  scientist: scientistCard,
  "shock-wave": shockWaveCard,

  tank: tankCard,
  "terrorist-attack": terrorAttackCard,
  "time-bomb": timeBombCard,

  torpedo: torpedoCard,
  tsunami: tsunamiCard,
};


const CardModalContext = createContext();

export const CardModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [card, setCard] = useState(null);

  const openCard = (cardImg) => {
    setCard(cardImg);
    setIsOpen(true);
  };

  const closeCard = () => {
    setIsOpen(false);
    setCard(null);
  };

  return (
    <CardModalContext.Provider value={{ isOpen, card, openCard, closeCard }}>
      {children}
    </CardModalContext.Provider>
  );
};

export const useCardModal = () => useContext(CardModalContext);
