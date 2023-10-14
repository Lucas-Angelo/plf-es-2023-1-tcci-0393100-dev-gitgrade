import { Op } from "sequelize";
import { WhereOptions } from "sequelize";

export function getContributorWhere(
    contributors: Array<string> | undefined,
    filterWithNoContributor: boolean | undefined,
    options: {
        contributorLoginFilterKey: string;
        contributorIdFilterKey: string;
    }
) {
    let contributorWhere: WhereOptions = {};
    if (contributors?.length || filterWithNoContributor) {
        const orParts = [];
        if (contributors?.length) {
            orParts.push({
                [options.contributorLoginFilterKey]: contributors,
            });
        }
        if (filterWithNoContributor) {
            orParts.push({
                [options.contributorLoginFilterKey]: null,
            });
        }

        contributorWhere = {
            [Op.or]: orParts,
        };
    }

    return contributorWhere;
}
