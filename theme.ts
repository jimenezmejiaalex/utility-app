import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
        primary: "#2B2D42",
        secondary: "#8D99AE",
        accent: "#EF233C",
        background: "#1E1F26",
        text: "#FFFFFF",
    },
    components: {
        Button: {
            variants: {
                primary: {
                    bg: "primary",
                    color: "text",
                },
                secondary: {
                    bg: "secondary",
                    color: "text",
                },
            },
        },
        Table: {
            variants: {
                custom: {
                    th: {
                        bg: "secondary",
                        color: "text",
                    },
                    td: {
                        bg: "background",
                        color: "text",
                    },
                },
            },
        },
    },
});

export default theme;
