import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'lightgray',
        color: 'black',
        fontWeight: 'bold',
        fontSize: '18px',
        whiteSpace: 'nowrap',
        border: '0.5px solid gray'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        whiteSpace: 'nowrap'
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: '#f1f1f1',
        cursor: 'pointer'
    },
    [`& td`]: {
        borderRight: '0.5px solid lightgray'
    },
}));



export default function TableListCompany({ items }) {
    const navigate = useNavigate();

    const downloadExcel = () => {
        const worksheet = XLSX.utils.table_to_sheet(document.querySelector('table'));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "StudentList.xlsx");
    }

    const handleClick = (userId) => {
        navigate(`/user-profile/${userId}`);
    };

    return (
        <>
            <TableContainer sx={{ marginTop: 5 }} component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">Email</StyledTableCell>
                            <StyledTableCell align="left">Full Name</StyledTableCell>
                            <StyledTableCell align="left">Degree</StyledTableCell>
                            <StyledTableCell align="left">Course</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((row) => (
                            <StyledTableRow onClick={() => handleClick(row._id)} key={row._id}>
                                <StyledTableCell align="left">{row?.email}</StyledTableCell>
                                <StyledTableCell align="left">{row?.fullname || row?.name}</StyledTableCell>
                                <StyledTableCell align="left">{row?.degree}</StyledTableCell>
                                <StyledTableCell align="left">{row?.course}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {items.length > 0 && <p className='text-sm p-5 cursor-pointer hover:underline-offset-2 underline' onClick={downloadExcel}>Download Excel file for this data</p>}
        </>
    );
}
