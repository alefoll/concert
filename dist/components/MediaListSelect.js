import React from "react";
import { Text } from "ink";
import { Select } from "@inkjs/ui";
import { ALLOWED_EXTENSIONS } from "../helpers/constant.js";
export const MediaListSelect = ({ medialist, onMediaSelected, }) => {
    if (medialist.length <= 0) {
        return React.createElement(Text, null,
            "No ",
            ALLOWED_EXTENSIONS.join(", "),
            " files found");
    }
    const toOptions = (medialist) => {
        return medialist.map(media => {
            return {
                label: media.filename,
                value: media.id,
            };
        });
    };
    return (React.createElement(Select, { visibleOptionCount: 20, options: toOptions(medialist), onChange: value => {
            const selectedMedia = medialist.find(media => media.id === value);
            if (selectedMedia) {
                onMediaSelected(selectedMedia);
            }
        } }));
};
