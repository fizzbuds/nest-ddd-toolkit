export interface ISerializerDeserializer<A, WM> {
    aggregateToWriteModel: (aggregate: A) => WM;
    writeModelToAggregate: (writeModel: WM) => A;
}
