import { Middleware, validator, StringValidator, NumberValidator } from '../../dist';

export const addUserValidator: Middleware = validator({
  firstname: StringValidator(),
  surname: StringValidator(),
  age: NumberValidator()
});
