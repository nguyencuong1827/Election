pragma solidity >=0.4.21 <0.7.0;

contract Election {
    // Model candidate
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }
    // Read/write Candidates
    mapping(uint256 => Candidate) public candidates;

    // Store Candidates Count
    uint256 public candidatesCount;

    // Add candidate
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Constructor
    constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }
}
