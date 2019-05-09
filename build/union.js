"use strict";
// tslint:disable:variable-name max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const description_1 = require("./description");
function createUnionType(config) {
    return new StrongUnionType(new StrongNullableUnionType(description_1.trimDescriptionsInConfig(config)));
}
exports.createUnionType = createUnionType;
function createUnionType2(config) {
    return new StrongUnionType2(new StrongNullableUnionType2(description_1.trimDescriptionsInConfig(config)));
}
exports.createUnionType2 = createUnionType2;
function createUnionType3(config) {
    return new StrongUnionType3(new StrongNullableUnionType3(description_1.trimDescriptionsInConfig(config)));
}
exports.createUnionType3 = createUnionType3;
function createUnionType4(config) {
    return new StrongUnionType4(new StrongNullableUnionType4(description_1.trimDescriptionsInConfig(config)));
}
exports.createUnionType4 = createUnionType4;
function createUnionType5(config) {
    return new StrongUnionType5(new StrongNullableUnionType5(description_1.trimDescriptionsInConfig(config)));
}
exports.createUnionType5 = createUnionType5;
function createUnionType9(config) {
    return new StrongUnionType9(new StrongNullableUnionType9(description_1.trimDescriptionsInConfig(config)));
}
exports.createUnionType9 = createUnionType9;
function createUnionType10(config) {
    return new StrongUnionType10(new StrongNullableUnionType10(description_1.trimDescriptionsInConfig(config)));
}
exports.createUnionType10 = createUnionType10;
class StrongUnionType extends graphql_1.GraphQLNonNull {
    constructor(nullableType) {
        super(nullableType);
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this.ofType;
    }
}
exports.StrongUnionType = StrongUnionType;
class StrongUnionType2 extends graphql_1.GraphQLNonNull {
    constructor(nullableType) {
        super(nullableType);
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this.ofType;
    }
}
exports.StrongUnionType2 = StrongUnionType2;
class StrongUnionType3 extends graphql_1.GraphQLNonNull {
    constructor(nullableType) {
        super(nullableType);
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this.ofType;
    }
}
exports.StrongUnionType3 = StrongUnionType3;
class StrongUnionType4 extends graphql_1.GraphQLNonNull {
    constructor(nullableType) {
        super(nullableType);
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this.ofType;
    }
}
exports.StrongUnionType4 = StrongUnionType4;
class StrongUnionType5 extends graphql_1.GraphQLNonNull {
    constructor(nullableType) {
        super(nullableType);
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this.ofType;
    }
}
exports.StrongUnionType5 = StrongUnionType5;
class StrongUnionType9 extends graphql_1.GraphQLNonNull {
    constructor(nullableType) {
        super(nullableType);
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this.ofType;
    }
}
exports.StrongUnionType9 = StrongUnionType9;
class StrongUnionType10 extends graphql_1.GraphQLNonNull {
    constructor(nullableType) {
        super(nullableType);
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this.ofType;
    }
}
exports.StrongUnionType10 = StrongUnionType10;
class StrongNullableUnionType extends graphql_1.GraphQLUnionType {
    constructor(config) {
        super({
            description: config.description,
            name: config.name,
            resolveType: (value, context) => config.resolveType(value, context).ofType,
            types: () => config.types.map(t => t.ofType),
        });
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this;
    }
}
exports.StrongNullableUnionType = StrongNullableUnionType;
class StrongNullableUnionType2 extends graphql_1.GraphQLUnionType {
    constructor(config) {
        super({
            description: config.description,
            name: config.name,
            resolveType: (value, context) => config.resolveType(value, context).ofType,
            types: () => config.types.map(t => t.ofType),
        });
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this;
    }
}
exports.StrongNullableUnionType2 = StrongNullableUnionType2;
class StrongNullableUnionType3 extends graphql_1.GraphQLUnionType {
    constructor(config) {
        super({
            description: config.description,
            name: config.name,
            resolveType: (value, context) => config.resolveType(value, context).ofType,
            types: () => config.types.map(t => t.ofType),
        });
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this;
    }
}
exports.StrongNullableUnionType3 = StrongNullableUnionType3;
class StrongNullableUnionType4 extends graphql_1.GraphQLUnionType {
    constructor(config) {
        super({
            description: config.description,
            name: config.name,
            resolveType: (value, context) => config.resolveType(value, context).ofType,
            types: () => config.types.map(t => t.ofType),
        });
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this;
    }
}
exports.StrongNullableUnionType4 = StrongNullableUnionType4;
class StrongNullableUnionType5 extends graphql_1.GraphQLUnionType {
    constructor(config) {
        super({
            description: config.description,
            name: config.name,
            resolveType: (value, context) => config.resolveType(value, context).ofType,
            types: () => config.types.map(t => t.ofType),
        });
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this;
    }
}
exports.StrongNullableUnionType5 = StrongNullableUnionType5;
class StrongNullableUnionType9 extends graphql_1.GraphQLUnionType {
    constructor(config) {
        super({
            description: config.description,
            name: config.name,
            resolveType: (value, context) => config.resolveType(value, context).ofType,
            types: () => config.types.map(t => t.ofType),
        });
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this;
    }
}
exports.StrongNullableUnionType9 = StrongNullableUnionType9;
class StrongNullableUnionType10 extends graphql_1.GraphQLUnionType {
    constructor(config) {
        super({
            description: config.description,
            name: config.name,
            resolveType: (value, context) => config.resolveType(value, context).ofType,
            types: () => config.types.map(t => t.ofType),
        });
        this._strongType = true;
        this._strongOutputType = true;
        this._strongValue = undefined;
    }
    getWeakType() {
        return this;
    }
    getWeakOutputType() {
        return this;
    }
    nullable() {
        return this;
    }
}
exports.StrongNullableUnionType10 = StrongNullableUnionType10;
