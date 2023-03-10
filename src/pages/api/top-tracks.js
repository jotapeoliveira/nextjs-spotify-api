import { topTracks } from "lib/spotify";

export default async function handler(req, res) {
    const response = await topTracks();

    if (response.status === 204 || response.status > 400) {
        return res.status(200).json({ isPlaying: false });
    }

    const { items } = await response.json();

    const tracks = items.slice(0, 10).map((track) => ({
        artist: track.artists.map((_artist) => _artist.name).join(', '),
        songUrl: track.external_urls.spotify,
        title: track.name,
        albumCoverUrl: track.album.images[0].url
    }))

    res.setHeader(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=30"
    );

    return res.status(200).json({ tracks })
}