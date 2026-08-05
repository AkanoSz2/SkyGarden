import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { importData } from "../scripts/dataTransfer.ts";
import type { GreenhouseTabData } from "../types.ts";

interface ImportModalProps {
    show: boolean;
    onHide: () => void;
    onImport: (data: GreenhouseTabData[]) => void;
}

export function ImportModal({ show, onHide, onImport }: ImportModalProps) {
    const [raw, setRaw] = useState("");
    const [error, setError] = useState(false);

    const close = () => {
        setRaw("");
        setError(false);
        onHide();
    };

    const handleImport = () => {
        const parsed = importData(raw.trim());
        if (!parsed) {
            setError(true);
            return;
        }
        onImport(parsed);
        close();
    };

    return (
        <Modal show={show} onHide={close} centered contentClassName="border-0" data-bs-theme="dark">
            <div className="border" style={{backgroundColor: "#0f172a", borderColor: "#2a3044"}}>
                <div className="d-flex justify-content-between align-items-start px-4 py-3 border-bottom" style={{borderColor: "#2a3044"}}>
                    <div>
                        <div className="fw-bold text-white">IMPORT DATA</div>
                        <div className="text-secondary" style={{fontSize: "0.85rem"}}>Paste your exported data below</div>
                    </div>
                    <button type="button" className="btn-close btn-close-white" onClick={close}/>
                </div>

                <div className="px-4 py-4" style={{backgroundColor: "#0a0f1e"}}>
                    <Form.Control
                        as="textarea"
                        rows={1}
                        placeholder="Paste exported data..."
                        value={raw}
                        onChange={(e) => {
                            setRaw(e.target.value);
                            setError(false);
                        }}
                        style={{
                            backgroundColor: "#1e293b",
                            borderColor: error ? "#dc2626" : "#2a3044",
                            color: "#fff",
                            padding: "0.9rem 1rem",
                            fontSize: "0.95rem",
                            fontFamily: "monospace",
                            resize: "none",
                        }}
                    />
                    {error && (
                        <div className="text-danger mt-2" style={{fontSize: "0.85rem"}}>
                            That doesn't look like valid exported data.
                        </div>
                    )}
                </div>

                <div className="d-flex justify-content-end gap-2 px-4 py-3 border-top" style={{borderColor: "#2a3044"}}>
                    <Button variant="outline-secondary" size="sm" onClick={close}>Cancel</Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={!raw.trim()}
                        style={{background: "#2d1b4e", borderColor: "#7c3aed", color: "#c4b5fd"}}
                        onClick={handleImport}
                    >
                        Import
                    </Button>
                </div>
            </div>
        </Modal>
    );
}