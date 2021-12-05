# mysql

## 1. 安装

> 官方地址：https://www.mysql.com/

## 2. 可视化工具

> 名称: navicat
>
> 下载:http://www.navicat.com.cn/

## 3. sql

### 1. 创建数据表(关键字大写)

```bash
create Table student
(
 id int not null primary key auto_increment,
 name varchar(64),
 age int,
 city varchar(64)
)
```

### 2. 查询数据表

```bash
select * from student
```

### 3. 查询数据表的列信息

```bash
desc student
```

### 4. 给数据表增加额外的列

```bash
# 修改student表信息，增加一列，名字叫 idcard,类型是varchar(20),不能为空, 增加到city列的后面
alter table student add column idcard varchar(20) not null after city
```

### 5. 修改数据表的列类型

```bash
# 修改student表信息，修改一列名字叫idcard的，类型修改为varchar(18),不能为空
alter table student modify column idcard varchar(18) not null
```

### 6. 删除数据表的一列

```bash
# 修改student表信息,删除一列名字叫idcard的
alter table student drop column idcard
```

### 7. 添加主键约束

```bash
# 修改student表信息,增加一个主键，键名叫id
alter table student add primary key(id)
```

### 8. 添加唯一约束索引(提高查询效率)

```bash
# 修改student表信息，增加一个唯一索引约束，名字叫uq_name,给name列加
alter table student add unique index uq_name (name)
```

### 9. 添加外键约束

```bash
# 修改student表信息,增加一个外键约束，名字叫fk_student_id,外键是student_id关联course表中的id
alter table student add constraint fk_student_id foreign key(student_id)  references course(id)
```

### 10. 表中插入数据

> 注意事项:
>
> 1. 每次插入一行数据，不能直插入一部分数据，插入的数据是否有效会按照整行的完整性要求来检验
> 2. 每个数据值的数据类型、精度、位数必须与对应的列明精准匹配
> 3. 如果某字段设置不能为空，则必须插入数据
> 4. 有缺省值的列，可以使用 DEFAULT 关键字来代理插入实际的值
> 5.

```bash
# 在student表中插入一条数据,数据信息一一对应，name叫张三,idcard为4,age为18,city为深圳
insert into student(name,idcard,age,city) values ('张三',4,18,'深圳')
```

### 11. 表中更改数据

```bash
# 更新student表，将age更改为44，city更改为上面，但是只更新id=3的行
update student set age=44,city='上海' where id=3
```

### 12. 表中删除数据

```bash
# 语法1:删除student表中id=4并且age=4的行
delete from student where id=4 and age=4

# 语法2:删除student表中id=4并且age=4的行
truncate table student where id=4 and age=4

# 区别
# 语法1 :为清空表，主键标识列不会被清空，添加的下一条数据会继续按照之前的主键序号递增
# 语法2 :为截断表，主键标识列会被清空，添加的下一条数据会重新开始递增
```

### 13. 表中查询数据

```bash
# 需求:查询北京的学生信息,并按照id升序排列
# 解释:条件为city是北京的,查询到的结果按照id字段进行升序排列
select * from student where city='北京' order by id asc

# 需求:查询所在城市为空的行
# 解释:查询student表的数据，条件是city为空的
select * from student where city is null

# 需求:查询所有学生信息，给查询到的学生信息增加额外一列信息展示，列名叫国家,信息为中国
select *,'中国' as '国家' from student

# 需求:分页查询,总共10条数据，查询第三页，要2条数据
# 解释:查询student表的数据,索引从3开始截取，截取2条数据，并且查询到的结果升序排列
select * from student order by asc limit 3,2

# 需求:查询所有学生的城市，重复的城市不要
# 解释:查询student表中的城市数据,city要求不能重复，重复的只返回一次,并且city数据不能为空
select distinct city from student where city not is null
```

### 14. 练习

```bash
# 1.增加province、birthday、gender、email列
# 2.增加相关数据
# 3.需求查询

## 1.查询山东省的同学所有信息
select * from student where province='山东'

## 2.查询山东省的男同学所有信息
select * from student where province='山东' and gender=1

## 3.查询学生的分数并且按升序排序
select * from student order by score asc

## 4.查询学生信息，先按学生id升序，在按学生分数降序
select * from student order by id asc,score desc

## 5.别名
## 5.解释:查询student表中的所有数据，但是结果只展示name字段，因为起了别名，所以结果只展示名字字段
select name as 名字 from student
```

### 15. 聚合函数

```bash
# 1.统计学生成绩的总分数
select SUM(score) from student

## 2.求学生成绩的最高分，最低分
select MAX(score),MIN(score) from student

## 3.求学生成绩的平均分
select AVG(score) from student

## 4.统计总记录数(total)
select COUNT(*) from student
select COUNT(1) from student

## 5.更多...
https://www.w3cschool.cn/mysql/func-date-add.html
```

### 16. 分组

```bash
# 语法
select 列名,查询表达式
from <表名>
where <条件，过滤行>
group by <分组字段>
having 分组后的过滤条件
order by 列名 [asc,desc]
limit 偏移量,条数

# 统计每位学生的平均成绩
select id,AVG(score) from student group by id

# 统计学生id大于1的学生的平均成绩
select id,AVG(score) from student where id > 1 group by id

# 统计学生id大于1的并且平均成绩大于60分的学生
select id,AVG(score) from student where id > 1 group by id having AVG(score) > 60

# 统计每门课程的最高分，并按分数从高到低排序
select curr,MAX(score) from student group by curr order by score desc

# 统计各个省男女同学的人数
select province,gender,COUNT(*) from student group by province,gender
```

### 17. 子查询

```bash
# 查询年龄大于平均年龄的学生
select * from student where age > (select AVG(age) from student)

# 查询年龄大于陕西省任何一位同学
select * from student where age > any (select age from student where province='陕西')

# 查询年龄大于陕西省所有年龄的同学
select * from student where age > all (select age from student where province='陕西')
```

### 18. 表连接

- inner join (内连接 -- 交集)

  ```bash
  # 解释:取出student表和score表中的相同id数据
  select * from student inner join score on student.id = score.id
  ```

- left join (左连接 -- 左表全部)

  ```bash
  # 解释:取出student表的全部，id没匹配上，就匹配为null
  select * from student left join score on student.id = score.id
  ```

- right join (右连接 -- 右表全部)

  ```bash
  # 解释:取出score表的全部，id没匹配上，就匹配为null
  select * from student right join score on student.id = score.id
  ```

### 19. 多表连接

```bash
`现在有3张表，分别是`
`user (用户表,主键id)`,
`role  (角色表,主键id,外键user_id、premission_id)`,
`permission (资源表,主键id)`
# 需求:查询用户对应的角色，角色对应的资源
select user.name,role.name,permission.name from user
inner join role on role.user_id = user.id
inner join permission on permission.id = role.permission_id
```

### 20. 自连接

```bash
# 练习
# 1.创建表
CREATE TABLE category (
id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
name VARCHAR(64) NOT NULL,
pid INT NOT NULL
)

# 2.添加数据
INSERT INTO category(id,name,pid)
VALUES
(1,'数码产品',0),
(2,'服装',0),
(3,'食品',0),
(4,'ipad',1),
(5,'李宁',2),
(6,'康师傅',3)

# 3.查询所有顶级分类下面类别的数量（pid为0代表顶级）
select c1.id,c1.name,c1.pid,COUNT(*) from category as c1 inner join category as c2 where c1.id = c2.pid group by c1.id

# 4.将pid换成具体的名称
select c1.id,c1.name,c2.name from category c1 inner join category c2 where c1.id = c2.pid

# 5.删除重复的记录(面试重点)
```

### 21. 自定义函数

- 无参数有返回值

  ```bash
  # 需求:创建一个函数，要求返回中文格式的时间
  CREATE FUNCTION FORMAT_DATE() RETURNS VARCHAR(64)
  RETURN DATE.FORMAT(NOW(),'%Y年%m月%d日 %H时%i分%s秒')
  ```

- 2.有参数有返回值

  ```bash
  # 需求:创建一个函数，要求2个值相加,返回2个值相加的结果
  CREATE FUNCTION ADDTWO(num1 int , num2 int) RETURNS int
  RETURN num1 + num2
  ```

- 3.多条语句的自定义函数

  ```bash
  # 需求:创建一个函数，该函数用于添加数据，并且返回该数据的id
  CREATE FUNCTION ADD_USER(name varchar(64)) RETURNS int
  BEGIN
  INSERT INTO student(name) VALUES(name)
  RETURN LAST_INSERT_ID()
  END
  ```

### 22. 模糊查询

```bash
# _ 代表任意一个字符
select * from student where name like 'zcf_'

# %代表任意多个字符
select * from student where name like 'zcf%'

# 查询包含某个字符串
select * from student where name like '%zcf%'
```

## 4. 数据库设计三大范式

> 1. 数据表中的每一列（每个字段）必须是不可拆分的最小单元，也就是确保每一列的原子性
> 2. 满足第一范式后，要求表中的所有列，都必须依赖于主键，而不能有任何一列与主键没有关系，也就是说一个表只描述一件事情
> 3. 数据不能存在传递关系,即每个属性都跟主键有直接关系而不是间接关系

## 5. RBAC

## 6. 事务

> 什么是事务?
>
> 1. 事务是作为单个逻辑工作单元执行的一系列操作
> 2. 多个操作作为一个整体向系统提交,要么都执行，要么都不执行
> 3. 事务是一个不可分割的工作逻辑单元
>
> 事务的特性?
>
> 1. 原子性(事务是一个完整的操作,事务各个部分是不可分的，要么都执行，要么都不执行)
> 2. 一致性(当事务完成后，数据必须处于完整的状态)
> 3. 隔离性(并发事务彼此隔离、独立,它不应该以任何方式依赖其他事务)
> 4. 持久性(事务完成后,它对数据库的修改被永久保持)
>
> 举例: 我向小惠转账 10 元,小惠钱包多 10 元.我钱包少 10 元,必须是一致的,只有转账成功才会得到这个结果，转账不成功 2 个人的钱包都恢复之前的状态

## 7. node 中使用 mysql

## 8. 锁

> 什么是锁?
>
> - 锁是计算机协调多个进程或线程并发访问某一资源的机制
>
> 锁的分类
>
> - 读锁 (共享锁)
>   - 针对同一份数据,多个读操作可以同时进行而不会互相影响
> - 写锁 (排它锁)
>   - 当前写操作没有完成前,会阻断其他写锁和读锁
>
> 锁的粒度
>
> - 表锁
> - 行锁
