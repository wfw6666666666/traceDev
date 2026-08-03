import re, base64, os

os.chdir(r'E:\claude\website\download-site')

# 从 git config 读取 token
with open('.git/config', 'r') as f:
    cfg = f.read()
m = re.search(r'https://[^:]+:(ghp_[^@]+)@github', cfg)
token = m.group(1) if m else ''
if not token:
    print('ERROR: 未找到 Token，请运行 git remote get-url origin 确认')
    exit(1)

# 从 journal.js 读取密码哈希
with open('js/journal.js', 'r', encoding='utf-8') as f:
    js = f.read()
m = re.search(r"PASSWORD_HASH\s*=\s*'([a-f0-9]+)'", js)
if not m:
    print('ERROR: 未找到 PASSWORD_HASH')
    exit(1)
pw_hash = m.group(1)

# XOR 加密 Token（用密码哈希前 32 位做 key）
key = pw_hash[:32]
pad = key * (len(token) // len(key) + 1)
pad = pad[:len(token)]
enc = base64.b64encode(bytes(ord(t) ^ ord(k) for t, k in zip(token, pad))).decode()

print(f'Token 前缀: {token[:10]}...')
print(f'加密结果:   {enc[:30]}...')

# 验证
dec = base64.b64decode(enc)
restored = ''.join(chr(dec[i] ^ ord(pad[i])) for i in range(len(dec)))
print(f'解密验证:   {restored[:10]}... 匹配={restored == token}')

if restored != token:
    print('ERROR: 加密验证失败！')
    exit(1)

# 写入 ENC_TOKEN
tag = f'const ENC_TOKEN = "{enc}";'
if 'const ENC_TOKEN =' in js:
    js = re.sub(r'const ENC_TOKEN = "[^"]*";', tag, js)
else:
    print('ERROR: 未找到 ENC_TOKEN 声明')
    exit(1)

with open('js/journal.js', 'w', encoding='utf-8') as f:
    f.write(js)

print('\n✅ 已写入 js/journal.js — 现在可以 git commit && git push')
