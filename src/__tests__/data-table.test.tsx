import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "@/components/transactions/data-table";
import { columns } from "@/components/transactions/columns";
import { Transaction } from "@/types";

const mockData: Transaction[] = [
  {
    id: "1",
    reference: "MRX-100001",
    timestamp: "2024-01-15T10:30:00Z",
    productType: "Spot",
    direction: "Buy",
    currencyPair: "EUR/USD",
    notional: 1000000,
    rate: 1.0842,
    status: "Completed",
    counterparty: "Deutsche Bank AG",
    valueDate: "2024-01-17",
    settlementDate: "2024-01-17",
    settlementType: "Gross",
  },
  {
    id: "2",
    reference: "MRX-100002",
    timestamp: "2024-01-15T11:00:00Z",
    productType: "Forward",
    direction: "Sell",
    currencyPair: "GBP/USD",
    notional: 500000,
    rate: 1.2631,
    status: "Pending",
    counterparty: "Goldman Sachs International",
    valueDate: "2024-02-15",
    settlementDate: "2024-02-15",
    settlementType: "Net",
  },
];

// Mock URL.createObjectURL and revokeObjectURL for CSV export
vi.stubGlobal("URL", {
  ...URL,
  createObjectURL: vi.fn(() => "blob:mock"),
  revokeObjectURL: vi.fn(),
});

describe("DataTable", () => {
  it("renders table with grid role", () => {
    render(<DataTable columns={columns} data={mockData} />);

    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders column headers in the table", () => {
    render(<DataTable columns={columns} data={mockData} />);

    const table = screen.getByRole("grid");
    expect(within(table).getByText("Reference")).toBeInTheDocument();
    expect(within(table).getByText("Pair")).toBeInTheDocument();
  });

  it("renders transaction references", () => {
    render(<DataTable columns={columns} data={mockData} />);

    const table = screen.getByRole("grid");
    expect(within(table).getByText("MRX-100001")).toBeInTheDocument();
    expect(within(table).getByText("MRX-100002")).toBeInTheDocument();
  });

  it("renders status badges", () => {
    render(<DataTable columns={columns} data={mockData} />);

    const table = screen.getByRole("grid");
    expect(within(table).getByText("Completed")).toBeInTheDocument();
    expect(within(table).getByText("Pending")).toBeInTheDocument();
  });

  it("shows empty state when no data", () => {
    render(<DataTable columns={columns} data={[]} />);

    const emptyMessages = screen.getAllByText("No transactions found.");
    expect(emptyMessages.length).toBeGreaterThan(0);
  });

  it("has a search input", () => {
    render(<DataTable columns={columns} data={mockData} />);

    expect(screen.getByLabelText(/search transactions/i)).toBeInTheDocument();
  });

  it("filters by search term", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={mockData} />);

    const searchInput = screen.getByLabelText(/search transactions/i);
    await user.type(searchInput, "MRX-100001");

    const table = screen.getByRole("grid");
    expect(within(table).getByText("MRX-100001")).toBeInTheDocument();
    expect(within(table).queryByText("MRX-100002")).not.toBeInTheDocument();
  });

  it("shows transaction count", () => {
    render(<DataTable columns={columns} data={mockData} />);

    expect(screen.getByText("2 transaction(s)")).toBeInTheDocument();
  });

  it("has CSV export button", () => {
    render(<DataTable columns={columns} data={mockData} />);

    expect(screen.getByRole("button", { name: /csv/i })).toBeInTheDocument();
  });

  it("has pagination controls", () => {
    render(<DataTable columns={columns} data={mockData} />);

    expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });
});
