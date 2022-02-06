import { Expression, SortKeyConditions } from "src/query/entity.expression";
import { eUser } from "./test.entity";


const test_null: Expression<eUser> = { NULL: "email" };
const test_lt: Expression<eUser> = { LT: { "email": "aa" } };
const test_between: Expression<eUser> = { BETWEEN: { "email": ["aa", "bb"] } };

const test_compose1: Expression<eUser> = { AND: [
  test_null,
  test_lt,
  test_between,
] };

const test_compose2: Expression<eUser> = { OR: [
  test_null,
  test_lt,
  test_between,
] };

const test_not: Expression<eUser> = { NOT: [test_compose1, ] };

// @ts-expect-error
const test_error: Expression<eUser> = 'a';
