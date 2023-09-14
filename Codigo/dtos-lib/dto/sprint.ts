/**
 * SprintCreateDTO - Used for creating a new Sprint.
 */
export interface SprintCreateDTO {
  /**
   * @isString name must be a string
   * @minLength 1 name must have a minimum length of 1
   * @maxLength 255 name must have a maximum length of 255
   */
  name: string;
  /**
   * @isDate start_date must be a Date
   */
  start_date: Date;
  /**
   * @isDate end_date must be a Date
   */
  end_date: Date;
  /**
   * @isInt evaluation_method_id must be an integer
   */
  evaluation_method_id: number;
}

/**
 * SprintUpdateDTO - Used for updating an existing Sprint.
 */
export interface SprintUpdateDTO {
  /**
   * @isString name must be a string
   * @minLength 1 name must have a minimum length of 1
   * @maxLength 255 name must have a maximum length of 255
   */
  name: string;
  /**
   * @isDate start_date must be a Date
   */
  start_date: Date;
  /**
   * @isDate end_date must be a Date
   */
  end_date: Date;
  /**
   * @isInt evaluation_method_id must be an integer
   */
  evaluation_method_id: number;
}

/**
 * SprintSearchDTO - Used for searching through Sprints with pagination and filters.
 */
export interface SprintSearchDTO {
  /**
   * @isInt page must be an integer
   * @minimum 1 page must be greater than or equal to 1
   * @isOptional page is optional
   */
  page?: number;
  /**
   * @isInt limit must be an integer
   * @minimum 1 limit must be greater than or equal to 1
   * @isOptional limit is optional
   */
  limit?: number;
  /**
   * @isString name must be a string
   * @minLength 1 name must have a minimum length of 1
   * @maxLength 255 name must have a maximum length of 255
   * @isOptional name is optional
   */
  name?: string;
  /**
   * @isDate start_date must be a Date
   * @isOptional start_date is optional
   */
  start_date?: Date;
  /**
   * @isDate end_date must be a Date
   * @isOptional end_date is optional
   */
  end_date?: Date;
  /**
   * @isInt evaluation_method_id must be an integer
   * @isOptional evaluation_method_id is optional
   */
  evaluation_method_id?: number;
}

/**
 * SprintFindOneDTO - Used for filtering to find a single Sprint.
 */
export interface SprintFindOneDTO {
  /**
   * @isInt id must be an integer
   * @isOptional id is optional
   */
  id?: number;
  /**
   * @isString name must be a string
   * @minLength 1 name must have a minimum length of 1
   * @maxLength 255 name must have a maximum length of 255
   * @isOptional name is optional
   */
  name?: string;
  /**
   * @isDate start_date must be a Date
   * @isOptional start_date is optional
   */
  start_date?: Date;
  /**
   * @isDate end_date must be a Date
   * @isOptional end_date is optional
   */
  end_date?: Date;
  /**
   * @isInt evaluation_method_id must be an integer
   * @isOptional evaluation_method_id is optional
   */
  evaluation_method_id?: number;
}

/**
 * SprintResponseDTO - Could be used to structure the response object when sending Sprints to the client.
 */
export interface SprintResponseDTO {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  evaluation_method_id: number;
}
