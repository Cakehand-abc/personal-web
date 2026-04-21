import os

# ================= 配置区 =================

# 1. 最终生成的 txt 文件名
OUTPUT_FILE = 'all_project_code.txt'

# 2. 你想要提取的代码文件后缀（可以根据你的需要增删）
ALLOWED_EXTENSIONS = {
    # 后端
    '.py', 
    # 前端
    '.ts', '.js', '.vue', '.jsx', '.tsx', 
    # 样式与结构
    '.html', '.css', '.scss', '.less',
    # 配置文件
    '.json', '.yaml', '.yml', '.md', '.env.example'
}

# 3. 绝对要跳过的“黑洞”文件夹（非常重要！否则生成的 txt 会有几个 G 那么大）
IGNORE_DIRS = {
    'node_modules',      # 前端依赖黑洞
    '__pycache__',       # Python 缓存
    'venv', 'env',       # 虚拟环境
    '.git', '.vscode', '.idea', # 隐藏配置
    'dist', 'build',     # 打包产物
    'migrations',        # 数据库迁移文件（通常不需要给 AI 看）
    'useless', '面试记录', '知识库' # 你项目里已经废弃或不需要看内容的文件夹
}

# ================= 核心逻辑 =================

def generate_code_txt():
    print(f"🚀 开始扫描并打包代码...")
    file_count = 0
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        # os.walk 会自动递归遍历当前目录('.')下的所有文件夹和文件
        for root, dirs, files in os.walk('.'):
            
            # 在遍历过程中，动态剔除掉我们不想进入的黑洞文件夹
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for file in files:
                # 获取文件后缀
                ext = os.path.splitext(file)[1].lower()
                
                # 如果后缀在我们的白名单里
                if ext in ALLOWED_EXTENSIONS:
                    # 拼接相对路径，例如：.\frontend\src\main.ts
                    filepath = os.path.join(root, file)
                    
                    # 写入华丽的分割线和文件名（让 AI 瞬间看懂这是哪个文件）
                    outfile.write(f"\n\n{'='*70}\n")
                    outfile.write(f"File Path: {filepath}\n")
                    outfile.write(f"{'='*70}\n\n")
                    
                    # 读取代码并写入 txt
                    try:
                        with open(filepath, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                        file_count += 1
                        print(f"✅ 已打包: {filepath}")
                    except Exception as e:
                        # 防止遇到编码奇怪的伪文本文件导致脚本崩溃
                        outfile.write(f"// 无法读取此文件内容，错误信息: {e}\n")
                        print(f"❌ 读取失败: {filepath}")

    print(f"\n🎉 打包大功告成！共提取了 {file_count} 个核心代码文件。")
    print(f"📁 结果已保存至当前目录下的: {OUTPUT_FILE}")

if __name__ == '__main__':
    generate_code_txt()