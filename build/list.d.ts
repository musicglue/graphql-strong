import { StrongInputOutputType, StrongInputType, StrongOutputType } from "./type";
/**
 * Creates a strong list type where the inner type is whatever GraphQL strong
 * type is passed in.
 */
export declare function createInputListType<TValue>(type: StrongInputType<TValue>): StrongInputType<TValue[]>;
export declare function createOutputListType<TValue>(type: StrongOutputType<TValue>): StrongOutputType<TValue[]>;
export declare function createListType<TValue>(type: StrongInputOutputType<TValue>): StrongInputOutputType<TValue[]>;
