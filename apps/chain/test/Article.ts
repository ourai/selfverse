import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

import { NATIVE_TOKEN, NFT_FAKE_BASE_URI, catchFunc, createOwnerChecker, createAdminChecker, createOperatorChecker } from './helper';

describe('Article', () => {
  async function deployArticleFixture() {
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

    return { owner, admin, o1, o2, others, article, donation, funds };
  }

  describe('Permission', () => {
    it('Check ownership', createOwnerChecker(deployArticleFixture, 'article'));
    it('Check admin setup', createAdminChecker(deployArticleFixture, 'article'));
    it('Check operators setup', createOperatorChecker(deployArticleFixture, 'article'));
  });

  describe('Publish and update', () => {
    it('Publish & unpublish', async () => {
      const { owner, admin, article } = await loadFixture(deployArticleFixture);

      let operator = article.connect(owner);

      await catchFunc(async () => await operator.add('标题', '描述', '内容', '横幅'));
      expect(await operator.totalCount()).to.equal(0);

      await operator.updateAdmin(admin);
      operator = article.connect(admin);

      // Add two articles
      await operator.add('标题1', '描述1', '内容1', '横幅1');
      await operator.add('标题2', '描述2', '内容2', '横幅2');
      expect(await operator.totalCount()).to.equal(2);
      expect((await operator.getAll()).length).to.equal(2);
      expect((await operator.getList()).length).to.equal(0);

      // Get specified article
      expect((await operator.getOne(1n)).title).to.equal('标题1');
      expect((await operator.getOne(2n)).description).to.equal('描述2');
      await catchFunc(async () => await operator.getOne(10n));

      // Update specified article
      const a1 = await operator.getOne(1n);
      const a1ut = a1.updatedAt;
      await operator.update(a1.id, '标题1改', a1.description, a1.content, a1.banner);
      expect((await operator.getOne(1n)).title).to.equal('标题1改');
      expect((await operator.getOne(1n)).updatedAt).to.greaterThan(a1ut);
      const a2 = await operator.getOne(2n);
      const a2ut = a2.updatedAt;
      await operator.update(a2.id, a2.title, '描述2改', a2.content, a2.banner);
      expect((await operator.getOne(2n)).description).to.equal('描述2改');
      expect((await operator.getOne(2n)).updatedAt).to.greaterThan(a2ut);

      // Publish articles
      await operator.publish(1n);
      expect((await operator.getList()).length).to.equal(1);
      expect((await operator.getOne(1n)).published).to.equal(true);
      await operator.publish(2n);
      expect((await operator.getList()).length).to.equal(2);
      expect((await operator.getOne(2n)).published).to.equal(true);

      // Unpublish articles
      await operator.unpublish(1n);
      expect((await operator.getList()).length).to.equal(1);
      expect((await operator.getOne(1n)).published).to.equal(false);
      await operator.unpublish(2n);
      expect((await operator.getList()).length).to.equal(0);
      expect((await operator.getOne(2n)).published).to.equal(false);
    });

    it('Donate', async () => {
      const { owner, admin, o1, o2, article, donation, funds } = await loadFixture(deployArticleFixture);

      let operator = article.connect(owner);

      await operator.updateAdmin(admin);
      operator = article.connect(admin);
      await operator.add('标题1', '描述1', '内容1', '横幅1');
      await operator.publish(1n);

      operator = article.connect(o1);
      expect(await donation.getReceived()).to.equal(ethers.parseEther('0'));
      expect(await funds.getReceived()).to.equal(ethers.parseEther('0'));
      await operator['donate(uint256)'](1n, { value: ethers.parseEther('0.5') });
      expect(await donation.getReceived()).to.equal(ethers.parseEther('0.5'));
      expect(await ethers.provider.getBalance(donation)).to.equal(ethers.parseEther('0'));
      expect(await funds.getReceived()).to.equal(ethers.parseEther('0.5'));
      expect(await ethers.provider.getBalance(funds)).to.equal(ethers.parseEther('0.5'));

      operator = article.connect(o2);
      await operator['donate(uint256)'](1n, { value: ethers.parseEther('0.5') });
      expect(await donation.getReceived()).to.equal(ethers.parseEther('1'));
      expect(await ethers.provider.getBalance(donation)).to.equal(ethers.parseEther('0'));
      expect(await funds.getReceived()).to.equal(ethers.parseEther('1'));
      expect(await ethers.provider.getBalance(funds)).to.equal(ethers.parseEther('1'));
    });
  });
});
