import { GraphQLList, GraphQLNonNull } from "graphql";
import { StrongInputOutputType, StrongInputType, StrongOutputType } from "./type";

/**
 * Creates a strong list type where the inner type is whatever GraphQL strong
 * type is passed in.
 */
export function createInputListType<TValue>(
  type: StrongInputType<TValue>,
): StrongInputType<TValue[]> {
  const nullableListType: StrongInputType<TValue[] | null | undefined> = {
    _strongInputType: true,
    _strongType: true,
    _strongValue: undefined as any,
    getWeakInputType: () => new GraphQLList(type.getWeakInputType()),
    getWeakType: () => new GraphQLList(type.getWeakType()),
    nullable: () => nullableListType,
  };
  const listType: StrongInputType<TValue[]> = {
    _strongInputType: true,
    _strongType: true,
    _strongValue: undefined as any,
    getWeakInputType: () => new GraphQLNonNull(new GraphQLList(type.getWeakInputType())),
    getWeakType: () => new GraphQLNonNull(new GraphQLList(type.getWeakType())),
    nullable: () => nullableListType,
  };
  return listType;
}

export function createOutputListType<TValue>(
  type: StrongOutputType<TValue>,
): StrongOutputType<TValue[]> {
  const nullableListType: StrongOutputType<TValue[] | null | undefined> = {
    _strongOutputType: true,
    _strongType: true,
    _strongValue: undefined as any,
    getWeakOutputType: () => new GraphQLList(type.getWeakOutputType()),
    getWeakType: () => new GraphQLList(type.getWeakType()),
    nullable: () => nullableListType,
  };
  const listType: StrongOutputType<TValue[]> = {
    _strongOutputType: true,
    _strongType: true,
    _strongValue: undefined as any,
    getWeakOutputType: () => new GraphQLNonNull(new GraphQLList(type.getWeakOutputType())),
    getWeakType: () => new GraphQLNonNull(new GraphQLList(type.getWeakType())),
    nullable: () => nullableListType,
  };
  return listType;
}

export function createListType<TValue>(
  type: StrongInputOutputType<TValue>,
): StrongInputOutputType<TValue[]> {
  const nullableListType: StrongInputOutputType<TValue[] | null | undefined> = {
    _strongInputType: true,
    _strongOutputType: true,
    _strongType: true,
    _strongValue: undefined as any,
    getWeakInputType: () => new GraphQLList(type.getWeakInputType()),
    getWeakOutputType: () => new GraphQLList(type.getWeakOutputType()),
    getWeakType: () => new GraphQLList(type.getWeakType()),
    nullable: () => nullableListType,
  };
  const listType: StrongInputOutputType<TValue[]> = {
    _strongInputType: true,
    _strongOutputType: true,
    _strongType: true,
    _strongValue: undefined as any,
    getWeakInputType: () => new GraphQLNonNull(new GraphQLList(type.getWeakInputType())),
    getWeakOutputType: () => new GraphQLNonNull(new GraphQLList(type.getWeakOutputType())),
    getWeakType: () => new GraphQLNonNull(new GraphQLList(type.getWeakType())),
    nullable: () => nullableListType,
  };
  return listType;
}
