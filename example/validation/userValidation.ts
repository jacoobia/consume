import { Middleware, StringValidator, createValidator, objectValidator } from '../../dist';

const ageValidator = objectValidator((object: unknown) => {
  if (typeof object !== 'number') return false;
  const age = Number(object);
  return age > 18;
}, 'User is too young!');

export const addUserValidator: Middleware = createValidator({
  firstname: StringValidator(),
  surname: StringValidator.optional(),
  age: ageValidator()
});
