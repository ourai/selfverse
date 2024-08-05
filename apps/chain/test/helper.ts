import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';

export const NFT_FAKE_BASE_URI = 'https://nft.fa.ke/';

export function resolveAmount(amountWithoutDecimals: number, decimals: number | bigint = 1_000_000_000_000_000_000n) {
  return amountWithoutDecimals * Math.pow(10, Number(decimals));
}

const defaultContractKey = 'contract';

export function createOwnerChecker(fixture: () => Promise<any>, contractKey: string = defaultContractKey) {
  return async () => {
    const { owner, ...others } = (await loadFixture(fixture)) as any;
    const contract = others[contractKey];

    const operator = contract.connect(owner);
    const addr = owner.address;
    const role = await operator.SV_OWNER();

    // Check via `Ownable.sol`'s API
    expect(await operator.owner()).to.equal(addr);

    // Check via `AccessControlEnumerable.sol`'s API
    expect(await operator.getRoleMemberCount(role)).to.equal(1);
    expect(await operator.getRoleMember(role, 0)).to.equal(addr);
  };
}

export function createAdminChecker(fixture: () => Promise<any>, contractKey: string = defaultContractKey) {
  return async () => {
    const { owner, admin, o1, ...others } = await loadFixture(fixture);
    const contract = others[contractKey];
    const role = await contract.SV_ADMIN();

    let operator = contract.connect(o1);
    expect(await operator.getRoleMemberCount(role)).to.equal(0);

    try {
      await operator.updateAdmin(admin);
    } catch (err) {
      // console.log(`[ERROR] ${(err as any).message}`);
    }

    expect(await operator.getRoleMemberCount(role)).to.equal(0);

    // Set up admin to `admin` by owner
    operator = contract.connect(owner);
    await operator.updateAdmin(admin);
    expect(await operator.getRoleMemberCount(role)).to.equal(1);
    expect(await operator.getRoleMember(role, 0)).to.equal(admin.address);

    operator = contract.connect(admin);

    try {
      await operator.updateAdmin(o1);
    } catch (err) {
      // console.log(`[ERROR] ${(err as any).message}`);
    }

    expect(await operator.getRoleMemberCount(role)).to.equal(1);
    expect(await operator.getRoleMember(role, 0)).to.equal(admin.address);

    // Transfer admin role from `admin` to `o1`
    operator = contract.connect(owner);
    await operator.updateAdmin(o1);
    expect(await operator.getRoleMemberCount(role)).to.equal(1);
    expect(await operator.getRoleMember(role, 0)).to.equal(o1.address);
  }
}

export function createOperatorChecker(fixture: () => Promise<any>, contractKey: string = defaultContractKey) {
  return async () => {
    const { owner, admin, o1, o2, others, ...rest } = await loadFixture(fixture);
    const contract = rest[contractKey];
    const role = await contract.SV_OPERATOR();

    let operator = contract.connect(owner);
    expect(await operator.getRoleMemberCount(role)).to.equal(0);

    try {
      await operator.updateOperators([o1, o2], false);
    } catch (err) {
      // console.log(`[ERROR] ${(err as any).message}`);
    }

    expect(await operator.getRoleMemberCount(role)).to.equal(0);

    // Set admin to `admin` and change operator to admin
    await operator.updateAdmin(admin);
    operator = contract.connect(admin);

    // Grant `operator` incrementally
    await operator.updateOperators([o1], false);
    expect(await operator.getRoleMemberCount(role)).to.equal(1);
    await operator.updateOperators([o2], false);
    expect(await operator.getRoleMemberCount(role)).to.equal(2);
    expect(await operator.getRoleMember(role, 0)).to.equal(o1.address);
    expect(await operator.getRoleMember(role, 1)).to.equal(o2.address);

    // Reset `operator` to new operators
    const [o3, o4] = others;
    await operator.updateOperators([o4, o3], true);
    expect(await operator.getRoleMemberCount(role)).to.equal(2);
    expect(await operator.getRoleMember(role, 0)).to.equal(o4.address);
    expect(await operator.getRoleMember(role, 1)).to.equal(o3.address);
  }
}
