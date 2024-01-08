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
  ValidatorOptions
} from '../../@types';

/**
 * Creates a validator function to be used in
 * validators, automatically appends the optional state
 * @param validateFunc The validator function
 * @returns {ValidatorFunction} validator function
 */
export const createValidator = (validateFunc: (object: unknown) => boolean): ValidatorFunction => {
  const validatorFunc = (): ElementValidator => ({ validate: validateFunc, optional: false });
  validatorFunc.optional = (): ElementValidator => ({ validate: validateFunc, optional: true });
  return validatorFunc;
};

/**
 * Default validator, validates a string
 */
export const StringValidator = createValidator((object) => typeof object === 'string');
/**
 * Default validator, validates a number
 */
export const NumberValidator = createValidator((object) => typeof object === 'number');
/**
 * Default validator, validates a boolean
 */
export const BooleanValidator = createValidator((object) => typeof object === 'boolean');

const extractPayload = (request: Request): UrlParams | RequestBody => {
  if (Object.keys(request.body).length > 0) {
    return request.body;
  } else if (Object.keys(request.urlParams).length > 0) {
    return request.urlParams;
  } else if (Object.keys(request.searchParams).length > 0) {
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
export const validator = (
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
          errors[key] = 'Invalid type: expected';
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
      return response.reply(400, { [errorResponseKey]: errors });
    }

    controller(request, response);
  };
};
