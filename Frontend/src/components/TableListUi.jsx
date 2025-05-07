import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Chip, Tooltip, IconButton, Link, Box, CircularProgress, Typography } from '@mui/material';
import { LinkedIn, GitHub, Code as CodeIcon, Description } from '@mui/icons-material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'lightgray',
        color: 'black',
        fontWeight: 'bold',
        fontSize: '16px',
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

export default function TableListUi({ items, loading = false }) {

    const handleClick = (userId) => {
        window.open(`/admin/user-profile/${userId}`, '_blank');
    };

    // Function to check if a field has valid data
    const hasValidData = (value) => {
        return value && value !== "0" && value !== 0 && value !== "0.0";
    };

    const ensureAbsoluteUrl = (url) => {
        if (!url) return '#';
        if (url.match(/^https?:\/\//i)) {
            return url;
        }
        return `https://${url}`;
    };

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString || dateString === "0001-01-01T00:00:00.000Z") return "---";
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                minHeight: 200
            }}>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                    Loading student data...
                </Typography>
            </Box>
        );
    }

    // If items is empty or null
    if (!items || items.length === 0) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4
            }}>
                <Typography variant="body1" color="text.secondary">
                    No student data available.
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} className='scrollbar-thin'>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="left">Degree</StyledTableCell>
                        <StyledTableCell align="left">Name</StyledTableCell>
                        <StyledTableCell align="left">Enrollment Number</StyledTableCell>
                        <StyledTableCell align="left">DOB</StyledTableCell>
                        <StyledTableCell align="left">Course</StyledTableCell>
                        <StyledTableCell align="left">Class</StyledTableCell>
                        <StyledTableCell align="left">CGPA</StyledTableCell>
                        <StyledTableCell align="left">10th %</StyledTableCell>
                        <StyledTableCell align="left">12th %</StyledTableCell>
                        <StyledTableCell align="left">Diploma %</StyledTableCell>
                        <StyledTableCell align="left">School 12th</StyledTableCell>
                        <StyledTableCell align="left">Gap Year</StyledTableCell>
                        <StyledTableCell align="left">Passing Year</StyledTableCell>
                        <StyledTableCell align="left">Backlogs</StyledTableCell>
                        <StyledTableCell align="left">Email</StyledTableCell>
                        <StyledTableCell align="left">Contact</StyledTableCell>
                        <StyledTableCell align="left">Address</StyledTableCell>
                        <StyledTableCell align="left">Profiles</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((row) => (
                        <StyledTableRow onClick={() => handleClick(row?._id)} key={row?._id}>
                            <StyledTableCell align="left">{row?.degree || "---"}</StyledTableCell>
                            <StyledTableCell align="left">{row?.fullname || "---"}</StyledTableCell>
                            <StyledTableCell align="left">{hasValidData(row?.enrollmentNumber) ? row.enrollmentNumber : "---"}</StyledTableCell>
                            <StyledTableCell align="left">{formatDate(row?.dob)}</StyledTableCell>
                            <StyledTableCell align="left">
                                {hasValidData(row?.course) ? (
                                    <Chip
                                        label={row.course}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                ) : "---"}
                            </StyledTableCell>
                            <StyledTableCell align="left">{hasValidData(row?.classes) ? row.classes : "---"}</StyledTableCell>
                            <StyledTableCell align="left">{hasValidData(row?.cgpa) ? row.cgpa : "---"}</StyledTableCell>
                            <StyledTableCell align="left">{hasValidData(row?.tenthPercentage) ? row.tenthPercentage : "---"}</StyledTableCell>
                            <StyledTableCell align="left">{hasValidData(row?.twelfthPercentage) ? row.twelfthPercentage : "---"}</StyledTableCell>
                            <StyledTableCell align="left">{hasValidData(row?.diplomaPercentage) ? row.diplomaPercentage : "---"}</StyledTableCell>
                            <StyledTableCell align="left">{hasValidData(row?.school12th) ? row.school12th : "---"}</StyledTableCell>
                            <StyledTableCell align="left">{hasValidData(row?.gapYear) ? row.gapYear : "---"}</StyledTableCell>
                            <StyledTableCell align="left">{hasValidData(row?.yearOfPassing) ? row.yearOfPassing : "---"}</StyledTableCell>
                            <StyledTableCell align="left">{hasValidData(row?.activeBacklogs) ? row.activeBacklogs : "0"}</StyledTableCell>
                            <StyledTableCell align="left">
                                <Tooltip title={`Email: ${row?.email}`}>
                                    <span>{row?.email}</span>
                                </Tooltip>
                            </StyledTableCell>
                            <StyledTableCell align="left">{hasValidData(row?.contactNumber) ? row.contactNumber : "---"}</StyledTableCell>
                            <StyledTableCell align="left">
                                {hasValidData(row?.address) ? (
                                    <Tooltip title={row.address}>
                                        <span>{row.address.length > 20 ? `${row.address.substring(0, 20)}...` : row.address}</span>
                                    </Tooltip>
                                ) : "---"}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {hasValidData(row?.resumeURL) && (
                                        <Tooltip title="Resume">
                                            <IconButton
                                                size="small"
                                                href={ensureAbsoluteUrl(row.resumeURL)}
                                                target="_blank"
                                                onClick={(e) => e.stopPropagation()}
                                                color="primary"
                                            >
                                                <Description fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {hasValidData(row?.linkedin) && (
                                        <Tooltip title="LinkedIn">
                                            <IconButton
                                                size="small"
                                                href={ensureAbsoluteUrl(row.linkedin)}
                                                target="_blank"
                                                onClick={(e) => e.stopPropagation()}
                                                color="primary"
                                            >
                                                <LinkedIn fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {hasValidData(row?.github) && (
                                        <Tooltip title="GitHub">
                                            <IconButton
                                                size="small"
                                                href={ensureAbsoluteUrl(row.github)}
                                                target="_blank"
                                                onClick={(e) => e.stopPropagation()}
                                                color="primary"
                                            >
                                                <GitHub fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {hasValidData(row?.leetCode) && (
                                        <Tooltip title="LeetCode">
                                            <IconButton
                                                size="small"
                                                href={ensureAbsoluteUrl(row.leetCode)}
                                                target="_blank"
                                                onClick={(e) => e.stopPropagation()}
                                                color="primary"
                                            >
                                                <CodeIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </div>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}