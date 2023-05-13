import React, { useEffect, useState } from "react";
import { Text, useInput } from "ink";
import { timeToClock } from "../helpers/chapter.js";
export const EditChapter = ({ chapterIndex, chapterList, onFinishEditing, onSaveEditing, }) => {
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
    }, [currentIndex]);
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
    return (React.createElement(React.Fragment, null,
        React.createElement(Text, null, "r : reset"),
        React.createElement(Text, null, "s : quit and save"),
        React.createElement(Text, null, "q : quit without saving"),
        React.createElement(Text, null, "n | p : next / precedent chapter"),
        React.createElement(Text, null, "Enter : Save and go to the next chapter"),
        React.createElement(Text, null, "\u25C2 | \u25B8 : move 1 second"),
        React.createElement(Text, null, "\u25BE | \u25B4 : move 1 minute"),
        React.createElement(Text, null,
            timeToClock(startTime),
            " ",
            chapter.title)));
};
