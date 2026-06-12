import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type DropdownItem = {
    name: string;
    img: string;
    value: string;
};

type Props = {
    items: DropdownItem[];
    value: DropdownItem;
    onChange: (item: DropdownItem) => void;
    renderItem?: (item: DropdownItem) => React.ReactNode;
};

export function StyledDropdown({ items, value, onChange, renderItem }: Props) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const toggle = () => {
        if (!open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const dropdownMaxHeight = 220;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const openDown = spaceBelow >= dropdownMaxHeight || spaceBelow >= spaceAbove;
            const top = openDown
                ? rect.bottom + window.scrollY
                : rect.top + window.scrollY - dropdownMaxHeight;

            setPos({ top, left: rect.left + window.scrollX, width: rect.width });
        }
        setOpen(v => !v);
    };

    const defaultRender = (item: DropdownItem) => (
        <div className="d-flex align-items-center gap-2">
            {item.img && <img src={item.img} width={20} height={20} alt={item.name} />}
            <span>{item.name}</span>
        </div>
    );

    return (
        <>
            <div
                ref={triggerRef}
                className="form-control form-control-sm bg-dark text-light border-secondary d-flex align-items-center gap-2"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={toggle}
            >
                {renderItem ? renderItem(value) : defaultRender(value)}
            </div>

            {open && createPortal(
                <div
                    ref={dropdownRef}  // ← add this ref
                    className="border border-secondary rounded bg-dark"
                    style={{
                        position: "absolute",
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        maxHeight: 220,
                        overflowY: "auto",
                        zIndex: 9999,
                        scrollbarWidth: "thin",
                        scrollbarColor: "#475569 #1e2937"
                    }}
                >
                    {items.map(item => (
                        <div
                            key={item.name}
                            className="px-2 py-1 text-light d-flex align-items-center gap-2"
                            style={{ cursor: "pointer" }}
                            onMouseDown={(e) => {
                                e.preventDefault(); 
                                onChange(item);
                                setOpen(false);
                            }}
                        >
                            {renderItem ? renderItem(item) : defaultRender(item)}
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </>
    );
}

type NumericDropdownProps = {
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    renderItem?: (value: number) => React.ReactNode;
};

export function StyledDropdownNumber({
                                         min,
                                         max,
                                         value,
                                         onChange,
                                         renderItem
                                     }: NumericDropdownProps) {

    const items: DropdownItem[] = Array.from(
        { length: max - min + 1 },
        (_, i) => {
            const n = min + i;
            return {
                name: String(n),
                img: "",
                value: String(n)
            };
        }
    );

    const selected =
        items.find(i => Number(i.name) === value)
        ?? items[0];

    return (
        <StyledDropdown
            items={items}
            value={selected}
            onChange={(item) => onChange(Number(item.name))}
            renderItem={
                renderItem
                    ? (item) => renderItem(Number(item.name))
                    : undefined
            }
        />
    );
}