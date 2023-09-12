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
  /**
   * @isDate disabledAt must be a Date
   * @isOptional
   * @default null
   */
  disabledAt?: Date | null;
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
   * @isDate disabledAt must be a Date
   */
  disabledAt: Date | null;
}

/**
 * EvaluationMethodSearchDTO - Used for searching through EvaluationMethods with pagination and filters.
 */
export interface EvaluationMethodSearchDTO {
  /**
   * @isInt page must be an integer
   * @minimum 1 page must be greater than or equal to 1
   * @isOptional page is optional, if not provided, default to 1
   * @default 1
   */
  page?: number;
  /**
   * @isInt limit must be an integer
   * @minimum 1 limit must be greater than or equal to 1
   * @isOptional limit is optional, if not provided, default to 10
   * @default 10
   */
  limit?: number;
  /**
   * @isString description must be a string
   * @isOptional
   */
  description?: string;
  /**
   * @isInt semester must be an integer
   * @isOptional
   */
  semester?: number;
  /**
   * @isInt year must be an integer
   * @isOptional
   */
  year?: number;
  /**
   * @isDate disabledAt must be a Date
   * @isOptional
   */
  disabledAt?: Date | null;
  /**
   * @isBoolean forceDisabled must be a boolean
   * @isOptional
   * @default false
   */
  forceDisabled?: boolean;
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
