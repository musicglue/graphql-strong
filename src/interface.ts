// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { GraphQLFieldConfigMap, GraphQLInterfaceType, GraphQLNonNull } from 'graphql';
import { getWeakArgsMap, StrongArgsConfig } from './args';
import { trimDescriptionsInConfig } from './description';
import { StrongObjectType } from './object';
import { StrongOutputType } from './type';

const getInterfaceOptions = <TValue, TFieldMap extends StrongInterfaceFieldMap>(config: StrongInterfaceTypeConfig<TValue, TFieldMap>) => {
  const options = {
    description: config.description,
    // Compute our fields from the fields map we were provided in the config.
    // The format we define in our config is pretty similar to the format
    // GraphQL.js expects.
    fields: (): GraphQLFieldConfigMap<TValue, never> => {
      const weakFields: GraphQLFieldConfigMap<TValue, never> = {};
      for (const fieldName of Object.keys(config.fields)) {
        const fieldConfig = config.fields[fieldName];
        weakFields[fieldName] = {
          args: fieldConfig.args && getWeakArgsMap(fieldConfig.args),
          deprecationReason: fieldConfig.deprecationReason,
          description: fieldConfig.description,
          type: fieldConfig.type.getWeakOutputType(),
        };
      }
      return weakFields;
    },
    name: config.name,
  };

  const { resolveType } = config;
  if (resolveType !== undefined) {
    Object.assign(options, { resolveType: (value: TValue) => resolveType(value).ofType });
  }

  return options;
};

/**
 * Creates a new strong GraphQL interface type. In addition to the runtime
 * configuration object there is also one important type parameter: `TFieldMap`.
 * `TFieldMap` will be used to compute a lot of things involving this interface.
 *
 * This returns the non-null interface type. To get the nullable type just call
 * `.nullable()`.
 */
export function createInterfaceType<TFieldMap extends StrongInterfaceFieldMap>(config: StrongInterfaceTypeConfig<{}, TFieldMap>): StrongInterfaceType<{}, TFieldMap>;
export function createInterfaceType<TValue, TFieldMap extends StrongInterfaceFieldMap>(config: StrongInterfaceTypeConfig<TValue, TFieldMap>): StrongInterfaceType<TValue, TFieldMap>;
export function createInterfaceType<TValue, TFieldMap extends StrongInterfaceFieldMap>(config: StrongInterfaceTypeConfig<TValue, TFieldMap>): StrongInterfaceType<TValue, TFieldMap> {
  return new StrongInterfaceType(new StrongNullableInterfaceType(trimDescriptionsInConfig(config)));
}

/**
 * The structure of the type we want as a type argument to
 * `createInterfaceType`.
 *
 * This type uniquely *does not* represent any runtime type. Instead it only
 * represents an abstract type that will be transformed into other types used in
 * defining and implementing interfaces.
 */
export interface StrongInterfaceFieldMap {
  [fieldName: string]: {
    type: any,
    args?: { [argName: string]: any },
  };
}

/**
 * The configuration object to be used when creating interface types. It
 * requires `resolveType` and `fields`.
 */
export interface StrongInterfaceTypeConfig<TValue, TFieldMap extends StrongInterfaceFieldMap> {
  readonly name: string;
  readonly description?: string | undefined;
  readonly resolveType?: (value: TValue) => StrongObjectType<TValue, never>;
  readonly fields: StrongInterfaceFieldMapConfig<TFieldMap>;
}

/**
 * The type for a fields configuration map.
 */
export type StrongInterfaceFieldMapConfig<TFieldMap extends StrongInterfaceFieldMap> = {
  readonly [TField in keyof TFieldMap]: StrongInterfaceFieldConfig<TFieldMap[TField]['args'], TFieldMap[TField]['type']>
};

/**
 * The configuration type for a single interface field.
 */
export interface StrongInterfaceFieldConfig<TArgs, TValue> {
  readonly description?: string | undefined;
  readonly deprecationReason?: string | undefined;
  readonly type: StrongOutputType<TValue>;
  readonly args?: StrongArgsConfig<TArgs>;
}

/**
 * The object that users will use to implement an interface on a strong object
 * type. It is a map of field names to resolver functions.
 */
export type StrongInterfaceImplementation<TValue, TContext, TFieldMap extends StrongInterfaceFieldMap> = {
  readonly [TField in keyof TFieldMap]: StrongInterfaceFieldImplementation<TValue, TFieldMap[TField]['args'], TContext, TFieldMap[TField]['type']>
};

/**
 * The resolver function that is used to implement an interface on a strong
 * object type.
 */
export type StrongInterfaceFieldImplementation<TSourceValue, TArgs, TContext, TValue> =
  (source: TSourceValue, args: TArgs, context: TContext) => TValue | Promise<TValue>;

/**
 * The interface type class created by `createInterfaceType`. It is
 * non-null, to get the nullable variant just call `.nullable()`.
 */
export
class StrongInterfaceType<TValue, TFieldMap extends StrongInterfaceFieldMap>
extends GraphQLNonNull<StrongNullableInterfaceType<TValue, TFieldMap>>
implements StrongOutputType<TValue> {
  // The required type flags.
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TValue = undefined as any;

  constructor(nullableType: StrongNullableInterfaceType<TValue, TFieldMap>) {
    super(nullableType);
  }

  // The required type conversion methods.
  public getWeakType(): this { return this; }
  public getWeakOutputType(): this { return this; }

  /**
   * Returns the inner nullable version of this type without mutating anything.
   */
  public nullable(): StrongOutputType<TValue | null | undefined> {
    return this.ofType;
  }

  /**
   * Returns the configuration object for fields on this interface.
   *
   * This method is private and should only be called inside of
   * `graphql-strong`.
   */
  public _getFieldConfigMap(): StrongInterfaceFieldMapConfig<TFieldMap> {
    return this.ofType._getFieldConfigMap();
  }
}

/**
 * The class for the nullable variant of the interface type. Because nullability
 * is reversed in `graphql-strong`, this is what actually extends the GraphQL.js
 * interface type.
 */
export
class StrongNullableInterfaceType<TValue, TFieldMap extends StrongInterfaceFieldMap>
extends GraphQLInterfaceType
implements StrongOutputType<TValue | null | undefined> {
  // The required type flags.
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TValue | null | undefined = undefined as any;

  private readonly _strongConfig: StrongInterfaceTypeConfig<TValue, TFieldMap>;

  constructor(config: StrongInterfaceTypeConfig<TValue, TFieldMap>) {
    super(getInterfaceOptions(config));
    this._strongConfig = config;
  }

  // The required type conversion methods.
  public getWeakType(): this { return this; }
  public getWeakOutputType(): this { return this; }

  /**
   * Returns self.
   */
  public nullable(): this {
    return this;
  }

  /**
   * Returns the configuration object for fields on this interface.
   *
   * This method is private and should only be called inside of
   * `graphql-strong`.
   */
  public _getFieldConfigMap(): StrongInterfaceFieldMapConfig<TFieldMap> {
    return this._strongConfig.fields;
  }
}
