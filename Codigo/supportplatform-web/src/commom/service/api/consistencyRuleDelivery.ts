import {
    ConsistencyRuleDeliveryResponseDTO,
    ConsistencyRuleDeliverySearchDTO,
} from "@gitgrade/dtos";
import api from "../config/api";
import { PaginationResponseDTO } from "@gitgrade/dtos/utils/pagination";

export class ConsistencyRuleDeliveryService {
    getAll(search?: ConsistencyRuleDeliverySearchDTO) {
        const searchParams = new URLSearchParams();
        if (search?.consistencyRuleId)
            searchParams.set(
                "consistencyRuleId",
                search.consistencyRuleId.toString()
            );
        if (search?.repositoryId)
            searchParams.set("repositoryId", search.repositoryId.toString());
        if (search?.evaluationMethodId)
            searchParams.set(
                "evaluationMethodId",
                search.evaluationMethodId.toString()
            );
        if (search?.status)
            searchParams.set("status", search.status.toString());

        if (search?.sprintId)
            searchParams.set("sprintId", search.sprintId.toString());

        if (search?.page) searchParams.set("page", search.page.toString());
        if (search?.limit) searchParams.set("limit", search.limit.toString());

        return api.get<
            PaginationResponseDTO<ConsistencyRuleDeliveryResponseDTO>
        >(`consistency-rule-delivery?${searchParams.toString()}`);
    }
}
