//SPDX-License-Identifier: MIT;
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";



contract UniversityContract is ERC721URIStorage {
    

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("ABC NFT", "ABCNFT") {
        owner = msg.sender;
    }


    
     //stores addresses that have been whitelisted
    mapping(address => bool) public whitelistedAddresses;

    //stores name of the student
    mapping (address => string) public studentName;

    //stores the time when an address was added
    mapping(string => uint) public timeAddressAdded;

    //stores addresses of issued degrees
    mapping(address => bool) public IssuedNFTs;

    //stores a persons address to tokenURI it holds
    mapping(address => string) public PersonToNFT;

    //stores address of the deployer
     address owner;

     uint256 public tokenId;

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


    function issueNFT(address to ) onlyOwner public {
        IssuedNFTs[to] = true;
        require(whitelistedAddresses[to], "Address not whitelisted");
    }
    
    function claimNFT(string memory tokenURI) public returns (uint256){
        require(IssuedNFTs[msg.sender], "Degree not yet issued");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

         tokenId = newItemId;


        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        PersonToNFT[msg.sender] = tokenURI;
        IssuedNFTs[msg.sender] = false;

        return newItemId;
    }

    function getTokenId() public view returns (uint256) {
        return tokenId;
    }
}
