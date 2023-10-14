import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { NavList, NavListItemProps } from "@primer/react";

interface INavListItemProps extends NavListItemProps {
    to: string;
    children: React.ReactNode;
}

export default function NavListItem({
    to,
    children,
    ...rest
}: INavListItemProps) {
    const resolved = useResolvedPath(to);
    const isCurrent = useMatch({ path: resolved.pathname, end: false });
    return (
        <NavList.Item
            as={Link}
            to={to}
            aria-current={isCurrent ? "page" : undefined}
            {...rest}
        >
            {children}
        </NavList.Item>
    );
}
