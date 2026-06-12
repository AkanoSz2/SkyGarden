function Message(){
    const name = 'abo';

    if (name)
        return <h1>Hi {name}</h1>;
    else
        return <h1>Hi there</h1>;
}

export default Message;