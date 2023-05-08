export default (name: string) => {
    if (process.env[name] === undefined) {
        throw new Error(`Required env var ${name} is undefined`);
    }

    return process.env[name];
}