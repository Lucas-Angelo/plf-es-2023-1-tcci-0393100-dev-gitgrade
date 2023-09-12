import { EvaluationMethod } from "../../model/EvaluationMethod";
import { Repository } from "../../model/Repository";
import { evaluationMethodTestingSeed } from "../seed/evaluationMethod";
import { repositoryTestingSeed } from "../seed/repository";

export async function seedDatabase() {
    await Repository.bulkCreate(repositoryTestingSeed, {});
    await EvaluationMethod.bulkCreate(evaluationMethodTestingSeed, {});
}
