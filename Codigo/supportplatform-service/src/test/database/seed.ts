import { Repository } from "../../model/Repository";
import { repositoryTestingSeed } from "../seed/repository";

export async function seedDatabase() {
    await Repository.bulkCreate(repositoryTestingSeed, {});
}
