# HackGT Metrics
## Introduction
HackGT Metrics is a system build on top of [Kubernetes](kubernetes.io), [Fluentd](fluentd.org) and [InfluxDB](www.influxdata.com) to provide a real time overview of our apps with minimal modification to application code. Simply log the event you want to record to STDOUT and HackGT Metrics handles the heavy lifting of ingesting, storing and making queryable the data you log.

## Architecture
Docker containers that are orchestrated by Kubernetes write logs to `/var/lib/docker/containers/` on the host machine. Fluentd is configured in a DaemonSet, meaning one instance of Fluentd is created per node in the Kubernetes cluster. 

Each instance of Fluentd performs the following steps:

1. Collect logs from the instance's host node
2. Parse each log line into JSON
3. Check if the log messag complies with the HackGT Metrics requirements
4. If a valid log line is found, push it into InfluxDB

### Files
`fluentd-image/` contains the files needed to build the Fluentd Docker image.

`kubernetes/` contains Kubernetes configuration files for Fluentd.

## Usage
Using HackGT Metrics is easy! Simply log a single-line JSON formatted message that conforms to the following schema:
```js
{
    hackgtmetricsversion: 1,
    serviceName: string
    values: object
    tags: object
}
```

### Service Name
serviceName should specify service and event type, for example `registration-hackgt4-submitapp`.

### Values and Tags
Values and tags can contain arbitrary key/value pairs. These are directly translated into [InfluxDB measurement equivalents](https://docs.influxdata.com/influxdb/v1.3/concepts/key_concepts/). The serviceName becomes the name of the measurement that data is inserted into.

## Querying and Visualization
Data can be queried as needed from InfluxDB. Currently, HackGT uses [Grafana](https://grafana.com/) to visualize event data stored using this system.
