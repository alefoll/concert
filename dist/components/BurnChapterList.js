import React from "react";
import { Text } from "ink";
import { ConfirmInput } from "@inkjs/ui";
export const BurnChapterList = ({ onCancel, onConfirm, }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(Text, null, "Are you sure to burn the chapters?"),
        React.createElement(ConfirmInput, { defaultChoice: "cancel", onCancel: onCancel, onConfirm: onConfirm })));
};
