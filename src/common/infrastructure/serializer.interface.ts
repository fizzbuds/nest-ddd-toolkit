export interface ISerializer<A, AM> {
    aggregateToAggregateModel: (aggregate: A) => AM;
    aggregateModelToAggregate: (aggregateModel: AM) => A;
}
