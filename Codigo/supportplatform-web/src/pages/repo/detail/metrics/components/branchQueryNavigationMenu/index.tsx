import { useSearchParams } from "react-router-dom";
import appRoutes from "../../../../../../commom/routes/appRoutes";
import BranchSelector from "../../../../../../commom/components/branchSelector";

interface IBranchQueryNavigationMenuProps {
    defaultBranchName?: string | null;
    repositoryId: number;
}

const pageRouteSearchParams = appRoutes.repo[":id"].metrics.search;

export default function BranchQueryNavigationMenu(
    props: IBranchQueryNavigationMenuProps
) {
    const [searchParams, setSearchParams] = useSearchParams();

    const defaultBranchName = props.defaultBranchName ?? "master";
    const selectedBranch =
        searchParams.get(pageRouteSearchParams.branch) ?? defaultBranchName;

    function handleSelectedBranchChange(branchName: string) {
        setSearchParams((previousSearchParams) => {
            previousSearchParams.set(pageRouteSearchParams.branch, branchName);
            return previousSearchParams;
        });
    }

    return (
        <BranchSelector
            defaultBranchName={defaultBranchName}
            selectedBranch={selectedBranch}
            onSelectedBranchChange={handleSelectedBranchChange}
            repositoryId={props.repositoryId}
        />
    );
}
