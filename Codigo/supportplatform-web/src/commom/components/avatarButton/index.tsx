import { Avatar, Box, ButtonProps, AvatarProps } from "@primer/react";

interface IAvatarButtonProps {
    title: AvatarProps["title"];
    variant: "selected" | "notSelected" | "commom";
    as?: "button";
    onClick?: ButtonProps["onClick"];
    src: AvatarProps["src"];
}

export default function AvatarButton({
    variant = "commom",
    ...props
}: IAvatarButtonProps) {
    return (
        <Box
            as="button"
            sx={{
                border: "none",
                backgroundColor: "transparent",
                p: 0,
                cursor: "pointer",
            }}
            onClick={props.onClick}
        >
            <Avatar
                src={props.src}
                size={20}
                title={props.title}
                sx={{
                    transition: "padding .4s, opacity .4s",
                    ...(variant === "notSelected" && {
                        opacity: 0.5,
                    }),
                    ...(variant === "selected" && {
                        border: "2px solid",
                        borderColor: "Highlight",
                    }),
                    ":hover": {
                        p: "1px",
                    },
                }}
            />
        </Box>
    );
}
