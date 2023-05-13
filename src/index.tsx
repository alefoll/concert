import React, { useEffect, useState } from "react";
import { render, TextProps, useApp } from "ink";
import {
    Spinner,
    ThemeProvider,
    defaultTheme,
    extendTheme,
} from "@inkjs/ui";

import * as savedConfig from "./helpers/config.js";
import { Media, getMediaList } from "./helpers/media.js";
import { Chapter, burn, parse, save as saveChapterList } from "./helpers/chapter.js";

import { BurnChapterList } from "./components/BurnChapterList.js";
import { EditChapter } from "./components/EditChapter.js";
import { ImportChapterListFromSetlistFm } from "./components/ImportChapterListFromSetlistFm.js";
import { SetMediaFolder } from "./components/SetMediaFolder.js";
import { SelectChapter } from "./components/SelectChapter.js";
import { SelectMedia } from "./components/SelectMedia.js";
import { MenuChoice, SelectMenu } from "./components/SelectMenu.js";

const App = () => {
    const config = savedConfig.get();

    const { exit } = useApp();

    const [mediaFolder, setMediaFolder] = useState(config.mediaFolder);
    const [mediaList, setMediaList]     = useState<Media[]>();

    const [currentMedia, setCurrentMedia] = useState<Media>();

    const [chapterList, setChapterList] = useState<Chapter[]>();

    const [menuChoice, setMenuChoice] = useState<MenuChoice>();

    const [currentChapterIndex, setCurrentChapterIndex] = useState<number>();

    const [isBurning, setIsBurning] = useState<boolean>(false);

    useEffect(() => {
        if (!mediaFolder) {
            return;
        }

        if (config.mediaFolder !== mediaFolder) {
            savedConfig.set("mediaFolder", mediaFolder);
        }

        try {
            setMediaList(getMediaList(mediaFolder));
        } catch {
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
        return <SetMediaFolder onSetMediaFolder={ mediaFolder => setMediaFolder(mediaFolder) } />;
    }

    if (!mediaList) {
        return <Spinner label="Scanning folder" />;
    }

    if (!currentMedia) {
        return <SelectMedia
            medialist={ mediaList }
            onGoBack={ exit }
            onMediaSelected={ media => setCurrentMedia(media) } />;
    }

    if (!menuChoice) {
        return <SelectMenu
            hasChapterList={ !!chapterList }
            onGoBack={ () => setCurrentMedia(undefined) }
            onMenuSelected={ (value) => setMenuChoice(value) } />;
    }

    switch (menuChoice) {
        case "burnChapterList":
            if (isBurning) {
                return <Spinner label="Burning" />;
            }

            return <BurnChapterList
                onCancel={() => setMenuChoice(undefined)}
                onConfirm={ () => {
                    setIsBurning(true);
                    burn({ media: currentMedia }).then(() => {
                        setIsBurning(false);
                        setMenuChoice(undefined);
                    });
                }} />;

        case "editChapter": {
            if (!chapterList) {
                throw new Error("Unreachable editChapter state, no chapterList")
            }

            if (currentChapterIndex == undefined) {
                return <SelectChapter
                    chapterList={ chapterList }
                    onChapterSelected={ index => setCurrentChapterIndex(index) }
                    onGoBack={() => setMenuChoice(undefined)} />;
            }

            return <EditChapter
                chapterIndex={ currentChapterIndex }
                chapterList={ chapterList }
                onFinishEditing={ () => { setCurrentChapterIndex(undefined); setMenuChoice(undefined) } }
                onSaveEditing={ updatedChapterList => {
                    setChapterList(updatedChapterList);
                    saveChapterList({ chapterList: updatedChapterList, media: currentMedia });
                }} />;
        }

        case "importChapterListFromSetlistFm":
            return <ImportChapterListFromSetlistFm
                media={ currentMedia }
                onCancel={() => setMenuChoice(undefined)}
                onChapterListFetched={ updatedChapterList => {
                    setChapterList(updatedChapterList);
                    saveChapterList({ chapterList: updatedChapterList, media: currentMedia });
                    setMenuChoice(undefined);
                }}
                setlistFmApiKey={ config.setlistFmApiKey } />;

        default:
            throw new Error(`Unreachable state: ${ menuChoice }`);
    }
};

const customTheme = extendTheme(defaultTheme, {
    components: {
        Select: {
            styles: {
                label({isFocused, isSelected}): TextProps {
                    let backgroundColor: string | undefined;

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

render(<ThemeProvider theme={ customTheme }><App /></ThemeProvider>);
