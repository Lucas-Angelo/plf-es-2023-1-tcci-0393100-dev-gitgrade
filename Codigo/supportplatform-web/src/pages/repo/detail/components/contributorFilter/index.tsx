import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import AvatarButton from "../../../../../commom/components/avatarButton";
import { useToggle } from "../../../../../commom/hooks/useToggle";
import appRoutes from "../../../../../commom/routes/appRoutes";

import AvatarFallbackLogoImage from "../../../../../assets/avatar-fallback-logo.png";
import QuestionMarkImage from "../../../../../assets/question-mark.png";

interface IContributorFilterProps {
    contributors?: Array<{
        id: number;
        githubName?: string | null;
        githubLogin: string | null;
        githubAvatarUrl: string | null;
    }>;
}

const pageSearchParams = appRoutes.repo["detail"].metrics.search;

export default function ContributorFilter(props: IContributorFilterProps) {
    const [searchParams, setSearchParams] = useSearchParams();

    const [constributorsFilterSet, setContributorsFilter] = useState(
        new Set(searchParams.getAll(pageSearchParams.contributor))
    );
    const [isFilteringWithNoContributor, toggleIsFilteringWithNoContributor] =
        useToggle(
            searchParams.get(pageSearchParams.filterWithNoContributor) ===
                "true"
        );

    function handleContributorClick(githubLogin: string | null) {
        if (githubLogin) {
            const newContributorsFilter = new Set(constributorsFilterSet);
            if (constributorsFilterSet.has(githubLogin)) {
                newContributorsFilter.delete(githubLogin);
            } else {
                newContributorsFilter.add(githubLogin);
            }

            setContributorsFilter(newContributorsFilter);
            setSearchParams((searchParams) => ({
                ...searchParams,
                [pageSearchParams.filterWithNoContributor]:
                    isFilteringWithNoContributor,
                [pageSearchParams.contributor]: Array.from(
                    newContributorsFilter
                ),
            }));
        }
    }

    function handleNoContributorClick() {
        toggleIsFilteringWithNoContributor();
        const newIsFilteringWithNoContributorObj: Record<string, boolean> = {};
        if (!isFilteringWithNoContributor) {
            newIsFilteringWithNoContributorObj[
                pageSearchParams.filterWithNoContributor
            ] = true;
        }

        setSearchParams((currentSearchParams) => ({
            ...currentSearchParams,
            ...newIsFilteringWithNoContributorObj,
            [pageSearchParams.contributor]: Array.from(constributorsFilterSet),
        }));
    }

    const hasAnyFilter =
        isFilteringWithNoContributor || constributorsFilterSet.size > 0;

    return (
        <>
            {props.contributors?.map((contributor) => (
                <AvatarButton
                    key={contributor.id}
                    src={contributor.githubAvatarUrl ?? AvatarFallbackLogoImage}
                    title={
                        contributor.githubName ??
                        contributor.githubLogin ??
                        "Não identificado"
                    }
                    variant={
                        contributor.githubLogin &&
                        constributorsFilterSet.has(contributor.githubLogin)
                            ? "selected"
                            : hasAnyFilter
                            ? "notSelected"
                            : "commom"
                    }
                    onClick={() =>
                        handleContributorClick(contributor.githubLogin)
                    }
                />
            ))}
            <AvatarButton
                src={QuestionMarkImage}
                title="(Sem contribuidor)"
                variant={
                    isFilteringWithNoContributor
                        ? "selected"
                        : hasAnyFilter
                        ? "notSelected"
                        : "commom"
                }
                onClick={handleNoContributorClick}
            />
        </>
    );
}
