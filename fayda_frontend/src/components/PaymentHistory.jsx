import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Toolbar,
  Button,
  MenuItem,
  Select,
  TextField,
  Stack,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const PAYMENT_ENDPOINT = "/payments/";

const statusColors = {
  success: "#388e3c",
  failed: "#d32f2f",
  pending: "#fbc02d",
};

export default function PaymentHistory() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .get(PAYMENT_ENDPOINT)
      .then((res) => setHistory(res.data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [token]);

  const filteredHistory = history.filter((row) => {
    let matches = true;
    if (methodFilter) matches = matches && row.method === methodFilter;
    if (statusFilter) matches = matches && row.status === statusFilter;
    if (dateFilter) {
      const date = new Date(row.created_at).toISOString().slice(0, 10);
      matches = matches && date === dateFilter;
    }
    return matches;
  });

  const handleExportExcel = () => {
    const exportData = filteredHistory.map((row) => ({
      Date: new Date(row.created_at).toLocaleString(),
      Method: row.method,
      Amount: row.amount,
      Status: row.status,
      Reference: row.reference,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "payment_history.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Date', 'Method', 'Amount', 'Status', 'Reference']],
      body: filteredHistory.map(p => [
        new Date(p.created_at).toLocaleString(),
        p.method,
        p.amount,
        p.status,
        p.reference
      ]),
    });
    doc.save("payment_history.pdf");
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6">💳 Payment History</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleExportExcel}
          >
            Export Excel
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
        </Stack>
      </Stack>
      <Toolbar disableGutters sx={{ mb: 2, gap: 2, flexWrap: "wrap" }}>
        <TextField
          type="date"
          size="small"
          label="Date"
          value={dateFilter}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <Select
          size="small"
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Methods</MenuItem>
          <MenuItem value="Telebirr">Telebirr</MenuItem>
          <MenuItem value="Stripe">Stripe</MenuItem>
          <MenuItem value="MockPay">MockPay</MenuItem>
        </Select>
        <Select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="success">Success</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </Select>
        {(methodFilter || statusFilter || dateFilter) && (
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              setMethodFilter("");
              setStatusFilter("");
              setDateFilter("");
            }}
          >
            Clear Filters
          </Button>
        )}
      </Toolbar>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredHistory.length === 0 ? (
        <Typography color="text.secondary">
          No payment records found for selected filters.
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHistory.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{new Date(p.created_at).toLocaleString()}</TableCell>
                <TableCell>{p.method}</TableCell>
                <TableCell>{p.amount}</TableCell>
                <TableCell>
                  <span
                    style={{
                      color: statusColors[p.status] || "#333",
                      fontWeight: "bold",
                    }}
                  >
                    {p.status}
                  </span>
                </TableCell>
                <TableCell>{p.reference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
