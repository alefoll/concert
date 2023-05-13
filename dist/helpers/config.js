import { readFileSync, writeFileSync } from "fs";
import { CONFIG_PATH } from "./constant.js";
export const get = () => {
    const defaultConfig = {
        mediaFolder: undefined,
        setlistFmApiKey: undefined,
    };
    try {
        const savedConfig = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
        return { ...defaultConfig, ...savedConfig };
    }
    catch {
        return defaultConfig;
    }
};
export const set = (key, value) => {
    const config = get();
    config[key] = value;
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4), "utf-8");
};
