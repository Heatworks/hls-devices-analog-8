#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <math.h>
#include <unistd.h>

#define CLK_DELAY 500

int xfer(int tx, int CLK_PIN, int MISO_PIN, int MOSI_PIN, int CS_PIN) {
    unsigned char t;
    unsigned char shiftin=0; 
    digitalWrite (CLK_PIN, 0);
    digitalWrite (CS_PIN, 0);
    usleep(CLK_DELAY);
    for (t=0; t < 8; t++) { 
        digitalWrite (CLK_PIN, 0);
        if ((tx & 0x80) == 0) 
            digitalWrite (MOSI_PIN, 0);
        else 
            digitalWrite (MOSI_PIN, 1);
        usleep(CLK_DELAY);
        digitalWrite (CLK_PIN, 1);
        tx <<= 1;    //shift left one bit 
        shiftin <<= 1; //shift left one bit 
        if (digitalRead(MISO_PIN) == 1) 
            shiftin |= 1;
        usleep(CLK_DELAY);
    } 
    digitalWrite (CLK_PIN, 0);
    digitalWrite (CS_PIN, 1);
    return shiftin;
}

double getTimestamp() {
    struct timespec spec;
    clock_gettime(CLOCK_REALTIME, &spec);
    long            ms; // Milliseconds
    time_t          s;  // Seconds
    s  = spec.tv_sec;
    ms = round(spec.tv_nsec / 1.0e6); // Convert nanoseconds to milliseconds
    if (ms > 999) {
        s++;
        ms = 0;
    }
    return (double)s + ((float)ms / 1000.0);
}

int readADCChannel(int channel, int CLK_PIN, int MISO_PIN, int MOSI_PIN, int CS_PIN) {
    int response = xfer(0b10000001 + (channel << 4), CLK_PIN, MISO_PIN, MOSI_PIN, CS_PIN);
    int responseA = xfer(0b0, CLK_PIN, MISO_PIN, MOSI_PIN, CS_PIN);
    int responseB = xfer(0b0, CLK_PIN, MISO_PIN, MOSI_PIN, CS_PIN);
    int responseC = xfer(0b0, CLK_PIN, MISO_PIN, MOSI_PIN, CS_PIN);

    int left = responseC >> 7;
    int middle = responseB << 1;
    int right = responseA << 9;
    return left + middle + right;
}

int main (int argc, char *argv[])
{
    int SPI_CLK, SPI_MISO, SPI_MOSI, SPI_CS, CHANNEL;
    if (argc < 6) {
        printf("Incomplete number of arguments.");
        exit(EXIT_FAILURE);
    }
    SPI_CLK = atoi(argv[1]);
    SPI_MISO = atoi(argv[2]);
    SPI_MOSI = atoi(argv[3]);
    SPI_CS = atoi(argv[4]);

    CHANNEL = atoi(argv[5]);

    wiringPiSetup ();

    pinMode (SPI_CLK, OUTPUT) ;
    pinMode (SPI_MISO, INPUT) ;
    pinMode (SPI_MOSI, OUTPUT) ;
    pinMode (SPI_CS, OUTPUT) ;

    // Print results.
    printf("%.3f,%i,%i", getTimestamp(), CHANNEL, readADCChannel(CHANNEL,SPI_CLK, SPI_MISO, SPI_MOSI, SPI_CS)); 
    
    return 0 ;
}