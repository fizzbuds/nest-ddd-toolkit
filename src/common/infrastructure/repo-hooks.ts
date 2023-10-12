export interface IRepoHooks<A> {
    onSave(aggregate: A): Promise<void>;
}
