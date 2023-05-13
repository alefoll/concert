import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import { DATA_FOLDER, FFMETADATA_EXTENSIONS } from "./constant.js";
import { getFilepath as getChapterFilepath } from "./chapter.js";
export const getFilepath = (media) => resolve(DATA_FOLDER, `${media.filename}${FFMETADATA_EXTENSIONS}`);
export const generateFFMetadata = ({ media }) => {
    const chapterFileContent = readFileSync(getChapterFilepath(media), "utf8");
    const lines = chapterFileContent.split("\n");
    const timeRegex = /^(\d{1,2}):(\d{2}):(\d{2}) (.*)/;
    const chapters = lines.map(line => {
        const match = line.match(timeRegex);
        if (!match) {
            return;
        }
        const [_, hours, minutes, seconds, chapterTitle] = match;
        return {
            startTime: (parseInt(seconds, 10) + parseInt(minutes, 10) * 60 + parseInt(hours, 10) * 3600) * 1000000000,
            endTime: Number.MAX_SAFE_INTEGER,
            chapterTitle,
        };
    }).filter(Boolean).sort((a, b) => (!a || !b) ? -1 : a.startTime - b.startTime);
    const ffmetadata = chapters.map(({ startTime, endTime, chapterTitle }, index) => {
        return `[CHAPTER]
TIMEBASE=1/1000000000
START=${startTime}
END=${chapters[index + 1] ? chapters[index + 1].startTime - 1 : endTime}
title=${chapterTitle}`;
    });
    const data = [";FFMETADATA1", ...ffmetadata].join("\n");
    writeFileSync(getFilepath(media), data, "utf8");
};
