#!/usr/bin/env perl
use IO::Socket::INET;

my $sig = 'Art-Net'.pack('x');
my $op = pack('v', 0x5000);
my $ver = pack('n', 14);

my $seq = pack('x');
my $phy = pack('x');

# "universe"
my $port = pack('n', 0);

#my @channels = (0) x 512;   // 0 for off, 255 for on
my @channels = (255) x 512;
$length = pack('n', scalar @channels);

my $data = pack('C*', @channels);
my $message = $sig.$op.$ver.$seq.$phy.$port.$length.$data;

my $sock = IO::Socket::INET->new(
    Proto    => 'udp',
    PeerPort => 6454,
    # PeerAddr => '192.168.1.91',
    PeerAddr => inet_ntoa(INADDR_BROADCAST),
    Broadcast => 1
) or die "Could not create socket: $!\n";

$sock->send($message) or die "Send error: $!\n";
