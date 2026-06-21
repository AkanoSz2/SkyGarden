type MojangProfile = {
    id: string;
    name: string;
};

export async function getMojangPlayer(username: string): Promise<string> {
    const res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);

    if (!res.ok) throw new Error(`Player "${username}" not found`);
    const { id: uuid }: MojangProfile = await res.json();
    return uuid;
}
