import React, { useEffect, useState } from "react";
import { render, useApp } from "ink";
import { Spinner, ThemeProvider, defaultTheme, extendTheme, } from "@inkjs/ui";
import * as savedConfig from "./helpers/config.js";
import { getMediaList } from "./helpers/media.js";
import { burn, parse, save as saveChapterList } from "./helpers/chapter.js";
import { BurnChapterList } from "./components/BurnChapterList.js";
import { EditChapter } from "./components/EditChapter.js";
import { ImportChapterListFromSetlistFm } from "./components/ImportChapterListFromSetlistFm.js";
import { SetMediaFolder } from "./components/SetMediaFolder.js";
import { SelectChapter } from "./components/SelectChapter.js";
import { SelectMedia } from "./components/SelectMedia.js";
import { SelectMenu } from "./components/SelectMenu.js";
const App = () => {
    const config = savedConfig.get();
    const { exit } = useApp();
    const [mediaFolder, setMediaFolder] = useState(config.mediaFolder);
    const [mediaList, setMediaList] = useState();
    const [currentMedia, setCurrentMedia] = useState();
    const [chapterList, setChapterList] = useState();
    const [menuChoice, setMenuChoice] = useState();
    const [currentChapterIndex, setCurrentChapterIndex] = useState();
    const [isBurning, setIsBurning] = useState(false);
    useEffect(() => {
        if (!mediaFolder) {
            return;
        }
        if (config.mediaFolder !== mediaFolder) {
            savedConfig.set("mediaFolder", mediaFolder);
        }
        try {
            setMediaList(getMediaList(mediaFolder));
        }
        catch {
            setMediaFolder(undefined);
        }
    }, [mediaFolder]);
    useEffect(() => {
        if (!currentMedia) {
            return;
        }
        setChapterList(parse({ media: currentMedia }));
    }, [currentMedia]);
    if (!mediaFolder) {
        return React.createElement(SetMediaFolder, { onSetMediaFolder: mediaFolder => setMediaFolder(mediaFolder) });
    }
    if (!mediaList) {
        return React.createElement(Spinner, { label: "Scanning folder" });
    }
    if (!currentMedia) {
        return React.createElement(SelectMedia, { medialist: mediaList, onGoBack: exit, onMediaSelected: media => setCurrentMedia(media) });
    }
    if (!menuChoice) {
        return React.createElement(SelectMenu, { hasChapterList: !!chapterList, onGoBack: () => setCurrentMedia(undefined), onMenuSelected: (value) => setMenuChoice(value) });
    }
    switch (menuChoice) {
        case "burnChapterList":
            if (isBurning) {
                return React.createElement(Spinner, { label: "Burning" });
            }
            return React.createElement(BurnChapterList, { onCancel: () => setMenuChoice(undefined), onConfirm: () => {
                    setIsBurning(true);
                    burn({ media: currentMedia }).then(() => {
                        setIsBurning(false);
                        setMenuChoice(undefined);
                    });
                } });
        case "editChapter": {
            if (!chapterList) {
                throw new Error("Unreachable editChapter state, no chapterList");
            }
            if (currentChapterIndex == undefined) {
                return React.createElement(SelectChapter, { chapterList: chapterList, onChapterSelected: index => setCurrentChapterIndex(index), onGoBack: () => setMenuChoice(undefined) });
            }
            return React.createElement(EditChapter, { chapterIndex: currentChapterIndex, chapterList: chapterList, onFinishEditing: () => { setCurrentChapterIndex(undefined); setMenuChoice(undefined); }, onSaveEditing: updatedChapterList => {
                    setChapterList(updatedChapterList);
                    saveChapterList({ chapterList: updatedChapterList, media: currentMedia });
                } });
        }
        case "importChapterListFromSetlistFm":
            return React.createElement(ImportChapterListFromSetlistFm, { media: currentMedia, onCancel: () => setMenuChoice(undefined), onChapterListFetched: updatedChapterList => {
                    setChapterList(updatedChapterList);
                    saveChapterList({ chapterList: updatedChapterList, media: currentMedia });
                    setMenuChoice(undefined);
                }, setlistFmApiKey: config.setlistFmApiKey });
        default:
            throw new Error(`Unreachable state: ${menuChoice}`);
    }
};
const customTheme = extendTheme(defaultTheme, {
    components: {
        Select: {
            styles: {
                label({ isFocused, isSelected }) {
                    let backgroundColor;
                    if (isSelected) {
                        backgroundColor = "green";
                    }
                    if (isFocused) {
                        backgroundColor = "#005cc5";
                    }
                    return { backgroundColor };
                },
            },
        },
    },
});
render(React.createElement(ThemeProvider, { theme: customTheme },
    React.createElement(App, null)));
