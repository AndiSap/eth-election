let Election = artifacts.require('./Election.sol');

contract('Election', function(accounts) {

    before(async () => {
        this.election = await Election.deployed();
    });

    it('initializes with two candidates', async () => {
        const candidatesCount = await this.election.candidatesCount();

        assert.equal(candidatesCount.toNumber(), 2);
    });

    it('initializes the candidates with the correct values', async () => {
        const firstCandidate = await this.election.candidates(1);

        assert.equal(firstCandidate.id, 1);
        assert.equal(firstCandidate.name, 'Candidate 1');
        assert.equal(firstCandidate.voteCount, 0);

        const secondCandidate = await this.election.candidates(2);

        assert.equal(secondCandidate.id, 2);
        assert.equal(secondCandidate.name, 'Candidate 2');
        assert.equal(secondCandidate.voteCount, 0);
    });

    it('allows a voter to cast a vote', async () => {
        const receipt = await this.election.vote(1, { from: accounts[0]});
        const voteResult = await this.election.voters(accounts[0]);
        const firstCandidate = await this.election.candidates(1);

        assert.equal(voteResult, true);
        assert.equal(firstCandidate.voteCount, 1);
        assert.equal(receipt.logs.length, 1);
        assert.equal(receipt.logs[0].event, "votedEvent");
        assert.equal(receipt.logs[0].args._candidateId.toNumber(), firstCandidate.id);
    });

    it('throws an exception for invalid candidates', async () => {
        try {
            await this.election.vote(99, { from: accounts[0]});
        } catch (error) {
            assert.equal(error.message, 'Returned error: VM Exception while processing transaction: revert');
        }

        const firstCandidate = await this.election.candidates(1);
        const secondCandidate = await this.election.candidates(2);

        assert.equal(firstCandidate.voteCount, 1);
        assert.equal(secondCandidate.voteCount, 0);
    });

    it('throws an exception for double voting', async () => {
        let firstCandidate;
        let secondCandidate;
        let error;

        try {
            await this.election.vote(1, { from: accounts[0]});
        } catch (_error) {
            error = _error;
        }
        firstCandidate = await this.election.candidates(1);
        secondCandidate = await this.election.candidates(2);

        assert.equal(error.message, 'Returned error: VM Exception while processing transaction: revert');
        assert.equal(firstCandidate.voteCount, 1);
        assert.equal(secondCandidate.voteCount, 0);

        await this.election.vote(1, { from: accounts[1]});
        firstCandidate = await this.election.candidates(1);
        secondCandidate = await this.election.candidates(2);

        assert.equal(firstCandidate.voteCount, 2);
        assert.equal(secondCandidate.voteCount, 0);
    });

});