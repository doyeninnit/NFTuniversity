//SPDX-License-Identifier: MIT;
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";



contract UniversityContract is ERC721URIStorage {
    address owner;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("UniversityDegree", "Degree") {
        owner = msg.sender;
    }

    mapping(address => bool) public IssuedDegrees;
    mapping(address => string) public PersonToDegree;


    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function issueDegree (address to ) onlyOwner public {
        IssuedDegrees[to] = true;
    }

    function claimDegree(string memory tokenURI) public returns (uint256){
        require(IssuedDegrees[msg.sender], "Degree not yet issued");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        PersonToDegree[msg.sender] = tokenURI;
        IssuedDegrees[msg.sender] = false;

        return newItemId;
    }
}