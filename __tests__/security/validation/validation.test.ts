import {
  Request,
  Response,
  createValidator,
  ValidatorFunction,
  objectValidator,
  StatusCodes,
  NumberValidator
} from '../../../lib';

const mockValidator: ValidatorFunction = objectValidator((object: unknown) => object === 'test');

describe('validator', () => {
  const mockRequest = {} as Request;
  const mockResponse = {
    reply: jest.fn()
  } as unknown as Response;
  const mockController = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the controller if payload is valid', () => {
    const validators = {
      foo: mockValidator(),
      bar: NumberValidator()
    };

    mockRequest.body = {
      foo: 'test',
      bar: 123
    };

    const middleware = createValidator(validators);
    middleware(mockRequest, mockResponse, mockController);

    expect(mockController).toHaveBeenCalledWith(mockRequest, mockResponse);
  });

  it('should call the controller if payload is valid with optional', () => {
    const validators = {
      foo: mockValidator(),
      bar: NumberValidator.optional()
    };

    mockRequest.body = {
      foo: 'test'
      //bar: 123
    };

    const middleware = createValidator(validators);
    middleware(mockRequest, mockResponse, mockController);

    expect(mockController).toHaveBeenCalledWith(mockRequest, mockResponse);
  });

  it('should return 400 response with errors if payload is invalid', () => {
    const validators = {
      foo: NumberValidator()
    };

    mockRequest.body = {
      foo: '1234lol'
    };

    const middleware = createValidator(validators);
    middleware(mockRequest, mockResponse, mockController);

    expect(mockResponse.reply).toHaveBeenCalledWith(400, {
      errors: { foo: 'Invalid type: expected' }
    });
  });

  it('should return 400 response with errors if payload is missing or malformed', () => {
    const validators = {
      foo: mockValidator()
    };

    mockRequest.body = {};

    const middleware = createValidator(validators);
    middleware(mockRequest, mockResponse, mockController);

    expect(mockResponse.reply).toHaveBeenCalledWith(StatusCodes.BadRequest, {
      errors: { Validation: 'Unable to parse payload, missing or malformed' }
    });
  });

  it('should return 400 response with errors if payload contains extra elements', () => {
    const validators = {
      foo: mockValidator()
    };

    mockRequest.body = { foo: 'test', bar: 'test' };

    const validationMiddleware = createValidator(validators, { noExtraElements: true });
    validationMiddleware(mockRequest, mockResponse, mockController);

    expect(mockResponse.reply).toHaveBeenCalledWith(StatusCodes.BadRequest, {
      errors: { bar: 'Element does not exist in validator' }
    });
  });
});
