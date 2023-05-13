import React from "react";
import { Select } from "@inkjs/ui";

export type MenuChoice = "burnChapterList"
    | "editChapter"
    | "importChapterListFromSetlistFm";

export const SelectMenu = ({
    hasChapterList,
    onMenuSelected,
    onGoBack,
}: {
    hasChapterList: boolean,
    onMenuSelected: (value: MenuChoice) => void,
    onGoBack: () => void,
}) => {
    const optionList: { label: string, value: MenuChoice }[] = hasChapterList
        ? [{
            label: "Generate chapter file from Setlist.fm",
            value: "importChapterListFromSetlistFm",
        }, {
            label: "Edit chapters",
            value: "editChapter",
        }, {
            label: "Burn it",
            value: "burnChapterList",
        }]
        : [{
            label: "Generate chapter file from Setlist.fm",
            value: "importChapterListFromSetlistFm",
        }];

    const goBackOption = {
        label: "Go back",
        value: "goBack",
    };

    return (
        <Select
            visibleOptionCount={ 20 }
            options={[
                ...optionList,
                goBackOption
            ]}
            onChange={ value => {
                if (value === "goBack") {
                    onGoBack();
                    return;
                }

                const selectedOption = optionList.find(option => option.value === value);

                if (!selectedOption) {
                    throw new Error("Unable to find option");
                }

                onMenuSelected(selectedOption.value);
            }}
        />
    );
}
