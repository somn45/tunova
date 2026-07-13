"use client";

import { useState } from "react";
import GetTrackModal from "./_GetTrackModal";

export default function GetTrackSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <section>
        <button onClick={() => setIsModalOpen(true)}>트랙 가져오기</button>
      </section>
      <GetTrackModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </>
  );
}
