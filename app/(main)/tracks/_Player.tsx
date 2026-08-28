import { CirclePlay, FastForward, Play } from "lucide-react";

export default function Player() {
  return (
    <section className="fixed bottom-10 flex h-40 w-full justify-center">
      <div className="flex w-full max-w-4xl bg-blue-300">
        <div className="flex w-1/2 items-center justify-center bg-rose-500">
          <Play size={32} className="text-white" />
        </div>
        <div className="flex w-1/2 flex-col justify-center gap-10">
          <div className="flex flex-col items-center gap-1 px-4 pt-2">
            <span className="w-full overflow-hidden text-center text-nowrap text-ellipsis">
              트랙 제목이 너무 길어서 곤란해지면 어쩌지?
            </span>
          </div>
          <div className="flex w-full justify-center gap-3 px-4">
            <FastForward size={32} className="rotate-180" />
            <CirclePlay size={32} />
            <FastForward size={32} />
          </div>
        </div>
      </div>
    </section>
  );
}
