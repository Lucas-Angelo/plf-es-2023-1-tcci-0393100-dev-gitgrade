import { ValidationType } from "@gitgrade/dtos/dto/consistencyRule";

export const validationTypeArray = [
    ValidationType.DEFAULT,
    ValidationType.CFF,
] as const;

export type ValidationTypeString = keyof typeof ValidationType;
