export class DuplicatedIdError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class OptimisticLockError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class RepoHookError extends Error {
    constructor(message: string) {
        super(message);
    }
}
