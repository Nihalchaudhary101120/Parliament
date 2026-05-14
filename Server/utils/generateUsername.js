const names = [
    "Jon Snow", "Aan", "chishiya",
    "Tony Stark", "Martha", "BulldojerBABA", "Parliament Crusher", "Missile Dropper", "Punisher", "Gun Man", "Ghost"
];

const generateGuestUsername = () => {
    const name = names[Math.floor(Math.random() * names.length)];
    const number = Math.floor(1000 + Math.random() * 9000);
    return `${name}_${number}`;
};

export default generateGuestUsername;
