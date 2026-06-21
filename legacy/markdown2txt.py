import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import mistune
import re
import os
try:
    from PIL import Image, ImageTk
    PIL_SUPPORT = True
except ImportError:
    PIL_SUPPORT = False
    print("警告: PIL/Pillow未安装，部分UI效果将不可用")

try:
    from tkinterdnd2 import TkinterDnD, DND_FILES
    DRAG_DROP_SUPPORT = True
except ImportError:
    DRAG_DROP_SUPPORT = False
    print("警告: tkinterdnd2未安装，拖放功能将不可用")

try:
    import clipboard
    CLIPBOARD_SUPPORT = True
except ImportError:
    CLIPBOARD_SUPPORT = False
    print("警告: clipboard未安装，剪贴板功能将不可用")

class GradientFrame(tk.Canvas):
    """创建渐变背景框架"""
    def __init__(self, parent, color1="#6a11cb", color2="#2575fc", **kwargs):
        tk.Canvas.__init__(self, parent, **kwargs)
        self.color1 = color1
        self.color2 = color2
        self.bind("<Configure>", self._draw_gradient)
        
    def _draw_gradient(self, event=None):
        """绘制渐变背景"""
        self.delete("gradient")
        width = self.winfo_width()
        height = self.winfo_height()
        
        # 创建渐变效果
        for i in range(height):
            # 计算当前位置的颜色
            r1, g1, b1 = self.winfo_rgb(self.color1)
            r2, g2, b2 = self.winfo_rgb(self.color2)
            
            r = (r1 + int((r2-r1) * i / height)) & 0xffff
            g = (g1 + int((g2-g1) * i / height)) & 0xffff
            b = (b1 + int((b2-b1) * i / height)) & 0xffff
            
            color = "#{:04x}{:04x}{:04x}".format(r, g, b)
            self.create_line(0, i, width, i, tags=("gradient",), fill=color)
        
        # 让渐变保持在最底层
        self.lower("gradient")

class CardFrame(tk.Frame):
    """创建银行卡风格的卡片"""
    def __init__(self, parent, bg_color="#a68ad2", **kwargs):
        tk.Frame.__init__(self, parent, **kwargs)
        self.config(bg=bg_color, relief=tk.RAISED, bd=0)
        self.round_corners = 15
        
        # 设置圆角和阴影（通过子控件实现）
        self.card_body = tk.Frame(self, bg=bg_color, relief=tk.RAISED, bd=0)
        self.card_body.pack(fill=tk.BOTH, expand=True, padx=3, pady=3)
        
        # 银行卡样式内容
        self.bank_name = tk.Label(self.card_body, text="Bank Name", font=("Arial", 14), bg=bg_color, fg="white")
        self.bank_name.place(x=20, y=20)
        
        # 模拟银行卡号
        self.card_number = tk.Label(
            self.card_body, 
            text="5544 8181 7777 0000", 
            font=("Courier New", 18, "bold"), 
            bg=bg_color, 
            fg="white"
        )
        self.card_number.place(x=20, y=100)
        
        # 持卡人信息
        self.card_holder = tk.Label(
            self.card_body, 
            text="Markdown格式", 
            font=("Arial", 12), 
            bg=bg_color, 
            fg="white"
        )
        self.card_holder.place(x=20, y=140)
        
        # 添加"芯片"图标
        self.chip_frame = tk.Frame(self.card_body, width=40, height=30, bg="#d4af37")
        self.chip_frame.place(x=480, y=20)
        
        # 圆形的双环图标（模拟银行卡标志）
        self.circle1 = tk.Canvas(self.card_body, width=40, height=40, highlightthickness=0, bg=bg_color)
        self.circle1.place(x=480, y=70)
        self.circle1.create_oval(5, 5, 35, 35, outline="white", fill=bg_color, width=2)
        
        self.circle2 = tk.Canvas(self.card_body, width=40, height=40, highlightthickness=0, bg=bg_color)
        self.circle2.place(x=500, y=70)
        self.circle2.create_oval(5, 5, 35, 35, outline="white", fill=bg_color, width=2)
        
    def set_text(self, name, number, holder):
        """设置卡片文本内容"""
        self.bank_name.config(text=name)
        self.card_number.config(text=number)
        self.card_holder.config(text=holder)

class StyleButton(tk.Button):
    """自定义样式按钮"""
    def __init__(self, parent, **kwargs):
        tk.Button.__init__(self, parent, **kwargs)
        self.config(
            relief=tk.FLAT,
            bg="#6a5acd",
            fg="white",
            activebackground="#9370db",
            activeforeground="white",
            font=("Arial", 10, "bold"),
            padx=10,
            pady=5,
            cursor="hand2"
        )
        self.bind("<Enter>", self._on_enter)
        self.bind("<Leave>", self._on_leave)
        
    def _on_enter(self, e):
        self.config(bg="#9370db")
        
    def _on_leave(self, e):
        self.config(bg="#6a5acd")

class MarkdownToTextConverter:
    def __init__(self):
        # 创建主窗口
        if DRAG_DROP_SUPPORT:
            self.root = TkinterDnD.Tk()
        else:
            self.root = tk.Tk()
        
        self.root.title("Markdown转TXT工具")
        self.root.geometry("800x700")
        
        # 创建渐变背景
        self.gradient_bg = GradientFrame(self.root)
        self.gradient_bg.pack(fill=tk.BOTH, expand=True)
        
        # 设置主题样式
        self.style = ttk.Style()
        self.style.theme_use('clam')
        self.style.configure('TButton', font=('Arial', 10), background='#6a5acd')
        self.style.configure('TFrame', background='#f0f0f0')
        
        # 创建内容框架
        self.content_frame = tk.Frame(self.gradient_bg, bg=None)
        self.content_frame.place(relx=0.5, rely=0.5, anchor="center", relwidth=0.95, relheight=0.9)
        
        # 创建顶部工具栏
        self.toolbar = tk.Frame(self.content_frame, bg="#f0f0f0")
        self.toolbar.pack(fill=tk.X, padx=10, pady=10)
        
        # 添加按钮
        self.open_btn = StyleButton(self.toolbar, text="打开MD文件", command=self.open_file)
        self.open_btn.pack(side=tk.LEFT, padx=5)
        
        self.paste_btn = StyleButton(self.toolbar, text="粘贴MD内容", command=self.paste_markdown)
        self.paste_btn.pack(side=tk.LEFT, padx=5)
        
        self.convert_btn = StyleButton(self.toolbar, text="转换", command=self.convert_markdown)
        self.convert_btn.pack(side=tk.LEFT, padx=5)
        
        self.save_btn = StyleButton(self.toolbar, text="保存TXT", command=self.save_txt)
        self.save_btn.pack(side=tk.LEFT, padx=5)
        
        self.clear_btn = StyleButton(self.toolbar, text="清空", command=self.clear_all)
        self.clear_btn.pack(side=tk.LEFT, padx=5)
        
        # 添加转换样式选择器标签
        self.style_label = tk.Label(self.toolbar, text="转换样式:", bg="#f0f0f0", font=("Arial", 10, "bold"))
        self.style_label.pack(side=tk.LEFT, padx=(20, 5))
        
        # 风格选择变量
        self.style_var = tk.StringVar()
        self.style_var.set("普通")
        self.styles = ["普通", "简约", "保留格式"]
        
        # 样式选择下拉菜单
        self.style_menu = ttk.Combobox(self.toolbar, textvariable=self.style_var, values=self.styles, state="readonly", width=8)
        self.style_menu.pack(side=tk.LEFT, padx=5)
        
        # 创建主框架
        self.main_frame = tk.Frame(self.content_frame, bg="#f0f0f0")
        self.main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # 创建卡片风格的样式预览
        self.card_preview_frame = tk.Frame(self.main_frame, bg="#f0f0f0")
        self.card_preview_frame.pack(fill=tk.X, pady=10)
        
        self.card_label = tk.Label(self.card_preview_frame, text="可选转换样式:", bg="#f0f0f0", font=("Arial", 10, "bold"))
        self.card_label.pack(anchor=tk.W, padx=10)
        
        # 创建水平放置的卡片示例
        self.cards_frame = tk.Frame(self.card_preview_frame, bg="#f0f0f0")
        self.cards_frame.pack(fill=tk.X, padx=10, pady=5)
        
        # 样式1: 普通卡片
        self.style1_card = CardFrame(self.cards_frame, bg_color="#8c61b6", width=250, height=160)
        self.style1_card.pack(side=tk.LEFT, padx=5, pady=5)
        self.style1_card.set_text("样式1", "普通格式", "标准Markdown转换")
        
        # 样式2: 简约卡片
        self.style2_card = CardFrame(self.cards_frame, bg_color="#6a11cb", width=250, height=160)
        self.style2_card.pack(side=tk.LEFT, padx=5, pady=5)
        self.style2_card.set_text("样式2", "简约格式", "只保留纯文本内容")
        
        # 样式3: 保留格式卡片
        self.style3_card = CardFrame(self.cards_frame, bg_color="#825cc9", width=250, height=160)
        self.style3_card.pack(side=tk.LEFT, padx=5, pady=5)
        self.style3_card.set_text("样式3", "保留格式", "保留部分Markdown格式")
        
        # 创建上下分割的窗格
        self.paned_window = ttk.PanedWindow(self.main_frame, orient=tk.VERTICAL)
        self.paned_window.pack(fill=tk.BOTH, expand=True, padx=0, pady=10)
        
        # 创建输入区域
        self.input_frame = ttk.LabelFrame(self.paned_window, text="Markdown输入")
        self.input_frame.pack(fill=tk.BOTH, expand=True)
        
        # 添加滚动条
        self.input_scroll = ttk.Scrollbar(self.input_frame)
        self.input_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        
        # 创建输入文本框
        self.input_text = tk.Text(self.input_frame, wrap=tk.WORD, yscrollcommand=self.input_scroll.set)
        self.input_text.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        self.input_text.config(font=("Consolas", 10), bg="#f8f8f8", fg="#333333")
        self.input_scroll.config(command=self.input_text.yview)
        
        # 启用拖放支持
        if DRAG_DROP_SUPPORT:
            self.input_text.drop_target_register(DND_FILES)
            self.input_text.dnd_bind('<<Drop>>', self.handle_drop)
        
        # 创建输出区域
        self.output_frame = ttk.LabelFrame(self.paned_window, text="TXT输出")
        self.output_frame.pack(fill=tk.BOTH, expand=True)
        
        # 添加滚动条
        self.output_scroll = ttk.Scrollbar(self.output_frame)
        self.output_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        
        # 创建输出文本框
        self.output_text = tk.Text(self.output_frame, wrap=tk.WORD, yscrollcommand=self.output_scroll.set)
        self.output_text.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        self.output_text.config(font=("Consolas", 10), bg="#f8f8f8", fg="#333333")
        self.output_scroll.config(command=self.output_text.yview)
        
        # 添加面板到分割窗口
        self.paned_window.add(self.input_frame, weight=1)
        self.paned_window.add(self.output_frame, weight=1)
        
        # 状态栏
        self.status_bar = tk.Label(
            self.content_frame, 
            text="就绪", 
            bd=1, 
            relief=tk.SUNKEN, 
            anchor=tk.W,
            bg="#f0f0f0",
            fg="#333333"
        )
        self.status_bar.pack(side=tk.BOTTOM, fill=tk.X)
        
        # 绑定样式卡片点击事件
        self.style1_card.bind("<Button-1>", lambda e: self.select_style("普通"))
        self.style2_card.bind("<Button-1>", lambda e: self.select_style("简约"))
        self.style3_card.bind("<Button-1>", lambda e: self.select_style("保留格式"))
        
        # 调用转换方法
        self.update_status("就绪")
    
    def select_style(self, style_name):
        """选择转换样式"""
        self.style_var.set(style_name)
        self.update_status(f"已选择样式: {style_name}")
    
    def open_file(self):
        """打开Markdown文件"""
        file_path = filedialog.askopenfilename(
            title="选择Markdown文件",
            filetypes=[("Markdown文件", "*.md"), ("所有文件", "*.*")]
        )
        
        if file_path:
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    content = file.read()
                    self.input_text.delete(1.0, tk.END)
                    self.input_text.insert(tk.END, content)
                self.update_status(f"已加载文件: {os.path.basename(file_path)}")
            except Exception as e:
                messagebox.showerror("错误", f"无法打开文件: {str(e)}")
    
    def handle_drop(self, event):
        """处理拖放事件"""
        file_path = event.data
        
        # 处理Windows路径中的{}和多个文件
        if file_path.startswith("{") and file_path.endswith("}"):
            file_path = file_path[1:-1]
        
        if os.path.isfile(file_path) and file_path.lower().endswith('.md'):
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    content = file.read()
                    self.input_text.delete(1.0, tk.END)
                    self.input_text.insert(tk.END, content)
                self.update_status(f"已加载文件: {os.path.basename(file_path)}")
            except Exception as e:
                messagebox.showerror("错误", f"无法打开文件: {str(e)}")
        else:
            messagebox.showwarning("警告", "请拖放.md格式的文件")
    
    def paste_markdown(self):
        """从剪贴板粘贴Markdown内容"""
        if not CLIPBOARD_SUPPORT:
            messagebox.showwarning("警告", "剪贴板功能不可用，请安装clipboard库")
            return
        
        try:
            content = clipboard.paste()
            if content:
                self.input_text.delete(1.0, tk.END)
                self.input_text.insert(tk.END, content)
                self.update_status("已从剪贴板粘贴内容")
            else:
                messagebox.showinfo("提示", "剪贴板中没有内容")
        except Exception as e:
            messagebox.showerror("错误", f"无法从剪贴板粘贴: {str(e)}")
    
    def convert_markdown(self):
        """转换Markdown为纯文本"""
        markdown_content = self.input_text.get(1.0, tk.END)
        
        if not markdown_content.strip():
            messagebox.showinfo("提示", "请先输入或加载Markdown内容")
            return
        
        try:
            style = self.style_var.get()
            
            # 根据不同样式进行转换
            if style == "普通":
                # 使用mistune进行标准转换
                markdown = mistune.create_markdown()
                html = markdown(markdown_content)
                # 移除HTML标签
                txt = re.sub('<[^<]+?>', '', html)
                # 清理额外的空行
                txt = re.sub(r'\n{3,}', '\n\n', txt)
            
            elif style == "简约":
                # 简约模式: 移除所有格式和特殊字符
                txt = markdown_content
                # 移除标题标记
                txt = re.sub(r'^#+\s+', '', txt, flags=re.MULTILINE)
                # 移除列表标记
                txt = re.sub(r'^[\*\-\+]\s+', '', txt, flags=re.MULTILINE)
                # 移除数字列表
                txt = re.sub(r'^\d+\.\s+', '', txt, flags=re.MULTILINE)
                # 移除代码块
                txt = re.sub(r'```[\s\S]*?```', '', txt)
                # 移除链接
                txt = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', txt)
                # 移除强调标记
                txt = re.sub(r'(\*\*|__)(.*?)\1', r'\2', txt)
                txt = re.sub(r'(\*|_)(.*?)\1', r'\2', txt)
                # 移除引用标记
                txt = re.sub(r'^>\s+', '', txt, flags=re.MULTILINE)
                # 清理额外的空行
                txt = re.sub(r'\n{3,}', '\n\n', txt)
            
            else:  # "保留格式"
                # 保留一些基本格式的转换
                txt = markdown_content
                # 将标题格式转换为======和------样式
                lines = txt.split('\n')
                result = []
                for i, line in enumerate(lines):
                    if re.match(r'^# ', line):
                        result.append(line[2:])
                        result.append('='*len(line[2:]))
                    elif re.match(r'^## ', line):
                        result.append(line[3:])
                        result.append('-'*len(line[3:]))
                    else:
                        result.append(line)
                txt = '\n'.join(result)
                
                # 转换其他格式但保留视觉结构
                # 保留列表结构
                txt = re.sub(r'^\*\s+', '• ', txt, flags=re.MULTILINE)  
                txt = re.sub(r'^\-\s+', '- ', txt, flags=re.MULTILINE)
                txt = re.sub(r'^\+\s+', '+ ', txt, flags=re.MULTILINE)
                
                # 转换链接格式
                txt = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'\1 (\2)', txt)
                
                # 保留代码块格式
                txt = re.sub(r'```(\w*)\n', r'--- 代码开始 ---\n', txt)
                txt = re.sub(r'```', r'--- 代码结束 ---', txt)
            
            # 更新输出文本框
            self.output_text.delete(1.0, tk.END)
            self.output_text.insert(tk.END, txt)
            
            self.update_status("转换完成")
        except Exception as e:
            messagebox.showerror("错误", f"转换失败: {str(e)}")
    
    def save_txt(self):
        """保存转换后的TXT文件"""
        txt_content = self.output_text.get(1.0, tk.END)
        
        if not txt_content.strip():
            messagebox.showinfo("提示", "没有可保存的内容")
            return
        
        file_path = filedialog.asksaveasfilename(
            title="保存TXT文件",
            defaultextension=".txt",
            filetypes=[("文本文件", "*.txt"), ("所有文件", "*.*")]
        )
        
        if file_path:
            try:
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(txt_content)
                self.update_status(f"已保存到: {os.path.basename(file_path)}")
            except Exception as e:
                messagebox.showerror("错误", f"无法保存文件: {str(e)}")
    
    def clear_all(self):
        """清空所有文本内容"""
        self.input_text.delete(1.0, tk.END)
        self.output_text.delete(1.0, tk.END)
        self.update_status("已清空所有内容")
    
    def update_status(self, message):
        """更新状态栏信息"""
        self.status_bar.config(text=message)
        
    def run(self):
        """运行应用程序"""
        self.root.mainloop()

if __name__ == "__main__":
    app = MarkdownToTextConverter()
    app.run() 