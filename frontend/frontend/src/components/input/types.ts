export interface InputBlock {
    header: string;
    value: string;
}

export interface InputBlockProps {
    block: InputBlock;
    index: number;
    onHeaderChange: (index: number, value: string) => void;
    onValueChange: (index: number, value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    headerRef: (el: HTMLInputElement | null) => void;
    valueRef: (el: HTMLInputElement | null) => void;
}

export interface AddInputButtonProps {
    onAdd: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
    onFocus: (e: React.FocusEvent<HTMLButtonElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLButtonElement>) => void;
    ref: (el: HTMLButtonElement | null) => void;
}