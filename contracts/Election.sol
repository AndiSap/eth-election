pragma solidity >=0.4.17;

contract Election {
    // model a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // store accounts that have voted
    mapping(address => bool) public voters;

    // store candidate
    
    // fetch candidate
    mapping(uint => Candidate) public candidates; // declare key/value pairs to store candidates in candidates function
    
    // store candidate count
    uint public candidatesCount; // needed since solidity cannot keep track on count of candidates by itself

    // voted event
    event votedEvent(
        uint indexed _candidateId
    );

    // Constructor
    constructor () public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate (string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidateId) public {
        // require that they havent' voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;
    
        // update candidate vote count
        candidates[_candidateId].voteCount++;

        // tigger voted event
        emit votedEvent(_candidateId);

    }
}