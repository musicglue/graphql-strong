// tslint:disable:object-literal-sort-keys
import { createSchema, StrongObjectType } from "../../index";

// Execute works fine with correct value and context
{
  const schema = createSchema<number, number>({
    query: null as any,
  });

  schema.execute("", 1, 2);
}

// Execute fails with incorrect value
{
  const schema = createSchema<number, number>({
    query: null as any,
  });

  schema.execute("", "string", 2);
}

// Execute fails with incorrect context
{
  const schema = createSchema<number, number>({
    query: null as any,
  });

  schema.execute("", 1, "string");
}

// Type works fine with correct value and context
{
  const query: StrongObjectType<number, number> = null as any;

  const schema = createSchema<number, number>({
    query,
  });
}

// Type fails with incorrect value
{
  const query: StrongObjectType<string, number> = null as any;

  const schema = createSchema<number, number>({
    query,
  });
}

// Type fails with incorrect context
{
  const query: StrongObjectType<number, string> = null as any;

  const schema = createSchema<number, number>({
    query,
  });
}
