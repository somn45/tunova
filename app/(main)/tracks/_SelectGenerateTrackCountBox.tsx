import { Dispatch, SetStateAction } from "react";

interface SelectGenerateTrackCountBox {
  setGenerateTrackCount: Dispatch<SetStateAction<number>>;
}

export default function SelectGenerateTrackCountBox({
  setGenerateTrackCount,
}: SelectGenerateTrackCountBox) {
  return (
    <ul>
      <li onClick={() => setGenerateTrackCount(1)}>1</li>
      <li onClick={() => setGenerateTrackCount(3)}>3</li>
      <li onClick={() => setGenerateTrackCount(10)}>10</li>
      <li onClick={() => setGenerateTrackCount(20)}>20</li>
    </ul>
  );
}
