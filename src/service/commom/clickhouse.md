sudo apt-key adv --keyserver keyserver.ubuntu.com --recv E0C56BD4
echo "deb http://repo.yandex.ru/clickhouse/deb/stable/ main/" | sudo tee /etc/apt/sources.list.d/clickhouse.list
sudo apt update
sudo apt install clickhouse-server clickhouse-client     --过程中输入密码  用户名默认为default


配置
/etc/clickhouse-server中
config.xml     服务配置
config.d/
user.xml       用户配置
users.d/


启动
sudo systemctl enable clickhouse-server.service
sudo systemctl restart clickhouse-server.service


登入
clickhouse-client --user default --password root123456


## 特性

ClickHouse不只是数据库，而是一个数据库管理系统，允许在运行时创建表和数据库、加载数据和运行查询，而无需重新配置或重启服务。

较于其他一些列式数据库，只能在内存中工作，ClickHouse用于工作在传统磁盘上，当然也可以使用SSD和内存

### 多核心并行处理
会使用服务器上一切可用的资源  并行处理大型查询

### 多服务器分布式处理
数据可以保存在不同的shard上，每一个shard都由一组用于容错的replica组成，查询可以并行地在所有shard上进行处理。对用户来说是透明

## 性能

### 单个大查询的吞吐量
如果数据被放置在page cache中，一个不太复杂的查询在单个服务器上大约能够以2-10GB／s（未压缩）的速度进行处理（对于简单的查询，速度可以达到30GB／s）

如果数据没有在page cache中的话，那么速度将取决于你的磁盘系统和数据的压缩率。例如，如果一个磁盘允许以400MB／s的速度读取数据，并且数据压缩率是3，则数据的处理速度为1.2GB/s。这意味着，如果你是在提取一个10字节的列，那么它的处理速度大约是1-2亿行每秒。

### 处理短查询的延迟时间
一个查询使用主键并且没有太多行(几十万)进行处理，并且没有查询太多的列，那么在数据被page cache缓存的情况下，它的延迟应该小于50毫秒(在最佳的情况下应该小于10毫秒)。

否则，延迟取决于数据的查找次数。如果你当前使用的是HDD，在数据没有加载的情况下，查询所需要的延迟可以通过以下公式计算得知： 查找时间（10 ms） * 查询的列的数量 * 查询的数据块的数量

### 处理大量短查询的吞吐量

ClickHouse可以在单个服务器上每秒处理数百个查询（在最佳的情况下最多可以处理数千个）

这不适用于分析型场景。因此我们建议每秒最多查询100次。

### 数据的写入性能

建议每次写入不少于1000行的批量写入，或每秒不超过一个写入请求。

当使用tab-separated格式将一份数据写入到MergeTree表中时，写入速度大约为50到200MB/s。如果您写入的数据每行为1Kb，那么写入的速度为50000到200000行每秒。如果您的行更小，那么写入速度将更高。为了提高写入性能，您可以使用多个INSERT进行并行写入，这将带来线性的性能提升。














