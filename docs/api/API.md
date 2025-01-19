# API文档

## 目录
1. [通用说明](#通用说明)
2. [员工管理](#员工管理)
3. [部门管理](#部门管理)
4. [项目管理](#项目管理)
5. [变动记录](#变动记录)
6. [统计功能](#统计功能)
7. [批量操作](#批量操作)
8. [错误处理](#错误处理)

## 通用说明

### 基础URL
```
https://api.example.com/v1
```

### 通用查询参数
- `page`: 页码，默认1
- `limit`: 每页记录数，默认10
- `sort`: 排序字段
- `order`: 排序方向(asc/desc)

### 通用响应格式
```json
{
  "success": true,
  "data": {}, // 具体数据
  "pagination": {
    "total": 100,
    "per_page": 10,
    "current_page": 1,
    "total_pages": 10
  }
}
```

## 员工管理

### 获取员工列表
- 端点：`GET /api/employees`
- 参数：
  - `keyword`: 搜索关键词
  - `department`: 部门ID
  - `project`: 项目ID
  - `startDate`: 入职开始日期
  - `endDate`: 入职结束日期
  - `status`: 在职状态
- 响应：
    ```json
    {
    "employees": [
        {
        "id": 1,
        "name": "张三",
        "position": "总监理工程师",
        "department": "一部",
        "project": "项目A",
        "joinDate": "2023-01-01",
        "status": "active"
        },
        // ... 更多员工记录
    ],
    "pagination": {
        "total": 100,
        "perPage": 10,
        "currentPage": 1,
        "totalPages": 10
    }
    }
    ```

### 添加新员工
- 端点：`POST /api/employees`
- 请求体：包含新员工的所有必要信息
- 响应：新创建的员工信息
    ```json
    {
    "success": true,
    "employee": {
        "id": 101,
        "name": "李四",
        "position": "监理员",
        "department": "二部",
        "project": "项目B",
        "joinDate": "2023-08-01",
        "status": "active"
    }
    }
    ```

### 编辑员工信息
- 端点：`PUT /api/employees/:id`
- 请求体：包含更新的员工信息
- 响应：更新后的员工信息
    ```json
    {
    "success": true,
    "employee": {
        "id": 101,
        "name": "李四",
        "position": "监理员",
        "department": "二部",
        "project": "项目C",
        "joinDate": "2023-08-01",
        "status": "active"
        }
    }
    ```

### 员工离职
- 端点：`POST /api/employees/:id/resign`
- 请求体：员工ID，分离职日期、离职原因
- 响应：更新后的员工信息
    ```json
    {
    "success": true,
    "employee": {
    "id": 101,
    "name": "李四",
    "position": "监理员",
    "department": "二部",
    "project": null,
    "joinDate": "2023-08-01",
    "resignDate": "2023-12-31",
    "status": "inactive"
    }
    }
    ```

### 部门调动
- 端点：`POST /api/employees/:id/transfer-department`
- 请求体：员工ID，新部门ID、调动日期、调动原因
- 响应：更新后的员工信息
    ```json
    {
    "success": true,
    "employee": {
        "id": 101,
        "name": "李四",
        "position": "高级监理员",
        "department": "三部",
        "project": "项目C",
        "joinDate": "2023-08-01",
        "status": "active"
    },
    "changeRecord": {
        "id": 201,
        "type": "部门调动",
        "date": "2023-12-01",
        "reason": "业务需要",
        "previousDepartment": "二部",
        "newDepartment": "三部"
    }
    }
    ```

### 项目调岗
- 端点：`POST /api/employees/:id/transfer-project`
- 请求体：员工ID、新项目ID、新部门ID（如果需要）、调岗日期、调岗原因
- 响应：更新后的员工信息
    ```json
    {
    "success": true,
    "employee": {
        "id": 101,
        "name": "李四",
        "position": "高级监理员",
        "department": "三部",
        "project": "项目D",
        "joinDate": "2023-08-01",
        "status": "active"
    },
    "changeRecord": {
        "id": 202,
        "type": "项目调岗",
        "date": "2023-12-15",
        "reason": "项目需求",
        "previousProject": "项目C",
        "newProject": "项目D"
    }
    }
    ```

### 获取部门列表
- 端点：`GET /api/departments`
- 响应：所有部门的列表
    ```json
    {
    "departments": [
        { "id": 1, "name": "一部" },
        { "id": 2, "name": "二部" },
        { "id": 3, "name": "三部" }
    ]
    }
    ```

### 获取项目列表
- 端点：`GET /api/projects`
- 参数：
  - `department_id`: 部门ID（可选）
- 响应：部门所属的所有项目列表
    ```json
    {
    "projects": [
        { "id": 1, "name": "项目A" },
        { "id": 2, "name": "项目B" },
        { "id": 3, "name": "项目C" },
        { "id": 4, "name": "项目D" }
    ]
    }
    ```

## 部门管理

### 获取部门列表
- 端点：`GET /api/departments`
- 响应：所有部门的列表
    ```json
    {
    "departments": [
        { "id": 1, "name": "一部" },
        { "id": 2, "name": "二部" },
        { "id": 3, "name": "三部" }
    ]
    }
    ```

### 创建部门
- 端点：`POST /api/departments`
- 请求体：部门名称
- 响应：
    ```json
    {
      "success": true,
      "department": {
        "id": 4,
        "name": "四部",
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
      }
    }
    ```

### 更新部门
- 端点：`PUT /api/departments/:id`
- 请求体：更新的部门信息
- 响应：与创建部门相同

### 删除部门
- 端点：`DELETE /api/departments/:id`
- 响应：
    ```json
    {
      "success": true,
      "message": "部门删除成功"
    }
    ```

### 获取部门统计信息
- 端点：`GET /api/departments/:id/stats`
- 响应：
    ```json
    {
      "department": {
        "id": 1,
        "name": "一部"
      },
      "stats": {
        "employee_count": 50,
        "project_count": 5,
        "active_employees": 45,
        "unassigned_employees": 5
      }
    }
    ```

## 项目管理

### 获取项目列表
- 端点：`GET /api/projects`
- 参数：
  - `department_id`: 部门ID（可选）
- 响应：部门所属的所有项目列表
    ```json
    {
    "projects": [
        { "id": 1, "name": "项目A" },
        { "id": 2, "name": "项目B" },
        { "id": 3, "name": "项目C" },
        { "id": 4, "name": "项目D" }
    ]
    }
    ```

### 创建项目
- 端点：`POST /api/projects`
- 请求体：项目名称和所属部门ID
- 响应：
    ```json
    {
      "success": true,
      "project": {
        "id": 5,
        "name": "项目E",
        "department_id": 1,
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
      }
    }
    ```

### 更新项目
- 端点：`PUT /api/projects/:id`
- 请求体：更新的项目信息
- 响应：与创建项目相同

### 删除项目
- 端点：`DELETE /api/projects/:id`
- 响应：
    ```json
    {
      "success": true,
      "message": "项目删除成功"
    }
    ```

### 获取项目统计信息
- 端点：`GET /api/projects/:id/stats`
- 响应：
    ```json
    {
      "project": {
        "id": 1,
        "name": "项目A",
        "department": "一部"
      },
      "stats": {
        "employee_count": 20,
        "department": "一部"
      }
    }
    ```

### 获取项目成员列表
- 端点：`GET /api/projects/:id/employees`
- 查询参数：page, limit
- 响应：
    ```json
    {
      "employees": [{
        "id": 1,
        "name": "张三",
        "position": "总监理工程师",
        "join_date": "2023-01-01"
      }],
      "pagination": {
        "total": 20,
        "per_page": 10,
        "current_page": 1,
        "total_pages": 2
      }
    }
    ```

## 变动记录

### 获取变动记录列表
- 端点：`GET /api/change-records`
- 参数：
  - `status`: 记录状态(pending/confirmed/rejected)
  - `type`: 变动类型
  - `startDate`: 开始日期
  - `endDate`: 结束日期
- 响应：包含变动记录列表、总数和分页信息
    ```json
    {
      "changeRecords": [
        {
          "id": 201,
          "employeeName": "李四",
          "type": "部门调动",
          "date": "2023-12-01",
          "reason": "业务需要",
          "previousDepartment": "二部",
          "previousProject": "",
          "newDepartment": "三部",
          "newProject": "",
          "status": "pending"
        },
        // ... 更多变动记录
      ],
      "pagination": {
        "total": 50,
        "perPage": 10,
        "currentPage": 1,
        "totalPages": 5
      }
    }
    ```

### 确认变动记录
- 端点：`POST /api/change-records/:id/confirm`
- 响应：更新后的变动记录信息
    ```json
    {
    "success": true,
    "changeRecord": {
        "id": 201,
        "employeeName": "李四",
        "type": "部门调动",
        "date": "2023-12-01",
        "reason": "业务需要",
        "previousDepartment": "二部",
        "previousProject': '',
        "newDepartment": "三部",
        "newProject": "",
        "status": "confirmed"
    }
    }
    ```

### 拒绝变动记录
- 端点：`POST /api/change-records/:id/reject`
- 请求体：拒绝原因（可选）
- 响应：更新后的变动记录信息
    ```json
    {
    "success": true,
    "changeRecord": {
        "id": 201,
        "employeeName": "李四",
        "type": "部门调动",
        "date": "2023-12-01",
        "reason": "业务需要",
        "previousDepartment": "二部",
        "newDepartment": "三部",
        "status": "rejected",
        "rejectReason": "人员配置调整"
    }
    }
    ```

### 获取变动记录详情
- 端点：`GET /api/change-records/:id`
- 响应：特定变动记录的详细信息
    ```json
    {
  "changeRecord": {
    "id": 201,
    "employeeName": "李四",
    "employeeId": 101,
    "type": "部门调动",
    "date": "2023-12-01",
    "reason": "业务需要",
    "previousDepartment": "二部",
    "newDepartment": "三部",
    "status": "pending",
    "createdAt": "2023-11-30T10:00:00Z",
    "updatedAt": "2023-11-30T10:00:00Z"
  }
}
    ```

### 搜索变动记录
- 端点：`GET /api/change-records/search`
- 查询参数：keyword（搜索员工名称、变动类型或原因）
- 响应：匹配的变动记录列表
    ```json
    {
  "changeRecords": [
    {
      "id": 201,
      "employeeName": "李四",
      "type": "部门调动",
      "date": "2023-12-01",
      "reason": "业务需要",
      "previousDepartment": "二部",
      "newDepartment": "三部",
      "status": "pending"
    },
    // ... 更多匹配的变动记录
    ],
    "total": 5
    }
    ```

## 统计功能

### 获取概要统计
- 端点：`GET /api/stats/summary`
- 响应：
    ```json
    {
      "total_employees": 100,
      "department_stats": [
        {
          "department": "一部",
          "employee_count": 30,
          "project_count": 5
        }
      ],
      "project_stats": [
        {
          "project": "项目A", 
          "employee_count": 15
        }
      ],
      "status_stats": {
        "active": 80,
        "inactive": 15,
        "unassigned": 5
      }
    }
    ```

## 批量操作

### 批量导入员工
- 端点：`POST /api/employees/bulk-import`
- 请求体：FormData格式，包含CSV文件
- 响应：
    ```json
    {
      "success": true,
      "stats": {
        "total": 100,
        "success": 95,
        "failed": 5,
        "errors": [
          {
            "row": 2,
            "reason": "部门不存在"
          }
          // ... 更多错误记录
        ]
      }
    }
    ```

### 导出员工数据
- 端点：`GET /api/employees/export`
- 查询参数：与GET /api/employees相同的过滤参数
- 响应：CSV文件下载

## 错误处理

### 错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述信息",
    "details": {
      "field": "具体字段",
      "reason": "具体原因"
    }
  }
}
```

### 错误码列表
| 错误码 | 描述 | HTTP状态码 |
|--------|------|------------|
| INVALID_INPUT | 输入参数验证失败 | 400 |
| RESOURCE_NOT_FOUND | 请求的资源不存在 | 404 |
| OPERATION_NOT_ALLOWED | 操作不允许 | 403 |
| DATABASE_ERROR | 数据库操作错误 | 500 |
| BUSINESS_RULE_VIOLATION | 违反业务规则 | 400 |
| DUPLICATE_ENTRY | 重复数据录入 | 400 |
| INVALID_STATUS_CHANGE | 非法的状态变更 | 400 |
| EMPLOYEE_NOT_ACTIVE | 非在职员工操作 | 400 |
| INVALID_DEPARTMENT_TRANSFER | 非法的部门调动 | 400 |
| INVALID_PROJECT_TRANSFER | 非法的项目调岗 | 400 |
| IMPORT_FILE_ERROR | 导入文件格式错误 | 400 |





