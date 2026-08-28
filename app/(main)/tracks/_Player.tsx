import { CirclePlay, FastForward, Play } from "lucide-react";

export default function Player() {
  return (
    <section className="fixed bottom-10 flex h-40 w-full justify-center">
      <div className="flex w-full flex-col md:flex-row">
        <div className="flex grow-3 items-center justify-center bg-rose-500 md:w-75 md:grow-0">
          <Play size={32} className="text-white" />
        </div>
        <div className="flex justify-center gap-10 px-2 md:w-[calc(100%-300px)] md:flex-col md:items-center md:p-3">
          <div className="flex w-[calc(100%-136px)] md:w-3/4 md:text-center">
            <span className="w-full overflow-hidden text-nowrap text-ellipsis">
              트랙 제목이 너무 길어서 곤란해지면 어쩌지?
            </span>
          </div>
          <div className="flex w-30 grow justify-center gap-3">
            <FastForward size={24} className="rotate-180" />
            <CirclePlay size={24} />
            <FastForward size={24} />
          </div>
        </div>
      </div>
    </section>
  );
}
