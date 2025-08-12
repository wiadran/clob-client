import "mocha";
import { expect } from "chai";
import { Wallet } from "ethers";
import { ApiKeyCreds, Chain, ClobClient, OrderType, Side } from "../src";

const TOKEN_ID = "16040015440196279900485035793550429453516625694844857319147506590755961451627";

type Config = {
    privateKey: string;
    apiKey: string;
    passphrase: string;
    secret: string;
    apiUrl: string;
};

let cfg: Config = {
    privateKey: "",
    apiKey: "",
    passphrase: "",
    secret: "",
    apiUrl: "",
};

try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loaded = require("./realPlace.config");
    cfg = { ...cfg, ...(loaded.default || loaded) };
} catch {
    // no config provided; test will be skipped
}

describe("realPlace", () => {
    let client: ClobClient | undefined;
    beforeEach(() => {
        const { privateKey, apiKey, passphrase, secret, apiUrl } = cfg;
        const creds: ApiKeyCreds = { key: apiKey, passphrase, secret };

        if (privateKey && apiKey && passphrase && secret && apiUrl) {
            const wallet = new Wallet(privateKey);
            client = new ClobClient(apiUrl, Chain.POLYGON, wallet, creds);
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

