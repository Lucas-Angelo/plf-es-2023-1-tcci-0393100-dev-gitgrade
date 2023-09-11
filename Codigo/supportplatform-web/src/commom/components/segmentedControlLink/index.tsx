import { SegmentedControl } from "@primer/react";
import { useMatch, useResolvedPath } from "react-router";
import { Link } from "react-router-dom";
import "./styles.css";

type SegmentedControlProps = React.ComponentProps<
    typeof SegmentedControl.Button
>;

interface ISegmentedButtonLinkProps extends SegmentedControlProps {
    to: string;
}

export default function SegmentedButtonLink({
    to,
    children,
    ...rest
}: ISegmentedButtonLinkProps) {
    const resolved = useResolvedPath(to);
    const isCurrent = useMatch({ path: resolved.pathname, end: true });

    return (
        <Link
            to={to}
            className="segmented-control-button-link"
        >
            <SegmentedControl.Button
                {...rest}
                selected={Boolean(isCurrent)}
            >
                {children}
            </SegmentedControl.Button>
        </Link>
    );
}
