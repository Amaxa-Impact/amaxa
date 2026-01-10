"use client ";

export const SkewedInfiniteScroll = (props: {
  items: {
    name: string;
    quote: string;
  }[];
}) => {
  const items = props.items;
  return (
    <div>
      <div className="flex w-full items-center justify-center">
        <div
          className="relative w-full max-w-screen-lg overflow-hidden"
          style={{
            maskComposite: "intersect",
            maskImage: `
          linear-gradient(to bottom, transparent, black 5rem),
          linear-gradient(to top,    transparent, black 5rem)
        `,
          }}
        >
          <div className="animate-skew-scroll mx-auto grid h-[650px] grid-cols-1 gap-5 sm:grid-cols-4">
            {items.map((item, idx) => (
              <li
                className="border-border relative w-[310px] max-w-full flex-shrink-0 rounded-2xl border bg-white px-8 py-6 md:w-[310px]"
                key={idx}
              >
                <blockquote>
                  <div
                    aria-hidden="true"
                    className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                  />

                  <div className="mb-6 flex items-center space-x-2">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="max-w-36 truncate">{item.name}</span>
                      </div>
                    </div>
                  </div>
                  <span className="relative z-20 text-sm leading-[1.6] font-normal text-[#878787]">
                    {item.quote}
                  </span>
                </blockquote>
              </li>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
