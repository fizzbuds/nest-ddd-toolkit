class MusicStudent {
    private totalCreditAmount: number;

    constructor() {
        this.totalCreditAmount = 0;
    }

    addFee(amount: number): void {
        this.totalCreditAmount += amount;
    }

    getTotalCreditAmount(): number {
        return this.totalCreditAmount;
    }
}

describe('MusicStudent', () => {
    describe('Given a MusicStudent', () => {
        let musicStudent: MusicStudent;

        beforeEach(() => {
            musicStudent = new MusicStudent();
        });

        it('should start with a total credit amount of 0', () => {
            expect(musicStudent.getTotalCreditAmount()).toBe(0);
        });

        describe('When adding a fee', () => {
            beforeEach(() => {
                musicStudent.addFee(100);
            });

            it('should increase the total credit amount', () => {
                expect(musicStudent.getTotalCreditAmount()).toBe(100);
            });
        });

        describe('When adding multiple fees', () => {
            beforeEach(() => {
                musicStudent.addFee(100);
                musicStudent.addFee(200);
            });

            it('should calculate the correct total credit amount', () => {
                expect(musicStudent.getTotalCreditAmount()).toBe(300);
            });
        });
    });
});
