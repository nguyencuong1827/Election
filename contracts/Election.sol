pragma solidity >=0.4.21 <0.7.0;

contract Election {

// Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
        string urlAvatar;
    }
    event votedEvent (
        uint indexed _candidateId
    );

    // Store accounts that have voted
    mapping(address => bool) public voters;

    // Read/write candidates
    mapping(uint => Candidate) public candidates;

    // Store Candidates Count
    uint public candidatesCount;

    // Constructor
    constructor () public {
        addCandidate("Barack Obama", "./images/barack-obama.jpg");
        addCandidate("Bill Clinton", "./images/bill-clinton.jpg");
    }
function addCandidate (string memory _name, string memory _url) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0, _url);
    }

function vote ( uint _candidateId) public {
    // require that they haven't voted before
    require(!voters[msg.sender]);

    // require a valid candidate
    require(_candidateId > 0 && _candidateId <= candidatesCount);

    // record that voter has voted
    voters[msg.sender] = true;

    // update candidate vote Count
    candidates[_candidateId].voteCount ++;

    // trigger voted event
    emit  votedEvent(_candidateId);
}


}
