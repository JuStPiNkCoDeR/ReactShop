// @ts-ignore
it('Simple generator write correct', () => {
    function* gen() {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                yield i + j;
            }
        }
    }

    let iterator = gen();

    let ans = [0, 1, 1, 2];
    let ar = [];

    for (let value of iterator) {
        ar.push(value);
    }

    expect(ar).toStrictEqual(ans);
});