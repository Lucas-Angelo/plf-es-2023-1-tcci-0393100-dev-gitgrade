/**
 * EvaluationMethodCreateDTO - Used for creating a new EvaluationMethod.
 */
export interface EvaluationMethodCreateDTO {
  /**
   * @isString description must be a string
   * @minLength 1 description must have a minimum length of 1
   * @maxLength 255 description must have a maximum length of 255
   */
  description: string;
  /**
   * @isInt semester must be an integer
   */
  semester: number;
  /**
   * @isInt year must be an integer
   */
  year: number;
}

/**
 * EvaluationMethodUpdateDTO - Used for updating an existing EvaluationMethod.
 */
export interface EvaluationMethodUpdateDTO {
  /**
   * @isString description must be a string
   * @minLength 1 description must have a minimum length of 1
   * @maxLength 255 description must have a maximum length of 255
   */
  description: string;
  /**
   * @isInt semester must be an integer
   */
  semester: number;
  /**
   * @isInt year must be an integer
   */
  year: number;
  /**
   * @isOptional disabledAt is optional
   * @isDate disabledAt must be a Date
   */
  disabledAt?: Date | null;
}

/**
 * EvaluationMethodSearchDTO - Used for searching through EvaluationMethods with pagination and filters.
 */
export interface EvaluationMethodSearchDTO {
  /**
   * @isOptional page is optional, if not provided, default to 1
   * @isInt page must be an integer
   * @minimum 1 page must be greater than or equal to 1
   * @default 1
   */
  page?: number;
  /**
   * @isOptional limit is optional, if not provided, default to 10
   * @isInt limit must be an integer
   * @minimum 1 limit must be greater than or equal to 1
   * @default 10
   */
  limit?: number;
  /**
   * @isOptional description is optional
   * @isString description must be a string
   */
  description?: string;
  /**
   * @isOptional semester is optional
   * @isInt semester must be an integer
   */
  semester?: number;
  /**
   * @isOptional year is optional
   * @isInt year must be an integer
   */
  year?: number;
  /**
   * @isOptional disabledAt is optional
   * @isDate disabledAt must be a Date
   */
  disabledAt?: Date;
  /**
   * @isOptional
   * @isBoolean forceDisabled must be a boolean
   * @default false
   */
  forceDisabled?: boolean;
}

/**
 * EvaluationMethodFindOneDTO - Used for finding a single EvaluationMethod.
 */
export interface EvaluationMethodFindOneDTO {
  /**
   * @isOptional id is optional
   * @isInt id must be an integer
   */
  id?: number;
  /**
   * @isOptional description is optional
   * @isString description must be a string
   * @minLength 1 description must have a minimum length of 1
   * @maxLength 255 description must have a maximum length of 255
   */
  description?: string;
  /**
   * @isOptional semester is optional
   * @isInt semester must be an integer
   */
  semester?: number;
  /**
   * @isOptional year is optional
   * @isInt year must be an integer
   */
  year?: number;
  /**
   * @isOptional disabledAt is optional
   * @isDate disabledAt must be a Date
   */
  disabledAt?: Date;
}

/**
 * EvaluationMethodResponseDTO - Could be used to structure the response object when sending EvaluationMethods to the client.
 */
export interface EvaluationMethodResponseDTO {
  id: number;
  description: string;
  semester: number;
  year: number;
  disabledAt?: Date | null;
}
