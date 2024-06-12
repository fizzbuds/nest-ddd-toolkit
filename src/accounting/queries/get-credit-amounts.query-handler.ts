import { IQueryHandler, Query } from '@fizzbuds/ddd-toolkit';
import { AccountingQueryBus } from '../infrastructure/accounting.query-bus';
import { Injectable } from '@nestjs/common';
import { CreditAmountQueryModel, CreditAmountQueryRepo } from '../read-models/credit-amount.query-repo';

type GetCreditAmountsQueryPayload = Record<string, never>;

export class GetCreditAmountsQuery extends Query<GetCreditAmountsQueryPayload, CreditAmountQueryModel[]> {
    constructor(payload: GetCreditAmountsQueryPayload) {
        super(payload);
    }
}

@Injectable()
export class GetCreditAmountsQueryHandler implements IQueryHandler<GetCreditAmountsQuery> {
    constructor(private readonly creditAmountQueryRepo: CreditAmountQueryRepo, queryBus: AccountingQueryBus) {
        queryBus.register(GetCreditAmountsQuery, this);
    }

    async handle({ payload }: GetCreditAmountsQuery) {
        return await this.creditAmountQueryRepo.getCreditAmounts();
    }
}
