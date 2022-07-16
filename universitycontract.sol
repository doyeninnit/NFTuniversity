//SPDX-License-Identifier: MIT;
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";



contract UniversityContract is ERC721URIStorage {
    

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("NFTUniversityDegree", "NFTDegree") {
        owner = msg.sender;
    }


    
     //stores addresses that have been whitelisted
    mapping(address => bool) public whitelistedAddresses;

    //stores name of the student
    mapping (address => string) public studentName;

    //stores the time when an address was added
    mapping(string => uint) public timeAddressAdded;

    //stores addresses of issued degrees
    mapping(address => bool) public IssuedDegrees;

    //stores a persons address to tokenURI it holds
    mapping(address => string) public PersonToDegree;

    //stores address of the deployer
     address owner;

    //stores number of whitelistd addresses
    uint8 public numAddressesWhitelisted;
    


    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }


    function addAddressToWhitelist(address _newAddress, string memory _name) public onlyOwner{

        require(!whitelistedAddresses[_newAddress], "student already whitelisted");

       //Adds the address to the mapping 
        whitelistedAddresses[_newAddress] = true;

        //Adds name of the student 
        studentName[_newAddress] = _name;

        // Adds the time when the name and address was added
        timeAddressAdded[_name] = block.timestamp;
        
        numAddressesWhitelisted += 1;
    }


    function issueDegree (address to ) onlyOwner public {
        IssuedDegrees[to] = true;
        require(whitelistedAddresses[to], "Address not whitelisted");
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