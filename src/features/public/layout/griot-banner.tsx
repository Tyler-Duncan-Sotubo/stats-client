import Image from "next/image";

export function GriotBanner() {
  return (
    <aside className="hidden xl:block w-75 2xl:w-87.5 shrink-0">
      <div className="sticky top-6 flex items-start">
        <a
          href="https://tooxclusive.com/stats"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl overflow-hidden w-full"
        >
          <div className="relative w-full h-145">
            <Image
              src="https://tooxclusive.com/wp-content/uploads/2026/04/coachella.jpg"
              alt="Griot — African music intelligence"
              fill
              sizes="(max-width: 1535px) 300px, 350px"
              className="object-cover"
            />
          </div>
        </a>
      </div>
    </aside>
  );
}
