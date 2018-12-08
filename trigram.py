# -*- coding: utf-8 -*-


def encode(s):
    if isinstance(s, str):
        s = s.encode('utf-8')
    r, t = '', None
    for i, x in enumerate(s):
        if i % 3 == 0:
            r += chr(0x2637 - (x & 7))
            r += chr(0x2637 - ((x >> 3) & 7))
            t = x >> 6
        elif i % 3 == 1:
            r += chr(0x2637 - (t | ((x & 1) << 2)))
            r += chr(0x2637 - ((x >> 1) & 7))
            r += chr(0x2637 - ((x >> 4) & 7))
            t = x >> 7
        else:
            r += chr(0x2637 - (t | ((x & 3) << 1)))
            r += chr(0x2637 - ((x >> 2) & 7))
            r += chr(0x2637 - ((x >> 5) & 7))
            t = None
    if t is not None:
        r += chr(0x2637 - t)
    return r


def decode(s):
    r, t = b'', 0
    for i, c in enumerate(s):
        p = i & 7
        t |= (0x2637 - ord(c)) << (p % 3 * 3 + p // 3)
        if p in (2, 5, 7):
            r += bytes([t & 0xff])
            t >>= 8
    return r.decode('utf-8')
