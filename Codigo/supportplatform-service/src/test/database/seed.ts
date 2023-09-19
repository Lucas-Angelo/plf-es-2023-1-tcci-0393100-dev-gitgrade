import { EvaluationMethod } from "../../model/EvaluationMethod";
import { Repository } from "../../model/Repository";
import { Sprint } from "../../model/Sprint";
import { evaluationMethodTestingSeed } from "../seed/evaluationMethod";
import { repositoryTestingSeed } from "../seed/repository";
import { sprintTestingSeed } from "../seed/sprint";

export async function seedDatabase() {
    await Repository.bulkCreate(repositoryTestingSeed, {});
    await EvaluationMethod.bulkCreate(evaluationMethodTestingSeed, {});
    await Sprint.bulkCreate(sprintTestingSeed, {});
}
