// tslint:disable:variable-name
// tslint:disable:max-classes-per-file

import { GraphQLNonNull, GraphQLUnionType } from 'graphql';
import { trimDescriptionsInConfig } from './description';
import { StrongObjectType, StrongOutputType } from './index';

export function createUnionType<TInput, TContext>(config: StrongUnionTypeConfig<TInput, TContext>): StrongUnionType<TInput, TContext> {
  return new StrongUnionType(new StrongNullableUnionType(trimDescriptionsInConfig(config)));
}

export interface StrongUnionTypeConfig<TInput, TContext> {
  readonly name: string;
  readonly description?: string | undefined;
  readonly resolveType: (source: TInput, context: TContext) => StrongObjectType<TInput, any>;
  readonly types: Array<StrongObjectType<TInput, any>>;
}

export
class StrongUnionType<TMembers, TContext>
extends GraphQLNonNull<StrongNullableUnionType<TMembers, TContext>>
implements StrongOutputType<TMembers> {
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TMembers = undefined as any;

  constructor(nullableType: StrongNullableUnionType<TMembers, TContext>) {
    super(nullableType);
  }

  public getWeakType(): this { return this; }
  public getWeakOutputType(): this { return this; }
  public nullable(): StrongOutputType<TMembers | null | undefined> {
    return this.ofType;
  }
}

export
class StrongNullableUnionType<TMembers, TContext>
extends GraphQLUnionType
implements StrongOutputType<TMembers | null | undefined> {
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TMembers | null | undefined = undefined as any;

  private readonly _strongConfig: StrongUnionTypeConfig<TMembers, TContext>;

  constructor(config: StrongUnionTypeConfig<TMembers, TContext>) {
    super({
      description: config.description,
      name: config.name,
      resolveType: (value, context) => config.resolveType(value, context).ofType,
      types: () => config.types.map(t => t.ofType),
    });
    this._strongConfig = config;
  }

  public getWeakType(): this { return this; }
  public getWeakOutputType(): this { return this; }
  public nullable(): this { return this; }
}
