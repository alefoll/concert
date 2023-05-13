import { randomUUID } from "crypto";
import got from "got";
import { getDuration } from "./media.js";
export const fetch = async ({ apiKey, id, }) => {
    const response = await got({
        method: "GET",
        url: `https://api.setlist.fm/rest/1.0/setlist/${id}`,
        headers: {
            "x-api-key": apiKey,
        }
    }).json();
    return response.sets.set[0].song.map(song => {
        const escape = (text) => text.replaceAll("#", "\\#");
        if (!song.with) {
            return escape(song.name);
        }
        return `${escape(song.name)} (with ${escape(song.with.name)})`;
    });
};
export const generateChapterList = ({ media, setlist, }) => {
    const durationInSeconds = getDuration(media);
    const averageSongTime = durationInSeconds / setlist.length;
    const chapters = setlist.map((song, index) => {
        return {
            endTime: 0,
            id: randomUUID(),
            startTime: Math.floor((averageSongTime * index) * 1000),
            title: song,
        };
    }).filter(Boolean).sort((a, b) => (!a || !b) ? -1 : a.startTime - b.startTime);
    return chapters.map((chapter, index) => {
        return {
            ...chapter,
            endTime: chapters[index + 1]
                ? chapters[index + 1].startTime - 1
                : Math.floor(durationInSeconds * 1000),
        };
    });
};
