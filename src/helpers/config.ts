import { readFileSync, writeFileSync } from "fs";

import { CONFIG_PATH } from "./constant.js";

interface Config {
    mediaFolder     : string | undefined,
    setlistFmApiKey : string | undefined,
}

export const get = (): Config => {
    const defaultConfig: Config = {
        mediaFolder: undefined,
        setlistFmApiKey: undefined,
    }

    try {
        const savedConfig = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));

        return { ...defaultConfig, ...savedConfig };
    } catch {
        return defaultConfig;
    }
};

export const set = (key: keyof Config, value: any) => {
    const config = get();

    config[key] = value;

    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4), "utf-8");
}
