// frontend/src/utils/dataExport.js
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // <--- THIS IS THE CORRECT IMPORT

// Generic function to flatten data for export (if needed)
const flattenData = (data) => {
    if (!data || data.length === 0) return [];
    return data.map(item => {
        const flattened = {};
        for (const key in item) {
            if (typeof item[key] === 'object' && item[key] !== null) {
                // Handle nested objects if necessary, e.g., user.username
                for (const nestedKey in item[key]) {
                    flattened[`${key}_${nestedKey}`] = item[key][nestedKey];
                }
            } else {
                flattened[key] = item[key];
            }
        }
        return flattened;
    });
};

const downloadCSV = (data, filename = 'data') => {
    if (!data || data.length === 0) {
        alert('No data to export.');
        return;
    }
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const downloadExcel = (data, filename = 'data') => {
    if (!data || data.length === 0) {
        alert('No data to export.');
        return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${filename}.xlsx`);
};

const downloadPDF = (data, columns, filename = 'data') => {
    if (!data || data.length === 0) {
        alert('No data to export.');
        return;
    }

    const doc = new jsPDF();
    const tableColumn = columns.map(col => col.header);
    const tableRows = data.map(item => columns.map(col => item[col.dataKey]));

    doc.autoTable({ // <-- THIS IS NOW CORRECT
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        headStyles: { fillColor: [59, 130, 246] }, // Tailwind primary color
        alternateRowStyles: { fillColor: [243, 244, 246] },
        styles: {
            fontSize: 8,
            cellPadding: 2,
            textColor: [31, 41, 55] // Dark text
        },
        didDrawPage: function(data) {
            // Header
            doc.setFontSize(10);
            doc.setTextColor(40);
            doc.text(`Report: ${filename}`, data.settings.margin.left, 10);

            // Footer
            var str = "Page " + doc.internal.getNumberOfPages()
            doc.setFontSize(8);
            doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
    });
    doc.save(`${filename}.pdf`);
};

export { downloadCSV, downloadExcel, downloadPDF, flattenData };