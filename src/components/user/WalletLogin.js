import {
    web3Accounts,
    web3Enable,
    web3FromSource,
} from "@polkadot/extension-dapp";
import {
    cryptoWaitReady,
    decodeAddress,
    signatureVerify,
} from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";

function hexDecode(hex) {
    var j;
    var hexes = hex.match(/.{1,4}/g) || [];
    var back = "";
    for (j = 0; j < hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }
    return back;
}

function hexEncode(str) {
    var hex, i;

    var result = "";
    for (i = 0; i < str.length; i++) {
        hex = str.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-4);
    }

    return result;
}

async function isValidSignature(message, signature, address) {
    await cryptoWaitReady();
    const publicKey = decodeAddress(address);
    const hexPublicKey = u8aToHex(publicKey);
    return signatureVerify(hexEncode(message), signature, hexPublicKey)
        .isValid;
}

export async function getAccounts() {
    const extensions = await web3Enable("my cool dapp");

    const allAccounts = await web3Accounts();
    return allAccounts;
}

export async function login(account, challenge) {

    // to be able to retrieve the signer interface from this account
    // we can use web3FromSource which will return an InjectedExtension type
    const injector = await web3FromSource(account.meta.source);
    // this injector object has a signer and a signRaw method
    // to be able to sign raw bytes
    const signRaw = injector && injector.signer && injector.signer.signRaw;

    if (signRaw) {
        // after making sure that signRaw is defined
        // we can use it to sign our message
        let accountAddress = account.address;
        // const message = "challenge message at 20210-11-21 10:00:00";
        const message = challenge;

        const { signature } = await signRaw({
            address: accountAddress,
            data: message,
            type: "bytes",
        });
        const isValid = await isValidSignature(
            message,
            signature,
            accountAddress
        );
        console.log("isValid", isValid);
        return signature;
        //fake account
        // let messageFake = accountAddress + "_fake";
        // let messageEncodedFake = hexEncode(messageFake);
        // const isValid_fake = await isValidSignature(
        //     messageFake,
        //     signature,
        //     accountAddress
        // );
        // console.log("isValid_fake", isValid_fake);
    }
}