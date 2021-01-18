# Improved Immutable Record

`ImprovedRecord` is a lightweight wrapper around the
[immutable.js](https://immutable-js.github.io/immutable-js/) `Record` type. This is intended _only_
for use with TypeScript, as it takes advantage of the type system to ensure safety while allowing
for more flexible use.

The primary benefit of `ImprovedRecord` is the ability to declare properties that do not have a
default value. These properties are required to be set when creating a new record instance, and they
cannot be deleted (only changed).

`ImprovedRecord` is inspired by Scala's
[case classes](https://docs.scala-lang.org/tour/case-classes.html), which work in a very similar
way.

## Comparison with immutable.js `Record`

|                                               | immutable.js `Record` | `ImprovedRecord`              |
| --------------------------------------------- | --------------------- | ----------------------------- |
| Properties can be declared without defaults   | ❌                    | ✅                            |
| Properties can be deleted (reset to default)  | ✅                    | Only properties with defaults |
| Shape easily defined by TypeScript interfaces | ✅                    | ✅                            |
| 100% safe at runtime                          | ✅                    | ❌                            |
| 100% safe at compile-time                     | ✅                    | ✅                            |
| Completely immutable                          | ✅                    | ✅                            |

## Getting Started

### Installation

#### NPM

```
npm i improved-record
```

#### Yarn

```
yarn add improved-record
```

### Usage

The API for `ImprovedRecord` is almost exactly the same as the API for the original
[`Record`](https://immutable-js.github.io/immutable-js/docs/#/Record).

Here are all the differences:

- The shape interface type parameter is required (cannot be correctly inferred).
- When creating factories, default values can only be specified for optional properties on the shape
  interface (properties defined like `property?: Type`).
- When creating factories, all required properties must have their default set to the unique
  `required` symbol. This is required because of how immutable.js works behind the scenes.
- `undefined` cannot be used as a default value or as a value for required types. Use `null`
  instead.
- When creating record instances, all properties without default values (required properties in the
  shape interface) are required. Properties with default values can still be overridden.
- When calling `delete` or `remove` on an instance, only properties with defaults (optional
  properties in the shape interface) may be deleted. Names of properties without defaults cannot be
  passed.
- The `clear` method is not available (because there are no default values for some properties).
- The `deleteIn` and `removeIn` methods are not available (because there is no way to safely type-
  check these methods and prevent required properties from being deleted).

That's it! Everything else is the same.

### Example

Here's a full example with a sample `Person` record:

#### Defining a factory

```ts
import {ImprovedRecord, ImprovedRecordOf, required} from "improved-immutable-record";

// The props interface is required (cannot be correctly inferred from the default values):
interface PersonProps {
  // For required properties like this, no default value will be defined.
  username: string;
  // Properties marked optional will always have a default value defined.
  level?: "admin" | "user";
  // The `| undefined` here will have no effect as `undefined` is not a valid value.
  displayName: string | undefined;
  // For truly optional properties, `null` can be used as the default value. `undefined` cannot be
  // the default value.
  age?: number | null;
}

// Now create the record factory. Providing the props interface is required.
const Person = ImprovedRecord<PersonProps>({
  // Set required properties to the unique `required` symbol.
  username: required,
  // Any optional property *must* have a default value.
  level: "user",
  // Even though `displayName` has `| undefined`, it is still a required property (no `?:`).
  displayName: required,
  age: null
});

// Define the record instance type with the same name as the record factory (this is optional but
// makes it much easier to work with and helps to avoid accidentally using `PersonProps` instead of
// `Person`.
type Person = ImprovedRecordOf<PersonProps>;

export default Person;
```

#### Using the factory

```ts
import Person from "Person";

// Using the factory method:
const samplePerson = Person({
  // Required properties must be defined.
  username: "sample123",
  // `displayName` cannot be set to `undefined`
  displayName: "unknown"
  // `age` and `level` don't have to be set because they have defaults.
});

// `Person` is also a type due to declaration merging:
const doSomething = (person: Person): void => {
  /* ... */
};

doSomething(samplePerson);
```
