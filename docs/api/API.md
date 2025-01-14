<!-- API文档 -->

根据"人员名单"和"变动记录"页面的功能需求，以下是需要实现的API列表：

1. 人员名单 API：

a. 获取员工列表
    1. 端点：GET /api/employees
    2. 查询参数：page, limit, sort, order, keyword, department, project, startDate, endDate
    3. 响应：
    ```
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

b. 添加新员工
    1. 端点：POST /api/employees
    2. 请求体：包含新员工的所有必要信息
    3. 响应：新创建的员工信息
    ```
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

c. 编辑员工信息
    1. 端点：PUT /api/employees/:id
    2. 请求体：包含更新的员工信息
    3. 响应：更新后的员工信息
    ```{
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
    }```

d. 员工离职
    1. 端点：POST /api/employees/:id/resign
    2. 请求体：员工ID，分离职日期、离职原因
    3. 响应：更新后的员工信息
    ```
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

e. 部门调动
    1. 端点：POST /api/employees/:id/transfer-department
    2. 请求体：员工ID，新部门ID、调动日期、调动原因
    3. 响应：更新后的员工信息
    ```
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

f. 项目调岗
    1. 端点：POST /api/employees/:id/transfer-project
    2. 请求体：员工ID、新项目ID、新部门ID（如果需要）、调岗日期、调岗原因
    3. 响应：更新后的员工信息
    ```
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

g. 获取部门列表
    1. 端点：GET /api/departments
    2. 响应：所有部门的列表
    ```
    {
    "departments": [
        { "id": 1, "name": "一部" },
        { "id": 2, "name": "二部" },
        { "id": 3, "name": "三部" }
    ]
    }
    ```

h. 获取项目列表
    1. 端点：GET /api/projects
    2. 请求体: 部门ID
    2. 响应：部门所属的所有项目列表
    ```
    {
    "projects": [
        { "id": 1, "name": "项目A" },
        { "id": 2, "name": "项目B" },
        { "id": 3, "name": "项目C" },
        { "id": 4, "name": "项目D" }
    ]
    }
    ```


2. 变动记录 API：
a. 获取变动记录列表
    1. 端点：GET /api/change-records
    2. 查询参数：page, limit, status (pending/confirmed/rejected), type, startDate, endDate
    3. 响应：包含变动记录列表、总数和分页信息
```
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


b. 确认变动记录
    1. 端点：POST /api/change-records/:id/confirm
    2. 响应：更新后的变动记录信息

    ```
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

c. 拒绝变动记录
    1. 端点：POST /api/change-records/:id/reject
    2. 请求体：拒绝原因（可选）
    3. 响应：更新后的变动记录信息
    ```
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

d. 获取变动记录详情
    1. 端点：GET /api/change-records/:id
    2. 响应：特定变动记录的详细信息
```
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
e. 搜索变动记录
    1. 端点：GET /api/change-records/search
    2. 查询参数：keyword（搜索员工名称、变动类型或原因）
    3. 响应：匹配的变动记录列表
    ```
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

3. 通用 API：

a. 批量导入员工信息
    1. 端点：POST /api/employees/bulk-import
    2. 请求体：包含员工信息的CSV或Excel文件
    3. 响应：导入结果，包括成功导入的数量和可能的错误信息
    ```
    {
    "success": true,
    "importedCount": 50,
    "errors": [
        {
        "row": 3,
        "message": "缺少必要字段：部门"
        },
        // ... 可能的其他错误
    ]
    }
    ```


b. 导出员工信息
    1. 端点：GET /api/employees/export
    2. 查询参数：与获取员工列表的参数相同，用于筛选要导出的数据
    3. 响应：包含员工信息的CSV或Excel文件





