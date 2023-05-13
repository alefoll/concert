import React, { useEffect, useState } from "react";
import { Text, useInput } from "ink";

import { Chapter, timeToClock } from "../helpers/chapter.js";

export const EditChapter = ({
    chapterIndex,
    chapterList,
    onFinishEditing,
    onSaveEditing,
}: {
    chapterIndex: number,
    chapterList: Chapter[],
    onFinishEditing: () => void,
    onSaveEditing: (value: Chapter[]) => void,
}) => {
    const copyChapterList = [...chapterList];

    const [currentIndex, setCurrentIndex] = useState(chapterIndex);

    const chapter = copyChapterList[currentIndex];

    const [startTime, setStartTime] = useState(chapter.startTime);

    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!chapter) {
            throw new Error("Unable to reach this chapter index");
        }

        setStartTime(chapter.startTime);
    }, [currentIndex])

    useInput((input, key) => {
        switch (input) {
            case "q":
                setIsActive(false);
                setTimeout(onFinishEditing, 0);
                return;

            case "s":
                chapter.startTime = startTime;
                onSaveEditing(copyChapterList);
                setIsActive(false);
                setTimeout(onFinishEditing, 0);
                return;

            case "r":
                setStartTime(chapter.startTime);
                return;

            case "n":
                if (currentIndex < copyChapterList.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                }
                return;

            case "p":
                if (currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                }
                return;
        }

        if (key.return) {
            chapter.startTime = startTime;
            onSaveEditing(copyChapterList);

            if (currentIndex >= copyChapterList.length - 1) {
                setIsActive(false);
                setTimeout(onFinishEditing, 0);
                return;
            }

            setCurrentIndex(currentIndex + 1);
        }

        if (key.leftArrow && startTime >= 1_000_000_000) {
            setStartTime(startTime - 1_000_000_000);
        }

        if (key.rightArrow) {
            setStartTime(startTime + 1_000_000_000);
        }

        if (key.upArrow) {
            setStartTime(startTime + 60_000_000_000);
        }

        if (key.downArrow && startTime >= 60_000_000_000) {
            setStartTime(startTime - 60_000_000_000);
        }
    }, { isActive });

    return (
        <>
            <Text>r : reset</Text>
            <Text>s : quit and save</Text>
            <Text>q : quit without saving</Text>
            <Text>n | p : next / precedent chapter</Text>
            <Text>Enter : Save and go to the next chapter</Text>
            <Text>◂ | ▸ : move 1 second</Text>
            <Text>▾ | ▴ : move 1 minute</Text>
            <Text>{ timeToClock(startTime) } { chapter.title }</Text>
        </>
    );
}
