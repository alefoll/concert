import React, { useState, useEffect } from "react";
import { Text } from "ink";
import { ConfirmInput, Spinner, TextInput } from "@inkjs/ui";

import { Chapter, getFilepath as getChapterFilepath } from "../helpers/chapter.js";
import { CONFIG_PATH } from "../helpers/constant.js";
import { Media } from "../helpers/media.js";
import {
    fetch as fetchSetlist,
    generateChapterList as generateChapterListFromSetlist,
} from "../helpers/setlistfm.js";
import { existsSync } from "fs";

export const ImportChapterListFromSetlistFm = ({
    media,
    setlistFmApiKey,
    onChapterListFetched,
    onCancel,
}: {
    media: Media,
    setlistFmApiKey: string | undefined,
    onChapterListFetched: (value: Chapter[]) => void,
    onCancel: () => void,
}) => {
    const [setlistId, setSetlistId] = useState<string>();
    const [overideChapterFile, setOverideChapterFile] = useState<boolean>(false);

    useEffect(() => {
        if (!setlistFmApiKey || !setlistId) {
            return;
        }

        fetchSetlist({
            apiKey: setlistFmApiKey,
            id: setlistId,
        }).then(setlist => {
            const chapterList = generateChapterListFromSetlist({ media, setlist });

            onChapterListFetched(chapterList);
        }).catch(() => {
            setSetlistId(undefined);
        });
    }, [setlistId]);

    if (!setlistFmApiKey) {
        return <Text>Add `setlistFmApiKey` in `{ CONFIG_PATH }`</Text>
    }

    if (setlistId) {
        return <Spinner label="Generating chapter file from Setlist.fm" />;
    }

    if (!overideChapterFile && existsSync(getChapterFilepath(media))) {
        return (
            <>
                <Text>A chapter file already exist, do you want to overwrite it? <Text backgroundColor="#005cc5" color="white">{ getChapterFilepath(media) }</Text></Text>
                <ConfirmInput
                    defaultChoice="cancel"
                    onConfirm={ () => { setOverideChapterFile(true) } }
                    onCancel={ () => { onCancel() } }
                />
            </>
        );
    }

    return (
        <>
            <Text>What is the setlist ID? ("https://www.setlist.fm/setlist/&lt;artist&gt;/&lt;year&gt;/&lt;location&gt;-<Text backgroundColor="#005cc5" color="white">&lt;ID&gt;</Text>.html")</Text>
            <TextInput
                placeholder="Setlist ID"
                onSubmit={ value => setSetlistId(value) }
            />
        </>
    );
}
