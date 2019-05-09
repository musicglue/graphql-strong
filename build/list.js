"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
/**
 * Creates a strong list type where the inner type is whatever GraphQL strong
 * type is passed in.
 */
function createInputListType(type) {
    const nullableListType = {
        _strongInputType: true,
        _strongType: true,
        _strongValue: undefined,
        getWeakInputType: () => new graphql_1.GraphQLList(type.getWeakInputType()),
        getWeakType: () => new graphql_1.GraphQLList(type.getWeakType()),
        nullable: () => nullableListType,
    };
    const listType = {
        _strongInputType: true,
        _strongType: true,
        _strongValue: undefined,
        getWeakInputType: () => new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(type.getWeakInputType())),
        getWeakType: () => new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(type.getWeakType())),
        nullable: () => nullableListType,
    };
    return listType;
}
exports.createInputListType = createInputListType;
function createOutputListType(type) {
    const nullableListType = {
        _strongOutputType: true,
        _strongType: true,
        _strongValue: undefined,
        getWeakOutputType: () => new graphql_1.GraphQLList(type.getWeakOutputType()),
        getWeakType: () => new graphql_1.GraphQLList(type.getWeakType()),
        nullable: () => nullableListType,
    };
    const listType = {
        _strongOutputType: true,
        _strongType: true,
        _strongValue: undefined,
        getWeakOutputType: () => new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(type.getWeakOutputType())),
        getWeakType: () => new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(type.getWeakType())),
        nullable: () => nullableListType,
    };
    return listType;
}
exports.createOutputListType = createOutputListType;
function createListType(type) {
    const nullableListType = {
        _strongInputType: true,
        _strongOutputType: true,
        _strongType: true,
        _strongValue: undefined,
        getWeakInputType: () => new graphql_1.GraphQLList(type.getWeakInputType()),
        getWeakOutputType: () => new graphql_1.GraphQLList(type.getWeakOutputType()),
        getWeakType: () => new graphql_1.GraphQLList(type.getWeakType()),
        nullable: () => nullableListType,
    };
    const listType = {
        _strongInputType: true,
        _strongOutputType: true,
        _strongType: true,
        _strongValue: undefined,
        getWeakInputType: () => new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(type.getWeakInputType())),
        getWeakOutputType: () => new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(type.getWeakOutputType())),
        getWeakType: () => new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(type.getWeakType())),
        nullable: () => nullableListType,
    };
    return listType;
}
exports.createListType = createListType;
