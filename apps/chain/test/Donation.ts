import { multiply } from '@ntks/toolbox';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

import { NFT_FAKE_BASE_URI, catchFunc, createOwnerChecker, createAdminChecker, createOperatorChecker } from './helper';

describe('Donation', () => {
  async function deployDonationFixture() {
    const [owner, admin, o1, o2, ...others] = await ethers.getSigners();

    // console.log('`owner`\' address:', owner.address);
    // console.log('`admin`\' address:', admin.address);
    // console.log('`o1`\' address:', o1.address);
    // console.log('`o2`\' address:', o2.address);

    const Donation = await ethers.getContractFactory('Donation');
    const donation = await Donation.deploy(NFT_FAKE_BASE_URI);

    return { owner, admin, o1, o2, others, donation };
  }

  describe('Permission', () => {
    it('Check ownership', createOwnerChecker(deployDonationFixture, 'donation'));
    it('Check admin setup', createAdminChecker(deployDonationFixture, 'donation'));
    it('Check operators setup', createOperatorChecker(deployDonationFixture, 'donation'));
  });

  describe('Donation', () => {
    it('Check donation', async () => {
      const { others, donation } = await loadFixture(deployDonationFixture);
      const [d1, d2] = others;

      let operator = donation.connect(d1);

      expect((await operator['getDonations()']()).length).to.equal(0);
      expect((await operator.getDonators()).length).to.equal(0);
      expect((await operator.getReceived())).to.equal(0);

      const ethAmount = '0.05';

      // Donator d1 donated
      await operator.donate({ value: ethers.parseEther(ethAmount) });
      expect((await operator['getDonations()']()).length).to.equal(1, 'Donation count isn\'t 1');
      expect((await operator.getDonators()).length).to.equal(1, 'Donator count isn\'t 1');
      expect((await operator.getReceived())).to.equal(ethers.parseEther(ethAmount));
      expect((await operator['getDonations(address)'](d1)).length).to.equal(1);

      // Donator d1 donated again
      await operator.donate({ value: ethers.parseEther(ethAmount) });
      expect((await operator['getDonations()']()).length).to.equal(2, 'Donation count isn\'t 2');
      expect((await operator.getDonators()).length).to.equal(1, 'Donator count isn\'t 1');
      expect((await operator.getReceived())).to.equal(ethers.parseEther(`${multiply(Number(ethAmount), 2)}`));
      expect((await operator['getDonations(address)'](d1)).length).to.equal(2);

      operator = donation.connect(d2);

      // Donator d2 donated
      await operator.donate({ value: ethers.parseEther(ethAmount) });
      expect((await operator['getDonations()']()).length).to.equal(3, 'Donation count isn\'t 3');
      expect((await operator.getDonators()).length).to.equal(2, 'Donator count isn\'t 2');
      expect((await operator.getReceived())).to.equal(ethers.parseEther(`${multiply(Number(ethAmount), 3)}`));
      expect((await operator['getDonations(address)'](d2)).length).to.equal(1);

      // Donator d2 donated again
      await operator.donate({ value: ethers.parseEther(ethAmount) });
      expect((await operator['getDonations()']()).length).to.equal(4, 'Donation count isn\'t 4');
      expect((await operator.getDonators()).length).to.equal(2, 'Donator count isn\'t 2');
      expect((await operator.getReceived())).to.equal(ethers.parseEther(`${multiply(Number(ethAmount), 4)}`));
      expect((await operator['getDonations(address)'](d2)).length).to.equal(2);
    });

    it('Check donator badge', async () => {
      const { owner, others, donation } = await loadFixture(deployDonationFixture);
      const [d1, d2] = others;

      let operator, donatorRecord;

      // Donator d1 donated but didn't receive a badge
      operator = donation.connect(d1);
      await operator.donate({ value: ethers.parseEther('0.05') });
      expect((await operator.getReceived())).to.equal(ethers.parseEther('0.05'));
      donatorRecord = (await operator.getDonators()).find(item => item.donator === d1.address)!;
      expect(donatorRecord[2]).to.equal(0n);

      // Donator d2 donated but didn't receive a badge too
      operator = donation.connect(d2);
      await operator.donate({ value: ethers.parseEther('0.5') });
      expect((await operator.getReceived())).to.equal(ethers.parseEther('0.55'));
      donatorRecord = (await operator.getDonators()).find(item => item.donator === d2.address)!;
      expect(donatorRecord[2]).to.equal(0n);

      // Donator d1 donated again and received a badge
      operator = donation.connect(d1);
      await operator.donate({ value: ethers.parseEther('0.95') });
      expect((await operator.getReceived())).to.equal(ethers.parseEther('1.5'));
      donatorRecord = (await operator.getDonators()).find(item => item.donator === d1.address)!;
      expect(donatorRecord[2]).to.equal(1n);
      expect(await operator.tokenURI(donatorRecord[2])).to.equal(`${NFT_FAKE_BASE_URI}1`);

      // Donator d2 donated again and received a badge too
      operator = donation.connect(d2);
      await operator.donate({ value: ethers.parseEther('0.5') });
      expect((await operator.getReceived())).to.equal(ethers.parseEther('2'));
      donatorRecord = (await operator.getDonators()).find(item => item.donator === d2.address)!;
      expect(donatorRecord[2]).to.equal(2n);
      expect(await operator.tokenURI(donatorRecord[2])).to.equal(`${NFT_FAKE_BASE_URI}2`);

      // SBT must be not transferable
      operator = donation.connect(owner);
      await catchFunc(async () => await operator.transferFrom(d1, d2, 1n));
      expect(await operator.ownerOf(1n)).to.equal(d1.address);
    });
  });
});
