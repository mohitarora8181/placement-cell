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
        cursor: 'pointer',
    },
    [`& td`]: {
        borderRight: '0.5px solid lightgray',
    },
}));



export default function TableListUi({ items }) {
    const navigate = useNavigate();

    const handleClick = (userId) => {
        navigate(`/admin/user-profile/${userId}`);
    };

    return (
        <TableContainer component={Paper} className='scrollbar-thin'>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="left">Degree</StyledTableCell>
                        <StyledTableCell align="left">Enrollment Number</StyledTableCell>
                        <StyledTableCell align="left">Full Name</StyledTableCell>
                        <StyledTableCell align="left">Course</StyledTableCell>
                        <StyledTableCell align="left">Class</StyledTableCell>
                        <StyledTableCell align="left">Email</StyledTableCell>
                        <StyledTableCell align="left">Contact Number</StyledTableCell>
                        <StyledTableCell align="left">Date of Birth</StyledTableCell>
                        <StyledTableCell align="left">Address</StyledTableCell>
                        <StyledTableCell align="left">12th School</StyledTableCell>
                        <StyledTableCell align="left">10th Percentage</StyledTableCell>
                        <StyledTableCell align="left">12th Percentage</StyledTableCell>
                        <StyledTableCell align="left">Diploma Percentage</StyledTableCell>
                        <StyledTableCell align="left">CGPA</StyledTableCell>
                        <StyledTableCell align="left">Gap Year</StyledTableCell>
                        <StyledTableCell align="left">Year of Passing</StyledTableCell>
                        <StyledTableCell align="left">Active Backlogs</StyledTableCell>
                        <StyledTableCell align="left">Nationality</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((row) => (
                        <StyledTableRow onClick={() => handleClick(row?._id)} key={row?._id}>
                            <StyledTableCell align="left">{row?.degree}</StyledTableCell>
                            <StyledTableCell align="left">{row?.enrollmentNumber}</StyledTableCell>
                            <StyledTableCell align="left">{row?.fullname}</StyledTableCell>
                            <StyledTableCell align="left">{row?.course}</StyledTableCell>
                            <StyledTableCell align="left">{row?.classes}</StyledTableCell>
                            <StyledTableCell align="left">{row?.email}</StyledTableCell>
                            <StyledTableCell align="left">{row?.contactNumber}</StyledTableCell>
                            <StyledTableCell align="left">{new Date(row?.dob).toLocaleDateString()}</StyledTableCell>
                            <StyledTableCell align="left">{row?.address}</StyledTableCell>
                            <StyledTableCell align="left">{row?.school12th}</StyledTableCell>
                            <StyledTableCell align="left">{row?.tenthPercentage}</StyledTableCell>
                            <StyledTableCell align="left">{row?.twelfthPercentage}</StyledTableCell>
                            <StyledTableCell align="left">{row?.diplomaPercentage}</StyledTableCell>
                            <StyledTableCell align="left">{row?.cgpa}</StyledTableCell>
                            <StyledTableCell align="left">{row?.gapYear}</StyledTableCell>
                            <StyledTableCell align="left">{row?.yearOfPassing}</StyledTableCell>
                            <StyledTableCell align="left">{row?.activeBacklogs}</StyledTableCell>
                            <StyledTableCell align="left">{row?.nationality}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
