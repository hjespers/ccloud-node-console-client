# ccloud-node-console-client
Example console consumer and console producer using Node.JS and Confluent Cloud

# Features

* Up to date support for Confluent Cloud - Apache Kafka as a Service (see https://www.confluent.io/confluent-cloud/)
* Up to date feature set from use of node-rdkafka node.js client (see https://github.com/Blizzard/node-rdkafka)
* Tested on Linux, macOS
* Supports dynamic topic, key, value, and partition inputs
* Supports 0.10 and 0.11 timestamps

# Dependencies

Linux dependencies

* openssl-dev
* libsasl2-dev
* libsasl2-modules
* C++ toolchain

macOS dependencies

* Brew
* Apple Xcode command line tools (for the compiler)
* openssl via Brew
* Export CPPFLAGS=-I/usr/local/opt/openssl/include and LDFLAGS=-L/usr/local/opt/openssl/lib
* Open Keychain Access, export all certificates in System Roots to a single .pem file

# Install

Install ccloud-node-console-client from source

	brew install openssl
	export CPPFLAGS=-I/usr/local/opt/openssl/include
	export LDFLAGS=-L/usr/local/opt/openssl/lib
	cd /tmp	
	git clone git@github.com:hjespers/ccloud-node-console-client-ccloud.git
	sudo -E npm install -g /tmp/ccloud-node-console-client


# Uninstall

	sudo npm uninstall -g ccloud-node-console-client


# Useage

	ccloud-console-producer --help
	Usage: ccloud-console-producer -e <endpoint> -k <apikey> -s <apisecret> -t <topic> -S <ssl ca location> -v

	Options:
	  -e, --endpoint   Confluent Cloud Endpoints (Broker List)  [required]
	  -k, --apikey     Confluent Cloud API Key                  [required]
	  -s, --apisecret  Confluent Cloud API Secret               [required]
	  -t, --topic      Kafka Topic to consume from              [required]
	  -v, --verbose    Verbose mode                             [boolean]
	  -S, --sslcaloc   SSL CA Location                          [default: "/usr/local/etc/openssl/cert.pem"]
	  -?, --help       Print usage information

	Missing required arguments: e, k, s, t


	ccloud-console-consumer --help
	Usage: ccloud-console-consumer -e <endpoint> -k <apikey> -s <apisecret> -t <topic> -c <consumer group id> -S <ssl ca location> -v -b

	Options:
	  -e, --endpoint   Confluent Cloud Endpoints (Broker List)       [required]
	  -b, --beginning  Consume messages from beginning               [boolean]
	  -k, --apikey     Confluent Cloud API Key                       [required]
	  -s, --apisecret  Confluent Cloud API Secret                    [required]
	  -t, --topic      Kafka Topic to consume from                   [required]
	  -c, --cgid       Consumer group.id (defaults to autogenerated
	  -v, --verbose    Verbose mode                                  [boolean]
	  -S, --sslcaloc   SSL CA Location                               [default: "/usr/local/etc/openssl/cert.pem"]
	  -?, --help       Print usage information

	Missing required arguments: e, k, s, t


## Example Consumer

	$ ccloud-console-consumer -e $CCLOUD_BROKERS -k $CCLOUD_SASL_USERNAME -s $CCLOUD_SASL_PASSWORD -t mytopic -v
	Using consumer group.id = node-console-consumer594945
	Setting auto.offset.reset = largest
	Created consumer subscription on topic = mytopic
	Got a message on topic "mytopic"
	{ value: <Buffer 22 62 61 72 22>,
	  size: 5,
	  key: 'foo',
	  topic: 'mytopic',
	  offset: 0,
	  partition: 0 }
	calling commit
	<Control-C>
	Caught interrupt signal
	consumer disconnected. {"connectionOpened":1498683661438}

## Example Producer

	$ ccloud-console-producer -e $CCLOUD_BROKERS -k $CCLOUD_SASL_USERNAME -s $CCLOUD_SASL_PASSWORD -t mytopic
	Confluent Cloud connection is ready
	prompt: key:  foo
	prompt: value:  bar
	Command-line input received:
	  Message key: foo
	  Message value: bar
	Message published

# Troubleshooting

If you see the following error when you run either console producer or consumer, it means you have not installed librdkafka correctly with the required SSL and SASL libraries. See install instructions for installoing openssl and setting compiler flags.

	Caught error: Error: Invalid value for configuration property "security.protocol"
