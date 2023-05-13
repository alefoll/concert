import React from "react";
import { Text } from "ink";
import { Option, Select } from "@inkjs/ui";

import { ALLOWED_EXTENSIONS } from "../helpers/constant.js";
import { Media } from "../helpers/media.js";

export const SelectMedia = ({
    medialist,
    onGoBack,
    onMediaSelected,
}: {
    medialist: Media[],
    onGoBack: () => void,
    onMediaSelected: (value: Media) => void,
}) => {
    if (medialist.length <= 0) {
        return <Text>No { ALLOWED_EXTENSIONS.join(", ") } files found</Text>;
    }

    const toOptions = (medialist: Media[]): Option[] => {
        return medialist.map(media => {
            return {
                label: media.filename,
                value: media.id,
            }
        });
    }

    const goBackOption = {
        label: "Go back",
        value: "goBack",
    };

    return (
        <Select
            visibleOptionCount={ 20 }
            options={[
                ...toOptions(medialist),
                goBackOption,
            ]}
            onChange={ value => {
                if (value === "goBack") {
                    onGoBack();
                    return;
                }

                const selectedMedia = medialist.find(media => media.id === value);

                if (!selectedMedia) {
                    throw new Error("Unable to find media");
                }

                onMediaSelected(selectedMedia);
            }}
        />
    );
}
