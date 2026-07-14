import type { TopAlbum } from "@/lib/lastfm/types";
import { formatNumber } from "@/lib/format";
import { ArtTile } from "@/components/art-tile";

/**
 * Uniform grid of album art tiles. Rank is a small muted prefix in the
 * caption line; no hero spans, no badges.
 */
export function TopAlbums({ albums }: { albums: TopAlbum[] }) {
  return (
    <section
      aria-labelledby="top-albums-heading"
      className="rounded-lg border border-border bg-card p-5"
    >
      <header className="mb-4 flex items-baseline justify-between">
        <h2
          id="top-albums-heading"
          className="text-sm font-medium text-foreground"
        >
          Top albums
        </h2>
        {albums.length > 0 && (
          <span className="font-mono text-xs tnum text-muted-foreground">
            {albums.length}
          </span>
        )}
      </header>

      {albums.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No albums in this period.
        </p>
      ) : (
        <ol className="grid grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-4 lg:grid-cols-6">
          {albums.map((album) => (
            <li key={`${album.rank}-${album.artist}-${album.name}`}>
              <a
                href={album.url}
                target="_blank"
                rel="noopener"
                className="group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <ArtTile
                  src={album.image}
                  alt={`${album.name} by ${album.artist}`}
                  label={album.name}
                  className="w-full rounded-md border border-border"
                />
                <div className="mt-2 flex flex-col gap-0.5">
                  <span className="truncate text-[13px] font-medium text-foreground">
                    <span
                      className="font-mono text-xs tnum text-muted-foreground"
                      aria-hidden="true"
                    >
                      {album.rank}
                    </span>{" "}
                    {album.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {album.artist}
                  </span>
                  <span className="font-mono text-xs tnum text-muted-foreground">
                    {formatNumber(album.playcount)}
                    <span> plays</span>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
