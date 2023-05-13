import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from "fs";
import { resolve } from "path";
import { randomUUID } from "crypto";

import { DATA_FOLDER, FFMETADATA_EXTENSIONS } from "./constant.js";
import { Media } from "./media.js";
import { spawn } from "child_process";

export const getFilepath = (media: Media) => resolve(DATA_FOLDER, `${media.filename}${FFMETADATA_EXTENSIONS}`);

export interface Chapter {
    endTime   : number,
    id        : string,
    startTime : number,
    title     : string,
}

export const generate = ({ chapterList }: { chapterList : Chapter[] }) => {
    const metadata = chapterList.map(({ startTime, endTime, title }, index) => {
        return `[CHAPTER]
TIMEBASE=1/1000000000
START=${ startTime }
END=${ chapterList[index + 1] ?  chapterList[index + 1].startTime - 1 : endTime }
title=${ title }`;
    });

    return [";FFMETADATA1", ...metadata].join("\n");
}

export const parse = ({ media }: { media: Media }): Chapter[] | undefined => {
    if (!existsSync(getFilepath(media))) {
        return undefined;
    }

    const content = readFileSync(getFilepath(media), "utf8");

    const lines = content.split("\n");

    const chapters: Chapter[] = [];

    for (let index = 0; index < lines.length; index++) {
        if (lines[index] === "[CHAPTER]") {
            index++;

            const maybeChapter = new Map<string, string>();

            while (lines[index] !== "[CHAPTER]" && index < lines.length) {
                const [key, ...value] = lines[index].split("=");

                try {
                    maybeChapter.set(key, value.join("="));
                } catch {}

                index++;
            }

            index--;

            try {
                if (maybeChapter.has("START") && maybeChapter.has("END") && maybeChapter.has("title")) {
                    chapters.push({
                        id: randomUUID(),
                        // @ts-expect-error
                        startTime: parseInt(maybeChapter.get("START")),
                        // @ts-expect-error
                        endTime: parseInt(maybeChapter.get("END")),
                        // @ts-expect-error
                        title: maybeChapter.get("title"),
                    });
                }
            } catch {}
        }
    }

    return chapters;
}

export const save = ({
    chapterList,
    media,
}: {
    chapterList: Chapter[],
    media: Media,
}) => {
    const data = generate({ chapterList });

    writeFileSync(getFilepath(media), data, "utf8");
}

export const burn = async ({
    media,
}: {
    media: Media,
}): Promise<void> => {
    const chapterFilePath = getFilepath(media);
    const mediaFilepath = resolve(media.pathname, media.filename + media.extension);
    const mediaFilepathTemp = resolve(media.pathname, `${ media.filename }.temp${ media.extension }`);

    const run = ({ command, args }: { command: string, args: string[] }): Promise<void> => {
        return new Promise((resolve) => {
            const child = spawn(command, args);

            child.on("close", exitCode => {
                if (exitCode !== 0) {
                    throw new Error(`Failed to run command. Return exit code ${ exitCode } on "${ command } ${ args.join(" ") }"`);
                }

                resolve();
            });
        });
    }

    await run({
        command: "ffmpeg",
        args: [
            "-loglevel",
            "error",
            "-hide_banner",
            "-y",
            "-stats",
            "-i",
            mediaFilepath,
            "-i",
            chapterFilePath,
            "-map_metadata",
            "1",
            "-codec",
            "copy",
            mediaFilepathTemp,
        ],
    });
    rmSync(mediaFilepath, { force: true });
    renameSync(mediaFilepathTemp, mediaFilepath);
}

export const timeToClock = (time: number): string => {
    return new Date(Math.floor(time / 1000000)).toISOString().substring(11, 19);
}
