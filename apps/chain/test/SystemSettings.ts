import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

import { NATIVE_TOKEN, NFT_FAKE_BASE_URI, ZERO_ADDRESS, catchFunc, createOwnerChecker, createAdminChecker, createOperatorChecker } from './helper';

describe('SystemSettings', () => {
  async function deploySystemSettingsFixture() {
    const [owner, admin, o1, o2, ...others] = await ethers.getSigners();

    // console.log('`owner`\' address:', owner.address);
    // console.log('`admin`\' address:', admin.address);
    // console.log('`o1`\' address:', o1.address);
    // console.log('`o2`\' address:', o2.address);

    const TokenFunds = await ethers.getContractFactory('TokenFunds');
    const funds = await TokenFunds.deploy(NATIVE_TOKEN);

    const Donation = await ethers.getContractFactory('Donation');
    const donation = await Donation.deploy(funds, NFT_FAKE_BASE_URI);

    const Article = await ethers.getContractFactory('Article');
    const article = await Article.deploy(funds, donation);

    const PaidWorks = await ethers.getContractFactory('PaidWorks');
    const works = await PaidWorks.deploy(funds);

    const SystemSettings = await ethers.getContractFactory('SystemSettings');
    const settings = await SystemSettings.deploy(funds, [
      { key: 'donation', contractAddr: donation },
      { key: 'article', contractAddr: article },
      { key: 'works', contractAddr: works },
    ]);

    return {
      owner, admin, o1, o2, others,
      funds, donation, article, works, settings,
    };
  }

  describe('Permission', () => {
    it('Check ownership', createOwnerChecker(deploySystemSettingsFixture, 'settings'));
    it('Check admin setup', createAdminChecker(deploySystemSettingsFixture, 'settings'));
    it('Check operators setup', createOperatorChecker(deploySystemSettingsFixture, 'settings'));
  });

  describe('Module operations', () => {
    it('Get modules', async () => {
      const { owner, funds, donation, article, works, settings } = await loadFixture(deploySystemSettingsFixture);
      const operator = settings.connect(owner);
      const [f, d, a, w] = await operator.getModules();

      expect(f.contractAddr).to.equal(await funds.getAddress());
      expect(d.contractAddr).to.equal(await donation.getAddress());
      expect(a.contractAddr).to.equal(await article.getAddress());
      expect(w.contractAddr).to.equal(await works.getAddress());
    });

    // it('Update admin for modules', async () => {
    //   const { owner, admin, funds, donation, article, works, settings } = await loadFixture(deploySystemSettingsFixture);
    //   const operator = settings.connect(owner);

    //   expect(await funds.hasRole(await funds.SV_ADMIN(), admin)).to.equal(false);
    //   expect(await donation.hasRole(await donation.SV_ADMIN(), admin)).to.equal(false);
    //   expect(await article.hasRole(await article.SV_ADMIN(), admin)).to.equal(false);
    //   expect(await works.hasRole(await works.SV_ADMIN(), admin)).to.equal(false);

    //   await operator.updateAdminForModules(admin);
    //   // expect(await funds.hasRole(await funds.SV_ADMIN(), admin)).to.equal(true);
    //   // expect(await donation.hasRole(await donation.SV_ADMIN(), admin)).to.equal(true);
    //   // expect(await article.hasRole(await article.SV_ADMIN(), admin)).to.equal(true);
    //   // expect(await works.hasRole(await works.SV_ADMIN(), admin)).to.equal(true);
    // });
  });
});
