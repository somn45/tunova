import { Dispatch, SetStateAction } from "react";

interface SelectGenerateTrackCountBox {
  currentGenerateTrackCount: number;
  setGenerateTrackCount: Dispatch<SetStateAction<number>>;
}

interface GenerateTrackCountOptionProps extends SelectGenerateTrackCountBox {
  generateTrackCount: number;
}

function GenerateTrackCountOption({
  generateTrackCount,
  currentGenerateTrackCount,
  setGenerateTrackCount,
}: GenerateTrackCountOptionProps) {
  const isChecked = currentGenerateTrackCount === generateTrackCount;
  return (
    <li
      className={`${isChecked ? "font-semibold text-black" : "font-normal text-gray-600"} cursor-pointer`}
      aria-checked={isChecked}
      onClick={() => setGenerateTrackCount(generateTrackCount)}
    >
      {generateTrackCount}
    </li>
  );
}

export default function SelectGenerateTrackCountBox({
  currentGenerateTrackCount,
  setGenerateTrackCount,
}: SelectGenerateTrackCountBox) {
  return (
    <ul aria-label="generate-track-count-radio-list">
      <GenerateTrackCountOption
        generateTrackCount={1}
        currentGenerateTrackCount={currentGenerateTrackCount}
        setGenerateTrackCount={setGenerateTrackCount}
      />
      <GenerateTrackCountOption
        generateTrackCount={3}
        currentGenerateTrackCount={currentGenerateTrackCount}
        setGenerateTrackCount={setGenerateTrackCount}
      />
      <GenerateTrackCountOption
        generateTrackCount={10}
        currentGenerateTrackCount={currentGenerateTrackCount}
        setGenerateTrackCount={setGenerateTrackCount}
      />
      <GenerateTrackCountOption
        generateTrackCount={20}
        currentGenerateTrackCount={currentGenerateTrackCount}
        setGenerateTrackCount={setGenerateTrackCount}
      />
    </ul>
  );
}
