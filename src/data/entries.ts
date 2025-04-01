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

// TODO: update return type
export const getProfile = async (did: string): Promise<any> => {
    try {
        const agent = new AtpAgent({
            service: "https://public.api.bsky.app",
        })
        const profile = await agent.app.bsky.actor.getProfile({
            actor: did
        })
        return profile.data;
    } catch (e) {
        console.error('Error getting profile from ATProto:', e)
        throw e
    }
}

export const getPublicEntries = async (did: string, pdsUrl: string): Promise<Essay[]> => {
    try {
        const agent = new AtpAgent({
            service: pdsUrl
        })
        const records = await agent.com.atproto.repo.listRecords({
            repo: did,
            collection: "xyz.groundmist.notebook.essay",
            limit: 20
        })
        const entries = records.data.records.map((record: any) => {
            // Extract markdown title if it exists
            const titleMatch = record.value.text.match(/^#\s+(.*?)(\r?\n|\r|$)/);
            const markdownTitle = titleMatch ? titleMatch[1].trim() : null;
            // Strip the title from content if it exists
            const content = record.value.text.replace(/^#\s+.*(\r?\n|\r|$)/, '').trim();
            return {
                content,
                title: markdownTitle || record.value.title,
                date: (record.value.createdAt),
                id: record.cid,
                preview: content.slice(0, 150)
            } as Essay
        });
        return entries;
    } catch (e) {
        console.error('Error getting entries from ATProto:', e)
        throw e
    }
}