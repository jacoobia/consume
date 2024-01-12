import { Middleware, StringValidator, NumberValidator, createValidator } from '../../dist';

export const addUserValidator: Middleware = createValidator({
  firstname: StringValidator(),
  surname: StringValidator(),
  age: NumberValidator()
});
