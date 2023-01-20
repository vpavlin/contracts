
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import verify from '../shared/verify';

const deployCoffeeBacon: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {deployments, getNamedAccounts} = hre
	const {deploy} = deployments;

	const {deployer} = await getNamedAccounts();

	const args:any[] =  []

	const isLocal = !hre.network.live

	const contract = await deploy('TestNFT', {
		from: deployer,
		args: args,
		log: true,
		autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
		waitConfirmations: isLocal ? 1 : 5,
	});

	if (!isLocal) {
		await verify(contract.address, args)
	}
};
export default deployCoffeeBacon;
deployCoffeeBacon.tags = ['TestNFT'];
deployCoffeeBacon.dependencies = [];