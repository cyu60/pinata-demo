"server only";

import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});

export const PUBLIC_GROUP_ID = "voicevault-public";

export const getFileUrl = (cid: string): string => {
  return `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/files/${cid}`;
};
