# Use PyMySQL if mysqlclient is not installed (e.g. on Windows)
try:
    import MySQLdb
except ImportError:
    import pymysql
    pymysql.install_as_MySQLdb()
