import { Connect, SimpleSigner, MNID } from 'uport-connect'

const uport = new Connect('Proof of Existence', {
     clientId: '2owsicQ8utLhyHi4kYBZFJiRweXYdFmrQrr',
     network: 'rinkeby',
     signer: SimpleSigner('cc8b7ee2bd0ac0b42cdef7a90c39a0e0ba24c1d8f38f87f9ad0e510622f60c30')
   })

const initAccount = async () => {
    let user = await uport.requestCredentials({
        requested: ['name', 'country', 'avatar', 'network'],
        notifications: true // We want this if we want to recieve credentials
    })
    // get user details
    const decodedId = MNID.decode(user.address)
    const specificNetworkAddress = decodedId.address
    const network = decodedId.network;
    return { specificNetworkAddress, user, network }
}

let web3 = uport.getWeb3()
export { web3, uport, MNID, initAccount }
