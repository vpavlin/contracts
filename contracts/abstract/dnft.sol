// SPDX-License-Identifier: GPL-3.0+
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

abstract contract DNFT {
    using Strings for uint256;


    string public url = "https://api.metaconflux.defidoc.org";
    string public apiVersion = "v1alpha";
    string public baseURI = "";

    bool public useDynamicMetadata = true;


    function dynamicTokenUri(uint256 id) public view returns(string memory) {
        string memory addr = Strings.toHexString(uint256(uint160(address(this))), 20);

        string memory x = string(abi.encodePacked(url, "/api/", apiVersion, "/", addr, "/", id.toString()));
        return x;
    }
    function staticTokenUri(uint256 id) public view returns(string memory) {
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, id.toString(), ".json")) : "";
    }   
    function tokenURI(uint256 id) public view virtual returns(string memory) {
        if (useDynamicMetadata) {
            console.log("Using dynamic");
            return dynamicTokenUri(id);
        } else {
            return staticTokenUri(id);
        }
    }

    event ApiVersion(string oldVersion, string newVersion);
    function setVersion(string memory version) internal {
        require(keccak256(abi.encodePacked(version)) != keccak256(abi.encodePacked("")), "Version cannot be empty");

        string memory oldVersion = apiVersion;

        apiVersion = version;

        emit ApiVersion(oldVersion, version);
    }

    event UsingDynamicMetadata(bool enabled);
    function setDynamic(bool enabled) internal {
        require(useDynamicMetadata != enabled, "Already set");

        useDynamicMetadata = enabled;

        emit UsingDynamicMetadata(enabled);
    } 
}