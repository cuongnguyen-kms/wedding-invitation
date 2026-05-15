type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      data-invitation-section
      className={`section-reveal scroll-mt-4 px-5 py-16 sm:px-8 ${className}`}
    >
      <div className="mx-auto w-full max-w-5xl">
        {eyebrow || title ? (
          <div className="mx-auto mb-10 max-w-2xl text-center">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-rose-500">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="mt-3 font-serif text-3xl text-rose-950 sm:text-5xl">
                {title}
              </h2>
            ) : null}
            <div className="mx-auto mt-5 h-px w-24 bg-rose-200" />
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
