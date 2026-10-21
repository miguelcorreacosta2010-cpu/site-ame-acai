export default function CategoryNav({ categories, onSelect }) {
  return (
    <nav className="sticky top-16 z-30 -mx-4 mb-2 border-b border-gold-15 bg-[hsl(285_74%_7%/.9)] px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
        <span className="shrink-0 text-[10px] uppercase tracking-[0.24em] text-[hsl(273_20%_64%)]">
          Cardápio
        </span>
        <span className="h-4 w-px shrink-0 bg-[hsl(46_59%_52%/.25)]" />
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className="shrink-0 rounded-full border border-gold-15 px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-gold-soft transition hover:border-gold-30 hover:bg-gold-12"
          >
            {category.label}
          </button>
        ))}
      </div>
    </nav>
  );
}