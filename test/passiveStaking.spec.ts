import { expect, use } from "chai"
import BigNumber from "bignumber.js"
import { Contract } from "ethers"
import PassiveStaking from "../artifacts/PassiveStaking.json"
import { deployContract, MockProvider, solidity } from "ethereum-waffle"

use(solidity)

describe("Testing PassiveStaking contract..", () => {
  const [owner, other, additional] = new MockProvider().getWallets()
  let passiveStaking: Contract

  beforeEach(async () => {
    passiveStaking = await deployContract(owner, PassiveStaking, ["Passive Staking", "PS"])
  })

  it(`Sum of addresses share is 1
    Sum of addresses rewardPerBlock values is rewardPerBlock value`, async () => {
    const otherAmount = new BigNumber(888888 * 10**18).toFixed()
    const additionalAmount = new BigNumber(111112 * 10**18).toFixed()
    await passiveStaking.transfer(other.address, otherAmount)
    await passiveStaking.transfer(additional.address, additionalAmount)
    await passiveStaking.stakingActivation()
    const rewardPerBlock = new BigNumber((await passiveStaking.rewardPerBlock()).toString())

    const additionalResult = await passiveStaking.addressInfo(additional.address)
    const additionalShare = (new BigNumber(additionalResult[5].toString())).div(rewardPerBlock)
    const aBalance = await passiveStaking.balanceOf(additional.address)
    const additionalBalance = new BigNumber(aBalance.toString())
    const additionalRewardPerBlock = new BigNumber(additionalResult[6].toString())

    const otherResult = await passiveStaking.addressInfo(other.address)
    const otherShare = (new BigNumber(otherResult[5].toString())).div(rewardPerBlock)
    const oBalance = await passiveStaking.balanceOf(other.address)
    const otherBalance = new BigNumber(oBalance.toString())
    const otherRewardPerBlock = new BigNumber(otherResult[6].toString())

    const shareSum = additionalShare.plus(otherShare)
    const rewardSum = additionalRewardPerBlock.plus(otherRewardPerBlock)

    expect(shareSum.toString()).to.equal("1")
    expect(rewardSum.toString()).to.equal("20000000000000000")
  })
})
