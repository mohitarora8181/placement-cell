import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'
import { useState } from 'react';
import { useEffect } from 'react';

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

    const [headers, setheaders] = useState([]);

    useEffect(() => {
        items.forEach(obj => {
            delete obj._id;
        });
        const keys = Object.keys(items[0]);
        setheaders(keys);
    }, []);

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
                            {headers.map((header, index) => {
                                return <StyledTableCell key={header + '-key-' + index} align="left">{header.toUpperCase()}</StyledTableCell>
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((row, index) => (
                            <StyledTableRow key={row._id + '--' + index} onClick={() => row._id && handleClick(row._id)}>
                                {
                                    headers.map(key => {
                                        return <StyledTableCell key={key + '-value-' + index} align="left">{row[key]}</StyledTableCell>
                                    })
                                }
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {items.length > 0 && <p className='text-sm p-5 cursor-pointer hover:underline-offset-2 underline' onClick={downloadExcel}>Download Excel file for this data</p>}
        </>
    );
}
