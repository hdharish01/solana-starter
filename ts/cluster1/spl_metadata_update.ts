import { createSignerFromKeypair, publicKey, signerIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../turbin3-wallet.json"
import { findMetadataPda, updateMetadataAccountV2, UpdateMetadataAccountV2InstructionArgs } from "@metaplex-foundation/mpl-token-metadata";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";



const mint = publicKey("CmARDXB5rCcuMsuKJanukcZGq3XX1wR6vjvHd1N1UVi8");
const newUri = "https://devnet.irys.xyz/FmYCqwtbAeEPrgXJfdrakrQB96P6oUpsJH27Z2msheCo";

const umi = createUmi("https://api.devnet.solana.com");

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));

const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

(async() => {
    try{
        const metadata = findMetadataPda(umi, {mint});

        const args: UpdateMetadataAccountV2InstructionArgs = {
            data: {
                name: "Levi",
                symbol: "LEV",
                uri: newUri,
                sellerFeeBasisPoints: 1,
                creators: null,
                collection: null,
                uses: null,
            },
            isMutable: null,
            primarySaleHappened: null,
        };

        const tx = updateMetadataAccountV2(umi,{
            metadata,
            updateAuthority: signer,
            ...args,
        })

        const result = await tx.sendAndConfirm(umi);
        console.log("URI updated! Tx signature:", bs58.encode(result.signature));
    } catch(e){
        console.error("Failded to update metadata:",e);
    }
})();
