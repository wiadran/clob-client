import "mocha";
import { expect } from "chai";
import { Wallet } from "ethers";
import { ApiKeyCreds, Chain, ClobClient, OrderType, Side } from "../src";

const TOKEN_ID = "16040015440196279900485035793550429453516625694844857319147506590755961451627";

describe("realPlace", () => {
    let client: ClobClient | undefined;
    beforeEach(() => {
        const privateKey = process.env.PRIVATE_KEY || "";
        const creds: ApiKeyCreds = {
            key: process.env.CLOB_API_KEY || "",
            passphrase: process.env.CLOB_PASSPHRASE || "",
            secret: process.env.CLOB_SECRET || "",
        };
        const host = process.env.CLOB_API_URL || "";

        if (privateKey && creds.key && creds.passphrase && creds.secret && host) {
            const wallet = new Wallet(privateKey);
            client = new ClobClient(host, Chain.POLYGON, wallet, creds);
        }
    });

    it("placeSingleOrder1", async function () {
        if (!client) {
            this.skip();
        }

        const order = await client!.createOrder({
            tokenID: TOKEN_ID,
            price: 0.01,
            size: 10,
            side: Side.BUY,
        });

        const resp = await client!.postOrder(order, OrderType.GTC);
        expect(resp).to.exist;
    });
});

