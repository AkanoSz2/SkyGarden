import Badge from "react-bootstrap/Badge";

interface MutationStatusProps {
    active: number;
    pending: number;
    failed: number;
}

interface StatusRowProps {
    label: string;
    count: number;
    bg: string;
    textColor?: string;
    value
}

function StatusRow({ label, count, bg, textColor, value }: StatusRowProps) {
    return (
        <div className="d-flex justify-content-between align-items-center fs-7">
            <Badge bg={bg}>{label}</Badge>
            <span className={`badge  text-${textColor ?? "light"}`}>
                {count}
            </span>
        </div>
    );
}

export function MutationStatus({ active, pending, failed }: MutationStatusProps) {
    return (
        <div
            className="rounded-3 border p-3"
            style={{backgroundColor: "#0f172a", borderColor: "#2a3044" }}
        >
            <div className="fw-bold mb-2" style={{ fontSize: "20px", color: "#e2e8f0" }}>
                Mutation Status
            </div>
            <hr style={{ borderColor: "#2a3044", margin: "0 0 10px 0" }} />
            <div className="d-flex flex-column gap-2">
                <StatusRow label="Active"           count="999"  bg="success" value="123" />
                <StatusRow label="Pending"          count="999"  bg="warning" value="123" />
                <StatusRow label="Failed"           count="999"  bg="danger"  value="123" />
            </div>
        </div>
    );
}