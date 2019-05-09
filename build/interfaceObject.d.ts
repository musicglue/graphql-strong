import { ExecutionResult, GraphQLInterfaceType, GraphQLIsTypeOfFn, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { StrongArgsConfig } from "./args";
import { StrongOutputType } from "./type";
/**
 * Creates a new strong GraphQL interface type. In addition to the runtime
 * configuration object there is also one important type parameter: `TFieldMap`.
 * `TFieldMap` will be used to compute a lot of things involving this interface.
 *
 * This returns the non-null interface type. To get the nullable type just call
 * `.nullable()`.
 */
export declare function createInterfaceType<TFieldMap extends StrongInterfaceFieldMap>(config: StrongInterfaceTypeConfig<{}, TFieldMap>): StrongInterfaceType<{}, TFieldMap>;
export declare function createInterfaceType<TValue, TFieldMap extends StrongInterfaceFieldMap>(config: StrongInterfaceTypeConfig<TValue, TFieldMap>): StrongInterfaceType<TValue, TFieldMap>;
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
        args?: {
            [argName: string]: any;
        };
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
export declare type StrongInterfaceFieldMapConfig<TFieldMap extends StrongInterfaceFieldMap> = {
    readonly [TField in keyof TFieldMap]: StrongInterfaceFieldConfig<TFieldMap[TField]["args"], TFieldMap[TField]["type"]>;
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
export declare type StrongInterfaceImplementation<TValue, TContext, TFieldMap extends StrongInterfaceFieldMap> = {
    readonly [TField in keyof TFieldMap]: StrongInterfaceFieldImplementation<TValue, any, TContext, TFieldMap[TField]["type"]>;
};
/**
 * The resolver function that is used to implement an interface on a strong
 * object type.
 */
export declare type StrongInterfaceFieldImplementation<TSourceValue, TArgs, TContext, TValue> = (source: TSourceValue, args: TArgs, context: TContext) => TValue | Promise<TValue>;
/**
 * The interface type class created by `createInterfaceType`. It is
 * non-null, to get the nullable variant just call `.nullable()`.
 */
export declare class StrongInterfaceType<TValue, TFieldMap extends StrongInterfaceFieldMap> extends GraphQLNonNull<StrongNullableInterfaceType<TValue, TFieldMap>> implements StrongOutputType<TValue> {
    readonly _strongType: true;
    readonly _strongOutputType: true;
    readonly _strongValue: TValue;
    constructor(nullableType: StrongNullableInterfaceType<TValue, TFieldMap>);
    getWeakType(): this;
    getWeakOutputType(): this;
    /**
     * Returns the inner nullable version of this type without mutating anything.
     */
    nullable(): StrongOutputType<TValue | null | undefined>;
    /**
     * Returns the configuration object for fields on this interface.
     *
     * This method is private and should only be called inside of
     * `graphql-strong`.
     */
    _getFieldConfigMap(): StrongInterfaceFieldMapConfig<TFieldMap>;
}
/**
 * The class for the nullable variant of the interface type. Because nullability
 * is reversed in `graphql-strong`, this is what actually extends the GraphQL.js
 * interface type.
 */
export declare class StrongNullableInterfaceType<TValue, TFieldMap extends StrongInterfaceFieldMap> extends GraphQLInterfaceType implements StrongOutputType<TValue | null | undefined> {
    readonly _strongType: true;
    readonly _strongOutputType: true;
    readonly _strongValue: TValue | null | undefined;
    private readonly _strongConfig;
    constructor(config: StrongInterfaceTypeConfig<TValue, TFieldMap>);
    getWeakType(): this;
    getWeakOutputType(): this;
    /**
     * Returns self.
     */
    nullable(): this;
    /**
     * Returns the configuration object for fields on this interface.
     *
     * This method is private and should only be called inside of
     * `graphql-strong`.
     */
    _getFieldConfigMap(): StrongInterfaceFieldMapConfig<TFieldMap>;
}
/**
 * Creates a strong GraphQL object type with a fluent builder interface.
 *
 * The type will be non-null, in order to get the nullable variant of the type
 * just call `.nullable()`.
 */
export declare function createObjectType<TValue>(config: StrongObjectTypeConfig<{}>): StrongObjectType<TValue, {}>;
export declare function createObjectType<TValue, TContext>(config: StrongObjectTypeConfig<TContext>): StrongObjectType<TValue, TContext>;
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
    readonly resolve: (source: TSourceValue, args: TArgs, context: TContext) => TValue | Promise<TValue>;
}
/**
 * A single field configuration except for you don’t need the arguments.
 */
export declare type StrongFieldConfigWithoutArgs<TSourceValue, TContext, TValue> = StrongFieldConfig<TSourceValue, {}, TContext, TValue>;
/**
 * A single field configuration except the arguments are required.
 */
export declare type StrongFieldConfigWithArgs<TSourceValue, TArgs, TContext, TValue> = StrongFieldConfig<TSourceValue, TArgs, TContext, TValue> & {
    readonly args: StrongArgsConfig<TArgs>;
};
/**
 * The object returned by `createObjectType`. It is non-null, to get the
 * nullable variant just call `.nullable()`.
 */
export declare class StrongObjectType<TValue, TContext> extends GraphQLNonNull<StrongNullableObjectType<TValue, TContext>> implements StrongOutputType<TValue> {
    readonly _strongType: true;
    readonly _strongOutputType: true;
    readonly _strongValue: TValue;
    /**
     * A schema created for executing queries against where the query type is this
     * object type.
     */
    private _schema;
    /**
     * The name of our object type.
     */
    readonly name: string;
    constructor(nullableType: StrongNullableObjectType<TValue, TContext>);
    getWeakType(): this;
    getWeakOutputType(): this;
    /**
     * Returns the inner nullable version of this type without mutating anything.
     */
    nullable(): StrongOutputType<TValue | null | undefined>;
    /**
     * Returns a new strong GraphQL object type with a new field. This function
     * does not mutate the type it was called on.
     *
     * The field created will have a nullable type. To get a non-null field type
     * use `fieldNonNull`.
     */
    field<TFieldValue>(config: StrongFieldConfigWithoutArgs<TValue, TContext, TFieldValue | null | undefined>): StrongObjectType<TValue, TContext>;
    field<TFieldValue, TArgs>(config: StrongFieldConfigWithArgs<TValue, TArgs, TContext, TFieldValue | null | undefined>): StrongObjectType<TValue, TContext>;
    /**
     * Returns a new strong GraphQL object type with a new field. This function
     * does not mutate the type it was called on.
     */
    fieldNonNull<TFieldValue>(config: StrongFieldConfigWithoutArgs<TValue, TContext, TFieldValue>): StrongObjectType<TValue, TContext>;
    fieldNonNull<TFieldValue, TArgs>(config: StrongFieldConfigWithArgs<TValue, TArgs, TContext, TFieldValue>): StrongObjectType<TValue, TContext>;
    /**
     * Implement a strong GraphQL interface defining only the new resolvers. All
     * of the descriptions, type, and argument information will be copied over
     * from the interface type.
     */
    implement<TFieldMap extends StrongInterfaceFieldMap>(interfaceType: StrongInterfaceType<any, TFieldMap>, implementation: StrongInterfaceImplementation<TValue, TContext, TFieldMap>, skipDup?: boolean): StrongObjectType<TValue, TContext>;
    /**
     * Extends the object type be calling a function which takes the object as an
     * input and returns an object of the same type. This allows the creation of
     * simple extensions that leverage the immutable builder pattern used by this
     * library.
     */
    extend(extension: (type: this) => StrongObjectType<TValue, TContext>): StrongObjectType<TValue, TContext>;
    /**
     * Creates a new copy of this type. It is the exact same as the type which
     * `.clone()` was called on except that the reference is different.
     */
    clone(): StrongObjectType<TValue, TContext>;
    /**
     * Executes a GraphQL query against this type. The schema used for executing
     * this query uses this object type as the query object type. There is no
     * mutation or subscription type.
     *
     * This can be very useful in testing.
     */
    execute(query: string, value: TValue, context: TContext, variables?: {
        [key: string]: any;
    }, operation?: string): Promise<ExecutionResult>;
}
/**
 * The private nullable implementation of `StrongObjectType`. Because we
 * want types to be non-null by default, but in GraphQL types are nullable by
 * default this type is also the one that actually extends from
 * `GraphQLObjectType`.
 */
export declare class StrongNullableObjectType<TValue, TContext> extends GraphQLObjectType implements StrongOutputType<TValue | null | undefined> {
    readonly _strongType: true;
    readonly _strongOutputType: true;
    readonly _strongValue: TValue | null | undefined;
    private readonly _strongConfig;
    private readonly _strongInterfaces;
    private readonly _strongFieldConfigs;
    constructor(config: StrongObjectTypeConfig<TContext>, interfaces: Array<StrongInterfaceType<TValue, any>>, fieldConfigs: Array<StrongFieldConfig<TValue, any, TContext, any>>);
    getWeakType(): this;
    getWeakOutputType(): this;
    /**
     * Returns self.
     */
    nullable(): this;
    isKindOf(): this;
    /**
     * Creates a new copy of this type. It is the exact same as the type which
     * `.clone()` was called on except that the reference is different.
     */
    clone(): StrongNullableObjectType<TValue, TContext>;
    /**
     * Returns true if we already have a field of this name.
     */
    private _hasField(fieldName);
    /**
     * Throws an error if we already have a field with the provided name,
     * otherwise the function does nothing.
     */
    private _assertUniqueFieldName(fieldName, skipDup?);
    /**
     * This method is a private implementation detail and should not be used
     * outside of `StrongObjectType`!
     */
    _field<TFieldValue, TArgs>(config: StrongFieldConfig<TValue, TArgs, TContext, TFieldValue | null | undefined>): StrongNullableObjectType<TValue, TContext>;
    /**
     * This method is a private implementation detail and should not be used
     * outside of `StrongObjectType`!
     */
    _fieldNonNull<TFieldValue, TArgs>(config: StrongFieldConfig<TValue, TArgs, TContext, TFieldValue>): StrongNullableObjectType<TValue, TContext>;
    /**
     * This method is a private implementation detail and should not be used
     * outside of `StrongObjectType`!
     */
    _implement<TFieldMap extends StrongInterfaceFieldMap>(interfaceType: StrongInterfaceType<TValue, TFieldMap>, implementation: StrongInterfaceImplementation<TValue, TContext, TFieldMap>, skipDup?: boolean): StrongNullableObjectType<TValue, TContext>;
}
