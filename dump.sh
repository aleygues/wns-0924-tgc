#!/bin/bash
docker exec tgc-db-1 pg_dumpall --clean --if-exists -U thegoodcorner > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql