import {createBrowserRouter} from "react-router-dom";
import Home, {HomeIndex} from "./home";
import {action as HomeAction, loader as HomeLoader} from "./TopBar/StatusBlock/StatusBlock";
import ErrorPage from "./Errors/ErrorPage";
import ProgramPage, {
    action as ProgramPageAction,
    loader as ProgramPageLoader,
    ProgramIndex
} from "./ProgramPage/ProgramPage";
import ProgramContent, {
    action as programContentAction,
    loader as programContentLoader
} from "./ProgramPage/ProgramContent/ProgramContent";
import AddModifyProgram, {action as addModifyProgramAction} from "./Modify/Program/AddModifyProgram";
import DataPoints, {
    action as DataPointsAction,
    ApplicantProfileInDataPoints,
    loader as DataPointsLoader, ProgramContentInDataPoints
} from "./DataPoints/DataPoints";
import {
    action as ProfileApplicantAction,
    DataPointsAction as ProfileDataPointsAction,
    DataPointsLoader as ProfileDataPointsLoader, loader as ProfileApplicantLoader, ProfileApplicantPage
} from "./Profile/ProfileApplicant/ProfileApplicantPage";
import Profile, {action as profileAction, loader as profileLoader, ProfileIndex} from "./Profile/Profile";
import AddModifyApplicant, {
    action as addModifyApplicantAction,
    loader as addModifyApplicantLoader
} from "./Modify/Applicant/AddModifyApplicant";
import AddModifyRecord, {
    action as addModifyRecordAction,
    loader as addModifyRecordLoader
} from "./Modify/Record/AddModifyRecord";
import PostPage, {action as PostPageAction, loader as PostPageLoader, PostIndex} from "./Post/PostPage";
import PostContent, {action as PostContentAction, loader as PostContentLoader} from "./Post/PostContent/PostContent";
import AddModifyPost, {action as AddModifyPostAction, loader as AddModifyPostLoader} from "./Modify/Post/AddModifyPost";
import FAQPage from "./FAQ/FAQPage";
import Login, {action as loginAction} from "./Auth/Login/Login";
import RegisterAndReset, {action as registerAndResetAction} from "./Auth/RegisterAndReset/RegisterAndReset";
import Agreement from "./Agreement/Agreement";
import {AboutUs} from "./AboutUs/AboutUs";
import {HowToUse} from "./HowToUse/HowToUse";
import React from "react";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
        loader: HomeLoader,
        action: HomeAction,
        errorElement: <ErrorPage/>,
        children: [
            {
                index: true,
                element: <HomeIndex/>,
            }, {
                errorElement: <ErrorPage/>,
                children: [
                    {
                        path: '/programs',
                        element: <ProgramPage/>,
                        loader: ProgramPageLoader,
                        action: ProgramPageAction,
                        children: [
                            {
                                errorElement: <ErrorPage/>,
                                children: [
                                    {
                                        index: true,
                                        element: <ProgramIndex/>,
                                    }, {
                                        path: '/programs/:programId',
                                        element: <ProgramContent/>,
                                        loader: programContentLoader,
                                        action: programContentAction
                                    }, {
                                        path: '/programs/:programId/edit',
                                        element: <AddModifyProgram key='edit' type='edit'/>,
                                        loader: programContentLoader,
                                        action: addModifyProgramAction
                                    }, {
                                        path: '/programs/new',
                                        element: <AddModifyProgram key='new' type='new'/>,
                                        action: addModifyProgramAction
                                    },
                                ]
                            }
                        ]
                    }, {
                        path: '/datapoints',
                        element: <DataPoints/>,
                        loader: DataPointsLoader,
                        action: DataPointsAction,
                        children: [
                            {
                                errorElement: <ErrorPage/>,
                                children: [
                                    {
                                        path: '/datapoints/applicant/:applicantId',
                                        element: <ApplicantProfileInDataPoints/>,
                                        loader: ProfileDataPointsLoader,
                                        action: ProfileDataPointsAction,
                                    }, {
                                        path: '/datapoints/program/:programId',
                                        element: <ProgramContentInDataPoints/>,
                                        loader: programContentLoader,
                                    }
                                ]
                            }
                        ]
                    }, {
                        path: '/profile',
                        element: <Profile/>,
                        loader: profileLoader,
                        action: profileAction,
                        children: [
                            {
                                errorElement: <ErrorPage/>,
                                children: [
                                    {
                                        index: true,
                                        element: <ProfileIndex/>
                                    }, {
                                        path: '/profile/:applicantId',
                                        element: <ProfileApplicantPage editable={true}/>,
                                        loader: ProfileApplicantLoader,
                                        action: ProfileApplicantAction,
                                    }, {
                                        path: '/profile/new-applicant',
                                        element: <AddModifyApplicant key='new' type='new'/>,
                                        loader: addModifyApplicantLoader,
                                        action: addModifyApplicantAction
                                    }, {
                                        path: '/profile/new-record',
                                        element: <AddModifyRecord key='new' type='new'/>,
                                        loader: addModifyRecordLoader,
                                        action: addModifyRecordAction
                                    }, {
                                        path: '/profile/:applicantId/edit',
                                        element: <AddModifyApplicant key='edit' type='edit'/>,
                                        loader: addModifyApplicantLoader,
                                        action: addModifyApplicantAction
                                    }, {
                                        path: '/profile/:applicantId/:programId/edit',
                                        element: <AddModifyRecord key='edit' type='edit'/>,
                                        loader: addModifyRecordLoader,
                                        action: addModifyRecordAction
                                    }
                                ]
                            }
                        ]
                    }, {
                        path: '/posts',
                        element: <PostPage/>,
                        loader: PostPageLoader,
                        action: PostPageAction,
                        children: [
                            {
                                errorElement: <ErrorPage/>,
                                children: [
                                    {
                                        index: true,
                                        element: <PostIndex/>
                                    }, {
                                        path: '/posts/:postId',
                                        element: <PostContent/>,
                                        loader: PostContentLoader,
                                        action: PostContentAction
                                    }, {
                                        path: '/posts/:postId/edit',
                                        element: <AddModifyPost key="edit" type="edit"/>,
                                        loader: AddModifyPostLoader,
                                        action: AddModifyPostAction
                                    }, {
                                        path: '/posts/new',
                                        element: <AddModifyPost key="new" type="new"/>,
                                        loader: AddModifyPostLoader,
                                        action: AddModifyPostAction
                                    }
                                ]
                            }
                        ]
                    }, {
                        path: '/FAQ',
                        element: <FAQPage/>,
                    }, {
                        path: '/login',
                        element: <Login/>,
                        action: loginAction
                    }, {
                        path: '/register',
                        element: <RegisterAndReset/>,
                        action: registerAndResetAction
                    }, {
                        path: '/reset',
                        element: <RegisterAndReset/>,
                        action: registerAndResetAction
                    }, {
                        path: '/agreement',
                        element: <Agreement/>,
                    }, {
                        path: '/about-us',
                        element: <AboutUs/>,
                    }, {
                        path: '/how-to-use',
                        element: <HowToUse/>,
                        loader: profileLoader,
                    }
                ]
            }
        ]
    },
]);

export default router;