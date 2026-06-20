---
title: "Git的常用命令"
pubDate: "2024-03-28T09:41:02+08:00"
tags: 
  - "技术"
categories: []
draft: false
slug: "git-commands"
---
不得不说Git真是个伟大的发明。在我很早以前就在想，难道需要很多人开发的程序，最后是通过微信或者QQ把代码发来发去吗？Git完美的解答了我的烦恼。
### Git的常用命令行
1. `git init`: 初始化一个新的 Git 仓库。
2. `git clone [repository_url]`: 克隆一个远程仓库到本地。
3. `git add [file(s)]`: 将文件添加到暂存区。
4. `git commit -m "[commit message]"`: 提交具有描述性消息的更改。
5. `git push`: 将提交的更改推送到远程仓库。
6. `git pull`: 从远程仓库获取更改并将其合并到当前分支。
7. `git branch [branch_name]`: 创建一个新的分支。
8. `git checkout [branch_name]`: 切换到不同的分支。
9. `git merge [branch_name]`: 将来自指定分支的更改合并到当前分支。
10. `git status`: 检查仓库的当前状态。
11. `git log`: 查看提交历史。
12. `git remote add [name] [url]`: 添加远程仓库地址。
13. `git remote -v`: 查看远程仓库列表及其地址。
14. `git fetch`: 从远程仓库获取最新的提交，但不合并到当前分支。
15. `git reset [file]`: 从暂存区中移除文件，但保留工作目录中的修改。
16. `git reset --hard [commit]`: 将当前分支的 HEAD 指针重置为指定的提交，并清除工作目录中的所有更改。
17. `git checkout -b [new_branch]`: 创建一个新分支并立即切换到该分支。
18. `git diff`: 查看工作目录中的更改。
19. `git tag [tag_name]`: 创建一个标签，通常用于标记版本。
20. `git stash`: 将未提交的更改暂存起来，以便稍后再应用。


不过我目前还没有把以上的命令全部都用过一遍，而且经常打错单词🤪🤪。所以把它记录到我的博客里方便我以后随时查看。
