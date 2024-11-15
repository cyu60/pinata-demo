"server only";

import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});

export const getGatewayUrl = (cid: string) =>
  `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`;
