import { execSync } from "child_process";
import { randomUUID } from "crypto";
import { readdirSync } from "fs";
import { resolve } from "path";
import { ALLOWED_EXTENSIONS } from "./constant.js";
export const getMediaList = (mediaFolder) => {
    const files = readdirSync(mediaFolder, { recursive: false });
    const filteredFilesList = [];
    for (const file of files) {
        ALLOWED_EXTENSIONS.forEach(ext => {
            if (file.toString().endsWith(ext)) {
                filteredFilesList.push({
                    extension: ext,
                    filename: file.toString().slice(0, -ext.length),
                    id: randomUUID(),
                    pathname: mediaFolder,
                });
            }
        });
    }
    return filteredFilesList;
};
export const getDuration = (media) => {
    const filepath = resolve(media.pathname, media.filename + media.extension);
    const output = execSync(`ffprobe -v error -hide_banner -of default=noprint_wrappers=0 -print_format json -select_streams v:0 -show_format "${filepath}"`, {
        encoding: "utf8",
    });
    const data = JSON.parse(output);
    return parseFloat(data.format.duration);
};
