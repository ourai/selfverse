import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

import { NFT_FAKE_BASE_URI, catchFunc, createOwnerChecker, createAdminChecker, createOperatorChecker } from './helper';

describe('WitnessOfBreakthrough', () => {
  async function deployWitnessOfBreakthroughFixture() {
    const [owner, admin, o1, o2, ...others] = await ethers.getSigners();

    // console.log('`owner`\' address:', owner.address);
    // console.log('`admin`\' address:', admin.address);
    // console.log('`o1`\' address:', o1.address);
    // console.log('`o2`\' address:', o2.address);

    const WitnessOfBreakthrough = await ethers.getContractFactory('WitnessOfBreakthrough');
    const badge = await WitnessOfBreakthrough.deploy(NFT_FAKE_BASE_URI);

    return { owner, admin, o1, o2, others, badge };
  }

  describe('Permission', () => {
    it('Check ownership', createOwnerChecker(deployWitnessOfBreakthroughFixture, 'badge'));
    it('Check admin setup', createAdminChecker(deployWitnessOfBreakthroughFixture, 'badge'));
    it('Check operators setup', createOperatorChecker(deployWitnessOfBreakthroughFixture, 'badge'));
  });

  describe('Badge', () => {
    it('Check minting badge', async () => {
      const { owner, admin, o1, o2, others, badge } = await loadFixture(deployWitnessOfBreakthroughFixture);
      const [m1, m2] = others;

      let operator = badge.connect(owner);

      expect(await operator.totalSupply()).to.equal(0);
      await catchFunc(async () => await operator.mint(m1));
      expect(await operator.totalSupply()).to.equal(0);

      // Set `admin` and `operator` roles
      await operator.updateAdmin(admin);
      expect(await operator.getRoleMemberCount(await operator.SV_OWNER())).to.equal(1);
      expect(await operator.getRoleMemberCount(await operator.SV_ADMIN())).to.equal(1);
      operator = badge.connect(admin);
      await operator.updateOperators([o1, o2], true);
      expect(await operator.getRoleMemberCount(await operator.SV_OPERATOR())).to.equal(2);

      // Mint badge to m1 by o1
      operator = badge.connect(o1);
      await operator.mint(m1);
      expect(await operator.totalSupply()).to.equal(1);
      expect(await operator.ownerOf(1n)).to.equal(m1.address);
      expect(await operator.tokenURI(1n)).to.equal(`${NFT_FAKE_BASE_URI}1`);

      // Mint badge to m2 by o2
      operator = badge.connect(o2);
      await operator.mint(m2);
      expect(await operator.totalSupply()).to.equal(2);
      expect(await operator.ownerOf(2n)).to.equal(m2.address);
      expect(await operator.tokenURI(2n)).to.equal(`${NFT_FAKE_BASE_URI}2`);
    });
  });
});
