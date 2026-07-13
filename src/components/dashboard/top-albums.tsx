import type { TopAlbum } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";
import { ArtTile } from "@/components/art-tile";

/**
 * Sleeve-grid of album art. Rank 1 spans 2x2 for editorial asymmetry;
 * rank badges sit like stickers on the corner of each sleeve.
 */
export function TopAlbums({ albums }: { albums: TopAlbum[] }) {
  return (
    <section aria-labelledby="top-albums-heading">
      <header className="mb-6 flex items-baseline justify-between border-t border-border pt-3">
        <h2
          id="top-albums-heading"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          Top Albums
        </h2>
        {albums.length > 0 && (
          <span className="font-mono text-[11px] tnum text-muted-foreground">
            {String(albums.length).padStart(2, "0")}
          </span>
        )}
      </header>

      {albums.length === 0 ? (
        <p className="font-mono text-xs text-muted-foreground">
          No albums in this period.
        </p>
      ) : (
        <ol className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {albums.map((album) => {
            const first = album.rank === 1;
            return (
              <li
                key={`${album.rank}-${album.artist}-${album.name}`}
                className={first ? "col-span-2 row-span-2" : ""}
              >
                <a
                  href={album.url}
                  target="_blank"
                  rel="noopener"
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <div className="relative overflow-hidden">
                    <ArtTile
                      src={album.image}
                      alt={`${album.name} by ${album.artist}`}
                      label={album.name}
                      className="w-full transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.02]"
                    />
                    <span
                      className={`absolute top-2 left-2 z-10 px-1.5 py-0.5 font-mono text-[10px] tnum tracking-wider transition-colors duration-200 ease-out ${
                        first
                          ? "bg-primary text-primary-foreground"
                          : "bg-background/85 text-foreground backdrop-blur-sm group-hover:bg-primary group-hover:text-primary-foreground"
                      }`}
                      aria-hidden="true"
                    >
                      {String(album.rank).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-2.5 flex flex-col gap-0.5">
                    <span
                      className={`truncate transition-colors duration-200 group-hover:text-primary ${
                        first
                          ? "font-display text-lg font-medium tracking-tight sm:text-xl"
                          : "text-sm font-medium"
                      }`}
                    >
                      {album.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {album.artist}
                    </span>
                    <span className="font-mono text-[11px] tnum text-muted-foreground">
                      {formatNumber(album.playcount)}
                      <span> plays</span>
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
