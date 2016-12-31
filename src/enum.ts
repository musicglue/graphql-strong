import { GraphQLNonNull, GraphQLEnumType } from 'graphql'
import { StrongGraphQLInputOutputType } from './type'

/**
 * Creates a type-safe non-null enum GraphQL type.
 */
export function createEnumType <TValue>(config: StrongGraphQLEnumTypeConfig<TValue>): StrongGraphQLInputOutputType<TValue> {
  return new StrongGraphQLEnumType<TValue>(new StrongGraphQLNullableEnumType<TValue>(config))
}

/**
 * The configuration for an enum type.
 */
export type StrongGraphQLEnumTypeConfig<TValue> = {
  readonly name: string,
  readonly description?: string | undefined,
  readonly values: {
    readonly [valueName: string]: {
      readonly value: TValue,
      readonly description?: string | undefined,
      readonly deprecationReason?: string | undefined,
    },
  },
}

/**
 * The non-null strong GraphQL enum type object.
 */
class StrongGraphQLEnumType<TValue>
extends GraphQLNonNull<StrongGraphQLNullableEnumType<TValue>>
implements StrongGraphQLInputOutputType<TValue> {
  // The required type flags.
  readonly _strongType = true
  readonly _strongInputType = true
  readonly _strongOutputType = true
  readonly _strongValue = null

  constructor (nullableType: StrongGraphQLNullableEnumType<TValue>) {
    super(nullableType)
  }

  // The required type conversion methods.
  public _weakType (): this { return this }
  public _weakInputType (): this { return this }
  public _weakOutputType (): this { return this }

  /**
   * Returns the inner nullable variation of this type.
   */
  public nullable (): StrongGraphQLInputOutputType<TValue | null | undefined> {
    return this.ofType
  }
}

/**
 * The nullable sstrong GraphQL enum type object.
 */
class StrongGraphQLNullableEnumType<TValue>
extends GraphQLEnumType
implements StrongGraphQLInputOutputType<TValue | null | undefined> {
  // The required type flags.
  readonly _strongType = true
  readonly _strongInputType = true
  readonly _strongOutputType = true
  readonly _strongValue = null

  constructor (config: StrongGraphQLEnumTypeConfig<TValue>) {
    super(config)
  }

  // The required type conversion methods.
  public _weakType (): this { return this }
  public _weakInputType (): this { return this }
  public _weakOutputType (): this { return this }

  /**
   * Returns self.
   */
  public nullable (): this {
    return this
  }
}