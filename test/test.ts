import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { TestNFT } from "../typechain-types";
import { NOTFOUND } from "dns";

describe("Dynamic NFT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployNFTFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, acc1, acc2] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("TestNFT");
    const nft:TestNFT = await NFT.deploy();

    return { nft, owner, acc1, acc2 };
  }

  describe("Deployment", function () {
    it("Should allow minting", async () => {
      const { nft, acc1 } = await loadFixture(deployNFTFixture);

      await nft.mint(acc1.address, 0)

      expect(await nft.balanceOf(acc1.address)).to.equal(1);
    });

    it("Should return dynamic URL", async () => {
      const { nft } = await loadFixture(deployNFTFixture);

      const uri = await nft.tokenURI(0)
      console.log(uri)
    });

    it("Should return static URL", async () => {
      const { nft } = await loadFixture(deployNFTFixture);

      await nft.swithDynamicMetadata()
      const uri = await nft.tokenURI(0)
      console.log(uri)
    });

    it("Should allow anyone to interact with the NFTs", async () => {
      const { nft, acc1, acc2} = await loadFixture(deployNFTFixture)

      await nft.mint(acc1.address, 0)

      await nft.interact(0)

      console.log(await nft.getMetadataValues(0))
      await nft.connect(acc2).interact(0)

      console.log(await nft.getMetadataValues(0))
    })
  });
});
