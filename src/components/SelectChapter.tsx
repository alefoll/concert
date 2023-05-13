import React from "react";
import { Option, Select } from "@inkjs/ui";

import { Chapter, timeToClock } from "../helpers/chapter.js";

export const SelectChapter = ({
    chapterList,
    onChapterSelected,
    onGoBack,
}: {
    chapterList: Chapter[],
    onChapterSelected: (index: number) => void,
    onGoBack: () => void,
}) => {
    const toOptions = ({ chapterList }: { chapterList: Chapter[] }): Option[] => {
        return chapterList.map(chapter => {
            return {
                label: `${ timeToClock(chapter.startTime) } ${ chapter.title }`,
                value: chapter.id,
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
                ...toOptions({ chapterList: chapterList }),
                goBackOption,
            ]}
            onChange={ value => {
                if (value === "goBack") {
                    onGoBack();
                    return;
                }

                const selectedChapter = chapterList.findIndex(chapter => chapter.id === value);

                if (selectedChapter < 0) {
                    throw new Error("Unable to find chapter");
                }

                onChapterSelected(selectedChapter);
            }}
        />
    );
}
