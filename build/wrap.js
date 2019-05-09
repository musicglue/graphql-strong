"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:object-literal-sort-keys member-ordering max-classes-per-file variable-name
const graphql_1 = require("graphql");
const list_1 = require("./list");
// Wrappings for types that are baked into the standard library.
exports.IntegerType = wrapWeakType(graphql_1.GraphQLInt);
exports.FloatType = wrapWeakType(graphql_1.GraphQLFloat);
exports.StringType = wrapWeakType(graphql_1.GraphQLString);
exports.BooleanType = wrapWeakType(graphql_1.GraphQLBoolean);
exports.IDType = wrapWeakType(graphql_1.GraphQLID);
exports.IntegerListType = list_1.createListType(exports.IntegerType);
exports.FloatListType = list_1.createListType(exports.FloatType);
exports.StringListType = list_1.createListType(exports.StringType);
exports.BooleanListType = list_1.createListType(exports.BooleanType);
exports.IDTypeListType = list_1.createListType(exports.IDType);
function wrapWeakType(type) {
    const nullableStrongType = {
        _strongType: true,
        _strongInputType: true,
        _strongOutputType: true,
        _strongValue: undefined,
        getWeakType: () => type,
        getWeakInputType: () => graphql_1.assertInputType(type),
        getWeakOutputType: () => graphql_1.assertOutputType(type),
        nullable: () => nullableStrongType,
    };
    const strongType = {
        _strongType: true,
        _strongInputType: true,
        _strongOutputType: true,
        _strongValue: undefined,
        getWeakType: () => new graphql_1.GraphQLNonNull(type),
        getWeakInputType: () => new graphql_1.GraphQLNonNull(graphql_1.assertInputType(type)),
        getWeakOutputType: () => new graphql_1.GraphQLNonNull(graphql_1.assertOutputType(type)),
        nullable: () => nullableStrongType,
    };
    return strongType;
}
exports.wrapWeakType = wrapWeakType;
