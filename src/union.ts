// tslint:disable:variable-name
// tslint:disable:max-classes-per-file

import { GraphQLNonNull, GraphQLUnionType } from "graphql";
import { trimDescriptionsInConfig } from "./description";
import { StrongObjectType } from "./object";
import { StrongOutputType } from "./type";

export function createUnionType<TInput, TContext>(
  config: StrongUnionTypeConfig<TInput, TContext>,
): StrongUnionType<TInput, TContext> {
  return new StrongUnionType(new StrongNullableUnionType(trimDescriptionsInConfig(config)));
}

export function createUnionType2<TInput, TContext, T1 extends TInput, T2 extends TInput>(
  config: StrongUnionTypeConfig2<TInput, TContext, T1, T2>,
): StrongUnionType2<TInput, TContext, T1, T2> {
  return new StrongUnionType2(new StrongNullableUnionType2(trimDescriptionsInConfig(config)));
}

export function createUnionType3<
  TInput,
  TContext,
  T1 extends TInput,
  T2 extends TInput,
  T3 extends TInput
>(
  config: StrongUnionTypeConfig3<TInput, TContext, T1, T2, T3>,
): StrongUnionType3<TInput, TContext, T1, T2, T3> {
  return new StrongUnionType3(new StrongNullableUnionType3(trimDescriptionsInConfig(config)));
}

export function createUnionType4<
  TInput,
  TContext,
  T1 extends TInput,
  T2 extends TInput,
  T3 extends TInput,
  T4 extends TInput
>(
  config: StrongUnionTypeConfig4<TInput, TContext, T1, T2, T3, T4>,
): StrongUnionType4<TInput, TContext, T1, T2, T3, T4> {
  return new StrongUnionType4(new StrongNullableUnionType4(trimDescriptionsInConfig(config)));
}

export function createUnionType5<
  TInput,
  TContext,
  T1 extends TInput,
  T2 extends TInput,
  T3 extends TInput,
  T4 extends TInput,
  T5 extends TInput
>(
  config: StrongUnionTypeConfig5<TInput, TContext, T1, T2, T3, T4, T5>,
): StrongUnionType5<TInput, TContext, T1, T2, T3, T4, T5> {
  return new StrongUnionType5(new StrongNullableUnionType5(trimDescriptionsInConfig(config)));
}

export interface StrongUnionTypeConfig<TInput, TContext> {
  readonly name: string;
  readonly description?: string | undefined;
  readonly resolveType: (source: TInput, context: TContext) => StrongObjectType<any, any>; // TODO: revert this to StrongObjectType<TInput, any>
  readonly types: Array<StrongObjectType<any, any>>; // TODO: revert this to StrongObjectType<TInput, any>
}

export interface StrongUnionTypeConfig2<TInput, TContext, T1 extends TInput, T2 extends TInput> {
  readonly name: string;
  readonly description?: string | undefined;
  readonly resolveType: (
    source: TInput,
    context: TContext,
  ) => StrongObjectType<T1, any> | StrongObjectType<T2, any>;
  readonly types: [StrongObjectType<T1, any>, StrongObjectType<T2, any>];
}

export interface StrongUnionTypeConfig3<
  TInput,
  TContext,
  T1 extends TInput,
  T2 extends TInput,
  T3 extends TInput
> {
  readonly name: string;
  readonly description?: string | undefined;
  readonly resolveType: (
    source: TInput,
    context: TContext,
  ) => StrongObjectType<T1, any> | StrongObjectType<T2, any> | StrongObjectType<T3, any>;
  readonly types: [StrongObjectType<T1, any>, StrongObjectType<T2, any>, StrongObjectType<T3, any>];
}

export interface StrongUnionTypeConfig4<
  TInput,
  TContext,
  T1 extends TInput,
  T2 extends TInput,
  T3 extends TInput,
  T4 extends TInput
> {
  readonly name: string;
  readonly description?: string | undefined;
  readonly resolveType: (
    source: TInput,
    context: TContext,
  ) =>
    | StrongObjectType<T1, any>
    | StrongObjectType<T2, any>
    | StrongObjectType<T3, any>
    | StrongObjectType<T4, any>;
  readonly types: [
    StrongObjectType<T1, any>,
    StrongObjectType<T2, any>,
    StrongObjectType<T3, any>,
    StrongObjectType<T4, any>
  ];
}

export interface StrongUnionTypeConfig5<
  TInput,
  TContext,
  T1 extends TInput,
  T2 extends TInput,
  T3 extends TInput,
  T4 extends TInput,
  T5 extends TInput
> {
  readonly name: string;
  readonly description?: string | undefined;
  readonly resolveType: (
    source: TInput,
    context: TContext,
  ) =>
    | StrongObjectType<T1, any>
    | StrongObjectType<T2, any>
    | StrongObjectType<T3, any>
    | StrongObjectType<T4, any>
    | StrongObjectType<T5, any>;
  readonly types: [
    StrongObjectType<T1, any>,
    StrongObjectType<T2, any>,
    StrongObjectType<T3, any>,
    StrongObjectType<T4, any>,
    StrongObjectType<T5, any>
  ];
}

export class StrongUnionType<TMembers, TContext>
  extends GraphQLNonNull<StrongNullableUnionType<TMembers, TContext>>
  implements StrongOutputType<TMembers> {
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TMembers = undefined as any;

  constructor(nullableType: StrongNullableUnionType<TMembers, TContext>) {
    super(nullableType);
  }

  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }
  public nullable(): StrongOutputType<TMembers | null | undefined> {
    return this.ofType;
  }
}

export class StrongUnionType2<TMembers, TContext, T1 extends TMembers, T2 extends TMembers>
  extends GraphQLNonNull<StrongNullableUnionType2<TMembers, TContext, T1, T2>>
  implements StrongOutputType<TMembers> {
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TMembers = undefined as any;

  constructor(nullableType: StrongNullableUnionType2<TMembers, TContext, T1, T2>) {
    super(nullableType);
  }

  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }
  public nullable(): StrongOutputType<TMembers | null | undefined> {
    return this.ofType;
  }
}

export class StrongUnionType3<
  TMembers,
  TContext,
  T1 extends TMembers,
  T2 extends TMembers,
  T3 extends TMembers
> extends GraphQLNonNull<StrongNullableUnionType3<TMembers, TContext, T1, T2, T3>>
  implements StrongOutputType<TMembers> {
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TMembers = undefined as any;

  constructor(nullableType: StrongNullableUnionType3<TMembers, TContext, T1, T2, T3>) {
    super(nullableType);
  }

  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }
  public nullable(): StrongOutputType<TMembers | null | undefined> {
    return this.ofType;
  }
}

export class StrongUnionType4<
  TMembers,
  TContext,
  T1 extends TMembers,
  T2 extends TMembers,
  T3 extends TMembers,
  T4 extends TMembers
> extends GraphQLNonNull<StrongNullableUnionType4<TMembers, TContext, T1, T2, T3, T4>>
  implements StrongOutputType<TMembers> {
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TMembers = undefined as any;

  constructor(nullableType: StrongNullableUnionType4<TMembers, TContext, T1, T2, T3, T4>) {
    super(nullableType);
  }

  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }
  public nullable(): StrongOutputType<TMembers | null | undefined> {
    return this.ofType;
  }
}

export class StrongUnionType5<
  TMembers,
  TContext,
  T1 extends TMembers,
  T2 extends TMembers,
  T3 extends TMembers,
  T4 extends TMembers,
  T5 extends TMembers
> extends GraphQLNonNull<StrongNullableUnionType5<TMembers, TContext, T1, T2, T3, T4, T5>>
  implements StrongOutputType<TMembers> {
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TMembers = undefined as any;

  constructor(nullableType: StrongNullableUnionType5<TMembers, TContext, T1, T2, T3, T4, T5>) {
    super(nullableType);
  }

  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }
  public nullable(): StrongOutputType<TMembers | null | undefined> {
    return this.ofType;
  }
}

export class StrongNullableUnionType<TMembers, TContext> extends GraphQLUnionType
  implements StrongOutputType<TMembers | null | undefined> {
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TMembers | null | undefined = undefined as any;

  constructor(config: StrongUnionTypeConfig<TMembers, TContext>) {
    super({
      description: config.description,
      name: config.name,
      resolveType: (value, context) => config.resolveType(value, context).ofType,
      types: () => config.types.map(t => t.ofType),
    });
  }

  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }
  public nullable(): this {
    return this;
  }
}

export class StrongNullableUnionType2<TMembers, TContext, T1 extends TMembers, T2 extends TMembers>
  extends GraphQLUnionType
  implements StrongOutputType<TMembers | null | undefined> {
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TMembers | null | undefined = undefined as any;

  constructor(config: StrongUnionTypeConfig2<TMembers, TContext, T1, T2>) {
    super({
      description: config.description,
      name: config.name,
      resolveType: (value, context) => config.resolveType(value, context).ofType,
      types: () => config.types.map(t => t.ofType),
    });
  }

  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }
  public nullable(): this {
    return this;
  }
}

export class StrongNullableUnionType3<
  TMembers,
  TContext,
  T1 extends TMembers,
  T2 extends TMembers,
  T3 extends TMembers
> extends GraphQLUnionType implements StrongOutputType<TMembers | null | undefined> {
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TMembers | null | undefined = undefined as any;

  constructor(config: StrongUnionTypeConfig3<TMembers, TContext, T1, T2, T3>) {
    super({
      description: config.description,
      name: config.name,
      resolveType: (value, context) => config.resolveType(value, context).ofType,
      types: () => config.types.map(t => t.ofType),
    });
  }

  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }
  public nullable(): this {
    return this;
  }
}

export class StrongNullableUnionType4<
  TMembers,
  TContext,
  T1 extends TMembers,
  T2 extends TMembers,
  T3 extends TMembers,
  T4 extends TMembers
> extends GraphQLUnionType implements StrongOutputType<TMembers | null | undefined> {
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TMembers | null | undefined = undefined as any;

  constructor(config: StrongUnionTypeConfig4<TMembers, TContext, T1, T2, T3, T4>) {
    super({
      description: config.description,
      name: config.name,
      resolveType: (value, context) => config.resolveType(value, context).ofType,
      types: () => config.types.map(t => t.ofType),
    });
  }

  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }
  public nullable(): this {
    return this;
  }
}

export class StrongNullableUnionType5<
  TMembers,
  TContext,
  T1 extends TMembers,
  T2 extends TMembers,
  T3 extends TMembers,
  T4 extends TMembers,
  T5 extends TMembers
> extends GraphQLUnionType implements StrongOutputType<TMembers | null | undefined> {
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TMembers | null | undefined = undefined as any;

  constructor(config: StrongUnionTypeConfig5<TMembers, TContext, T1, T2, T3, T4, T5>) {
    super({
      description: config.description,
      name: config.name,
      resolveType: (value, context) => config.resolveType(value, context).ofType,
      types: () => config.types.map(t => t.ofType),
    });
  }

  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }
  public nullable(): this {
    return this;
  }
}
