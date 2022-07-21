Object.get = (key, obj) => {
    for (const [_key, _value] of Object.entries(obj)) {
        if (key === _key) {
            return _value;
        }
    }
}

Array.rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function generateRandomKey(length = 10) {

    let chars = {
        numbers: [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9'
        ],
        upper: [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'W',
            'X',
            'Y',
            'Z'
        ],
        lower: [
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'w',
            'x',
            'y',
            'z'
        ]
    }

    let result = [''];

    for (let i = 0; i < length; i++) {
        result.push(Array.rand(
            Object.get(
                Array.rand(
                    Object.keys(chars)
                    // Server room object keys can't start with number
                    .filter(name => i != 0 || name !== 'numbers')
                ),
                chars
            )
        ));
    }

    return result.join('');
}