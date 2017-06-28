#!/usr/bin/env node
'use strict';

var Kafka = require('node-rdkafka');

var argv = require('optimist')
    .usage('Usage: $0 -e <endpoint> -k <apikey> -s <apisecret> -t <topic> -S <ssl ca location> -v')
    .demand(['e', 'k', 's', 't'])
    .boolean(['v'])
    .alias('e', 'endpoint')
    .describe('e', 'Confluent Cloud Endpoints (Broker List)')
    .alias('k', 'apikey')
    .describe('k', 'Confluent Cloud API Key')
    .alias('s', 'apisecret')
    .describe('s', 'Confluent Cloud API Secret')
    .alias('t', 'topic')
    .describe('t', 'Kafka Topic to consume from')
    .alias('v', 'verbose')
    .describe('v', 'Verbose mode')
    .alias('S', 'sslcaloc')
    .describe('S', 'SSL CA Location')
    .default('S', '/usr/local/etc/openssl/cert.pem')
    .alias('?', 'help')
    .describe('?', 'Print usage information');
      
argv = argv.argv;

if ( argv.help === true ) {
    console.log( 'Usage: ccloud-console-producer -e <endpoint> -k <apikey> -s <apisecret> -t <topic>');
    console.log( '\nOptions:');
    console.log( '  -e, --endpoint   Confluent Cloud Endpoints (Broker List)     [required]');
    console.log( '  -k, --apikey     Confluent Cloud API Key                     [required]');
    console.log( '  -s, --apisecret  Confluent Cloud API Secret                  [required]');
    console.log( '  -t, --topic      Kafka Topic to consumer from                [required]');
    console.log( '  -v, --verbose    Verbose mode                                [boolean]');
    console.log( '  -S, --sslcaloc   SSL CA Location (default = /usr/local/etc/openssl/cert.pem)');
    console.log( '  -?, --help       Print usage information                      ');
    process.exit();
}


var producer;
try {
    producer = new Kafka.Producer({
        'client.id': 'ccloud-node-console-producer',
        'metadata.broker.list': argv.endpoint,
        'retry.backoff.ms': 200,
        'message.send.max.retries': 15,
        'socket.keepalive.enable': true,
        'queue.buffering.max.messages': 100000,
        'queue.buffering.max.ms': 10,
        'batch.num.messages': 1000000,
        'security.protocol': 'sasl_ssl',
        'sasl.mechanisms': 'PLAIN',
        'sasl.username': argv.apikey,
        'sasl.password': argv.apisecret,
        'ssl.ca.location': argv.sslcaloc,
        'api.version.request': true //added to force 0.10.x style timestamps on all messages
    });  

    // Connect to the broker manually
    producer.connect();

    producer
        .on('ready', function() {
            // Wait for the ready event before proceeding with input prompt
            console.log('Confluent Cloud connection is ready');
            var prompt = require('prompt');

            prompt.start();

            prompt.get(['key', 'value'], function (err, result) {
                if (err) { return onErr(err); }
                console.log('Command-line input received:');
                console.log('  Message key: ' + result.key);
                console.log('  Message value: ' + result.value);

                var key = null;
                //set the key
                if ( result.key ) {
                    key = result.key.toString();
                } 

                if (result.value === null || argv.topic === "") {                    
                    console.log("Ignored request to send a NULL message or NULL topic");
                    process.exit();
                } else {
                    producer.produce(
                        argv.topic,                                 // topic
                        null,                                       // partition
                        new Buffer(JSON.stringify(result.value)),   // value
                        key                                         // key
                    );
                    console.log('Message published');
                    producer.flush(2000 , function () {
                        process.exit();
                    });
                }

                function onErr(err) {
                    console.log(err);
                    return 1;
                }              
            })   
        .on('error', function(err) {
            console.error('Error from producer: ' + err);
        })
        .on('disconnected', function(arg) {
            console.log('producer disconnected. ' + JSON.stringify(arg));
            process.exit();
        });
    });
    //control-c to exit
    process.on('SIGINT', function() {
        console.log("Caught interrupt signal");
        producer.disconnect();
    });

} catch(e) {
    console.log('Caught error: ' + e);    
}


 



 




