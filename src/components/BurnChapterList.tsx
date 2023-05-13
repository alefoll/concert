import React from "react";
import { Text } from "ink";
import { ConfirmInput } from "@inkjs/ui";

export const BurnChapterList = ({
    onCancel,
    onConfirm,
}: {
    onCancel  : () => void,
    onConfirm : () => void,
}) => {
    return (
        <>
            <Text>Are you sure to burn the chapters?</Text>
            <ConfirmInput
                defaultChoice="cancel"
                onCancel={ onCancel }
                onConfirm={ onConfirm } />
        </>
    );
}
