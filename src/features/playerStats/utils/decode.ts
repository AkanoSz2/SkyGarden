import nbt from "prismarine-nbt";

/*
                            NBT PLEASE EXPLODE
prismarine-nbt's real output type (nbt.NBT) is technically accurate but
painful to destructure through (`.value.i.value.value` etc.) without
casting everywhere. This local type documents the actual shape this
project consumes, so callers get real autocomplete/checking instead of
silently-typed `any`.
*/

export interface NBTTag {
    type: string;
    value: unknown;
}

export interface NBTListTag {
    type: string;
    value: {
        type: string;
        value: NBTCompound[];
    };
}

export interface NBTCompound {
    tag?: NBTTag;
    [key: string]: unknown;
}

export interface DecodedNBT {
    type: string;
    value: {
        i: NBTListTag;
        [key: string]: unknown;
    };
}

export function decodeNBT(base64: string): Promise<DecodedNBT> {
    const buffer = Buffer.from(base64, "base64");
    return new Promise((resolve, reject) => {
        nbt.parse(buffer, (err, data) => {
            if (err) reject(err);
            else resolve(data as unknown as DecodedNBT);
        });
    });
}