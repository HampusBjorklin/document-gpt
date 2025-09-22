import type { FC } from "react";
import type { InputBlockProps } from "./types";

export const InputBlockComponent: FC<InputBlockProps> = ({
    block,
    index,
    onHeaderChange,
    onValueChange,
    onAddUrl,
    onAddFile,
    onKeyDown,
    onFocus,
    onBlur,
    headerRef,
    valueRef,
}) => {
    return (
        <div key={index} className="input-block">
            {/* Column 1: Header and Prompt Inputs */}
            <div className="inputs-section">
                <input
                    type="text"
                    value={block.header}
                    onChange={(e) => onHeaderChange(index, e.target.value)}
                    className="header-field"
                    placeholder="HEADER"
                    ref={headerRef}
                    onKeyDown={onKeyDown}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                <input
                    type="text"
                    value={block.value}
                    onChange={(e) => onValueChange(index, e.target.value)}
                    className="input-field"
                    placeholder="PROMPT"
                    ref={valueRef}
                    onKeyDown={onKeyDown}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </div>

            {/* Column 2: Context Controls */}
            <div className="controls-section">
                <div className="context-section">
                    <div className="context-header">[ADD CONTEXT]</div>
                    <div className="context-buttons">
                        <button
                            className="add-context-button"
                            onClick={() => onAddUrl(index)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        >
                            ADD URL
                        </button>
                        <button
                            className="add-context-button"
                            onClick={() => onAddFile(index)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        >
                            ADD FILE
                        </button>
                    </div>
                </div>
            </div>

            {/* Column 3: List of Context Items */}
            <div className="list-section">
                <div className="context-items-list">
                    {block.urls.map((url, i) => (
                        <div className="context-item" key={`url-${i}`}>{url}</div>
                    ))}
                    {block.files.map((file, i) => (
                        <div className="context-item" key={`file-${i}`}>{file}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};