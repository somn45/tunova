"use client";

import { useState } from "react";
import UserSearchTrackModal from "./_UserSearchTrackModal";

export default function GetTrackSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <section>
        <button onClick={() => setIsModalOpen(true)}>트랙 가져오기</button>
      </section>
      <UserSearchTrackModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </>
  );
}
