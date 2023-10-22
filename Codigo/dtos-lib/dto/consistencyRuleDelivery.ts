export enum ConsistencyRuleDeliveryStatus {
  AWAITING_DELIVERY = "AWAITING_DELIVERY",
  DELIVERED_ON_TIME = "DELIVERED_ON_TIME",
  DELIVERED_LATE = "DELIVERED_LATE",
  NOT_DELIVERED = "NOT_DELIVERED",
  DELIVERED_WITH_INVALIDITY = "DELIVERED_WITH_INVALIDITY",
}

/**
 * ConsistencyRuleDeliveryCreateDTO - Used for creating a new ConsistencyRuleDelivery.
 */
export interface ConsistencyRuleDeliveryCreateDTO {
  /**
   * @isInt consistencyRuleId must be an integer
   * @minimum 1 consistencyRuleId must be greater than or equal to 1
   */
  consistencyRuleId: number;
  /**
   * @isInt repositoryId must be an integer
   * @minimum 1 repositoryId must be greater than or equal to 1
   */
  repositoryId: number;
  /**
   * @isOptional deliveryAt is optional
   * @isDate deliveryAt must be a Date
   */
  deliveryAt?: Date | null;
  /**
   * @isEnum status must be one of ['AWAITING_DELIVERY', 'DELIVERED_ON_TIME', 'DELIVERED_LATE', 'NOT_DELIVERED', 'DELIVERED_WITH_INVALIDITY']
   */
  status: ConsistencyRuleDeliveryStatus;
}

/**
 * ConsistencyRuleDeliveryUpdateDTO - Used for updating an existing ConsistencyRuleDelivery.
 */
export interface ConsistencyRuleDeliveryUpdateDTO {
  /**
   * @isInt consistencyRuleId must be an integer
   * @minimum 1 consistencyRuleId must be greater than or equal to 1
   */
  consistencyRuleId: number;
  /**
   * @isInt repositoryId must be an integer
   * @minimum 1 repositoryId must be greater than or equal to 1
   */
  repositoryId: number;
  /**
   * @isOptional deliveryAt is optional
   * @isDate deliveryAt must be a Date
   */
  deliveryAt?: Date | null;
  /**
   * @isEnum status must be one of ['AWAITING_DELIVERY', 'DELIVERED_ON_TIME', 'DELIVERED_LATE', 'NOT_DELIVERED', 'DELIVERED_WITH_INVALIDITY']
   * @isOptional status is optional
   */
  status: ConsistencyRuleDeliveryStatus;
}

/**
 * ConsistencyRuleDeliverySearchDTO - Used for searching through ConsistencyRuleDeliveries with pagination and filters.
 */
export interface ConsistencyRuleDeliverySearchDTO {
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
   * @isInt consistencyRuleId must be an integer
   * @minimum 1 consistencyRuleId must be greater than or equal to 1
   * @isOptional consistencyRuleId is optional
   */
  consistencyRuleId?: number;
  /**
   * @isInt repositoryId must be an integer
   * @minimum 1 repositoryId must be greater than or equal to 1
   * @isOptional repositoryId is optional
   */
  repositoryId?: number;
  /**
   * @isDate deliveryAt must be a Date
   * @isOptional deliveryAt is optional
   */
  deliveryAt?: Date;
  /**
   * @isDate deliveryAtStart must be a Date
   * @isOptional deliveryAtStart is optional
   */
  deliveryAtStart?: Date;
  /**
   * @isDate deliveryAtEnd must be a Date
   * @isOptional deliveryAtEnd is optional
   */
  deliveryAtEnd?: Date;
  /**
   * @isEnum status must be one of ['AWAITING_DELIVERY', 'DELIVERED_ON_TIME', 'DELIVERED_LATE', 'NOT_DELIVERED', 'DELIVERED_WITH_INVALIDITY']
   * @isOptional status is optional
   */
  status?: ConsistencyRuleDeliveryStatus;
}

/**
 * ConsistencyRuleDeliveryFindOneDTO - Used for filtering to find a single ConsistencyRuleDelivery.
 */
export interface ConsistencyRuleDeliveryFindOneDTO {
  /**
   * @isInt id must be an integer
   * @isOptional id is optional
   */
  id?: number;
  /**
   * @isInt consistencyRuleId must be an integer
   * @minimum 1 consistencyRuleId must be greater than or equal to 1
   * @isOptional consistencyRuleId is optional
   */
  consistencyRuleId?: number;
  /**
   * @isInt repositoryId must be an integer
   * @minimum 1 repositoryId must be greater than or equal to 1
   * @isOptional repositoryId is optional
   */
  repositoryId?: number;
  /**
   * @isDate deliveryAt must be a Date
   * @isOptional deliveryAt is optional
   */
  deliveryAt?: Date;
  /**
   * @isDate deliveryAtStart must be a Date
   * @isOptional deliveryAtStart is optional
   */
  deliveryAtStart?: Date;
  /**
   * @isDate deliveryAtEnd must be a Date
   * @isOptional deliveryAtEnd is optional
   */
  deliveryAtEnd?: Date;
  /**
   * @isEnum status must be one of ['AWAITING_DELIVERY', 'DELIVERED_ON_TIME', 'DELIVERED_LATE', 'NOT_DELIVERED', 'DELIVERED_WITH_INVALIDITY']
   * @isOptional status is optional
   */
  status?: ConsistencyRuleDeliveryStatus;
}

/**
 * ConsistencyRuleDeliveryResponseDTO - Could be used to structure the response object when sending ConsistencyRuleDeliveries to the client.
 */
export interface ConsistencyRuleDeliveryResponseDTO {
  id: number;
  consistencyRuleId: number;
  repositoryId: number;
  deliveryAt: Date | null;
  status: ConsistencyRuleDeliveryStatus;
}
