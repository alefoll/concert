import React, { useState, useEffect } from "react";
import { Text } from "ink";
import { ConfirmInput, Spinner, TextInput } from "@inkjs/ui";
import { getFilepath as getChapterFilepath } from "../helpers/chapter.js";
import { CONFIG_PATH } from "../helpers/constant.js";
import { fetch as fetchSetlist, generateChapterList as generateChapterListFromSetlist, } from "../helpers/setlistfm.js";
import { existsSync } from "fs";
export const ImportChapterListFromSetlistFm = ({ media, setlistFmApiKey, onChapterListFetched, onCancel, }) => {
    const [setlistId, setSetlistId] = useState();
    const [overideChapterFile, setOverideChapterFile] = useState(false);
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
        return React.createElement(Text, null,
            "Add `setlistFmApiKey` in `",
            CONFIG_PATH,
            "`");
    }
    if (setlistId) {
        return React.createElement(Spinner, { label: "Generating chapter file from Setlist.fm" });
    }
    if (!overideChapterFile && existsSync(getChapterFilepath(media))) {
        return (React.createElement(React.Fragment, null,
            React.createElement(Text, null,
                "A chapter file already exist, do you want to overwrite it? ",
                React.createElement(Text, { backgroundColor: "#005cc5", color: "white" }, getChapterFilepath(media))),
            React.createElement(ConfirmInput, { defaultChoice: "cancel", onConfirm: () => { setOverideChapterFile(true); }, onCancel: () => { onCancel(); } })));
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(Text, null,
            "What is the setlist ID? (\"https://www.setlist.fm/setlist/<artist>/<year>/<location>-",
            React.createElement(Text, { backgroundColor: "#005cc5", color: "white" }, "<ID>"),
            ".html\")"),
        React.createElement(TextInput, { placeholder: "Setlist ID", onSubmit: value => setSetlistId(value) })));
};
