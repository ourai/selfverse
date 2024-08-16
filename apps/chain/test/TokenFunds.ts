import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

import { NATIVE_TOKEN, ZERO_ADDRESS, STABLECOIN_MAP, catchFunc, createOwnerChecker, createAdminChecker, createOperatorChecker } from './helper';

describe('TokenFunds', () => {
  async function deployTokenFundsFixture() {
    const [owner, admin, o1, o2, ...others] = await ethers.getSigners();

    // console.log('`owner`\' address:', owner.address);
    // console.log('`admin`\' address:', admin.address);
    // console.log('`o1`\' address:', o1.address);
    // console.log('`o2`\' address:', o2.address);

    const TokenFunds = await ethers.getContractFactory('TokenFunds');
    const funds = await TokenFunds.deploy(NATIVE_TOKEN);

    return { owner, admin, o1, o2, others, funds };
  }

  describe('Permission', () => {
    it('Check ownership', createOwnerChecker(deployTokenFundsFixture, 'funds'));
    it('Check admin setup', createAdminChecker(deployTokenFundsFixture, 'funds'));
    it('Check operators setup', createOperatorChecker(deployTokenFundsFixture, 'funds'));
  });

  describe('Payment token', () => {
    it('Native token', async () => {
      const { funds } = await loadFixture(deployTokenFundsFixture);

      const paymentToken = await funds.getPaymentToken();

      expect(paymentToken).to.equal(NATIVE_TOKEN);
      expect(await funds.getPaymentTokenContract()).to.equal(ZERO_ADDRESS);
      expect(await funds.isNativeToken(paymentToken)).to.equal(true);
      expect(await funds.isTokenValid(paymentToken)).to.equal(true);
    });

    it('Stablecoin token', async () => {
      const { owner, admin, funds } = await loadFixture(deployTokenFundsFixture);
      const [coin1, coin2] = Object.entries(STABLECOIN_MAP);
      const [s1, a1] = coin1;
      const [s2, a2] = coin2;

      let operator = funds.connect(admin);

      await catchFunc(async () => await operator.updatePaymentToken(s1));
      expect(await funds.getPaymentToken()).to.equal(NATIVE_TOKEN);

      operator = funds.connect(owner);

      await catchFunc(async () => await operator.updatePaymentToken(s1));
      expect(await funds.getPaymentToken()).to.equal(NATIVE_TOKEN);

      await operator.addToken(s1, a1);
      await operator.addToken(s2, a2);

      const checkStablecoin = async (cs: string, ca: string) => {
        await operator.updatePaymentToken(cs);
        expect(await funds.getPaymentToken()).to.equal(cs);
        expect((await funds.getPaymentTokenContract()).toLowerCase()).to.equal(ca.toLowerCase());
        expect(await funds.isNativeToken(cs)).to.equal(false);
        expect(await funds.isTokenValid(cs)).to.equal(true);
      }

      await checkStablecoin(s1, a1);
      await checkStablecoin(s2, a2);
    });

    // it('Deposit and withdraw', async () => {
    //   const { owner, o1, funds } = await loadFixture(deployTokenFundsFixture);
    //   const [cs, ca] = Object.entries(STABLECOIN_MAP)[0];

    //   let operator = funds.connect(owner);

    //   await operator.addToken(cs, ca);
    //   await operator.updatePaymentToken(cs);
    // });
  });
});
