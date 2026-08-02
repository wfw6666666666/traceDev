"""
TraceDev · 学习日志后端服务
Flask 驱动的轻量博客系统 —— 支持管理员认证、文件上传、文章CRUD
"""
import os
import json
import hashlib
import secrets
import time
from datetime import datetime
from functools import wraps
from pathlib import Path

from flask import (
    Flask, request, jsonify, session, send_from_directory, abort, url_for
)
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

# ── 配置 ──────────────────────────────────────────────
BASE_DIR    = Path(__file__).resolve().parent
DATA_DIR    = BASE_DIR / 'data'
UPLOAD_DIR  = BASE_DIR / 'uploads'
STATIC_DIR  = BASE_DIR  # 静态文件从项目根目录提供

POSTS_FILE   = DATA_DIR / 'posts.json'
ADMIN_FILE   = DATA_DIR / 'admin.json'
SECRET_FILE  = DATA_DIR / '.secret'

ALLOWED_IMAGE_EXT = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'}
ALLOWED_FILE_EXT  = {'pdf', 'zip', 'rar', '7z', 'doc', 'docx', 'xls', 'xlsx',
                     'ppt', 'pptx', 'txt', 'md', 'csv', 'json', 'xml', 'py',
                     'c', 'cpp', 'h', 'ino', 'epro', 'sch', 'pcb'}

MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB

# ── 初始化目录 ─────────────────────────────────────────
DATA_DIR.mkdir(exist_ok=True)
UPLOAD_DIR.mkdir(exist_ok=True)

# ── Flask 应用 ─────────────────────────────────────────
app = Flask(__name__, static_folder=None)

# 加载或生成 secret key
if SECRET_FILE.exists():
    app.secret_key = SECRET_FILE.read_text().strip()
else:
    key = secrets.token_hex(32)
    SECRET_FILE.write_text(key)
    app.secret_key = key

app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# ── 数据读写工具 ──────────────────────────────────────

def read_json(path, default=None):
    """读取 JSON 文件，不存在则返回默认值"""
    if default is None:
        default = []
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except (json.JSONDecodeError, ValueError):
        return default

def write_json(path, data):
    """写入 JSON 文件"""
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

def init_admin():
    """初始化管理员密码（仅首次运行）"""
    if not ADMIN_FILE.exists():
        # 默认密码: tracedev2026
        default_pw = 'tracedev2026'
        write_json(ADMIN_FILE, {
            'username': 'admin',
            'password_hash': generate_password_hash(default_pw),
            'created_at': datetime.now().isoformat()
        })
        print(f'[Init] 管理员账号已创建: admin / {default_pw}')
        print('[Init] 请登录后尽快修改密码！')

def get_posts():
    return read_json(POSTS_FILE, default=[])

def save_posts(posts):
    write_json(POSTS_FILE, posts)

# ── 认证装饰器 ────────────────────────────────────────

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return jsonify({'error': '未登录'}), 401
        return f(*args, **kwargs)
    return decorated

# ── 静态文件服务 ──────────────────────────────────────

@app.route('/')
def index():
    return send_from_directory(STATIC_DIR, 'index.html')

@app.route('/<path:filepath>')
def static_files(filepath):
    """提供静态文件：CSS / JS / assets / uploads"""
    target = STATIC_DIR / filepath
    if target.is_file():
        return send_from_directory(STATIC_DIR, filepath)
    # 如果不是文件，返回 index.html（SPA 回退）
    return send_from_directory(STATIC_DIR, 'index.html')

# ── 认证 API ──────────────────────────────────────────

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json(silent=True) or {}
    password = data.get('password', '')

    admin = read_json(ADMIN_FILE, default={})
    if not admin:
        return jsonify({'error': '系统未初始化'}), 500

    if check_password_hash(admin.get('password_hash', ''), password):
        session['admin_logged_in'] = True
        session['admin_login_time'] = time.time()
        return jsonify({'ok': True, 'message': '登录成功'})
    return jsonify({'error': '密码错误'}), 401

@app.route('/api/logout', methods=['POST'])
def api_logout():
    session.pop('admin_logged_in', None)
    return jsonify({'ok': True})

@app.route('/api/check-auth', methods=['GET'])
def api_check_auth():
    return jsonify({'logged_in': bool(session.get('admin_logged_in'))})

@app.route('/api/change-password', methods=['POST'])
@login_required
def api_change_password():
    data = request.get_json(silent=True) or {}
    old_pw = data.get('old_password', '')
    new_pw = data.get('new_password', '')

    if len(new_pw) < 6:
        return jsonify({'error': '新密码至少6位'}), 400

    admin = read_json(ADMIN_FILE, default={})
    if not check_password_hash(admin.get('password_hash', ''), old_pw):
        return jsonify({'error': '原密码错误'}), 401

    admin['password_hash'] = generate_password_hash(new_pw)
    write_json(ADMIN_FILE, admin)
    return jsonify({'ok': True, 'message': '密码修改成功'})

# ── 文章 CRUD API ─────────────────────────────────────

@app.route('/api/posts', methods=['GET'])
def api_get_posts():
    """获取全部文章（公开，按时间倒序）"""
    posts = get_posts()
    posts.sort(key=lambda p: p.get('createdAt', ''), reverse=True)
    return jsonify(posts)

@app.route('/api/posts/<post_id>', methods=['GET'])
def api_get_post(post_id):
    """获取单篇文章"""
    posts = get_posts()
    for p in posts:
        if p['id'] == post_id:
            return jsonify(p)
    abort(404)

@app.route('/api/posts', methods=['POST'])
@login_required
def api_create_post():
    """创建文章（需登录）"""
    data = request.get_json(silent=True) or {}

    title = data.get('title', '').strip()
    if not title:
        return jsonify({'error': '标题不能为空'}), 400

    posts = get_posts()

    # 生成 ID
    ts = datetime.now().strftime('%Y%m%d%H%M%S')
    post_id = f'post-{ts}'

    post = {
        'id': post_id,
        'title': title,
        'content': data.get('content', ''),
        'tags': data.get('tags', []),
        'category': data.get('category', ''),
        'images': data.get('images', []),
        'files': data.get('files', []),
        'links': data.get('links', []),
        'pinned': data.get('pinned', False),
        'createdAt': datetime.now().strftime('%Y-%m-%d'),
        'updatedAt': datetime.now().strftime('%Y-%m-%d %H:%M'),
    }
    posts.append(post)
    save_posts(posts)
    return jsonify(post), 201

@app.route('/api/posts/<post_id>', methods=['PUT'])
@login_required
def api_update_post(post_id):
    """更新文章（需登录）"""
    data = request.get_json(silent=True) or {}
    posts = get_posts()

    for i, p in enumerate(posts):
        if p['id'] == post_id:
            if 'title' in data:
                p['title'] = data['title'].strip()
            if 'content' in data:
                p['content'] = data['content']
            if 'tags' in data:
                p['tags'] = data['tags']
            if 'category' in data:
                p['category'] = data['category']
            if 'images' in data:
                p['images'] = data['images']
            if 'files' in data:
                p['files'] = data['files']
            if 'links' in data:
                p['links'] = data['links']
            if 'pinned' in data:
                p['pinned'] = data['pinned']
            p['updatedAt'] = datetime.now().strftime('%Y-%m-%d %H:%M')
            save_posts(posts)
            return jsonify(p)

    abort(404)

@app.route('/api/posts/<post_id>', methods=['DELETE'])
@login_required
def api_delete_post(post_id):
    """删除文章（需登录）"""
    posts = get_posts()
    new_posts = [p for p in posts if p['id'] != post_id]

    if len(new_posts) == len(posts):
        abort(404)

    save_posts(new_posts)
    return jsonify({'ok': True})

# ── 文件上传 API ──────────────────────────────────────

def allowed_file(filename, allowed_set):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_set

@app.route('/api/upload', methods=['POST'])
@login_required
def api_upload():
    """上传图片或文件（需登录）"""
    if 'file' not in request.files:
        return jsonify({'error': '没有选择文件'}), 400

    file = request.files['file']
    if not file.filename:
        return jsonify({'error': '文件名为空'}), 400

    upload_type = request.form.get('type', 'image')  # image | file

    if upload_type == 'image':
        allowed = ALLOWED_IMAGE_EXT
    else:
        allowed = ALLOWED_FILE_EXT

    if not allowed_file(file.filename, allowed):
        return jsonify({'error': f'不支持的文件类型，允许: {", ".join(allowed)}'}), 400

    # 生成唯一文件名
    ext = file.filename.rsplit('.', 1)[1].lower()
    safe_name = secure_filename(file.filename.rsplit('.', 1)[0])
    unique_name = f'{safe_name}_{datetime.now().strftime("%Y%m%d%H%M%S")}.{ext}'

    file.save(str(UPLOAD_DIR / unique_name))

    return jsonify({
        'ok': True,
        'filename': unique_name,
        'original_name': file.filename,
        'url': f'/uploads/{unique_name}',
        'size': os.path.getsize(UPLOAD_DIR / unique_name),
    })

@app.route('/api/upload-delete', methods=['POST'])
@login_required
def api_delete_upload():
    """删除已上传的文件（需登录）"""
    data = request.get_json(silent=True) or {}
    filename = data.get('filename', '')

    # 安全检查：防止路径遍历
    safe = secure_filename(filename)
    filepath = UPLOAD_DIR / safe
    if filepath.exists() and filepath.is_file():
        filepath.unlink()
        return jsonify({'ok': True})
    return jsonify({'error': '文件不存在'}), 404

# ── 启动 ──────────────────────────────────────────────

if __name__ == '__main__':
    init_admin()
    print(f'=' * 50)
    print(f'  TraceDev 学习日志系统')
    print(f'  访问地址: http://localhost:8080')
    print(f'  管理员: admin')
    print(f'  数据目录: {DATA_DIR}')
    print(f'  上传目录: {UPLOAD_DIR}')
    print(f'=' * 50)
    app.run(host='0.0.0.0', port=5050, debug=True)
