// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "../abstract/dnft.sol";


contract TestNFT is DNFT, ERC721, Ownable {
    struct Interaction {
        uint256 time;
        uint256 counter;
        address interactor;
    }

    mapping(uint256 => Interaction) lastInteraction; //tokenId => interaction

    constructor() ERC721("Neon Creatures", "NC") {
        baseURI = "ipfs://QmUrEHi8CNYKbKR14zZTn3LaUbMEzmFdrMtHaPAcYrZdbL/";
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function tokenURI(uint256 id) public view override(DNFT, ERC721) returns(string memory) {
        return DNFT.tokenURI(id);
    }

    function swithDynamicMetadata() public onlyOwner {
        setDynamic(!useDynamicMetadata);
    }

    event Interacted(uint256 time, uint256 count, address interactor);
    function interact(uint256 id) public {
        require(_exists(id), "Token does not exist");
        Interaction storage i = lastInteraction[id];

        lastInteraction[id] = Interaction(block.timestamp, i.counter+1, msg.sender);
        emit Interacted(block.timestamp, i.counter, msg.sender);   
    }

    function getMetadataValues(uint256 tokenId) public view returns(uint256, uint256, address) {
        Interaction memory i = lastInteraction[tokenId];

        return (i.time, i.counter, i.interactor);
    }
}
