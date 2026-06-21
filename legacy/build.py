import os
import sys
import subprocess
import platform

def clear_screen():
    """清除屏幕"""
    if platform.system() == "Windows":
        os.system('cls')
    else:
        os.system('clear')

def print_header():
    """打印头部信息"""
    clear_screen()
    print("=" * 50)
    print("       Markdown转TXT工具打包脚本")
    print("=" * 50)
    print()

def check_dependencies():
    """检查并安装依赖"""
    print("[1/4] 检查依赖...")
    
    # 必需的依赖列表
    required_packages = [
        "mistune",
        "tkinterdnd2",
        "clipboard",
        "pillow",
        "pyinstaller"
    ]
    
    for package in required_packages:
        try:
            subprocess.run(
                [sys.executable, "-m", "pip", "install", package], 
                check=True, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE
            )
            print(f"  - {package} 已安装/更新")
        except subprocess.CalledProcessError as e:
            print(f"  - 错误: 无法安装 {package}")
            print(f"  - 详情: {e}")
            return False
    
    print("  √ 所有依赖安装完成")
    return True

def check_source_files():
    """检查源文件是否存在"""
    print("\n[2/4] 检查源文件...")
    
    required_files = [
        "markdown2txt.py",
        "README.md"
    ]
    
    all_files_exist = True
    for file in required_files:
        if os.path.exists(file):
            print(f"  - {file} 已找到")
        else:
            print(f"  - 错误: {file} 不存在")
            all_files_exist = False
    
    if all_files_exist:
        print("  √ 所有源文件检查通过")
    
    return all_files_exist

def build_executable():
    """构建可执行文件"""
    print("\n[3/4] 开始构建可执行文件...")
    
    try:
        # 创建输出目录
        os.makedirs("dist", exist_ok=True)
        
        # 使用PyInstaller打包
        build_cmd = [
            sys.executable, 
            "-m", 
            "PyInstaller",
            "--onefile",
            "--noconsole",
            "--name", 
            "markdown2txt",
            "markdown2txt.py"
        ]
        
        subprocess.run(build_cmd, check=True)
        print("  √ 构建成功")
        return True
    except subprocess.CalledProcessError as e:
        print(f"  - 错误: 构建失败")
        print(f"  - 详情: {e}")
        return False

def copy_additional_files():
    """复制附加文件到dist目录"""
    print("\n[4/4] 复制附加文件...")
    
    try:
        if os.path.exists("README.md"):
            import shutil
            shutil.copy("README.md", os.path.join("dist", "README.md"))
            print("  - README.md 已复制")
        
        print("  √ 附加文件复制完成")
        return True
    except Exception as e:
        print(f"  - 错误: 无法复制附加文件")
        print(f"  - 详情: {e}")
        return False

def main():
    """主程序流程"""
    print_header()
    
    # 检查并安装依赖
    if not check_dependencies():
        print("\n× 依赖检查失败，打包终止。")
        return
    
    # 检查源文件
    if not check_source_files():
        print("\n× 源文件检查失败，打包终止。")
        return
    
    # 构建可执行文件
    if not build_executable():
        print("\n× 构建失败，打包终止。")
        return
    
    # 复制附加文件
    if not copy_additional_files():
        print("\n× 附加文件复制失败，打包过程不完整。")
    
    # 完成
    print("\n" + "=" * 50)
    print("  打包完成! 可执行文件位于 dist 目录")
    print("=" * 50)

if __name__ == "__main__":
    main() 