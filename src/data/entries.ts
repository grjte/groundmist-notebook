import { AtpAgent } from "@atproto/api";
import { Essay } from "../types";

interface DidService {
    id: string;
    type: string;
    serviceEndpoint: string;
}

interface DidDocument {
    "@context": string | string[];
    id: string;
    service?: DidService[];
}

/**
 * Resolves a handle (e.g. "alice.bsky.social") to a DID by querying the
 * public identity resolution endpoint.
 *
 * @param handle - The handle to resolve.
 * @returns The resolved DID as a string.
 */
export async function resolveHandleToDid(handle: string): Promise<string> {
    const url = `${import.meta.env.VITE_ATPROTO_HANDLE_RESOLVER_URL}/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to resolve handle ${handle}: ${response.statusText}`);
    }

    const data: { did: string } = await response.json();
    return data.did;
}


/**
 * Given a DID, fetch its DID document from the PLC directory
 * and extract the PDS service endpoint URL.
 *
 * @param did - The DID (e.g. "did:plc:abcdef123456...")
 * @returns The PDS URL as a string.
 */
export async function getPdsUrl(did: string): Promise<string> {
    // The PLC directory endpoint; adjust if needed for your DID method
    const url = `${import.meta.env.VITE_ATPROTO_PLC_DIRECTORY_URL}/${did}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch DID document for ${did}: ${response.statusText}`);
    }

    const didDoc: DidDocument = await response.json();
    if (!didDoc.service || didDoc.service.length === 0) {
        throw new Error(`No service entries found in DID document for ${did}`);
    }

    // Look for the service entry corresponding to the AT Protocol PDS.
    const pdsService = didDoc.service.find(
        (s) => s.type === "AtprotoPersonalDataServer" || s.id.endsWith("#atproto_pds")
    );

    if (!pdsService) {
        throw new Error(`No AT Protocol PDS service found in DID document for ${did}`);
    }

    return pdsService.serviceEndpoint;
}

export const getPublicEntries = async (handleOrDid: string): Promise<Essay[]> => {
    try {
        console.log("handleOrDid", handleOrDid);
        let did: string;
        if (handleOrDid.startsWith("did:")) {
            did = handleOrDid;
        } else {
            did = await resolveHandleToDid(handleOrDid);
        }
        console.log("did", did);
        const pdsUrl = await getPdsUrl(did);
        console.log("pdsUrl", pdsUrl);

        const agent = new AtpAgent({
            service: pdsUrl
        })
        const records = await agent.com.atproto.repo.listRecords({
            repo: did,
            collection: "xyz.groundmist.notebook.essay",
            limit: 20
        })
        console.log("records", records);
        // TODO: update type; add preview to record
        const entries = records.data.records.map((record: any) => {
            return {
                content: record.value.text,
                title: record.value.title,
                date: (record.value.createdAt),
                id: record.cid,
                preview: record.value.text.slice(0, 150)
            } as Essay
        });
        console.log("entries", entries);
        return entries;
    } catch (e) {
        console.error('Error getting entries from ATProto:', e)
        throw e
    }
}