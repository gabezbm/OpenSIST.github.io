import {FilterMatchMode, FilterService} from "primereact/api";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {getPrograms} from "../../Data/ProgramData";
import {getRecordByRecordIDs} from "../../Data/RecordData";
import {Form, Outlet, redirect, useLoaderData, useNavigate, useParams} from "react-router-dom";
import './DataPoints.css';
import React, {useEffect, useState} from "react";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Chip, Dialog, DialogActions,
    DialogContent, IconButton, Paper, Tooltip, useTheme,
} from "@mui/material";
import {Check, Close, Explore, FilterAltOff, OpenInFull, Refresh} from "@mui/icons-material";
import {ProfileApplicantPage} from "../Profile/ProfileApplicant/ProfileApplicantPage";
import {recordStatusList} from "../../Data/Schemas";
import ProgramContent from "../ProgramPage/ProgramContent/ProgramContent";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {DraggableFAB, InlineTypography} from "../common";
import {ThemeSwitcherProvider} from 'react-css-theme-switcher';
import {TriStateCheckbox} from 'primereact/tristatecheckbox';
import {Dropdown} from "primereact/dropdown";
import ControlPointIcon from '@mui/icons-material/ControlPoint';

export async function loader() {
    let programs = await getPrograms();
    programs = Object.values(programs).flat().filter(program => program.Applicants.length > 0);
    const recordIDs = programs.map(program => program.Applicants.map(applicant => applicant + "|" + program.ProgramID)).flat();
    let records = Object.values(await getRecordByRecordIDs(recordIDs));
    const programIDs = programs.map(program => program.ProgramID);
    records = records.sort((a, b) => {
        return programIDs.indexOf(a.ProgramID) - programIDs.indexOf(b.ProgramID);
    });
    return {records};
}

export async function action() {
    let programs = await getPrograms(true);
    programs = Object.values(programs).flat().filter(program => program.Applicants.length > 0);
    const recordIDs = programs.map(program => program.Applicants.map(applicant => applicant + "|" + program.ProgramID)).flat();
    await getRecordByRecordIDs(recordIDs, true);
    return redirect('/datapoints');
}

export function ApplicantProfileInDataPoints() {
    const navigate = useNavigate();
    const params = useParams();
    const applicantID = params.applicantId;
    const {applicant} = useLoaderData();
    return (
        <Dialog
            open={applicantID === applicant.ApplicantID}
            onClose={() => navigate(-1)}
            fullWidth
            maxWidth={'xl'}
            sx={{userSelect: 'text'}}
        >
            <DialogActions>
                <IconButton onClick={() => navigate(-1)}>
                    <Close/>
                </IconButton>
            </DialogActions>
            <DialogContent>
                <ProfileApplicantPage editable={false}/>
            </DialogContent>
        </Dialog>
    )
}

export function ProgramContentInDataPoints() {
    const navigate = useNavigate();
    const params = useParams();
    const programID = params.programId;
    const {programContent} = useLoaderData();
    return (
        <Dialog
            open={programID === programContent.ProgramID}
            onClose={() => navigate(-1)}
            fullWidth
            maxWidth={'xl'}
            sx={{userSelect: 'text'}}
        >
            <DialogContent>
                <ProgramContent editable={false}/>
            </DialogContent>
        </Dialog>
    )
}

export function DataGrid({records, insideProgramPage, style = {}}) {
    const navigate = useNavigate();
    const theme = useTheme();
    const themeMap = {
        light: "/TableLight.css",
        dark: "/TableDark.css"
    };

    const [filters, setFilters] = useState(null);
    useEffect(() => {
        initFilters();
    }, []);

    const initFilters = () => {
        setFilters({
            global: {value: null, matchMode: FilterMatchMode.CONTAINS},
            ApplicantID: {value: null, matchMode: FilterMatchMode.CONTAINS},
            ProgramID: {value: null, matchMode: FilterMatchMode.CONTAINS},
            Status: {value: null, matchMode: FilterMatchMode.EQUALS},
            Season: {value: null, matchMode: FilterMatchMode.CUSTOM},
            Final: {value: null, matchMode: FilterMatchMode.EQUALS}
        });
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'Reject':
                return 'error';
            case 'Admit':
                return 'success';
            case 'Waitlist':
                return "default";
            case 'Defer':
                return 'warning';
            default:
                return null;
        }
    };
    const getSemesterColor = (semester) => {
        switch (semester) {
            case 'Fall':
                return 'warning';
            case 'Spring':
                return 'success';
            case 'Winter':
                return 'primary';
            case 'Summer':
                return 'secondary';
            default:
                return null;
        }
    }
    const groupSubheaderTemplate = (data) => {
        return (
            <InlineTypography sx={{gap: '0.5rem'}}>
                <b>{data.ProgramID}</b>
                <Tooltip title="添加申请记录" arrow>
                    <ControlPointIcon onClick={() => navigate(`/profile/new-record`, {
                        state: {
                            programID: data.ProgramID,
                            from: window.location.pathname
                        }
                    })} sx={{
                        cursor: 'pointer',
                        "&:hover": {color: (theme) => theme.palette.mode === "dark" ? "#a1a1a1" : "#6b6b6b"}
                    }}/>
                </Tooltip>
            </InlineTypography>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <Chip label={rowData.Status} color={getStatusColor(rowData.Status)}/>
    };

    const statusFilterItemTemplate = (option) => {
        return <Chip label={option} color={getStatusColor(option)}/>
    };

    const statusFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={recordStatusList}
                onChange={(e) => options.filterApplyCallback(e.value)}
                itemTemplate={statusFilterItemTemplate}
                className="p-column-filter"
                showClear
            />
        );
    };

    const finalBodyTemplate = (rowData) => {
        return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {rowData.Final ? <Check color='success'/> : null}
        </div>
    };
    const programPeriodBodyTemplate = (rowData) => {
        return <Chip label={`${rowData.ProgramYear} ${rowData.Semester}`} color={getSemesterColor(rowData.Semester)}/>
    };
    const timelineBodyTemplate = (rowData, columnBodyOption) => {
        const field = columnBodyOption.field;
        const timelineKey = field.split('.')[1];
        return <>
            {rowData.TimeLine[timelineKey]?.split('T')[0]}
        </>
    };
    const applicantBodyTemplate = (rowData) => {
        return (
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Tooltip title={rowData.ApplicantID} arrow>
                    <Chip label={rowData.ApplicantID} sx={{maxWidth: "8rem"}}/>
                </Tooltip>
                <Tooltip title='查看申请人信息' arrow>
                    <IconButton onClick={() => navigate(`/datapoints/applicant/${rowData.ApplicantID}`)}>
                        <OpenInFull sx={{fontSize: "0.8rem"}}/>
                    </IconButton>
                </Tooltip>
            </div>
        )
    };

    const programBodyTemplate = (rowData) => {
        return <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Tooltip title={rowData.ProgramID} arrow>
                <Chip label={rowData.ProgramID} sx={{maxWidth: "9rem"}}/>
            </Tooltip>
            <Tooltip title='查看项目描述' arrow>
                <IconButton onClick={() => navigate(`/datapoints/program/${rowData.ProgramID}`)}>
                    <OpenInFull sx={{fontSize: "0.8rem"}}/>
                </IconButton>
            </Tooltip>
        </div>
    };

    const FinalRowFilterTemplate = (options) => {
        // return <Checkbox onChange={(e) => options.filterApplyCallback(e.checked)} checked={options.value}/>;
        return <TriStateCheckbox onChange={(e) => options.filterApplyCallback(e.value)} value={options.value}/>
    };

    FilterService.register('custom_Season', (value, filters) => {
        if (!filters) {
            return true;
        }
        filters = filters.replace(/\s/g, "").toLowerCase();
        value = value.replace(/\s/g, "").toLowerCase();
        return value.includes(filters);
    })

    return (
        <ThemeSwitcherProvider defaultTheme={theme.palette.mode} themeMap={themeMap}>
            <DataTable
                value={records}
                dataKey="RecordID"
                rowGroupMode={insideProgramPage ? null : "subheader"}
                groupRowsBy="ProgramID"
                sortMode='multiple'
                multiSortMeta={[{field: 'ProgramID', order: 0}, {field: 'Season', order: -1}]}
                size='small'
                scrollable
                scrollHeight="100%"
                rowGroupHeaderTemplate={groupSubheaderTemplate}
                rowHover
                showGridlines
                paginator={insideProgramPage ? null : true}
                paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first}~{last} of {totalRecords}"
                rows={insideProgramPage ? null : 20}
                filterDelay={insideProgramPage ? null : 300}
                filters={insideProgramPage ? null : filters}
                filterDisplay={insideProgramPage ? null : 'row'}
                emptyMessage={insideProgramPage ? "该项目暂无申请记录" : "未找到任何匹配内容"}
                className='DataTableStyle'
                style={{...style}}
            >
                <Column
                    field='ApplicantID'
                    header='申请人'
                    body={applicantBodyTemplate}
                    filter={!insideProgramPage}
                    align='center'
                    filterPlaceholder="搜索申请人"
                    className="ApplicantIDColumn"
                    style={{minWidth: '10rem'}}
                />
                {insideProgramPage ? null : <Column
                    field='ProgramID'
                    header='申请项目'
                    body={programBodyTemplate}
                    align='center'
                    filter={!insideProgramPage}
                    filterPlaceholder="搜索项目"
                    className="ProgramIDColumn"
                    style={{width: '10rem'}}
                />}
                <Column
                    field='Status'
                    header='申请结果'
                    body={statusBodyTemplate}
                    align='center'
                    filter={!insideProgramPage}
                    filterElement={statusFilterTemplate}
                    className="StatusColumn"
                    style={{minWidth: '6rem'}}
                />
                <Column
                    field='Final'
                    header='最终去向'
                    body={finalBodyTemplate}
                    dataType="boolean"
                    filter={!insideProgramPage}
                    align='center'
                    filterElement={FinalRowFilterTemplate}
                    className="FinalColumn"
                    style={{minWidth: '6rem'}}
                />
                <Column
                    field='Season'
                    header='申请季'
                    filter={!insideProgramPage}
                    align='center'
                    filterPlaceholder="搜索申请季"
                    body={programPeriodBodyTemplate}
                    className="SeasonColumn"
                    style={{width: '7rem'}}
                />
                <Column
                    field='TimeLine.Decision'
                    header='结果通知时间'
                    align='center'
                    body={timelineBodyTemplate}
                    style={{minWidth: '9rem'}}
                />
                <Column
                    field='TimeLine.Interview'
                    header='面试时间'
                    align='center'
                    body={timelineBodyTemplate}
                    style={{minWidth: '8rem'}}
                />
                <Column
                    field='TimeLine.Submit'
                    header='网申提交时间'
                    align='center'
                    body={timelineBodyTemplate}
                    style={{minWidth: '9rem'}}
                />
                <Column
                    field='Detail'
                    header='备注、补充说明等'
                    style={{width: '25rem', minWidth: '15rem'}}
                />
            </DataTable>
        </ThemeSwitcherProvider>
    )
}

function UsageGuidance() {
    return (
        <Accordion sx={{bgcolor: '#448aff1a'}} disableGutters>
            <AccordionSummary
                expandIcon={<ArrowDropDownIcon/>}
            >
                <InlineTypography>
                    <Explore/> 请先阅读使用指南
                </InlineTypography>
            </AccordionSummary>
            <AccordionDetails>
                <ol>
                    <li>
                        <InlineTypography>
                            对于<b>申请人</b>和<b>申请项目</b>这两列，可点击单元格右侧<OpenInFull
                            sx={{fontSize: "1rem"}}/>按钮查看申请人或项目的详细信息。
                        </InlineTypography>
                    </li>
                    <li>本页面为只读模式，想要编辑自己的申请人信息或添加/删除/修改所申请的项目，请点击右上角头像下拉菜单中Profile页面编辑相应信息。</li>
                    <li>
                        <InlineTypography>
                            可通过表格上部的filter来进行关键信息筛选。可点击左上角<FilterAltOff/>按钮重置所有筛选。
                        </InlineTypography>
                    </li>
                    <li>
                        <InlineTypography>
                            表格会每十分钟自动从服务器获取一次最新数据，您也可以可点击左上角<Refresh/>按钮手动获取。
                        </InlineTypography>
                    </li>
                </ol>
            </AccordionDetails>
        </Accordion>
    );
}

export default function DataPoints() {
    const loaderRecords = useLoaderData();
    const records = loaderRecords.records.map(record => {
        record['Season'] = record.ProgramYear + " " + record.Semester;
        return record;
    });

    return (
        <>
            <Paper className="DataPointsContent">
                <UsageGuidance/>
                <DataGrid records={records} insideProgramPage={false}/>
                <Outlet/>
            </Paper>
            <Form method="post">
                <DraggableFAB
                    Icon={<Refresh/>}
                    ActionType="Refresh"
                    ButtonClassName="HiddenRefreshButton"
                    color="primary"
                    style={{
                        position: 'absolute',
                        bottom: '20%',
                        right: "1rem"
                    }}
                    tooltipTitle='刷新表格'
                />
            </Form>
        </>
    )
}
