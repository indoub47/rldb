@echo off
psql -U postgres -d rldb -h localhost -p 5432 -w -f recreatedb.sql