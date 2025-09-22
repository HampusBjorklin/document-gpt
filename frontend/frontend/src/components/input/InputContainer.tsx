import { useState, useRef } from "react";
import type { FC } from "react";
import type { InputBlock } from "./types";
import { InputBlockComponent } from "./InputBlockComponent";
import { AddInputButton } from "./AddInputButton";

export const InputContainer: FC = () => {
    const [blocks, setBlocks] = useState<InputBlock[]>([
        { header: "", value: "", urls: [], files: [] },
    ]);

    const inputRefs = useRef<(HTMLInputElement | HTMLButtonElement | null)[]>([]);

    const clearKeyboardFocusClasses = () => {
        const focusedEl = document.querySelector(".keyboard-focused");
        if (focusedEl) {
            focusedEl.classList.remove("keyboard-focused");
        }
    };

    const focusElement = (element: HTMLElement | null) => {
        if (element) {
            clearKeyboardFocusClasses();
            element.focus();
            element.classList.add("keyboard-focused");
        }
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
        const newFile = `document_${Date.now()}.pdf`;
        const newBlocks = [...blocks];
        newBlocks[blockIndex].files.push(newFile);
        setBlocks(newBlocks);
    };

    const addBlock = () => {
        setBlocks((prev) => [...prev, { header: "", value: "", urls: [], files: [] }]);
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>
    ) => {
        const { key } = e;
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) return;

        const currentElement = e.currentTarget as HTMLElement;
        const allBlocks = Array.from(document.querySelectorAll<HTMLElement>('.input-block'));
        const inputBlock = currentElement.closest<HTMLElement>(".input-block");
        const blockIndex = inputBlock ? allBlocks.indexOf(inputBlock) : -1;

        e.preventDefault();

        // --- Vertical Navigation ---
        if (key === 'ArrowUp' || key === 'ArrowDown') {
            let targetElement: HTMLElement | null = null;

            if (currentElement.classList.contains('header-field') && key === 'ArrowDown') {
                targetElement = inputBlock?.querySelector<HTMLInputElement>('.input-field');
            } else if (currentElement.classList.contains('input-field') && key === 'ArrowUp') {
                targetElement = inputBlock?.querySelector<HTMLInputElement>('.header-field');
            }
            else {
                const direction = key === 'ArrowUp' ? -1 : 1;
                const targetBlockIndex = blockIndex + direction;

                if (blockIndex !== -1 && targetBlockIndex >= 0 && targetBlockIndex < allBlocks.length) {
                    const targetBlock = allBlocks[targetBlockIndex];

                    if (currentElement.classList.contains('input-field') && key === 'ArrowDown') {
                        targetElement = targetBlock.querySelector<HTMLInputElement>('.header-field');
                    } else if (currentElement.classList.contains('header-field') && key === 'ArrowUp') {
                        targetElement = targetBlock.querySelector<HTMLInputElement>('.input-field');
                    } else if (currentElement.classList.contains('add-context-button')) {
                        const buttons = Array.from(inputBlock.querySelectorAll<HTMLButtonElement>('.add-context-button'));
                        const buttonIndex = buttons.indexOf(currentElement as HTMLButtonElement);
                        const targetButtons = targetBlock.querySelectorAll<HTMLButtonElement>('.add-context-button');
                        if (targetButtons[buttonIndex]) {
                            targetElement = targetButtons[buttonIndex];
                        }
                    }
                }
                else if (key === 'ArrowDown' && blockIndex === allBlocks.length - 1) {
                    targetElement = document.querySelector<HTMLButtonElement>('.add-button');
                }
                else if (key === 'ArrowUp' && currentElement.classList.contains('add-button')) {
                    const lastBlock = allBlocks[allBlocks.length - 1];
                    if (lastBlock) {
                        targetElement = lastBlock.querySelector<HTMLInputElement>('.input-field');
                    }
                }
            }
            focusElement(targetElement);
        }

        // --- Horizontal Navigation ---
        if (inputBlock && (key === 'ArrowLeft' || key === 'ArrowRight')) {
            // If on Header or Prompt, ArrowRight goes to the first button
            if ((currentElement.classList.contains("header-field") || currentElement.classList.contains("input-field")) && key === 'ArrowRight') {
                const firstButton = inputBlock.querySelector<HTMLButtonElement>(".add-context-button");
                focusElement(firstButton);
            }
            // Handle navigation between buttons or back to the prompt
            else if (currentElement.classList.contains("add-context-button")) {
                const buttons = Array.from(inputBlock.querySelectorAll<HTMLButtonElement>(".add-context-button"));
                const currentIndex = buttons.indexOf(currentElement as HTMLButtonElement);

                if (key === 'ArrowRight' && currentIndex < buttons.length - 1) {
                    focusElement(buttons[currentIndex + 1]);
                } else if (key === 'ArrowLeft') {
                    if (currentIndex > 0) {
                        focusElement(buttons[currentIndex - 1]);
                    } else if (currentIndex === 0) {
                        // From the first button, go back to the prompt
                        const promptInput = inputBlock.querySelector<HTMLInputElement>(".input-field");
                        focusElement(promptInput);
                    }
                }
            }
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLButtonElement>) => {
        clearKeyboardFocusClasses();
        e.currentTarget.classList.add("keyboard-focused");
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLButtonElement>) => {
        e.currentTarget.classList.remove("keyboard-focused");
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