export default function RecommendTrackCarousel() {
  return (
    <section className="relative flex shrink-0 grow basis-0 items-center justify-center bg-green-300 p-2 md:grow-3 md:p-6 xl:grow">
      <div className="absolute top-0 bottom-0 left-4 my-auto flex size-11 items-center justify-center rounded-full bg-white">
        <button className="grow text-2xl font-bold">{`<`}</button>
      </div>
      <div className="absolute top-0 right-4 bottom-0 my-auto flex size-11 items-center justify-center rounded-full bg-white">
        <button className="grow text-2xl font-bold">{`>`}</button>
      </div>
      <div className="flex grow flex-col items-center gap-4">
        <div className="size-32 rounded-md bg-black"></div>
        <div className="flex flex-col items-center gap-2">
          <span>트랙 제목</span>
          <span>트랙 아티스트</span>
        </div>
        <p className="max-h-25 overflow-hidden px-3 text-ellipsis md:w-1/2 md:px-0">
          지금 어떤 걸 선택해야 할지 고민된다면 이 트랙을 강력 추천해 드려요.
          지금 어떤 걸 선택해야 할지 고민된다면 이 트랙을 강력 추천해 드려요.
          지금 어떤 걸 선택해야 할지 고민된다면 이 트랙을 강력 추천해 드려요.
          지금 어떤 걸 선택해야 할지 고민된다면 이 트랙을 강력 추천해 드려요.
          지금 어떤 걸 선택해야 할지 고민된다면 이 트랙을 강력 추천해 드려요.
          지금 어떤 걸 선택해야 할지 고민된다면 이 트랙을 강력 추천해 드려요.
          지금 어떤 걸 선택해야 할지 고민된다면 이 트랙을 강력 추천해 드려요.
          지금 어떤 걸 선택해야 할지 고민된다면 이 트랙을 강력 추천해 드려요.
          지금 어떤 걸 선택해야 할지 고민된다면 이 트랙을 강력 추천해 드려요.
          지금 어떤 걸 선택해야 할지 고민된다면 이 트랙을 강력 추천해 드려요.
        </p>
      </div>
    </section>
  );
}
