# -*- coding: utf-8 -*-


def encode(s):
    t = ''
    x = s.encode('utf-8') + b'\x00' * 4
    for i in range(0, len(x) - 4, 3):
        a, b, c = x[i + 0], x[i + 1], x[i + 2]
        t += chr(0x2637 - (a & 7))
        t += chr(0x2637 - ((a >> 3) & 7))
        t += chr(0x2637 - ((a >> 6) | ((b & 1) << 2)))
        t += chr(0x2637 - ((b >> 1) & 7))
        t += chr(0x2637 - ((b >> 4) & 7))
        t += chr(0x2637 - ((b >> 7) | ((c & 3) << 1)))
        t += chr(0x2637 - ((c >> 2) & 7))
        t += chr(0x2637 - ((c >> 5) & 7))
    return t


def decode(s):
    t = bytearray()
    x = [0x2637 - ord(c) for c in s] + [0] * 8
    for i in range(0, len(x) - 8, 8):
        t.append(x[i + 0] | (x[i + 1] << 3) | ((x[i + 2] & 3) << 6))
        t.append((x[i + 2] >> 2) | (x[i + 3] << 1) | (x[i + 4] << 4) | ((x[i + 5] & 1) << 7))
        t.append((x[i + 5] >> 1) | (x[i + 6] << 2) | (x[i + 7] << 5))
    return t.decode('utf8').rstrip('\x00')
