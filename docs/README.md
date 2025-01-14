# B-Zero
Web application for B-Zero project

# 目录结构
.
├── app/
│   ├── __init__.py
│   ├── models/            # 数据库模型
│   ├── routes/            # 各功能模块的路由，按模块划分
│   ├── services/          # 业务逻辑，拆分如人员管理、薪资管理等
│   └── templates/         # 前端页面（若前后端不分离）
├── tests/
│   └── test_personnel.py  # 单元测试示例
├── migrations/            # 数据迁移
├── requirements.txt
├── run.py                 # 入口文件（启动Flask应用）
└── README.md




# 快速更新requirements.txt文件：
```
pip freeze > requirements.txt
```