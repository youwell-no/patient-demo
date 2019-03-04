import { createMuiTheme } from '@material-ui/core';

const brown1 = '#f2ede6';
const blue1 = '#b2dbf6';
const blue2 = '#bad9f3';
const blue3 = '#68ace6';
const blue4 = '#315570';
const grey0 = '#f3f3f3';
const grey1 = '#e5e5e5';
const grey2 = '#c2c2c2';
const yellow1 = '#fff0e0';
const yellow2 = '#f8b121';
const green = '#A4BE1C';
const red = '#DE0808';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: blue3,
        },
        secondary: {
            main: yellow2,
        },
    },
    typography: {
        useNextVariants: true,
        fontSize: 16,

        subheading: {
            fontWeight: 500,
        },
    },
    colors: {
        brown1,
        blue1,
        blue2,
        blue3,
        blue4,
        grey0,
        grey1,
        grey2,
        yellow1,
        yellow2,
        green,
        red,
    },
    sizes: {
        desktopHeaderHeight: 50,
    },
    borders: {
        normal: `1px solid ${grey1}`,
        dim: `1px solid ${grey0}`,
        thickBlue: `8px solid ${blue3}`,
        boxShadow1: '2px 2px 4px 1px rgba(120, 120, 120, 0.4)',
        boxShadow1Right: '4px 0px 2px 0px rgba(120, 120, 120, 0.4)',
        boxShadow1Width: 6,
    },
});

export default theme;
