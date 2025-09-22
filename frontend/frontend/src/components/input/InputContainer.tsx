import { useState, useRef } from "react";
import type { FC } from "react";
import type { InputBlock } from "./types";
import { InputBlockComponent } from "./InputBlockComponent";
import { AddInputButton } from "./AddInputButton";

export const InputContainer: FC = () => {
    const [blocks, setBlocks] = useState<InputBlock[]>([
        { header: "", value: "", urls: [], files: [] },
    ]);

    // Refs for headers, inputs, and the add button. Kept in a flat sequence:
    // [header0, input0, header1, input1, ..., addButton]
    const inputRefs = useRef<(HTMLInputElement | HTMLButtonElement | null)[]>([]);

    const clearKeyboardFocusClasses = () => {
        inputRefs.current.forEach((el) => {
            if (el && el.classList) el.classList.remove("keyboard-focused");
        });
    };

    const handleHeaderChange = (index: number, value: string) => {
        const newBlocks = [...blocks];
        newBlocks[index].header = value;
        setBlocks(newBlocks);
    };

    const handleValueChange = (index: number, value: string) => {
        const newBlocks = [...blocks];
        newBlocks[index].value = value;
        setBlocks(newBlocks);
    };

    const handleAddUrl = (blockIndex: number) => {
        const newUrl = prompt("Enter URL:", "https://");
        if (newUrl) {
            const newBlocks = [...blocks];
            newBlocks[blockIndex].urls.push(newUrl);
            setBlocks(newBlocks);
        }
    };

    const handleAddFile = (blockIndex: number) => {
        // This is a placeholder for actual file upload logic
        const newFile = `document_${Date.now()}.pdf`;
        const newBlocks = [...blocks];
        newBlocks[blockIndex].files.push(newFile);
        setBlocks(newBlocks);
    };


    const addBlock = () => {
        const currentLength = blocks.length;
        setBlocks((prev) => [...prev, { header: "", value: "", urls: [], files: [] }]);

        requestAnimationFrame(() => {
            const newAddButtonIndex = (currentLength + 1) * 2;
            const addButtonEl = inputRefs.current[newAddButtonIndex] as HTMLButtonElement | undefined;
            if (addButtonEl) {
                addButtonEl.focus();
                clearKeyboardFocusClasses();
                addButtonEl.classList.add("keyboard-focused");
            }
        });
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>
    ) => {
        const inputs = inputRefs.current.filter(Boolean) as (
            | HTMLInputElement
            | HTMLButtonElement
        )[];

        const flatIndex = inputs.indexOf(e.currentTarget as HTMLInputElement | HTMLButtonElement);

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (flatIndex >= 0 && flatIndex < inputs.length - 1) {
                const next = inputs[flatIndex + 1] as HTMLElement;
                next.focus();
                clearKeyboardFocusClasses();
                next.classList.add("keyboard-focused");
            }
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (flatIndex > 0) {
                const prev = inputs[flatIndex - 1] as HTMLElement;
                prev.focus();
                clearKeyboardFocusClasses();
                prev.classList.add("keyboard-focused");
            }
        }

        if (e.key === "ArrowRight") {
            // If currently on a prompt input, move focus to first context button
            const currentElement = e.currentTarget as HTMLElement;
            if (currentElement.classList.contains("input-field")) {
                const inputBlock = currentElement.closest(".input-block");
                if (inputBlock) {
                    const firstButton = inputBlock.querySelector<HTMLButtonElement>(
                        ".add-context-button"
                    );
                    if (firstButton) {
                        e.preventDefault();
                        firstButton.focus();
                        clearKeyboardFocusClasses();
                        firstButton.classList.add("keyboard-focused");
                    }
                }
            }
        }


    };



    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLButtonElement>) => {
        clearKeyboardFocusClasses();
        const element = e.currentTarget as HTMLElement;
        element.classList.add("keyboard-focused");
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLButtonElement>) => {
        const element = e.currentTarget as HTMLElement;
        element.classList.remove("keyboard-focused");
    };

    return (
        <div className="input-container">
            {blocks.map((block, index) => (
                <InputBlockComponent
                    key={index}
                    block={block}
                    index={index}
                    onHeaderChange={handleHeaderChange}
                    onValueChange={handleValueChange}
                    onAddUrl={handleAddUrl}
                    onAddFile={handleAddFile}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    headerRef={(el) => (inputRefs.current[index * 2] = el)}
                    valueRef={(el) => (inputRefs.current[index * 2 + 1] = el)}
                />
            ))}

            <AddInputButton
                onAdd={addBlock}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                ref={(el) => {
                    const index = blocks.length * 2;
                    inputRefs.current[index] = el;
                }}
            />
        </div>
    );
};