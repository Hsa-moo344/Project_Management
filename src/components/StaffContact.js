import React, { useState } from "react";

const StaffContact = () => {
  const [showAll, setShowAll] = useState(false);

  const staffList = [
    { name: "Say Moo Paw", position: "Administration Manager (1)" },
    {
      name: "Pyone Pyone Kyi",
      position: "Consultant for Bachelor of Nursing Science",
    },
    { name: "Nan Sanay Mue", position: "Nursing Educator" },
    { name: "Saw Nyi Nyi Htoo", position: "Nursing Educator" },
    { name: "Naw Eh Dah Paw", position: "Nursing Educator" },
    { name: "Sumitra Thida Soe", position: "IPSR Project Coordinator" },
    { name: "Moe Hnin Phyu Phwe", position: "Enumerator/Data Officer" },
    { name: "Nway Nway Oo", position: "Deputy Director of Protection" },
  ];

  const displayedList = showAll ? staffList : staffList.slice(0, 3);

  return (
    <div>
      <ul>
        {displayedList.map((item, index) => (
          <li key={index}>
            <strong>{item.name}</strong> — {item.position}
          </li>
        ))}
      </ul>
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default StaffContact;
