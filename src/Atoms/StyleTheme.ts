import {ThemedStyledProps} from 'styled-components';

export type MyTheme = {
    wrapperBackground: string
    containerBackground: string
    containerBorder: string,
    inputUnderline: string,

    buttonPrimary: string
    buttonSecondary: string

    borderDimFocus: string
    borderFocus: string
    backgroundFocus: string

    titleText: string
    headerText: string
    normalText: string
    footerText: string

    link: string
    linkHover: string

    success: string
    error: string
}

export type PropsTheme<P> = ThemedStyledProps<P, MyTheme>
export type StyleTheme = PropsTheme<{}>

export type ThemeType = 'lightTheme' | 'darkTheme'

export function mapToTheme(theme: ThemeType): MyTheme {
    switch (theme) {
        case 'lightTheme':
            return LightTheme
        case 'darkTheme':
            return DarkTheme
        default:
            return LightTheme
    }
}

export const LightTheme = {
    wrapperBackground: '#dedede',

    containerBackground: '#fffefc',
    containerBorder: '#9e9e9e',
    inputUnderline: '#dfdedc',

    buttonSecondary: '#467aa8',
    buttonPrimary: '#46badc',

    borderDimFocus: '#C2DCE7',
    borderFocus: '#1e81b0',
    backgroundFocus: '#DBE4E8',

    titleText: '#0a0a0a',
    headerText: '#404040',
    normalText: '#101010',
    footerText: '#535353',

    link: '#337ab7',
    linkHover: '#23527c',

    success: '#00aa00',
    error: '#aa0000'
} as MyTheme

export const DarkTheme = {
    wrapperBackground: '#0F171E',

    containerBackground: '#0C131B',
    containerBorder: '#808080',
    inputUnderline: '#2F373E',

    buttonPrimary: '#265a88',
    buttonSecondary: '#269abc',

    borderDimFocus: '#352F24',
    borderFocus: '#f0ad4e',
    backgroundFocus: '#1C232B',

    titleText: '#f0f0f0',
    normalText: '#d0d0d0',
    headerText: '#808080',
    footerText: '#737373',

    link: '#337ab7',
    linkHover: '#23527c',

    success: '#008800',
    error: '#880000'
} as MyTheme