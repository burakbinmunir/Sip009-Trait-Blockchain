
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.28.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
     name: "Ensure that Minting is working properly",
     async fn(chain: Chain, accounts: Map<string, Account>) {

         const deployer = accounts.get("deployer")!;

         let block = chain.mineBlock([
            Tx.contractCall("nft", "mint!", [types.ascii("300")], deployer.address)
         ]);
         assertEquals(block.receipts.length, 1);
         assertEquals(block.height, 2);
        block.receipts[0].result.expectOk()
        .expectAscii("Done")

     //    const nftMintEvent = block.receipts[0].events[0].nft_mint_event;
     //    const [nftAssetContractPrincipal, nftAssetId] = nftMintEvent.asset_identifier.split("::");

     //    block.receipts[0].events.expectNonFungibleTokenMintEvent("1",deployer.address,nftAssetContractPrincipal,nftAssetId);
     },
});


Clarinet.test(
    {
        name: "Ensure that get owner is correct",

        async fn(chain: Chain, accounts: Map<string, Account>){
            const deployer = accounts.get("deployer")!;

            let block = chain.mineBlock([
                Tx.contractCall("nft", "mint!", [types.ascii("300")], deployer.address),
                Tx.contractCall("nft", "get-owner", [types.uint(1)], deployer.address)
            ])

            assertEquals(block.receipts.length ,2)
            assertEquals(block.height,2)

            block.receipts[0].result.expectOk().expectAscii("Done")

            const owner = block.receipts[1].result.expectOk().expectSome();
            assertEquals(owner,deployer.address)
        },

    }
)



Clarinet.test(
    {
        name: "Ensure that transfer is workking correct",

        async fn(chain: Chain, accounts: Map<string, Account>){
            const deployer = accounts.get("deployer")!;
            const reciever = accounts.get("wallet_1")!;

            let block = chain.mineBlock([
                Tx.contractCall("nft", "mint!", [types.ascii("300")], deployer.address),
                Tx.contractCall("nft", "transfer", [types.uint(1), types.principal(deployer.address), types.principal(reciever.address)], deployer.address),
                Tx.contractCall("nft", "get-owner", [types.uint(1)], deployer.address)
            ])

            assertEquals(block.receipts.length ,3)
            assertEquals(block.height,2)

            block.receipts[0].result.expectOk().expectAscii("Done")

            const owner = block.receipts[2].result.expectOk().expectSome();
            assertEquals(owner,reciever.address)
        },

    }
)


Clarinet.test(
    {
        name: "Ensure that Burning is workking correct",

        async fn(chain: Chain, accounts: Map<string, Account>){
            const deployer = accounts.get("deployer")!;
            const reciever = accounts.get("wallet_1")!;

            let block = chain.mineBlock([
                Tx.contractCall("nft", "mint!", [types.ascii("300")], deployer.address),
                ///Tx.contractCall("nft", "transfer", [types.uint(1), types.principal(deployer.address), types.principal(reciever.address)], deployer.address),
                Tx.contractCall("nft", "burn!", [types.uint(1)], deployer.address),
                Tx.contractCall("nft", "get-owner", [types.uint(1)], deployer.address)
            ])

            assertEquals(block.receipts.length ,3)
            assertEquals(block.height,2)

            block.receipts[0].result.expectOk().expectAscii("Done")

            const owner = block.receipts[2].result.expectOk().expectNone();
            assertEquals(owner,"")
        },

    }
)