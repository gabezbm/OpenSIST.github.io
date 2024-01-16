import {useLocation, useNavigation} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {Backdrop, CircularProgress} from "@mui/material";

export function LoadingBackdrop() {
    const navigation = useNavigation()
    const loading = navigation.state !== 'idle'
    return (
        <Backdrop open={loading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export function useSmallPage() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowWidth / windowHeight < 0.75 || windowWidth < 768;
    // return windowWidth < 768;
}

export function useClickOutSideRef() {
    const [isMenuVisible, setIsMenuVisible] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuVisible(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return [isMenuVisible, setIsMenuVisible, menuRef];
}

export function useUnAuthorized() {
    const location = useLocation();
    return ['/login', '/register', '/reset', '/agreement'].includes(location.pathname);
}

export function getSelectorStyle() {
    const colors = getComputedStyle(document.body);
    return {
        container: (provided) => ({
            ...provided,
            width: '100%',
        }),
        control: (provided) => ({
            ...provided,
            width: '100%',
            minHeight: 0,
            marginBottom: '10px',
            backgroundColor: colors.getPropertyValue('--input-bg-color'),
            color: colors.getPropertyValue('--color'),
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderRadius: '5px',
            border: 'none',
        }),
        menu: (provided) => ({
            ...provided,
            margin: 0,
            padding: 0,
            backgroundColor: colors.getPropertyValue('--menu-bg-color'),
        }),
        option: (provided) => ({
            ...provided,
            color: colors.getPropertyValue('--color'),
            backgroundColor: colors.getPropertyValue('--menu-bg-color'),
            cursor: 'pointer',
            borderRadius: '5px',
            transition: 'background-color 0.3s ease',
            '&:hover': {
                backgroundColor: colors.getPropertyValue('--block-hover-bg-color'),
            },
        }),
        clearIndicator: (provided) => ({
            ...provided,
            padding: 0,
            svg: {
                paddingLeft: '6px',
                paddingRight: '6px',
            },
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            padding: 0,
            svg: {
                paddingLeft: '6px',
                paddingRight: '6px',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: colors.getPropertyValue('--color'),
        }),
        input: (provided) => ({
            ...provided,
            color: colors.getPropertyValue('--color'),
        }),
        singleValue: (provided) => ({
            ...provided,
            color: colors.getPropertyValue('--color'),
        }),
        multiValue: (provided) => ({
            ...provided,
            color: colors.getPropertyValue('--color'),
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: '40px',
            overflowY: 'auto',
        }),
    };
}