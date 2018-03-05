// tslint:disable:max-classes-per-file variable-name object-literal-sort-keys member-ordering
import {
  ExecutionResult,
  graphql,
  GraphQLFieldConfigMap,
  GraphQLInterfaceType,
  GraphQLIsTypeOfFn,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";
import { getWeakArgsMap, StrongArgsConfig } from "./args";
import { trimDescriptionsInConfig } from "./description";
import { StrongOutputType } from "./type";

const getInterfaceOptions = <TValue, TFieldMap extends StrongInterfaceFieldMap>(
  config: StrongInterfaceTypeConfig<TValue, TFieldMap>,
) => {
  const options = {
    description: config.description,
    // Compute our fields from the fields map we were provided in the config.
    // The format we define in our config is pretty similar to the format
    // GraphQL.js expects.
    fields: (): GraphQLFieldConfigMap<TValue, any> => {
      const weakFields: GraphQLFieldConfigMap<TValue, any> = {};
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
export function createInterfaceType<TFieldMap extends StrongInterfaceFieldMap>(
  config: StrongInterfaceTypeConfig<{}, TFieldMap>,
): StrongInterfaceType<{}, TFieldMap>;
export function createInterfaceType<TValue, TFieldMap extends StrongInterfaceFieldMap>(
  config: StrongInterfaceTypeConfig<TValue, TFieldMap>,
): StrongInterfaceType<TValue, TFieldMap>;
export function createInterfaceType<TValue, TFieldMap extends StrongInterfaceFieldMap>(
  config: StrongInterfaceTypeConfig<TValue, TFieldMap>,
): StrongInterfaceType<TValue, TFieldMap> {
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
    type: any;
    args?: { [argName: string]: any };
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
  readonly [TField in keyof TFieldMap]: StrongInterfaceFieldConfig<
    TFieldMap[TField]["args"],
    TFieldMap[TField]["type"]
  >
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
export type StrongInterfaceImplementation<
  TValue,
  TContext,
  TFieldMap extends StrongInterfaceFieldMap
> = {
  readonly [TField in keyof TFieldMap]: StrongInterfaceFieldImplementation<
    TValue,
    any, // TODO: return this to: TFieldMap[TField]["args"],
    TContext,
    TFieldMap[TField]["type"]
  >
};

/**
 * The resolver function that is used to implement an interface on a strong
 * object type.
 */
export type StrongInterfaceFieldImplementation<TSourceValue, TArgs, TContext, TValue> = (
  source: TSourceValue,
  args: TArgs,
  context: TContext,
) => TValue | Promise<TValue>;

/**
 * The interface type class created by `createInterfaceType`. It is
 * non-null, to get the nullable variant just call `.nullable()`.
 */
export class StrongInterfaceType<TValue, TFieldMap extends StrongInterfaceFieldMap>
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
  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }

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
export class StrongNullableInterfaceType<TValue, TFieldMap extends StrongInterfaceFieldMap>
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
  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }

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

/**
 * Creates a strong GraphQL object type with a fluent builder interface.
 *
 * The type will be non-null, in order to get the nullable variant of the type
 * just call `.nullable()`.
 */
export function createObjectType<TValue>(
  config: StrongObjectTypeConfig<{}>,
): StrongObjectType<TValue, {}>;
export function createObjectType<TValue, TContext>(
  config: StrongObjectTypeConfig<TContext>,
): StrongObjectType<TValue, TContext>;
export function createObjectType<TValue, TContext>(
  config: StrongObjectTypeConfig<TContext>,
): StrongObjectType<TValue, TContext> {
  return new StrongObjectType(
    new StrongNullableObjectType(trimDescriptionsInConfig(config), [], []),
  );
}

/**
 * A configuration object to be used when creating object types. Any extra
 * options will go straight into the type config.
 */
export interface StrongObjectTypeConfig<TContext> {
  readonly name: string;
  readonly description?: string | undefined;
  readonly isTypeOf?: GraphQLIsTypeOfFn<any, TContext>;
}

/**
 * The configration object for a single field of a strong GraphQL object type.
 * Takes a lot of generic type parameters to make sure everything is super safe!
 *
 * Arguments are optional.
 */
export interface StrongFieldConfig<TSourceValue, TArgs, TContext, TValue> {
  readonly name: string;
  readonly description?: string | undefined;
  readonly deprecationReason?: string | undefined;
  readonly type: StrongOutputType<TValue> | (() => StrongOutputType<TValue>);
  readonly args?: StrongArgsConfig<TArgs>;
  readonly resolve: (
    source: TSourceValue,
    args: TArgs,
    context: TContext,
  ) => TValue | Promise<TValue>;
}

/**
 * A single field configuration except for you don’t need the arguments.
 */
export type StrongFieldConfigWithoutArgs<TSourceValue, TContext, TValue> = StrongFieldConfig<
  TSourceValue,
  {},
  TContext,
  TValue
>;

/**
 * A single field configuration except the arguments are required.
 */
export type StrongFieldConfigWithArgs<TSourceValue, TArgs, TContext, TValue> = StrongFieldConfig<
  TSourceValue,
  TArgs,
  TContext,
  TValue
> & {
  readonly args: StrongArgsConfig<TArgs>;
};

/**
 * The object returned by `createObjectType`. It is non-null, to get the
 * nullable variant just call `.nullable()`.
 */
// Developers could just instantiate this object directly instead of using
// `createObjectType`, but the function interface feels nicer and allows us to
// add extra features like function overloading.
export class StrongObjectType<TValue, TContext>
  extends GraphQLNonNull<StrongNullableObjectType<TValue, TContext>>
  implements StrongOutputType<TValue> {
  // The required type flags.
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TValue = undefined as any;

  /**
   * A schema created for executing queries against where the query type is this
   * object type.
   */
  private _schema: GraphQLSchema | null = null;

  /**
   * The name of our object type.
   */
  public readonly name: string;

  constructor(nullableType: StrongNullableObjectType<TValue, TContext>) {
    super(nullableType);
    this.name = nullableType.name;
  }

  // The required type conversion methods.
  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }

  /**
   * Returns the inner nullable version of this type without mutating anything.
   */
  public nullable(): StrongOutputType<TValue | null | undefined> {
    return this.ofType;
  }

  /**
   * Returns a new strong GraphQL object type with a new field. This function
   * does not mutate the type it was called on.
   *
   * The field created will have a nullable type. To get a non-null field type
   * use `fieldNonNull`.
   */
  public field<TFieldValue>(
    config: StrongFieldConfigWithoutArgs<TValue, TContext, TFieldValue | null | undefined>,
  ): StrongObjectType<TValue, TContext>;
  public field<TFieldValue, TArgs>(
    config: StrongFieldConfigWithArgs<TValue, TArgs, TContext, TFieldValue | null | undefined>,
  ): StrongObjectType<TValue, TContext>;
  public field<TFieldValue, TArgs>(
    config: StrongFieldConfig<TValue, TArgs, TContext, TFieldValue | null | undefined>,
  ): StrongObjectType<TValue, TContext> {
    return new StrongObjectType(this.ofType._field(config));
  }

  /**
   * Returns a new strong GraphQL object type with a new field. This function
   * does not mutate the type it was called on.
   */
  public fieldNonNull<TFieldValue>(
    config: StrongFieldConfigWithoutArgs<TValue, TContext, TFieldValue>,
  ): StrongObjectType<TValue, TContext>;
  public fieldNonNull<TFieldValue, TArgs>(
    config: StrongFieldConfigWithArgs<TValue, TArgs, TContext, TFieldValue>,
  ): StrongObjectType<TValue, TContext>;
  public fieldNonNull<TFieldValue, TArgs>(
    config: StrongFieldConfig<TValue, TArgs, TContext, TFieldValue>,
  ): StrongObjectType<TValue, TContext> {
    return new StrongObjectType(this.ofType._fieldNonNull(config));
  }

  /**
   * Implement a strong GraphQL interface defining only the new resolvers. All
   * of the descriptions, type, and argument information will be copied over
   * from the interface type.
   */
  public implement<TFieldMap extends StrongInterfaceFieldMap>(
    interfaceType: StrongInterfaceType<any, TFieldMap>,
    implementation: StrongInterfaceImplementation<TValue, TContext, TFieldMap>,
    skipDup?: boolean,
  ): StrongObjectType<TValue, TContext> {
    return new StrongObjectType(this.ofType._implement(interfaceType, implementation, skipDup));
  }

  /**
   * Extends the object type be calling a function which takes the object as an
   * input and returns an object of the same type. This allows the creation of
   * simple extensions that leverage the immutable builder pattern used by this
   * library.
   */
  public extend(
    extension: (type: this) => StrongObjectType<TValue, TContext>,
  ): StrongObjectType<TValue, TContext> {
    return extension(this);
  }

  /**
   * Creates a new copy of this type. It is the exact same as the type which
   * `.clone()` was called on except that the reference is different.
   */
  public clone(): StrongObjectType<TValue, TContext> {
    return new StrongObjectType(this.ofType.clone());
  }

  /**
   * Executes a GraphQL query against this type. The schema used for executing
   * this query uses this object type as the query object type. There is no
   * mutation or subscription type.
   *
   * This can be very useful in testing.
   */
  public execute(
    query: string,
    value: TValue,
    context: TContext,
    variables: { [key: string]: any } = {},
    operation?: string,
  ): Promise<ExecutionResult> {
    if (this._schema === null) {
      this._schema = new GraphQLSchema({ query: this.ofType });
    }
    return graphql(this._schema, query, value, context, variables, operation);
  }
}

/**
 * The private nullable implementation of `StrongObjectType`. Because we
 * want types to be non-null by default, but in GraphQL types are nullable by
 * default this type is also the one that actually extends from
 * `GraphQLObjectType`.
 */
export class StrongNullableObjectType<TValue, TContext> extends GraphQLObjectType
  implements StrongOutputType<TValue | null | undefined> {
  // The required type flags.
  public readonly _strongType: true = true;
  public readonly _strongOutputType: true = true;
  public readonly _strongValue: TValue | null | undefined = undefined as any;

  private readonly _strongConfig: StrongObjectTypeConfig<TContext>;
  private readonly _strongInterfaces: Array<StrongInterfaceType<TValue, any>>;
  private readonly _strongFieldConfigs: Array<StrongFieldConfig<TValue, any, TContext, any>>;

  constructor(
    config: StrongObjectTypeConfig<TContext>,
    interfaces: Array<StrongInterfaceType<TValue, any>>,
    fieldConfigs: Array<StrongFieldConfig<TValue, any, TContext, any>>,
  ) {
    super({
      name: config.name,
      description: config.description,
      isTypeOf: config.isTypeOf || undefined,
      // Add all of the nullable versions of our interfaces.
      interfaces: () => interfaces.map(interfaceType => interfaceType.ofType),
      // We define a thunk which computes our fields from the fields config
      // array we’ve built.
      fields: (): GraphQLFieldConfigMap<TValue, TContext> => {
        const weakFields: GraphQLFieldConfigMap<TValue, TContext> = {};
        for (const fieldConfig of fieldConfigs) {
          weakFields[fieldConfig.name] = {
            description: fieldConfig.description,
            deprecationReason: fieldConfig.deprecationReason,
            type:
              typeof fieldConfig.type === "function"
                ? fieldConfig.type().getWeakOutputType()
                : fieldConfig.type.getWeakOutputType(),
            args: fieldConfig.args && getWeakArgsMap(fieldConfig.args),
            resolve: (source, args, context) => fieldConfig.resolve(source, args, context),
          };
        }
        return weakFields;
      },
    });
    this._strongConfig = config;
    this._strongInterfaces = interfaces;
    this._strongFieldConfigs = fieldConfigs;
  }

  // The required type conversion methods.
  public getWeakType(): this {
    return this;
  }
  public getWeakOutputType(): this {
    return this;
  }

  /**
   * Returns self.
   */
  public nullable(): this {
    return this;
  }

  public isKindOf(): this {
    return this;
  }

  /**
   * Creates a new copy of this type. It is the exact same as the type which
   * `.clone()` was called on except that the reference is different.
   */
  public clone(): StrongNullableObjectType<TValue, TContext> {
    return new StrongNullableObjectType(
      this._strongConfig,
      this._strongInterfaces,
      this._strongFieldConfigs,
    );
  }

  /**
   * Returns true if we already have a field of this name.
   */
  private _hasField(fieldName: string): boolean {
    return !!this._strongFieldConfigs.find(({ name }) => name === fieldName);
  }

  /**
   * Throws an error if we already have a field with the provided name,
   * otherwise the function does nothing.
   */
  private _assertUniqueFieldName(fieldName: string, skipDup: boolean = false): boolean {
    if (this._hasField(fieldName)) {
      if (!skipDup) {
        throw new Error(`Type '${this.name}' already has a field named '${fieldName}'.`);
      }
      return false;
    }

    return true;
  }

  /**
   * This method is a private implementation detail and should not be used
   * outside of `StrongObjectType`!
   */
  public _field<TFieldValue, TArgs>(
    config: StrongFieldConfig<TValue, TArgs, TContext, TFieldValue | null | undefined>,
  ): StrongNullableObjectType<TValue, TContext> {
    this._assertUniqueFieldName(config.name);
    return new StrongNullableObjectType(this._strongConfig, this._strongInterfaces, [
      ...this._strongFieldConfigs,
      trimDescriptionsInConfig({
        ...config,
        type: () =>
          typeof config.type === "function" ? config.type().nullable() : config.type.nullable(),
      }),
    ]);
  }

  /**
   * This method is a private implementation detail and should not be used
   * outside of `StrongObjectType`!
   */
  public _fieldNonNull<TFieldValue, TArgs>(
    config: StrongFieldConfig<TValue, TArgs, TContext, TFieldValue>,
  ): StrongNullableObjectType<TValue, TContext> {
    this._assertUniqueFieldName(config.name);
    return new StrongNullableObjectType(this._strongConfig, this._strongInterfaces, [
      ...this._strongFieldConfigs,
      trimDescriptionsInConfig(config),
    ]);
  }

  /**
   * This method is a private implementation detail and should not be used
   * outside of `StrongObjectType`!
   */
  public _implement<TFieldMap extends StrongInterfaceFieldMap>(
    interfaceType: StrongInterfaceType<TValue, TFieldMap>,
    implementation: StrongInterfaceImplementation<TValue, TContext, TFieldMap>,
    skipDup?: boolean,
  ): StrongNullableObjectType<TValue, TContext> {
    // Get the field config map from our interface.
    const fieldConfigMap = interfaceType._getFieldConfigMap();
    // Create all of the object fields from our interface fields and the
    // implementation argument.
    const fieldConfigs = Object.keys(fieldConfigMap)
      .filter(key => this._assertUniqueFieldName(key, skipDup))
      .map<StrongFieldConfig<TValue, {}, TContext, {}>>(fieldName => {
        // Get what we will need to create this field.
        const fieldConfig = fieldConfigMap[fieldName];
        const fieldResolver = implementation[fieldName];
        // Create a field.
        return trimDescriptionsInConfig({
          name: fieldName,
          description: fieldConfig.description,
          deprecationReason: fieldConfig.deprecationReason,
          type: fieldConfig.type,
          args: fieldConfig.args,
          resolve: fieldResolver,
        });
      });
    // Create a new strong nullable object type with our new fields and our new
    // interface.
    return new StrongNullableObjectType(
      this._strongConfig,
      [...this._strongInterfaces, interfaceType],
      [...this._strongFieldConfigs, ...fieldConfigs],
    );
  }
}
