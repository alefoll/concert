import React from "react";
import { Text } from "ink";
import { TextInput } from "@inkjs/ui";

export const SetMediaFolder = ({
    onSetMediaFolder,
}: {
    onSetMediaFolder: (value: string) => void,
}) => {
    return (
        <>
            <Text>Path to the media folder...</Text>
            <TextInput
                placeholder="Path to the media folder..."
                onSubmit={ value => onSetMediaFolder(value) }
            />
        </>
    );
}
