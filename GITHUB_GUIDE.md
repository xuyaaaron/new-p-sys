# GitHub 上传与部署指南

由于您的电脑目前没有检测到 Git 命令行工具，您需要先安装 Git 或使用 GitHub Desktop。请按照以下步骤操作将 `printer` 项目上传到 GitHub 并部署。

## 第一步：准备环境

### 选项 A：安装 Git (推荐)
1.  访问 [git-scm.com](https://git-scm.com/download/win) 下载 **Git for Windows**。
2.  运行安装程序，一路点击 "Next" 使用默认设置安装即可。
3.  **安装完成后，请重启您的电脑**（或者关闭所有代码编辑器和终端窗口重新打开），以便命令生效。

### 选项 B：使用 GitHub Desktop
如果不喜欢命令行，可以下载 [GitHub Desktop](https://desktop.github.com/) 并登录您的账号。

---

## 第二步：将代码上传到 GitHub (使用命令行)

假设您已经安装好 Git，请按以下步骤操作：

1.  **登录 GitHub** 并创建一个新仓库 (New Repository)。
    *   仓库名建议：`printer-web` (或者您喜欢的名字)
    *   选择 **Public** (公开)
    *   **不要**勾选 "Add a README", ".gitignore" 或 "license" (因为我们本地已经有了)。
    *   点击 **Create repository**。

2.  **在本地文件夹打开终端**
    *   找到桌面上的 `printer` 文件夹。
    *   进入文件夹，在空白处 **右键**，选择 **"Open Git Bash here"** (如果你装了 Git Bash) 或者 **"在终端中打开"**。

3.  **运行上传命令**
    将以下命令依次复制并在终端中运行（将 `YOUR_GITHUB_USER` 替换为你的 GitHub 用户名）：

    ```bash
    # 1. 初始化 Git 仓库
    git init

    # 2. 添加所有文件 (会自动忽略 node_modules)
    git add .

    # 3. 提交代码
    git commit -m "Initial commit"

    # 4. 关联远程仓库 (请替换下面的 URL 为你刚才创建的仓库地址)
    # 格式通常是: https://github.com/用户名/仓库名.git
    git remote add origin https://github.com/YOUR_USERNAME/printer-web.git

    # 5. 推送到 GitHub
    git push -u origin main
    ```

    *如果是第一次使用 Git，它可能会弹窗让你输入 GitHub 的账号密码。*

---

## 第三步：开启 GitHub Pages 部署

代码上传成功后：

1.  打开你的 GitHub 仓库页面。
2.  点击上方的 **Settings** (设置) 选项卡。
3.  在左侧侧边栏找到 **Pages**。
4.  在 **Build and deployment** > **Source** 下，选择 **Deploy from a branch**。
5.  在 **Branch** 下，选择 `main` 分支，文件夹选择 `/(root)`。
6.  点击 **Save**。

(注意：由于这是 Vite 项目，直接这样部署可能会导致白屏。如果出现白屏，请看下面的进阶配置)

### 进阶：配置 Vite 自动化部署 (推荐)

为了让网站正常运行，建议使用 GitHub Actions 自动构建：

1.  在 GitHub 仓库页面，点击 **Settings** > **Pages**。
2.  在 **Source** 下，改为选择 **GitHub Actions**。
3.  点击 **Static HTML** 或者搜索 **Vite** 的工作流配置。
4.  GitHub 会自动检测并在 `.github/workflows/` 下创建一个部署脚本，直接点击 **Commit changes** 即可。

这样 GitHub 会自动帮你运行 `npm install` 和 `npm run build`，然后把 `dist` 文件夹部署上去，这是最稳妥的方法。
