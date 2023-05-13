import React from "react";
import { Text } from "ink";
import { Select } from "@inkjs/ui";
import { ALLOWED_EXTENSIONS } from "../helpers/constant.js";
export const SelectMedia = ({ medialist, onGoBack, onMediaSelected, }) => {
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
    const goBackOption = {
        label: "Go back",
        value: "goBack",
    };
    return (React.createElement(Select, { visibleOptionCount: 20, options: [
            ...toOptions(medialist),
            goBackOption,
        ], onChange: value => {
            if (value === "goBack") {
                onGoBack();
                return;
            }
            const selectedMedia = medialist.find(media => media.id === value);
            if (!selectedMedia) {
                throw new Error("Unable to find media");
            }
            onMediaSelected(selectedMedia);
        } }));
};
