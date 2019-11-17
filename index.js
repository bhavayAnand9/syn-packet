'use strict';

let raw = require('raw-socket');
let crypto = require('crypto');

class SynPack
{
    constructor(sourcePort, destinationPort, dstIp){
        this.socket =    raw.createSocket({
                         protocol: raw.Protocol.TCP
                     });
        this.sourcePort = sourcePort;
        this.destinationPort = destinationPort;
        this.destinationIp = dstIp;
        this.seqCounter = 0;
        this.ackCounter = 0;
        this.packet = this.buildSyncPacket();
    }

    //generates pseudo header for checksum calculation
    genPseudoHeader(dstIp, tcpPacketLength) {
        let pseudoHeader = new Buffer(12);
        pseudoHeader.fill(0);
        pseudoHeader.writeUInt32BE((Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0), 0);
        pseudoHeader.writeUInt32BE(dstIp, 4);
        pseudoHeader.writeUInt8(6, 9);
        pseudoHeader.writeUInt16BE(tcpPacketLength, 10);
        return pseudoHeader;
    }

    //builds a syn packet buffer
    buildSyncPacket() {
        let buf = new Buffer('0000000000000000000000005002200000000000', 'hex');

        //writes source and destination port
        buf.writeUInt16BE(Math.floor(Math.random() * 65535) + 1, 0);
        buf.writeUInt16BE(this.destinationPort, 2);

        //writes a random seq and ack number
        //seq num
        // crypto.randomBytes(4).copy(buf, 4);
        buf.writeUInt32BE(this.seqCounter, 4);
        ++this.seqCounter;
        //ack num
        // crypto.randomBytes(4).copy(buf, 8);
        buf.writeUInt32BE(this.ackCounter, 8);
        // ++this.ackCounter;

        //50 02 20 00 => note for self

        //creates checksum of pseudo header using raw-socket
        let sum = raw.createChecksum(this.genPseudoHeader(this.destinationIp, buf.length), buf);

        //write above generated checksum
        buf.writeUInt16BE(sum, 16);

        //writes urgent pointer which depends on urgent pointer flag
        buf.writeUInt16BE(0, 16);

        return buf;
    }

    sendPacket(beforecb, aftercb){
        console.log(this.packet);
        this.socket.send(this.packet, 0, this.packet.length, this.destinationIp, beforecb, aftercb);
    }

    sendNumberOfPackets(beforecb, aftercb, howMany) {
        while(howMany--){c
            this.socket.send(this.packet, 0, this.packet.length, this.destinationIp, beforecb, aftercb);
            this.packet = this.buildSyncPacket();
        }
    }

}

module.exports = SynPack;