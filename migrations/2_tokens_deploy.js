const PassiveStaking = artifacts.require("PassiveStaking")

module.exports = function (deployer) {
  deployer.deploy(PassiveStaking, "Passive Staking", "PS")
}
