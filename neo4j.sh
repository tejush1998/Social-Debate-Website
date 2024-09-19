#!/bin/bash

# Path to the Neo4j bin directory
NEO4J_BIN="/Users/mac/Library/Application Support/Neo4j Desktop/Application/relate-data/dbmss/ENTER_DB_ID/bin/neo4j"

# Check if the argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 {start|stop}"
    exit 1
fi

# Execute the command based on the argument
if [ "$1" = "start" ]; then
    "$NEO4J_BIN" start
elif [ "$1" = "stop" ]; then
    "$NEO4J_BIN" stop
else
    echo "Invalid argument. Use 'start' or 'stop'."
    exit 1
fi
