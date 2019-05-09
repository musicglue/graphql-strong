"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-classes-per-file variable-name object-literal-sort-keys member-ordering
const graphql_1 = require("graphql");
const args_1 = require("./args");
const description_1 = require("./description");
const getInterfaceOptions = (config) => {
    const options = {
        description: config.description,
        // Compute our fields from the fields map we were provided in the config.
        // The format we define in our config is pretty similar to the format
        // GraphQL.js expects.
        fields: () => {
            const weakFields = {};
            for (const fieldName of Object.keys(config.fields)) {
                const fieldConfig = config.fields[fieldName];
                weakFields[fieldName] = {
                    args: fieldConfig.args && args_1.getWeakArgsMap(fieldConfig.args),
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
        Object.assign(options, { resolveType: (value) => resolveType(value).ofType });
    }
    return options;
};
function createInterfaceType(config) {
    return new StrongInterfaceType(new StrongNullableInterfaceType(description_1.trimDescriptionsInConfig(config)));
}
exports.createInterfaceType = createInterfaceType;
/**
 * The interface type class created by `createInterfaceType`. It is
 * non-null, to get the nullable variant just call `.nullable()`.
 */
class StrongInterfaceType extends graphql_1.GraphQLNonNull {
    constructor(nullableType) {
        super(nullableType);
        // The required type flags.
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    // The required type conversion methods.
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    /**
     * Returns the inner nullable version of this type without mutating anything.
     */
    nullable() {
        return this.ofType;
    }
    /**
     * Returns the configuration object for fields on this interface.
     *
     * This method is private and should only be called inside of
     * `graphql-strong`.
     */
    _getFieldConfigMap() {
        return this.ofType._getFieldConfigMap();
    }
}
exports.StrongInterfaceType = StrongInterfaceType;
/**
 * The class for the nullable variant of the interface type. Because nullability
 * is reversed in `graphql-strong`, this is what actually extends the GraphQL.js
 * interface type.
 */
class StrongNullableInterfaceType extends graphql_1.GraphQLInterfaceType {
    constructor(config) {
        super(getInterfaceOptions(config));
        // The required type flags.
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
        this._strongConfig = config;
    }
    // The required type conversion methods.
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    /**
     * Returns self.
     */
    nullable() {
        return this;
    }
    /**
     * Returns the configuration object for fields on this interface.
     *
     * This method is private and should only be called inside of
     * `graphql-strong`.
     */
    _getFieldConfigMap() {
        return this._strongConfig.fields;
    }
}
exports.StrongNullableInterfaceType = StrongNullableInterfaceType;
function createObjectType(config) {
    return new StrongObjectType(new StrongNullableObjectType(description_1.trimDescriptionsInConfig(config), [], []));
}
exports.createObjectType = createObjectType;
/**
 * The object returned by `createObjectType`. It is non-null, to get the
 * nullable variant just call `.nullable()`.
 */
// Developers could just instantiate this object directly instead of using
// `createObjectType`, but the function interface feels nicer and allows us to
// add extra features like function overloading.
class StrongObjectType extends graphql_1.GraphQLNonNull {
    constructor(nullableType) {
        super(nullableType);
        // The required type flags.
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
        /**
         * A schema created for executing queries against where the query type is this
         * object type.
         */
        this._schema = null;
        this.name = nullableType.name;
    }
    // The required type conversion methods.
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    /**
     * Returns the inner nullable version of this type without mutating anything.
     */
    nullable() {
        return this.ofType;
    }
    field(config) {
        return new StrongObjectType(this.ofType._field(config));
    }
    fieldNonNull(config) {
        return new StrongObjectType(this.ofType._fieldNonNull(config));
    }
    /**
     * Implement a strong GraphQL interface defining only the new resolvers. All
     * of the descriptions, type, and argument information will be copied over
     * from the interface type.
     */
    implement(interfaceType, implementation, skipDup) {
        return new StrongObjectType(this.ofType._implement(interfaceType, implementation, skipDup));
    }
    /**
     * Extends the object type be calling a function which takes the object as an
     * input and returns an object of the same type. This allows the creation of
     * simple extensions that leverage the immutable builder pattern used by this
     * library.
     */
    extend(extension) {
        return extension(this);
    }
    /**
     * Creates a new copy of this type. It is the exact same as the type which
     * `.clone()` was called on except that the reference is different.
     */
    clone() {
        return new StrongObjectType(this.ofType.clone());
    }
    /**
     * Executes a GraphQL query against this type. The schema used for executing
     * this query uses this object type as the query object type. There is no
     * mutation or subscription type.
     *
     * This can be very useful in testing.
     */
    execute(query, value, context, variables = {}, operation) {
        if (this._schema === null) {
            this._schema = new graphql_1.GraphQLSchema({ query: this.ofType });
        }
        return graphql_1.graphql(this._schema, query, value, context, variables, operation);
    }
}
exports.StrongObjectType = StrongObjectType;
/**
 * The private nullable implementation of `StrongObjectType`. Because we
 * want types to be non-null by default, but in GraphQL types are nullable by
 * default this type is also the one that actually extends from
 * `GraphQLObjectType`.
 */
class StrongNullableObjectType extends graphql_1.GraphQLObjectType {
    constructor(config, interfaces, fieldConfigs) {
        super({
            name: config.name,
            description: config.description,
            isTypeOf: config.isTypeOf || undefined,
            // Add all of the nullable versions of our interfaces.
            interfaces: () => interfaces.map(interfaceType => interfaceType.ofType),
            // We define a thunk which computes our fields from the fields config
            // array we’ve built.
            fields: () => {
                const weakFields = {};
                for (const fieldConfig of fieldConfigs) {
                    weakFields[fieldConfig.name] = {
                        description: fieldConfig.description,
                        deprecationReason: fieldConfig.deprecationReason,
                        type: typeof fieldConfig.type === "function"
                            ? fieldConfig.type().getWeakOutputType()
                            : fieldConfig.type.getWeakOutputType(),
                        args: fieldConfig.args && args_1.getWeakArgsMap(fieldConfig.args),
                        resolve: (source, args, context) => fieldConfig.resolve(source, args, context),
                    };
                }
                return weakFields;
            },
        });
        // The required type flags.
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
        this._strongConfig = config;
        this._strongInterfaces = interfaces;
        this._strongFieldConfigs = fieldConfigs;
    }
    // The required type conversion methods.
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    /**
     * Returns self.
     */
    nullable() {
        return this;
    }
    isKindOf() {
        return this;
    }
    /**
     * Creates a new copy of this type. It is the exact same as the type which
     * `.clone()` was called on except that the reference is different.
     */
    clone() {
        return new StrongNullableObjectType(this._strongConfig, this._strongInterfaces, this._strongFieldConfigs);
    }
    /**
     * Returns true if we already have a field of this name.
     */
    _hasField(fieldName) {
        return !!this._strongFieldConfigs.find(({ name }) => name === fieldName);
    }
    /**
     * Throws an error if we already have a field with the provided name,
     * otherwise the function does nothing.
     */
    _assertUniqueFieldName(fieldName, skipDup = false) {
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
    _field(config) {
        this._assertUniqueFieldName(config.name);
        return new StrongNullableObjectType(this._strongConfig, this._strongInterfaces, [
            ...this._strongFieldConfigs,
            description_1.trimDescriptionsInConfig(Object.assign({}, config, { type: () => typeof config.type === "function" ? config.type().nullable() : config.type.nullable() })),
        ]);
    }
    /**
     * This method is a private implementation detail and should not be used
     * outside of `StrongObjectType`!
     */
    _fieldNonNull(config) {
        this._assertUniqueFieldName(config.name);
        return new StrongNullableObjectType(this._strongConfig, this._strongInterfaces, [
            ...this._strongFieldConfigs,
            description_1.trimDescriptionsInConfig(config),
        ]);
    }
    /**
     * This method is a private implementation detail and should not be used
     * outside of `StrongObjectType`!
     */
    _implement(interfaceType, implementation, skipDup) {
        // Get the field config map from our interface.
        const fieldConfigMap = interfaceType._getFieldConfigMap();
        // Create all of the object fields from our interface fields and the
        // implementation argument.
        const fieldConfigs = Object.keys(fieldConfigMap)
            .filter(key => this._assertUniqueFieldName(key, skipDup))
            .map(fieldName => {
            // Get what we will need to create this field.
            const fieldConfig = fieldConfigMap[fieldName];
            const fieldResolver = implementation[fieldName];
            // Create a field.
            return description_1.trimDescriptionsInConfig({
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
        return new StrongNullableObjectType(this._strongConfig, [...this._strongInterfaces, interfaceType], [...this._strongFieldConfigs, ...fieldConfigs]);
    }
}
exports.StrongNullableObjectType = StrongNullableObjectType;
