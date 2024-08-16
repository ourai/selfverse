import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

import { NATIVE_TOKEN, ZERO_ADDRESS, catchFunc, createOwnerChecker, createAdminChecker, createOperatorChecker } from './helper';

describe('PaidWorks', () => {
  async function deployPaidWorksFixture() {
    const [owner, admin, o1, o2, ...others] = await ethers.getSigners();

    // console.log('`owner`\' address:', owner.address);
    // console.log('`admin`\' address:', admin.address);
    // console.log('`o1`\' address:', o1.address);
    // console.log('`o2`\' address:', o2.address);

    const TokenFunds = await ethers.getContractFactory('TokenFunds');
    const funds = await TokenFunds.deploy(NATIVE_TOKEN);

    const PaidWorks = await ethers.getContractFactory('PaidWorks');
    const works = await PaidWorks.deploy(funds);

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
      const freeWorkPrice = ethers.parseEther('0');
      const paidWorkPrice = ethers.parseEther('1');

      let operator = works.connect(owner);
      expect((await operator['getAllWorks()']()).length).to.equal(0, 'Initial count of works is not 0');

      await catchFunc(async () => operator.add(paidWorkPrice, ZERO_ADDRESS, 'title', 'cover', 'description', 'content'));
      expect((await operator['getAllWorks()']()).length).to.equal(0);

      await operator.updateAdmin(admin);
      operator = works.connect(admin);

      const firstWorkPrice = freeWorkPrice;
      const secondWorkPrice = paidWorkPrice;

      // Add two works
      await Promise.all([
        operator.add(firstWorkPrice, ZERO_ADDRESS, 'title', 'cover', 'description', 'content'),
        operator.add(secondWorkPrice, ZERO_ADDRESS, 'title', 'cover', 'description', 'content')
      ]);
      let allWorks = await operator['getAllWorks()']();
      expect(allWorks.length).to.equal(2);
      expect(allWorks[0].price).to.equal(firstWorkPrice);
      expect(allWorks[1].price).to.equal(secondWorkPrice);

      // List them for sales
      expect(allWorks[0].listing).to.equal(false);
      expect(allWorks[1].listing).to.equal(false);
      await Promise.all([operator.sell(allWorks[0].id), operator.sell(allWorks[1].id)]);
      allWorks = await operator['getAllWorks()']();
      expect(allWorks[0].listing).to.equal(true);
      expect(allWorks[1].listing).to.equal(true);

      // Buy works
      operator = works.connect(b1);
      await catchFunc(async () => {
        const paidWorks = allWorks.filter(({ price }) => price !== freeWorkPrice);
        await operator['buy(uint256)'](paidWorks[0].id);
      });
      await operator['buy(uint256)'](allWorks[1].id, { value: secondWorkPrice });
      operator = works.connect(b2);
      await operator['buy(uint256)'](allWorks[0].id, { value: firstWorkPrice });

      // Unlist the free works
      operator = works.connect(admin);
      await Promise.all(allWorks.filter(item => item.price === freeWorkPrice).map(item => operator.unlist(item.id)));
      allWorks = await operator['getAllWorks()']();
      expect(allWorks[0].listing).to.equal(false);
      expect(allWorks[1].listing).to.equal(true);

      const b1Bought = await operator.getBoughtWorks(b1);
      expect(b1Bought.length).to.equal(1);
      expect(b1Bought[0].id).to.equal(2n);
      const b2Bought = await operator.getBoughtWorks(b2);
      expect(b2Bought.length).to.equal(1);
      expect(b2Bought[0].id).to.equal(1n);
    });
  });
});
