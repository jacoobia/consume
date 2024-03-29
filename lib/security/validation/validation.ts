import {
  Controller,
  Middleware,
  Request,
  RequestBody,
  Response,
  UrlParams,
  ValidatorError,
  ValidatorFunction,
  ElementValidator,
  ValidatorOptions,
  StatusCodes
} from '../../@types';

/**
 * Creates a validator function to be used in
 * validators, automatically appends the optional state
 * @param validateFunc The validator function
 * @returns {ValidatorFunction} validator function
 */
export const objectValidator = (
  validateFunc: (object: unknown) => boolean,
  errorMessage?: string
): ValidatorFunction => {
  const validatorFunc = (): ElementValidator => ({
    validate: (object) => validateFunc(object),
    message: errorMessage,
    optional: false
  });

  validatorFunc.optional = (): ElementValidator => ({
    validate: (object) => object === undefined || validateFunc(object),
    message: errorMessage,
    optional: true
  });

  return validatorFunc;
};

/**
 * Default validator, validates a string
 */
export const StringValidator = objectValidator(
  (object) => typeof object === 'string',
  'Invalid type, expected a string'
);
/**
 * Default validator, validates a number
 */
export const NumberValidator = objectValidator(
  (object) => typeof object === 'number',
  'Invalid type, expected a number'
);
/**
 * Default validator, validates a boolean
 */
export const BooleanValidator = objectValidator(
  (object) => typeof object === 'boolean',
  'Invalid type, expected a boolean'
);

const extractPayload = (request: Request): UrlParams | RequestBody => {
  if (request.body && Object.keys(request.body).length > 0) {
    return request.body;
  } else if (request.urlParams && Object.keys(request.urlParams).length > 0) {
    return request.urlParams;
  } else if (request.searchParams && Object.keys(request.searchParams).length > 0) {
    return request.searchParams;
  } else {
    return null;
  }
};

/**
 * Creates an express middleware that will validate the payload of
 * a HTTP request, it's method agnostic so does not discriminate between
 * body/query/params.
 * @param validators The validation rules to follow
 * @returns {RequestHandler} An express middleware
 */
export const createValidator = (
  validators: Record<string, ElementValidator>,
  options?: ValidatorOptions
): Middleware => {
  return (request: Request, response: Response, controller: Controller) => {
    const errors: ValidatorError = {};
    const payload: UrlParams | RequestBody | null = extractPayload(request);

    if (payload !== null) {
      for (const key in validators) {
        const validator = validators[key];
        const value = payload[key];

        if (value === undefined) {
          if (!validator.optional) {
            errors[key] = 'Required element is missing or undefined';
          }
        } else if (!validator.validate(value)) {
          errors[key] = validator.message ?? 'Invalid type';
        }
      }
    } else {
      errors['Validation'] = 'Unable to parse payload, missing or malformed';
    }

    if (options?.noExtraElements) {
      for (const key in payload) {
        if (!validators[key]) {
          errors[key] = 'Element does not exist in validator';
        }
      }
    }

    if (Object.keys(errors).length) {
      const errorResponseKey = options?.errorListName ? options.errorListName : 'errors';
      return response.reply(StatusCodes.BadRequest, { [errorResponseKey]: errors });
    }

    controller(request, response);
  };
};
