import { Image } from '@/components/ui/image';

export default function SectionBanner({ id, eyebrow, title, text, image, imageAlt, reverse }) {
  return (
    <div
      id={id}
      className="grid scroll-mt-32 overflow-hidden rounded-[2rem] border border-gold-15 velvet-card lg:grid-cols-[1.1fr_1fr]"
    >
      <div className={`relative h-56 w-full sm:h-72 lg:h-full lg:min-h-[260px] ${reverse ? 'lg:order-2' : ''}`}>
        <Image src={image} alt={imageAlt} className="h-56 w-full sm:h-72 lg:h-full lg:min-h-[260px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(285_74%_7%/.75)] via-transparent to-transparent" />
      </div>

      <div className="flex flex-col justify-center gap-3 px-6 py-8 sm:px-10 lg:py-12">
        {eyebrow && (
          <span className="text-[10px] uppercase tracking-[0.24em] text-gold">{eyebrow}</span>
        )}
        <h2 className="font-display text-3xl text-[hsl(var(--foreground))] sm:text-4xl">{title}</h2>
        <p className="max-w-md text-sm leading-relaxed text-[hsl(273_20%_78%)] sm:text-base">{text}</p>
      </div>
    </div>
  );
}