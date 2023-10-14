import { UnderlineNav2, NavListItemProps } from "@primer/react";
import { useMatch, useResolvedPath } from "react-router";
import { Link } from "react-router-dom";

interface IUnderlineNavItemLinkProps extends NavListItemProps {
    to: string;
    children: React.ReactNode;
}

export default function UnderlineNavItemLink({
    to,
    children,
    ...rest
}: IUnderlineNavItemLinkProps) {
    const resolved = useResolvedPath(to);
    const isCurrent = useMatch({ path: resolved.pathname, end: false });
    return (
        <UnderlineNav2.Item
            as={Link}
            to={to}
            aria-current={isCurrent ? "page" : undefined}
            {...rest}
        >
            {children}
        </UnderlineNav2.Item>
    );
}
