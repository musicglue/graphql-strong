import { GraphQLList, GraphQLNonNull } from 'graphql';
import { StrongInputOutputType, StrongInputType, StrongOutputType } from './type';

/**
 * Creates a strong list type where the inner type is whatever GraphQL strong
 * type is passed in.
 */
export function createListType<TValue>(type: StrongInputOutputType<TValue>): StrongInputOutputType<Array<TValue>>;
export function createListType<TValue>(type: StrongInputType<TValue>): StrongInputType<Array<TValue>>;
export function createListType<TValue>(type: StrongOutputType<TValue>): StrongOutputType<Array<TValue>>;
export function createListType<TValue>(type: StrongInputOutputType<TValue>): StrongInputOutputType<Array<TValue>> {
  const nullableListType: StrongInputOutputType<Array<TValue> | null | undefined> = {
    _strongInputType: true,
    _strongOutputType: true,
    _strongType: true,
    _strongValue: undefined as any,
    getWeakInputType: () => new GraphQLList(type.getWeakInputType()),
    getWeakOutputType: () => new GraphQLList(type.getWeakOutputType()),
    getWeakType: () => new GraphQLList(type.getWeakType()),
    nullable: () => nullableListType,
  };
  const listType: StrongInputOutputType<Array<TValue>> = {
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
