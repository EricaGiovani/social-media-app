const emojis = [
  "😀", "😅", "🥰", "😇", "🙂", "😋",
  "🤪", "🤐", "😏", "🤗", "😪", "🙄",
  "🤫", "😴",  "🥵", "😫",  "😭", "😱"
];

export function EmojiPicker({ onPick }: { onPick: (emoji: string) => void }) {
  return (
    <div className="absolute bottom-full left-0 mb-2 grid grid-cols-6 gap-1 rounded-xl border border-border bg-card p-2">
      {emojis.map((e) => (
        <button
          key={e}
          type="button"
          onClick={() => onPick(e)}
          className="flex size-9 items-center justify-center rounded-md text-xl hover:bg-gray-800"
        >
          {e}
        </button>
      ))}
    </div>
  );
}