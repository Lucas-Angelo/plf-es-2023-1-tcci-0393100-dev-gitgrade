/**
 * SprintCreateDTO - Used for creating a new Sprint.
 */
export interface SprintCreateDTO {
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
   */
  page: number;
  /**
   * @isInt limit must be an integer
   * @minimum 1 limit must be greater than or equal to 1
   */
  limit: number;
  /**
   * @isDate start_date must be a Date
   * @isOptional
   */
  start_date?: Date;
  /**
   * @isDate end_date must be a Date
   * @isOptional
   */
  end_date?: Date;
  /**
   * @isInt evaluation_method_id must be an integer
   * @isOptional
   */
  evaluation_method_id?: number;
}

/**
 * SprintFindOneDTO - Used for filtering to find a single Sprint.
 */
export interface SprintFindOneDTO {
  /**
   * @isInt id must be an integer
   * @isOptional
   */
  id?: number;
  /**
   * @isDate start_date must be a Date
   * @isOptional
   */
  start_date?: Date;
  /**
   * @isDate end_date must be a Date
   * @isOptional
   */
  end_date?: Date;
  /**
   * @isInt evaluation_method_id must be an integer
   * @isOptional
   */
  evaluation_method_id?: number;
}

/**
 * SprintResponseDTO - Could be used to structure the response object when sending Sprints to the client.
 */
export interface SprintResponseDTO {
  id: number;
  start_date: Date;
  end_date: Date;
  evaluation_method_id: number;
}
