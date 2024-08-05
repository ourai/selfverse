import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

import { createOwnerChecker, createAdminChecker, createOperatorChecker } from './helper';

describe('PaidWorks', () => {
  async function deployPaidWorksFixture() {
    const [owner, admin, o1, o2, ...others] = await ethers.getSigners();

    // console.log('`owner`\' address:', owner.address);
    // console.log('`admin`\' address:', admin.address);
    // console.log('`o1`\' address:', o1.address);
    // console.log('`o2`\' address:', o2.address);

    const PaidWorks = await ethers.getContractFactory('PaidWorks');
    const works = await PaidWorks.deploy();

    return { owner, admin, o1, o2, others, works };
  }

  describe('Permission', () => {
    it('Check ownership', createOwnerChecker(deployPaidWorksFixture, 'works'));
    it('Check admin setup', createAdminChecker(deployPaidWorksFixture, 'works'));
    it('Check operators setup', createOperatorChecker(deployPaidWorksFixture, 'works'));
  });

  describe('Trade', () => {
    it('Check selling and buying', async () => {
      const { owner, admin, others, works } = await loadFixture(deployPaidWorksFixture);
      const [b1, b2] = others;

      let operator, allWorks;

      operator = works.connect(owner);
      expect((await operator.getAllWorks()).length).to.equal(0, 'Initial count of works is not 0');

      try {
        await operator['add(uint256)'](ethers.parseEther('1'));
      } catch (err) {
        // console.log('[ERROR]', (err as any).message);
      }
      expect((await operator.getAllWorks()).length).to.equal(0);

      await operator.updateAdmin(admin);
      operator = works.connect(admin);

      // Add two works
      await Promise.all([operator['add(uint256)'](ethers.parseEther('0')), operator['add(uint256)'](ethers.parseEther('1'))]);
      allWorks = await operator.getAllWorks();
      expect(allWorks.length).to.equal(2);
      expect(allWorks[0].price).to.equal(ethers.parseEther('0'));
      expect(allWorks[1].price).to.equal(ethers.parseEther('1'));

      // List them for sales
      expect(allWorks[0].listing).to.equal(false);
      expect(allWorks[1].listing).to.equal(false);
      await Promise.all([operator.sell(allWorks[0].id), operator.sell(allWorks[1].id)]);
      allWorks = await operator.getAllWorks();
      expect(allWorks[0].listing).to.equal(true);
      expect(allWorks[1].listing).to.equal(true);

      // Unlist the free works
      await Promise.all(allWorks.filter(item => item.price === ethers.parseEther('0')).map(item => operator.unlist(item.id)));
      allWorks = await operator.getAllWorks();
      expect(allWorks[0].listing).to.equal(false);
      expect(allWorks[1].listing).to.equal(true);

      operator = works.connect(b1);

      try {
        await operator.buy(allWorks[0].id);
      } catch (err) {
        // console.log('[ERROR]', (err as any).message);
      }

      try {
        await operator.buy(allWorks[1].id);
      } catch (err) {
        // console.log('[ERROR]', (err as any).message);
      }

      await operator.buy(allWorks[1].id, { value: ethers.parseEther('1') });
    });
  });
});
