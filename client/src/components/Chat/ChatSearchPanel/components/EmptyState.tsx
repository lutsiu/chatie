export function EmptyState({ q }: { q: string }) {
  return (
    <div className="mx-[1.6rem] rounded-b-[1rem] bg-zinc-900 border border-zinc-800 border-t-0 px-[1.6rem] py-[1.2rem]">
      <div className="text-center text-zinc-300 text-[1.6rem]">
        There were no results for <span className="text-white">"{q}"</span>. Try a new search.
      </div>
    </div>
  );
}
