"""生成加密 Token，嵌入 journal.js"""
import re, base64

# 读取 journal.js 获取密码哈希
with open('js/journal.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 读 git remote token 和密码哈希
pw_hash = re.search(r"PASSWORD_HASH\s*=\s*'([a-f0-9]+)'", js).group(1)
print(f'密码哈希: {pw_hash}')

# 从 git remote 提取 token
import subprocess
r = subprocess.run(['git', 'remote', 'get-url', 'origin'], capture_output=True, text=True)
url = r.stdout.strip()
token = ''
if '@github.com' in url:
    token = url.split('://')[1].split('@')[0].split(':')[-1]
    print(f'Token 前缀: {token[:10]}...')
elif 'ENV_TOKEN' in globals():
    token = globals()['ENV_TOKEN']

# 用密码哈希的前32字符做 XOR key
key = pw_hash[:32]
pad = (key * (len(token) // len(key) + 1))[:len(token)]
enc = base64.b64encode(bytes(ord(t) ^ ord(k) for t, k in zip(token, pad))).decode()
print(f'加密后: {enc[:20]}...')

# 写入
tag = f'const ENC_TOKEN = "{enc}";'
if 'const ENC_TOKEN' in js:
    js = re.sub(r'const ENC_TOKEN = "[^"]*";', tag, js)
else:
    js = js.replace("const PASSWORD_HASH = '", f"{tag}\nconst PASSWORD_HASH = '")
with open('js/journal.js', 'w', encoding='utf-8') as f:
    f.write(js)

# 验证
a = base64.b64decode(enc)
restored = ''.join(chr(a[i] ^ ord(pad[i])) for i in range(len(a)))
print(f'验证: {restored[:10]}... 匹配: {restored == token}')
