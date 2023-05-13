import React from "react";
import { Text } from "ink";
import { TextInput } from "@inkjs/ui";
export const SetMediaFolder = ({ onSetMediaFolder, }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(Text, null, "Path to the media folder..."),
        React.createElement(TextInput, { placeholder: "Path to the media folder...", onSubmit: value => onSetMediaFolder(value) })));
};
