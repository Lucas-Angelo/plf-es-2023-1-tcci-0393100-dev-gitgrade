import { Navigate, NavigateProps } from "react-router";
import { useSearchParamsString } from "../../hooks/useRemainingSearchParams";

interface INavigateMaintainingSearchParamsProps extends NavigateProps {}

export default function NavigateMaintainingSearchParams(
    props: INavigateMaintainingSearchParamsProps
) {
    const searchParamsString = useSearchParamsString();
    const to = props.to;
    return (
        <Navigate
            {...props}
            to={{
                pathname: typeof to === "string" ? to : to.pathname,
                search: searchParamsString,
            }}
        />
    );
}
