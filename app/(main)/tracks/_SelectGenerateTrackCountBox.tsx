import clsx from "clsx";
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
      className={clsx(
        `flex size-8 items-center justify-center rounded-md p-2`,
        {
          "bg-gray-300": !isChecked,
          "bg-sky-700 text-white": isChecked,
        },
      )}
    >
      <button
        aria-checked={isChecked}
        onClick={e => {
          e.preventDefault();
          setGenerateTrackCount(generateTrackCount);
        }}
        className="font-semibold"
      >
        {generateTrackCount}
      </button>
    </li>
  );
}

export default function SelectGenerateTrackCountBox({
  currentGenerateTrackCount,
  setGenerateTrackCount,
}: SelectGenerateTrackCountBox) {
  return (
    <ul aria-label="generate-track-count-radio-list" className="flex gap-4">
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
