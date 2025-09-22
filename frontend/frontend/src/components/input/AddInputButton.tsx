import { forwardRef } from "react";
import type { AddInputButtonProps } from "./types";

export const AddInputButton = forwardRef<HTMLButtonElement, Omit<AddInputButtonProps, 'ref'>>(
    ({ onAdd, onKeyDown, onFocus, onBlur }, ref) => {
        return (
            <button
                className="add-button"
                onClick={onAdd}
                ref={ref}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
            >
                ADD INPUT +
            </button>
        );
    }
);

AddInputButton.displayName = 'AddInputButton';
